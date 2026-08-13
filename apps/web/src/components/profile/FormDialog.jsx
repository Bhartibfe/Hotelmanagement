import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const FormDialog = ({ title, onClose, children, maxWidth = 800 }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0, 0, 0, 0.5)", zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          width: "100%",
          maxWidth: `${maxWidth}px`,
          maxHeight: "90vh",
          overflowY: "auto",
          borderTop: "3px solid #C6A962",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 28px", borderBottom: "1px solid #E2DDD5",
          position: "sticky", top: 0, background: "#FFFFFF", zIndex: 10,
        }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "22px",
            fontWeight: 600, color: "#0A1628", margin: 0,
          }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", fontSize: "24px",
              color: "#64748B", cursor: "pointer", width: "32px", height: "32px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px" }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FormDialog;
