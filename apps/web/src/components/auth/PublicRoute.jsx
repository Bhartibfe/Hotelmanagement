import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LoadingSpinner = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
    <div style={{ width: 40, height: 40, border: "3px solid #f3f3f3", borderTop: "3px solid #8B7355", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
);

const authPaths = ["/login", "/register", "/register/hotel-owner", "/register/vendor", "/register/expert"];

const PublicRoute = () => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  // Redirect authenticated users away from login/register pages
  if (user && authPaths.includes(location.pathname)) {
    return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
