import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: "fas fa-th-large", exact: true },
  { path: "/admin/membership-requests", label: "Membership Requests", icon: "fas fa-user-clock", badge: "23" },
  { path: "/admin/members", label: "Members", icon: "fas fa-users" },
  { path: "/admin/vendors", label: "Vendors", icon: "fas fa-building" },
  { path: "/admin/experts", label: "Experts", icon: "fas fa-user-tie" },
  { path: "/admin/events", label: "Events", icon: "fas fa-calendar-alt" },
  { path: "/admin/testimonials", label: "Testimonials", icon: "fas fa-quote-right" },
  { path: "/admin/product-approvals", label: "Product Approvals", icon: "fas fa-box-open" },
  { path: "/admin/profile-edits", label: "Profile Edits", icon: "fas fa-edit" },
  { path: "/admin/feed", label: "Feed Posts", icon: "fas fa-rss" },
  { path: "/admin/homepage", label: "Homepage", icon: "fas fa-home" },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sidebarWidth = sidebarCollapsed ? "72px" : "270px";

  // Get current page title
  const currentPage = NAV_ITEMS.find((item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path) && item.path !== "/admin"
  ) || NAV_ITEMS[0];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarWidth,
          background: "linear-gradient(180deg, #0A1628 0%, #0F1D32 100%)",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "4px 0 24px rgba(10, 22, 40, 0.15)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: sidebarCollapsed ? "20px 16px" : "24px 28px",
            borderBottom: "1px solid rgba(198,169,98,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "76px",
          }}
        >
          {!sidebarCollapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #C6A962, #E8D5A3)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#0A1628", fontFamily: "'Cormorant Garamond', serif" }}>H</span>
              </div>
              <div>
                <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.2 }}>
                  Admin Panel
                </h4>
                <span style={{ fontSize: "10px", color: "#546A8B", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  Hotel Sircle
                </span>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #C6A962, #E8D5A3)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              <span style={{ fontSize: "16px", fontWeight: 800, color: "#0A1628", fontFamily: "'Cormorant Garamond', serif" }}>H</span>
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#546A8B", cursor: "pointer", padding: "6px", borderRadius: "6px", fontSize: "13px", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(198,169,98,0.15)"; e.currentTarget.style.color = "#C6A962"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#546A8B"; }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          )}
        </div>

        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            style={{ background: "none", border: "none", color: "#546A8B", cursor: "pointer", padding: "16px 0", fontSize: "13px" }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        )}

        {/* Section Label */}
        {!sidebarCollapsed && (
          <div style={{ padding: "20px 28px 8px", fontSize: "10px", color: "#3D5375", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600 }}>
            Navigation
          </div>
        )}

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "4px 12px", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }} className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onMouseEnter={() => setHoveredNav(item.path)}
              onMouseLeave={() => setHoveredNav(null)}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: sidebarCollapsed ? "12px 16px" : "11px 16px",
                color: isActive ? "#C6A962" : hoveredNav === item.path ? "#FFFFFF" : "#7B8FAB",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                background: isActive ? "rgba(198,169,98,0.1)" : hoveredNav === item.path ? "rgba(255,255,255,0.04)" : "transparent",
                borderRadius: "8px",
                margin: "2px 0",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                position: "relative",
              })}
            >
              <div style={{ width: "20px", textAlign: "center", flexShrink: 0 }}>
                <i className={item.icon} style={{ fontSize: "14px" }}></i>
              </div>
              {!sidebarCollapsed && <span>{item.label}</span>}
              {!sidebarCollapsed && item.badge && (
                <span style={{ marginLeft: "auto", background: "#F59E0B", color: "#0A1628", fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "10px", lineHeight: 1.4 }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div style={{ padding: sidebarCollapsed ? "16px 12px" : "16px 20px", borderTop: "1px solid rgba(198,169,98,0.1)" }}>
          {!sidebarCollapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "linear-gradient(135deg, #C6A962, #E8D5A3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#0A1628" }}>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "13px", color: "#FFFFFF", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.firstName} {user?.lastName}
                </p>
                <span style={{ fontSize: "11px", color: "#546A8B" }}>Administrator</span>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: "8px" }}>
            <NavLink
              to="/"
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", color: "#7B8FAB", textDecoration: "none", fontSize: "11px", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(198,169,98,0.1)"; e.currentTarget.style.color = "#C6A962"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#7B8FAB"; }}
            >
              <i className="fas fa-external-link-alt" style={{ fontSize: "10px" }}></i>
              {!sidebarCollapsed && "Site"}
            </NavLink>
            <button
              onClick={handleLogout}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", border: "none", color: "#7B8FAB", cursor: "pointer", fontSize: "11px", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#EF4444"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#7B8FAB"; }}
            >
              <i className="fas fa-sign-out-alt" style={{ fontSize: "10px" }}></i>
              {!sidebarCollapsed && "Logout"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: sidebarWidth,
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Bar */}
        <header
          style={{
            background: "#FFFFFF",
            padding: "0 32px",
            height: "64px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 999,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: "16px", padding: "4px" }}
              >
                <i className="fas fa-bars"></i>
              </button>
            )}
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#0A1628", margin: 0, fontFamily: "'Cormorant Garamond', serif" }}>
                {currentPage.label}
              </h2>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ position: "relative" }}>
              <i className="far fa-bell" style={{ fontSize: "18px", color: "#64748B", cursor: "pointer" }}></i>
              <span style={{ position: "absolute", top: "-4px", right: "-6px", width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444", border: "2px solid #FFFFFF" }}></span>
            </div>
            <div style={{ width: "1px", height: "24px", background: "#E2E8F0" }}></div>
            <span style={{ fontSize: "13px", color: "#64748B" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: "28px 32px", flex: 1 }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        .admin-sidebar-nav::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AdminLayout;
