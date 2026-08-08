import React, { useEffect, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "aos/dist/aos.css";
import { tg_title_animation } from "./lib/gsap/tg_title_animation";
import { useParticles } from "./lib/hooks/useParticles";
import { useParallax } from "./lib/hooks/useParallax";
import { useHasAnimation } from "./lib/hooks/useHasAnimation";
import { useWow } from "./lib/hooks/useWow";
import { useAos } from "./lib/hooks/useAos";
import { useJarallax } from "./lib/hooks/useJarallax";
import { AuthProvider } from "./contexts/AuthContext";

// Route Guards
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import PublicRoute from "./components/auth/PublicRoute";

// Lazy-loaded Public Pages
const Home = React.lazy(() => import("./pages/Home/Home"));
const AboutPage = React.lazy(() => import("./pages/About/AboutPage"));
const MembersPage = React.lazy(() => import("./pages/Members/MembersPage"));
const FeedPage = React.lazy(() => import("./pages/Feed/FeedPage"));
const VendorsPage = React.lazy(() => import("./pages/Vendors/VendorsPage"));
const ExpertsPage = React.lazy(() => import("./pages/Experts/ExpertsPage"));
const ExpertProfilePage = React.lazy(() => import("./pages/Experts/ExpertProfilePage"));
const TestimonialsPage = React.lazy(() => import("./pages/Testimonials/TestimonialsPage"));
const MemberProfilePage = React.lazy(() => import("./pages/Members/MemberProfilePage"));
const EventsPage = React.lazy(() => import("./pages/Events/EventsPage"));
const InsightsPage = React.lazy(() => import("./pages/Insights/InsightsPage"));
const BlogDetailsPage = React.lazy(() => import("./pages/BlogPages/BlogDetailsPage"));
const ContactPage = React.lazy(() => import("./pages/Contact/ContactPage"));
const ErrorPage = React.lazy(() => import("./pages/ErrorPage/ErrorPage"));

// Lazy-loaded Auth Pages
const LoginPage = React.lazy(() => import("./pages/Auth/LoginPage"));
const RoleSelectionPage = React.lazy(() => import("./pages/Auth/RoleSelectionPage"));
const RegisterPage = React.lazy(() => import("./pages/Auth/RegisterPage"));
const VendorRegisterPage = React.lazy(() => import("./pages/Auth/VendorRegisterPage"));
const ExpertRegisterPage = React.lazy(() => import("./pages/Auth/ExpertRegisterPage"));
const MembershipPendingPage = React.lazy(() => import("./pages/Auth/MembershipPendingPage"));
const CompleteProfilePage = React.lazy(() => import("./pages/Auth/CompleteProfilePage"));
const RevisionRequestedPage = React.lazy(() => import("./pages/Auth/RevisionRequestedPage"));
const SharedProfileFormPage = React.lazy(() => import("./pages/Auth/SharedProfileFormPage"));

// Lazy-loaded Profile Pages
const MyProfilePage = React.lazy(() => import("./pages/Profile/MyProfilePage"));

// Lazy-loaded Admin Pages
const AdminLayout = React.lazy(() => import("./pages/Admin/AdminLayout"));
const AdminDashboard = React.lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminMembershipRequests = React.lazy(() => import("./pages/Admin/AdminMembershipRequests"));
const AdminMembers = React.lazy(() => import("./pages/Admin/AdminMembers"));
const AdminVendors = React.lazy(() => import("./pages/Admin/AdminVendors"));
const AdminExperts = React.lazy(() => import("./pages/Admin/AdminExperts"));
const AdminEvents = React.lazy(() => import("./pages/Admin/AdminEvents"));
const AdminTestimonials = React.lazy(() => import("./pages/Admin/AdminTestimonials"));
const AdminFeed = React.lazy(() => import("./pages/Admin/AdminFeed"));
const AdminHomepage = React.lazy(() => import("./pages/Admin/AdminHomepage"));
const AdminProductApprovals = React.lazy(() => import("./pages/Admin/AdminProductApprovals"));
const AdminProfileEdits = React.lazy(() => import("./pages/Admin/AdminProfileEdits"));

const LoadingSpinner = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
    <div style={{ width: 40, height: 40, border: "3px solid #f3f3f3", borderTop: "3px solid #8B7355", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
);

// Separate component for animation hooks so they don't run on admin routes
const AnimationInitializer = () => {
  useWow();
  useAos();
  useJarallax();
  useParallax();
  useParticles();
  useHasAnimation();

  useEffect(() => {
    tg_title_animation();
  }, []);

  return null;
};

function App() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AuthProvider>
      {!isAdminRoute && <AnimationInitializer />}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public & Member Pages */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/members/:id" element={<MemberProfilePage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/experts" element={<ExpertsPage />} />
            <Route path="/experts/:id" element={<ExpertProfilePage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/insights/:slug" element={<BlogDetailsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/marketplace" element={<Navigate to="/vendors" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RoleSelectionPage />} />
            <Route path="/register/hotel-owner" element={<RegisterPage />} />
            <Route path="/register/vendor" element={<VendorRegisterPage />} />
            <Route path="/register/expert" element={<ExpertRegisterPage />} />
            <Route path="/shared-profile/:token" element={<SharedProfileFormPage />} />
            <Route path="/membership-pending" element={<MembershipPendingPage />} />
            <Route path="/complete-profile" element={<CompleteProfilePage />} />
            <Route path="/revision-requested" element={<RevisionRequestedPage />} />
            <Route path="/my-profile" element={<MyProfilePage />} />
          </Route>

          {/* Admin Pages */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="membership-requests" element={<AdminMembershipRequests />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="vendors" element={<AdminVendors />} />
            <Route path="experts" element={<AdminExperts />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="feed" element={<AdminFeed />} />
            <Route path="homepage" element={<AdminHomepage />} />
            <Route path="product-approvals" element={<AdminProductApprovals />} />
            <Route path="profile-edits" element={<AdminProfileEdits />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
