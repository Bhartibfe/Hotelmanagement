import { ApiError, buildApiError } from "./apiError";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (token) => {
  refreshQueue.forEach(({ resolve }) => resolve(token));
  refreshQueue = [];
};

const failQueue = (error) => {
  refreshQueue.forEach(({ reject }) => reject(error));
  refreshQueue = [];
};

/*
  Throws an ApiError whose `code` says whether the session is genuinely over.
  The distinction matters: only a server that actually rejected the refresh
  token should clear it. A refresh that fails because the connection dropped
  mid-flight must leave the stored tokens alone, or a moment of bad signal
  signs the member out and loses whatever they were part-way through.
*/
const refreshTokens = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new ApiError("You are not signed in. Please sign in to continue.", {
      status: 401,
      code: "SESSION_EXPIRED",
    });
  }

  let response;
  try {
    response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch (err) {
    throw new ApiError(
      "We lost the connection while renewing your session. Check your connection and try again.",
      { status: 0, code: "NETWORK", cause: err }
    );
  }

  if (!response.ok) {
    throw new ApiError("Your session has expired. Please sign in again to continue.", {
      status: response.status,
      code: "SESSION_EXPIRED",
    });
  }

  const data = await response.json();
  localStorage.setItem("accessToken", data.accessToken);
  if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
  return data.accessToken;
};

// Describes what a request was trying to do, so a bare 500 or 403 can still
// say "We could not update the event" instead of "Request failed with status
// 500". Derived from the path rather than annotated on all hundred-odd
// endpoints: the last segment that is not an id is the resource.
const describeAction = (method, path) => {
  const segments = path.split("?")[0].split("/").filter(Boolean);
  const isId = (s) => /^[0-9]+$/.test(s) || /^[0-9a-f]{8}-/i.test(s) || s.length > 20;
  const resource = [...segments].reverse().find((s) => !isId(s)) || "data";
  const noun = resource.replace(/-/g, " ");
  switch (method) {
    case "GET": return `load the ${noun}`;
    case "POST": return `save the ${noun}`;
    case "PUT":
    case "PATCH": return `update the ${noun}`;
    case "DELETE": return `delete the ${noun}`;
    default: return `complete that ${noun} request`;
  }
};

const readBody = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (response.status === 204) return { json: null, empty: true };
  if (contentType.includes("application/json")) {
    try {
      return { json: await response.json(), empty: false };
    } catch {
      // A truncated or malformed JSON body is a server fault, not a user one.
      return { json: null, empty: false, malformed: true };
    }
  }
  const text = await response.text().catch(() => "");
  return { json: null, empty: false, text };
};

