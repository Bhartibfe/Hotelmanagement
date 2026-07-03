import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  // Not logged in -> login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Profile is still incomplete -> complete profile
  if (user.profileStatus === "INCOMPLETE") {
    return <Navigate to="/complete-profile" replace />;
  }

  // Admin requested revisions -> complete profile (handles revision there now)
  if (user.membershipStatus === "REVISION_REQUESTED") {
    return <Navigate to="/complete-profile" replace />;
  }

  // Profile submitted, pending admin review
  if (user.membershipStatus === "PENDING" && user.profileStatus === "PENDING_REVIEW") {
    return <Navigate to="/membership-pending" replace />;
  }

  // Membership rejected -> show rejected message
  if (user.membershipStatus === "REJECTED") {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "500px",
            border: "1px solid #E2DDD5",
            padding: "60px 40px",
            borderTop: "3px solid #EF4444",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.1)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <i
              className="fas fa-times-circle"
              style={{ fontSize: "28px", color: "#EF4444" }}
            ></i>
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "28px",
              fontWeight: 600,
              color: "#0A1628",
              marginBottom: "12px",
            }}
          >
            Membership Not Approved
          </h2>
          <p
            style={{
              color: "#6B7280",
              fontSize: "15px",
              lineHeight: "1.7",
              margin: 0,
            }}
          >
            Unfortunately, your membership application was not approved at this
            time. If you believe this is an error, please contact our support
            team for assistance.
          </p>
        </div>
      </div>
    );
  }

  // Membership pending (legacy / fallback)
  if (user.membershipStatus === "PENDING") {
    return <Navigate to="/membership-pending" replace />;
  }

  // APPROVED or any other passing state -> allow access
  return children;
};

export default ProtectedRoute;
