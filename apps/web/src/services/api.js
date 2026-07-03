const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
};

export const api = {
  // Auth
  register: (data) =>
    fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  login: (data) =>
    fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  getMe: () =>
    fetch(`${API_URL}/auth/me`, { headers: getHeaders() }).then(handleResponse),

  // Users
  getUsers: (params) =>
    fetch(`${API_URL}/users?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  getUser: (id) =>
    fetch(`${API_URL}/users/${id}`, { headers: getHeaders() }).then(handleResponse),

  updateProfile: (data) =>
    fetch(`${API_URL}/users/me`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Profile - Complete & Manage
  submitProfile: (data) =>
    fetch(`${API_URL}/profile/complete`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  getMyProfile: () =>
    fetch(`${API_URL}/profile/me`, { headers: getHeaders() }).then(handleResponse),

  resubmitProfile: (data) =>
    fetch(`${API_URL}/profile/resubmit`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  addProduct: (data) =>
    fetch(`${API_URL}/profile/products`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  getMyProducts: () =>
    fetch(`${API_URL}/profile/products`, { headers: getHeaders() }).then(handleResponse),

  updateProduct: (id, data) =>
    fetch(`${API_URL}/profile/products/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  submitProfileEdit: (data) =>
    fetch(`${API_URL}/profile/edit-draft`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  getMyEditDraft: () =>
    fetch(`${API_URL}/profile/edit-draft`, { headers: getHeaders() }).then(handleResponse),

  // Feed
  getFeed: (params) =>
    fetch(`${API_URL}/feed?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  createPost: (data) =>
    fetch(`${API_URL}/feed`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  likePost: (id) =>
    fetch(`${API_URL}/feed/${id}/like`, {
      method: "POST",
      headers: getHeaders(),
    }).then(handleResponse),

  // Hotels
  getHotels: (params) =>
    fetch(`${API_URL}/hotels?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  getHotel: (id) =>
    fetch(`${API_URL}/hotels/${id}`, { headers: getHeaders() }).then(handleResponse),

  createHotel: (data) =>
    fetch(`${API_URL}/hotels`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Vendors (Public)
  getVendors: (params) =>
    fetch(`${API_URL}/vendors?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  getFeaturedVendors: () =>
    fetch(`${API_URL}/vendors/featured`, {
      headers: getHeaders(),
    }).then(handleResponse),

  // Experts (Public)
  getExperts: (params) =>
    fetch(`${API_URL}/experts?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  getExpert: (id) =>
    fetch(`${API_URL}/experts/${id}`, { headers: getHeaders() }).then(handleResponse),

  getFeaturedExperts: () =>
    fetch(`${API_URL}/experts/featured`, {
      headers: getHeaders(),
    }).then(handleResponse),

  // Testimonials (Public)
  getTestimonials: (params) =>
    fetch(`${API_URL}/testimonials?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  getFeaturedTestimonials: () =>
    fetch(`${API_URL}/testimonials/featured`, {
      headers: getHeaders(),
    }).then(handleResponse),

  // Events
  getEvents: (params) =>
    fetch(`${API_URL}/events?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  getEvent: (id) =>
    fetch(`${API_URL}/events/${id}`, { headers: getHeaders() }).then(handleResponse),

  getFeaturedEvents: () =>
    fetch(`${API_URL}/events/featured`, {
      headers: getHeaders(),
    }).then(handleResponse),

  registerForEvent: (id) =>
    fetch(`${API_URL}/events/${id}/register`, {
      method: "POST",
      headers: getHeaders(),
    }).then(handleResponse),

  // Connections
  getConnections: () =>
    fetch(`${API_URL}/connections`, { headers: getHeaders() }).then(handleResponse),

  sendConnection: (data) =>
    fetch(`${API_URL}/connections`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Messages
  getConversations: () =>
    fetch(`${API_URL}/messages/conversations`, { headers: getHeaders() }).then(handleResponse),

  getMessages: (userId) =>
    fetch(`${API_URL}/messages/${userId}`, { headers: getHeaders() }).then(handleResponse),

  sendMessage: (userId, content) =>
    fetch(`${API_URL}/messages/${userId}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ content }),
    }).then(handleResponse),

  // Notifications
  getNotifications: () =>
    fetch(`${API_URL}/notifications`, { headers: getHeaders() }).then(handleResponse),

  // ===== Admin Endpoints =====

  // Admin - Membership Requests
  getMembershipRequests: (params) =>
    fetch(`${API_URL}/admin/membership-requests?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  approveMembership: (id, data) =>
    fetch(`${API_URL}/admin/membership-requests/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Admin - Members
  getAdminMembers: (params) =>
    fetch(`${API_URL}/admin/members?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  updateMember: (id, data) =>
    fetch(`${API_URL}/admin/members/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Admin - Vendors
  getAdminVendors: (params) =>
    fetch(`${API_URL}/admin/vendors?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  toggleVendorFeatured: (id) =>
    fetch(`${API_URL}/admin/vendors/${id}/toggle-featured`, {
      method: "PUT",
      headers: getHeaders(),
    }).then(handleResponse),

  // Admin - Experts
  getAdminExperts: (params) =>
    fetch(`${API_URL}/admin/experts?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  createExpert: (data) =>
    fetch(`${API_URL}/admin/experts`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  toggleExpertFeatured: (id) =>
    fetch(`${API_URL}/admin/experts/${id}/toggle-featured`, {
      method: "PUT",
      headers: getHeaders(),
    }).then(handleResponse),

  deleteExpert: (id) =>
    fetch(`${API_URL}/admin/experts/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(handleResponse),

  // Admin - Events
  getAdminEvents: (params) =>
    fetch(`${API_URL}/admin/events?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  createEvent: (data) =>
    fetch(`${API_URL}/admin/events`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateEvent: (id, data) =>
    fetch(`${API_URL}/admin/events/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteEvent: (id) =>
    fetch(`${API_URL}/admin/events/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(handleResponse),

  // Admin - Testimonials
  getAdminTestimonials: (params) =>
    fetch(`${API_URL}/admin/testimonials?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  createTestimonial: (data) =>
    fetch(`${API_URL}/admin/testimonials`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateTestimonial: (id, data) =>
    fetch(`${API_URL}/admin/testimonials/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteTestimonial: (id) =>
    fetch(`${API_URL}/admin/testimonials/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(handleResponse),

  // Admin - Feed
  getAdminFeed: (params) =>
    fetch(`${API_URL}/admin/feed?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  moderatePost: (id, data) =>
    fetch(`${API_URL}/admin/feed/${id}/moderate`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Admin - Stats
  getAdminStats: () =>
    fetch(`${API_URL}/admin/stats`, {
      headers: getHeaders(),
    }).then(handleResponse),

  // Admin - Profile Review
  getProfileForReview: (userId) =>
    fetch(`${API_URL}/admin/profile-review/${userId}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  approveProfile: (userId, data) =>
    fetch(`${API_URL}/admin/profile-review/${userId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  requestRevision: (userId, data) =>
    fetch(`${API_URL}/admin/profile-review/${userId}/revision`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Admin - Product Approvals
  getPendingProducts: (params) =>
    fetch(`${API_URL}/admin/product-approvals?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  approveProduct: (id, data) =>
    fetch(`${API_URL}/admin/product-approvals/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Admin - Profile Edits
  getPendingEdits: (params) =>
    fetch(`${API_URL}/admin/profile-edits?${new URLSearchParams(params)}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  reviewProfileEdit: (id, data) =>
    fetch(`${API_URL}/admin/profile-edits/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),
};
