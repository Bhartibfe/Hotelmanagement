/*=============================
  ApiError
  -----------------------------
  Every failure that comes out of services/api.js is one of these, so callers
  never have to guess whether they are holding a network `TypeError`, an abort,
  or a real server response.

  The point is that `err.message` is always a sentence a member can act on.
  Before this existed a dropped connection surfaced as the browser's raw
  "Failed to fetch" and a rejected form surfaced as "Validation failed" with the
  per-field detail thrown away on the floor.
===============================*/

export class ApiError extends Error {
  constructor(message, { status = 0, code = "UNKNOWN", fieldErrors = null, path = "", cause = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    // { email: "Invalid email format", ... } — forms use this to mark inputs.
    this.fieldErrors = fieldErrors;
    this.path = path;
    if (cause) this.cause = cause;
  }

  // True when retrying the exact same request could plausibly succeed.
  get isRetryable() {
    return this.code === "NETWORK" || this.code === "TIMEOUT" || this.status >= 500 || this.status === 429;
  }
}

// What to say when the server sent a status but no usable message of its own.
// `action` is a short verb phrase naming what was being attempted, so the text
// reads as "We could not save the event because ..." rather than "Error 409".
const statusMessage = (status, action) => {
  const what = action || "complete that request";
  switch (status) {
    case 400:
      return `We could not ${what} because some of the details sent were not valid. Please check the form and try again.`;
    case 401:
      return "Your session has expired. Please sign in again to continue.";
    case 403:
      return `You do not have permission to ${what}. If you think this is wrong, contact an administrator.`;
    case 404:
      return "We could not find what you were looking for — it may have been removed or renamed.";
    case 409:
      return `We could not ${what} because it conflicts with something that already exists.`;
    case 413:
      return "That upload is too large. Please use a smaller file and try again.";
    case 422:
      return `We could not ${what} because some of the details sent were not valid.`;
    case 429:
      return "Too many requests in a short time. Please wait a moment and try again.";
    case 500:
      return `The server hit an unexpected problem while trying to ${what}. Please try again in a moment.`;
    case 502:
    case 503:
    case 504:
      return "The server is temporarily unavailable. Please try again in a minute.";
    default:
      return `We could not ${what} (server responded with status ${status}).`;
  }
};

// Turns the API's `{ error, errors: [{ field, message }] }` validation payload
// into one readable sentence plus a field map the forms can use.
const readValidation = (list) => {
  const fieldErrors = {};
  const parts = [];
  list.forEach(({ field, message }) => {
    const key = field || "_";
    if (!fieldErrors[key]) fieldErrors[key] = message;
    parts.push(labelled(field, message));
  });
  return { fieldErrors, summary: parts.join(" · ") };
};

/*
  "First name is required" already names its field, so prefixing it would
  produce "First name: First name is required". Only messages that do not lead
  with their own field name get the prefix.
*/
const labelled = (field, message) => {
  if (!field) return message;
  const label = prettyField(field);
  return message.toLowerCase().startsWith(label.toLowerCase()) ? message : `${label}: ${message}`;
};

// "organizationName" / "user.firstName" -> "Organization name" / "First name"
export const prettyField = (field) =>
  String(field)
    .split(".")
    .pop()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());

export const buildApiError = ({ status, body, path, action }) => {
  if (body && Array.isArray(body.errors) && body.errors.length > 0) {
    const { fieldErrors, summary } = readValidation(body.errors);
    return new ApiError(summary, { status, code: "VALIDATION", fieldErrors, path });
  }

  const serverMessage = typeof body?.error === "string" ? body.error.trim() : "";
  // Server messages like "Failed to update vendor" are already specific enough;
  // only fall back to our own wording when there is nothing to show.
  const message = serverMessage || statusMessage(status, action);
  return new ApiError(message, {
    status,
    code: status === 401 ? "UNAUTHENTICATED" : status === 403 ? "FORBIDDEN" : status === 404 ? "NOT_FOUND" : "HTTP",
    path,
  });
};

export { statusMessage };
