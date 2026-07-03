import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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

// Public Pages
import Home from "./pages/Home/Home";
import AboutPage from "./pages/About/AboutPage";
import MembersPage from "./pages/Members/MembersPage";
import FeedPage from "./pages/Feed/FeedPage";
import VendorsPage from "./pages/Vendors/VendorsPage";
import ExpertsPage from "./pages/Experts/ExpertsPage";
import TestimonialsPage from "./pages/Testimonials/TestimonialsPage";
import MemberProfilePage from "./pages/Members/MemberProfilePage";
import EventsPage from "./pages/Events/EventsPage";
import InsightsPage from "./pages/Insights/InsightsPage";
import BlogDetailsPage from "./pages/BlogPages/BlogDetailsPage";
import ContactPage from "./pages/Contact/ContactPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

// Auth Pages
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import VendorRegisterPage from "./pages/Auth/VendorRegisterPage";
import ExpertRegisterPage from "./pages/Auth/ExpertRegisterPage";
import MembershipPendingPage from "./pages/Auth/MembershipPendingPage";
import CompleteProfilePage from "./pages/Auth/CompleteProfilePage";
import RevisionRequestedPage from "./pages/Auth/RevisionRequestedPage";

// Profile Pages
import MyProfilePage from "./pages/Profile/MyProfilePage";

// Admin Pages
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminMembershipRequests from "./pages/Admin/AdminMembershipRequests";
import AdminMembers from "./pages/Admin/AdminMembers";
import AdminVendors from "./pages/Admin/AdminVendors";
import AdminExperts from "./pages/Admin/AdminExperts";
import AdminEvents from "./pages/Admin/AdminEvents";
import AdminTestimonials from "./pages/Admin/AdminTestimonials";
import AdminFeed from "./pages/Admin/AdminFeed";
import AdminHomepage from "./pages/Admin/AdminHomepage";
import AdminProductApprovals from "./pages/Admin/AdminProductApprovals";
import AdminProfileEdits from "./pages/Admin/AdminProfileEdits";

function App() {
  useWow();
  useAos();
  useJarallax();
  useParallax();
  useParticles();
  useHasAnimation();

  useEffect(() => {
    tg_title_animation();
  }, []);

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AuthProvider>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/members/:id" element={<MemberProfilePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/experts" element={<ExpertsPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/insights/:slug" element={<BlogDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Redirects */}
        <Route path="/marketplace" element={<Navigate to="/vendors" replace />} />

        {/* Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/vendor" element={<VendorRegisterPage />} />
        <Route path="/register/expert" element={<ExpertRegisterPage />} />
        <Route path="/membership-pending" element={<MembershipPendingPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />
        <Route path="/revision-requested" element={<RevisionRequestedPage />} />

        {/* Protected Member Pages */}
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />

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
    </AuthProvider>
  );
}

export default App;
