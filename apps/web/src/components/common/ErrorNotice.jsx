import React from "react";
import { getErrorMessage, getFieldErrorList, isRetryable } from "../../lib/errors";

/*=============================
  ErrorNotice
  -----------------------------
  One block used everywhere a request can fail, so a member always sees what
  broke and what to do next instead of an empty section that silently rendered
  nothing. `onRetry` is only offered for failures a retry could actually fix.
===============================*/

const TONES = {
  error: { bg: "#FEF2F2", border: "#FCA5A5", text: "#991B1B", icon: "fas fa-circle-exclamation" },
  warning: { bg: "#FFFBEB", border: "#FCD34D", text: "#92400E", icon: "fas fa-triangle-exclamation" },
  info: { bg: "#EFF6FF", border: "#93C5FD", text: "#1E40AF", icon: "fas fa-circle-info" },
};

export const ErrorNotice = ({ error, title, onRetry, onDismiss, tone = "error", compact = false, style }) => {
  if (!error) return null;

  const t = TONES[tone] || TONES.error;
  const message = getErrorMessage(error);
  const details = getFieldErrorList(error);
  const showRetry = typeof onRetry === "function" && isRetryable(error);

  return (
    <div
      role="alert"
      className="error-notice"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: "8px",
        padding: compact ? "10px 14px" : "16px 18px",
        color: t.text,
        fontSize: compact ? "13px" : "14px",
        lineHeight: 1.55,
        ...style,
      }}
    >
      <i className={t.icon} style={{ marginTop: "2px", flexShrink: 0 }} aria-hidden="true"></i>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <strong style={{ display: "block", marginBottom: "4px" }}>{title}</strong>}
        <span style={{ overflowWrap: "anywhere" }}>{message}</span>

        {/* Only shown when the server named specific fields — the summary line
            above already repeats them, so this stays collapsed for a single one. */}
        {details.length > 1 && (
          <ul style={{ margin: "8px 0 0", paddingLeft: "18px" }}>
            {details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}

        {showRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              marginTop: "10px",
              background: "transparent",
              border: `1px solid ${t.border}`,
              borderRadius: "6px",
              color: t.text,
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              minHeight: "40px",
              padding: "8px 16px",
              textTransform: "uppercase",
            }}
          >
            <i className="fas fa-rotate-right" style={{ marginRight: "6px" }} aria-hidden="true"></i>
            Try again
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss this message"
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
      )}
    </div>
  );
};

/*  A whole section failed to load. Keeps the page rhythm instead of the section
    vanishing, which is what an empty `catch {}` used to produce. */
export const SectionError = ({ error, onRetry, background = "#FFFFFF", padding = "clamp(48px, 6vw, 72px) 0" }) => (
  <section style={{ padding, background }}>
    <div className="container">
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <ErrorNotice error={error} title="This section could not be loaded" onRetry={onRetry} />
      </div>
    </div>
  </section>
);

export default ErrorNotice;