const request = async (method, path, { body, auth = true, timeout = 30000, action, redirectOnSessionEnd = true } = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const what = action || describeAction(method, path);

  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = localStorage.getItem("accessToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const send = () =>
    fetch(`${API_URL}${path}`, {
      method,
      headers,
      signal: controller.signal,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

  try {
    let response = await send();

    // Handle 401 with token refresh. The retry reuses `send`, so it keeps the
    // same abort signal and cannot outlive the timeout.
    if (response.status === 401 && auth) {
      if (isRefreshing) {
        const newToken = await new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        });
        headers["Authorization"] = `Bearer ${newToken}`;
        response = await send();
      } else {
        isRefreshing = true;
        try {
          const newToken = await refreshTokens();
          isRefreshing = false;
          processQueue(newToken);
          headers["Authorization"] = `Bearer ${newToken}`;
          response = await send();
        } catch (err) {
          isRefreshing = false;
          failQueue(err);

          // A dropped connection is not an expired session. Keep the tokens so
          // the next attempt can still use them, and report it as a network
          // problem rather than throwing the member out.
          if (err.code === "NETWORK") throw err;

          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          // Bounce to login, but only from pages that actually need an account —
          // otherwise a stale token turns every public page into a redirect.
          if (redirectOnSessionEnd && !window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
          }
          throw err;
        }
      }
    }

    clearTimeout(timeoutId);

    // Any write invalidates the public GET cache so fresh data is served next time
    if (method !== "GET" && response.ok) publicCache.clear();

    const { json, empty, malformed, text } = await readBody(response);

    if (!response.ok) {
      if (malformed || (json === null && text !== undefined)) {
        // A proxy or a crashed server answers with HTML, not JSON. Quoting a
        // fragment of a stack-trace page at a member helps nobody, so only a
        // short plain-text body is passed through; anything else falls back to
        // the status wording.
        const plain = (text || "").trim();
        const usable = plain && plain.length <= 200 && !plain.startsWith("<") ? plain : null;
        throw buildApiError({ status: response.status, body: { error: usable }, path, action: what });
      }
      throw buildApiError({ status: response.status, body: json, path, action: what });
    }

    if (empty) return null;
    if (malformed) {
      throw new ApiError(
        `The server's reply to "${what}" was not readable. Please try again.`,
        { status: response.status, code: "BAD_RESPONSE", path }
      );
    }
    return json;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) throw err;
    if (err.name === "AbortError") {
      throw new ApiError(
        `The server took longer than ${Math.round(timeout / 1000)} seconds to ${what}. It may be busy — please try again.`,
        { status: 0, code: "TIMEOUT", path, cause: err }
      );
    }
    // fetch() rejects with a TypeError for DNS failures, refused connections,
    // offline devices and CORS rejections — all of which read as the useless
    // "Failed to fetch" if passed straight through.
    throw new ApiError(
      navigator.onLine === false
        ? "You appear to be offline. Reconnect to the internet and try again."
        : `We could not reach the server to ${what}. Check your connection and try again.`,
      { status: 0, code: "NETWORK", path, cause: err }
    );
  }
};

// Short-lived cache for public GETs used by the homepage and directories.
// Keeps repeat navigation instant and de-duplicates parallel requests for the
// same path (sections mount together, React StrictMode mounts twice).
const PUBLIC_CACHE_TTL = 60000;
const publicCache = new Map();
const inFlight = new Map();

const cachedGet = (path) => {
  const hit = publicCache.get(path);
  if (hit && Date.now() - hit.time < PUBLIC_CACHE_TTL) return Promise.resolve(hit.data);

  const pending = inFlight.get(path);
  if (pending) return pending;

  const promise = request("GET", path, { auth: false })
    .then((data) => {
      publicCache.set(path, { data, time: Date.now() });
      return data;
    })
    .finally(() => inFlight.delete(path));

  inFlight.set(path, promise);
  return promise;
};

