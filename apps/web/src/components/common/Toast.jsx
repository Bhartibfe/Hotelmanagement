import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { getErrorMessage, getFieldErrorList } from "../../lib/errors";

/*=============================
  Toasts
  -----------------------------
  Writes across this site used to fail silently: empty catch blocks around a
  save, a delete that quietly did nothing, one `alert("Failed to send email")`
  that never said why. Nobody could tell a permission problem from a dropped
  connection from a duplicate email address.

  Every write now reports through here. The message is the one the server sent,
  not a category label, and an error stays until dismissed — successes fade on
  their own.
===============================*/

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  // Deliberately not throwing: a component rendered outside the provider
  // (a preview, a test) should still work, just without toasts.
  return ctx || FALLBACK;
};

const FALLBACK = {
  toastError: (err) => console.error(err),
  toastSuccess: () => {},
  dismiss: () => {},
};

const SUCCESS_MS = 4000;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (toast) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { ...toast, id }]);
      if (toast.tone === "success") {
        timers.current.set(id, setTimeout(() => dismiss(id), SUCCESS_MS));
      }
      return id;
    },
    [dismiss]
  );

  /*  `action` names what was being attempted — "delete the event", "save the
      partner". It titles the toast, so a bare "Not authorized" is read as
      "Could not delete the event / Not authorized". */
  const toastError = useCallback(
    (err, action) => {
      console.error(action ? `Action failed (${action}):` : "Action failed:", err);
      return push({
        tone: "error",
        title: action ? `Could not ${action}` : "Something went wrong",
        message: getErrorMessage(err),
        details: getFieldErrorList(err),
      });
    },
    [push]
  );

  const toastSuccess = useCallback((message) => push({ tone: "success", message }), [push]);

  const value = useMemo(() => ({ toastError, toastSuccess, dismiss }), [toastError, toastSuccess, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

const TONES = {
  error: { bg: "#FEF2F2", border: "#FCA5A5", text: "#991B1B", icon: "fas fa-circle-exclamation" },
  success: { bg: "#ECFDF5", border: "#6EE7B7", text: "#065F46", icon: "fas fa-circle-check" },
};

const ToastStack = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="app-toast-stack" aria-live="polite">
      {toasts.map((toast) => {
        const t = TONES[toast.tone] || TONES.error;
        return (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className="app-toast"
            style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.text }}
          >
            <i className={t.icon} style={{ marginTop: "2px", flexShrink: 0 }} aria-hidden="true"></i>
            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title && <strong style={{ display: "block", marginBottom: "2px" }}>{toast.title}</strong>}
              <span style={{ overflowWrap: "anywhere" }}>{toast.message}</span>
              {toast.details && toast.details.length > 1 && (
                <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                  {toast.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss"
              style={{
                background: "none",
                border: "none",
                color: t.text,
                cursor: "pointer",
                flexShrink: 0,
                fontSize: "14px",
                lineHeight: 1,
                opacity: 0.7,
                padding: "4px",
              }}
            >
              <i className="fas fa-xmark"></i>
            </button>
          </div>
        );
      })}

      <style>{`
        .app-toast-stack {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 2000;
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: min(400px, calc(100vw - 40px));
          pointer-events: none;
        }
        .app-toast {
          pointer-events: auto;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 13px;
          line-height: 1.5;
          box-shadow: 0 12px 30px rgba(10, 22, 40, 0.16);
          animation: appToastIn 0.22s ease-out;
        }
        @keyframes appToastIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Phones: full width along the bottom, clear of the home indicator. */
        @media (max-width: 575.98px) {
          .app-toast-stack {
            right: 12px;
            left: 12px;
            width: auto;
            bottom: calc(12px + env(safe-area-inset-bottom, 0px));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .app-toast { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default ToastProvider;
