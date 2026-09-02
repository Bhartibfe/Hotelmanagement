/*=============================
  Error text helpers
  -----------------------------
  services/api.js already produces a readable sentence for everything it
  throws. These helpers cover the rest: errors thrown by component code, and
  the handful of places that need the per-field detail broken back out.
===============================*/

import { prettyField } from "../services/apiError";

// The one function every catch block should use. Never returns "[object
// Object]", "undefined", or a raw "Failed to fetch".
export const getErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  if (!err) return fallback;
  if (typeof err === "string") return err.trim() || fallback;

  const message = typeof err.message === "string" ? err.message.trim() : "";
  if (!message) return fallback;

  // Anything the browser throws verbatim is noise to a member; swap in wording
  // that says what to do about it.
  const opaque = {
    "Failed to fetch": "We could not reach the server. Check your connection and try again.",
    "NetworkError when attempting to fetch resource.":
      "We could not reach the server. Check your connection and try again.",
    "Load failed": "We could not reach the server. Check your connection and try again.",
  };
  return opaque[message] || message;
};

// `{ email: "Invalid email format" }` for a form to hang under its inputs.
export const getFieldErrors = (err) => (err && err.fieldErrors) || null;

// Field-level detail as a bullet list, for forms that show one summary block
// rather than per-input messages.
export const getFieldErrorList = (err) => {
  const fields = getFieldErrors(err);
  if (!fields) return [];
  return Object.entries(fields).map(([field, message]) => {
    if (field === "_") return message;
    const label = prettyField(field);
    // Same rule as the summary line: never write "First name: First name is
    // required" when the server's message already names the field.
    return message.toLowerCase().startsWith(label.toLowerCase()) ? message : `${label}: ${message}`;
  });
};

// True when offering a "Try again" button makes sense.
export const isRetryable = (err) =>
  Boolean(err && (err.isRetryable || err.code === "NETWORK" || err.code === "TIMEOUT" || err.status >= 500));