const api = {
  // Auth
  register: (data) => request("POST", "/auth/register", { body: data, auth: false }),
  login: (data) => request("POST", "/auth/login", { body: data, auth: false }),
  logout: () => request("POST", "/auth/logout"),
  // Runs on every page load, public ones included, so a stale token must not
  // yank a browsing visitor over to the sign-in screen.
  getMe: () => request("GET", "/auth/me", { redirectOnSessionEnd: false, action: "confirm you are signed in" }),

  // Public stats
  getPublicStats: () => cachedGet("/public-stats"),

  // Users
  getUsers: (params) => request("GET", `/users?${new URLSearchParams(params || {})}`),
  getUser: (id) => request("GET", `/users/${id}`, { auth: false }),
  updateProfile: (data) => request("PUT", "/users/me", { body: data }),

  // Profile
  submitProfile: (data) => request("POST", "/profile/complete", { body: data }),
  getMyProfile: () => request("GET", "/profile/me"),
  resubmitProfile: (data) => request("PUT", "/profile/resubmit", { body: data }),
  addProduct: (data) => request("POST", "/profile/products", { body: data }),
  getMyProducts: () => request("GET", "/profile/products"),
  updateProduct: (id, data) => request("PUT", `/profile/products/${id}`, { body: data }),
  submitProfileEdit: (data) => request("POST", "/profile/edit-draft", { body: data }),
  getMyEditDraft: () => request("GET", "/profile/edit-draft"),

  // Feed
  getFeed: (params) => request("GET", `/feed?${new URLSearchParams(params || {})}`),
  getPost: (id) => request("GET", `/feed/${id}`),
  getMyPosts: () => request("GET", "/feed/my-posts"),
  createPost: (data) => request("POST", "/feed", { body: data }),
  updatePost: (id, data) => request("PUT", `/feed/${id}`, { body: data }),
  deletePost: (id) => request("DELETE", `/feed/${id}`),
  likePost: (id) => request("POST", `/feed/${id}/like`),
  unlikePost: (id) => request("DELETE", `/feed/${id}/like`),
  getComments: (id) => request("GET", `/feed/${id}/comments`),
  addComment: (id, data) => request("POST", `/feed/${id}/comments`, { body: data }),
  savePost: (id) => request("POST", `/feed/${id}/save`),
  unsavePost: (id) => request("DELETE", `/feed/${id}/save`),

  // Hotels
  getHotels: (params) => request("GET", `/hotels?${new URLSearchParams(params || {})}`, { auth: false }),
  getHotel: (id) => request("GET", `/hotels/${id}`, { auth: false }),
  createHotel: (data) => request("POST", "/hotels", { body: data }),

  // Vendors/Marketplace
  getVendors: (params) => request("GET", `/marketplace?${new URLSearchParams(params || {})}`, { auth: false }),
  getFeaturedVendors: () => cachedGet("/marketplace/featured"),

  // Experts
  getExperts: (params) => request("GET", `/experts?${new URLSearchParams(params || {})}`, { auth: false }),
  getExpert: (id) => request("GET", `/experts/${id}`, { auth: false }),
  getFeaturedExperts: () => cachedGet("/experts/featured"),

  // Advisory board — same record shape as experts, admin-created only
  getAdvisory: (params) => request("GET", `/advisory?${new URLSearchParams(params || {})}`, { auth: false }),
  getAdvisoryMember: (id) => request("GET", `/advisory/${id}`, { auth: false }),

  // Testimonials
  getTestimonials: (params) => cachedGet(`/testimonials?${new URLSearchParams(params || {})}`),
  getFeaturedTestimonials: () => request("GET", "/testimonials/featured", { auth: false }),

  // Events
  getEvents: (params) => cachedGet(`/events?${new URLSearchParams(params || {})}`),
  getEvent: (idOrSlug) => request("GET", `/events/${idOrSlug}`, { auth: false }),
  getFeaturedEvents: () => request("GET", "/events/featured", { auth: false }),
  getMyEvents: () => request("GET", "/events/my-events"),
  createUserEvent: (data) => request("POST", "/events", { body: data }),
  updateUserEvent: (id, data) => request("PUT", `/events/${id}`, { body: data }),
  deleteUserEvent: (id) => request("DELETE", `/events/${id}`),
  registerForEvent: (id) => request("POST", `/events/${id}/register`),
  unregisterForEvent: (id) => request("DELETE", `/events/${id}/register`),
  checkEventRegistration: (id) => request("GET", `/events/${id}/check-registration`),

  // Connections
  getConnections: (params) => request("GET", `/connections?${new URLSearchParams(params || {})}`),
  sendConnection: (data) => request("POST", "/connections", { body: data }),

  // Messages
  getConversations: () => request("GET", "/messages"),
  getMessages: (userId) => request("GET", `/messages/${userId}`),
  sendMessage: (userId, data) => request("POST", `/messages/${userId}`, { body: data }),

  // Notifications
  getNotifications: () => request("GET", "/notifications"),

  // Admin
  getMembershipRequests: (params) => request("GET", `/admin/membership-requests?${new URLSearchParams(params || {})}`),
  approveMembership: (id, data) => request("PUT", `/admin/membership-requests/${id}`, { body: data }),
  getAdminMembers: (params) => request("GET", `/admin/members?memberType=HOTEL_OWNER&${new URLSearchParams(params || {})}`),
  updateMember: (id, data) => request("PUT", `/admin/members/${id}`, { body: data }),
  getAdminVendors: (params) => request("GET", `/admin/vendors?${new URLSearchParams(params || {})}`),
  createVendor: (data) => request("POST", "/admin/vendors", { body: data }),
  updateVendor: (id, data) => request("PUT", `/admin/vendors/${id}`, { body: data }),
  deleteVendor: (id) => request("DELETE", `/admin/vendors/${id}`),
  toggleVendorFeatured: (id, data) => request("PUT", `/admin/vendors/${id}/feature`, { body: data }),
  getAdminExperts: (params) => request("GET", `/admin/experts?${new URLSearchParams(params || {})}`),
  createExpert: (data) => request("POST", "/admin/experts", { body: data }),
  updateExpert: (id, data) => request("PUT", `/admin/experts/${id}/edit`, { body: data }),
  toggleExpertFeatured: (id) => request("PUT", `/admin/experts/${id}`),
  toggleExpertPinned: (id) => request("PUT", `/admin/experts/${id}/pin`),
  deleteExpert: (id) => request("DELETE", `/admin/experts/${id}`),
  getAdminEvents: (params) => request("GET", `/admin/events?${new URLSearchParams(params || {})}`),
  getEventRegistrations: (id) => request("GET", `/admin/events/${id}/registrations`),
  notifyEventRegistrant: (eventId, data) => request("POST", `/admin/events/${eventId}/notify-registrant`, { body: data }),
  createEvent: (data) => request("POST", "/admin/events", { body: data }),
  updateEvent: (id, data) => request("PUT", `/admin/events/${id}`, { body: data }),
  deleteEvent: (id) => request("DELETE", `/admin/events/${id}`),
  getAdminTestimonials: (params) => request("GET", `/admin/testimonials?${new URLSearchParams(params || {})}`),
  createTestimonial: (data) => request("POST", "/admin/testimonials", { body: data }),
  updateTestimonial: (id, data) => request("PUT", `/admin/testimonials/${id}`, { body: data }),
  deleteTestimonial: (id) => request("DELETE", `/admin/testimonials/${id}`),
  getAdminFeed: (params) => request("GET", `/admin/feed?${new URLSearchParams(params || {})}`),
  adminCreatePost: (data) => request("POST", "/admin/feed", { body: data }),
  moderatePost: (id, data) => request("PUT", `/admin/feed/${id}`, { body: data }),
  getAdminStats: () => request("GET", "/admin/stats"),
  getProfileForReview: (id) => request("GET", `/admin/profile-review/${id}`),
  approveProfile: (id, data) => request("PUT", `/admin/profile-review/${id}`, { body: data }),
  requestRevision: (id, data) => request("POST", `/admin/profile-review/${id}/revision`, { body: data }),
  getPendingProducts: (params) => request("GET", `/admin/products?${new URLSearchParams(params || {})}`),
  approveProduct: (id, data) => request("PUT", `/admin/products/${id}`, { body: data }),
  getPendingEdits: (params) => request("GET", `/admin/profile-edits?${new URLSearchParams(params || {})}`),
  reviewProfileEdit: (id, data) => request("PUT", `/admin/profile-edits/${id}`, { body: data }),
  adminEditProfile: (id, data) => request("PUT", `/admin/profile/${id}/edit`, { body: data }),

  // Homepage Config
  getHomepageConfig: () => cachedGet("/homepage-config"),
  getAdminHomepageConfig: () => request("GET", "/admin/homepage-config"),
  saveHomepageConfig: (config) => request("PUT", "/admin/homepage-config", { body: config }),

  // Owner ordering
  reorderMembers: (orderedIds) => request("PUT", "/admin/members/reorder", { body: { orderedIds } }),
  setOwnersSort: (mode) => request("PUT", "/admin/owners-sort", { body: { mode } }),

  // Share
  createShareToken: (data) => request("POST", "/share/create-token", { body: data }),
  validateShareToken: (token) => request("GET", `/share/validate/${token}`, { auth: false }),
  submitSharedProfile: (token, data) => request("POST", `/share/submit/${token}`, { body: data, auth: false }),
};

export default api;
