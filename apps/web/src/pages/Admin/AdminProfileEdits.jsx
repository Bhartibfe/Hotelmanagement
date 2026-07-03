import React from "react";

const AdminProfileEdits = () => {
  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "28px",
            fontWeight: 600,
            color: "#0A1628",
            marginBottom: "8px",
          }}
        >
          Profile Edit Requests
        </h2>
        <p style={{ color: "#6B7280", fontSize: "14px" }}>
          Review and approve member profile edit requests.
        </p>
      </div>
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2DDD5",
          padding: "60px 40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(198, 169, 98, 0.1)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <i
            className="flaticon-profit"
            style={{ fontSize: "24px", color: "#C6A962" }}
          ></i>
        </div>
        <h4
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "20px",
            fontWeight: 600,
            color: "#0A1628",
            marginBottom: "8px",
          }}
        >
          Coming Soon
        </h4>
        <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
          Profile edit review workflow will be available here.
        </p>
      </div>
    </div>
  );
};

export default AdminProfileEdits;
