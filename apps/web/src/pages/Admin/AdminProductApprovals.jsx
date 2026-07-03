import React from "react";

const AdminProductApprovals = () => {
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
          Product Approvals
        </h2>
        <p style={{ color: "#6B7280", fontSize: "14px" }}>
          Review and approve vendor product submissions.
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
            className="flaticon-investment"
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
          Product approval workflow will be available here.
        </p>
      </div>
    </div>
  );
};

export default AdminProductApprovals;
