import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LoadingSpinner = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
    <div style={{ width: 40, height: 40, border: "3px solid #f3f3f3", borderTop: "3px solid #8B7355", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  // Pending review
  if (user.membershipStatus === "PENDING" && user.profileStatus === "PENDING_REVIEW") {
    return <Navigate to="/membership-pending" replace />;
  }

  // Rejected
  if (user.membershipStatus === "REJECTED") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FAFAF7", padding: "24px" }}>
        <div style={{ maxWidth: 480, textAlign: "center", padding: "48px 32px", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>!</div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1F2937", marginBottom: 12 }}>Membership Not Approved</h2>
          {user.rejectionReason && (
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Reason: {user.rejectionReason}
            </p>
          )}
          <p style={{ color: "#9CA3AF", fontSize: 13 }}>Please contact support for more information.</p>
        </div>
      </div>
    );
  }

  // Fail-closed: only APPROVED members get through
  if (user.membershipStatus !== "APPROVED" && user.role !== "ADMIN") {
    return <Navigate to="/membership-pending" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
