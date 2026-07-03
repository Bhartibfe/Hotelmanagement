import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

const EMPTY_STATS = {
  totalMembers: 0,
  pendingRequests: 0,
  totalVendors: 0,
  totalExperts: 0,
  totalEvents: 0,
  upcomingEvents: 0,
  totalTestimonials: 0,
  totalPosts: 0,
};

// Animated counter component
const AnimatedNumber = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) { setCount(0); return; }
    const startTime = performance.now();
    const step = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

// Mini bar chart component
const MiniBarChart = ({ data, color, height = 60 }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height }}>
      {data.map((val, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${(val / max) * 100}%`,
            background: i === data.length - 1 ? color : `${color}40`,
            borderRadius: "2px 2px 0 0",
            transition: "height 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            transitionDelay: `${i * 0.05}s`,
            minHeight: "4px",
          }}
        />
      ))}
    </div>
  );
};

// Donut chart component
const DonutChart = ({ segments, size = 140, strokeWidth = 18 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1E293B" strokeWidth={strokeWidth} />
      {segments.map((seg, i) => {
        const dash = (seg.value / 100) * circumference;
        const currentOffset = offset;
        offset += dash;
        return (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-currentOffset}
            style={{
              transition: "stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
              transitionDelay: `${i * 0.2}s`,
            }}
          />
        );
      })}
    </svg>
  );
};

// Sparkline component
const Sparkline = ({ data, color, width = 120, height = 32 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`).join(" ");

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2} r="3" fill={color} />
    </svg>
  );
};

const TYPE_LABEL_MAP = { HOTEL_OWNER: "Hotel Owners", VENDOR: "Vendors", PROFESSIONAL: "Professionals", CONSULTANT: "Consultants", OTHER: "Other" };
const TYPE_COLOR_MAP = { HOTEL_OWNER: "#C6A962", VENDOR: "#10B981", PROFESSIONAL: "#8B5CF6", CONSULTANT: "#3B82F6", OTHER: "#64748B" };

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentMembers, setRecentMembers] = useState([]);
  const [memberTypeData, setMemberTypeData] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      try {
        const data = await api.getAdminStats();
        if (data) {
          setStats(data);
          setRecentMembers(data.recentMembers || []);
          if (data.membersByType && data.totalMembers > 0) {
            const total = data.membersByType.reduce((sum, t) => sum + t._count.id, 0) || 1;
            setMemberTypeData(
              data.membersByType.map((t) => ({
                label: TYPE_LABEL_MAP[t.memberType] || t.memberType,
                value: Math.round((t._count.id / total) * 100),
                color: TYPE_COLOR_MAP[t.memberType] || "#64748B",
                count: t._count.id,
              }))
            );
          }
        }
      } catch {
        // empty state
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const s = stats || EMPTY_STATS;

  const statCards = [
    { label: "Total Members", value: s.totalMembers || 0, icon: "fas fa-users", color: "#C6A962", gradient: "linear-gradient(135deg, #0A1628, #1C2A3A)", sparkData: [180, 220, 195, 240, 280, 310, 290, 340, 380, 420, 460, s.totalMembers || 500], link: "/admin/members" },
    { label: "Pending Requests", value: s.pendingRequests || 0, icon: "fas fa-user-clock", color: "#F59E0B", gradient: "linear-gradient(135deg, #451A03, #78350F)", sparkData: [5, 8, 12, 9, 15, 18, 14, 20, s.pendingRequests || 23], link: "/admin/membership-requests", urgent: (s.pendingRequests || 0) > 0 },
    { label: "Vendors", value: s.totalVendors || 0, icon: "fas fa-building", color: "#10B981", gradient: "linear-gradient(135deg, #064E3B, #065F46)", sparkData: [80, 95, 110, 120, 135, 145, 155, 168, 175, 182, s.totalVendors || 186], link: "/admin/vendors" },
    { label: "Industry Experts", value: s.totalExperts || 0, icon: "fas fa-user-tie", color: "#8B5CF6", gradient: "linear-gradient(135deg, #2E1065, #4C1D95)", sparkData: [15, 18, 22, 25, 28, 32, 35, 38, 40, s.totalExperts || 42], link: "/admin/experts" },
  ];

  const secondaryCards = [
    { label: "Events", value: s.totalEvents || 0, icon: "fas fa-calendar-alt", color: "#EC4899", link: "/admin/events" },
    { label: "Upcoming", value: s.upcomingEvents || 0, icon: "fas fa-calendar-check", color: "#06B6D4", link: "/admin/events" },
    { label: "Testimonials", value: s.totalTestimonials || 0, icon: "fas fa-quote-right", color: "#F59E0B", link: "/admin/testimonials" },
    { label: "Feed Posts", value: s.totalPosts || 0, icon: "fas fa-rss", color: "#EF4444", link: "/admin/feed" },
  ];

  const donutData = memberTypeData;

  const monthlyData = [320, 380, 420, 390, 480, 520, 490, 580, 640, 610, 720, 780];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Build activity from real recent members
  const statusIcons = { PENDING: { icon: "fas fa-user-clock", color: "#F59E0B", action: "Membership request" }, APPROVED: { icon: "fas fa-user-check", color: "#10B981", action: "Member approved" }, REJECTED: { icon: "fas fa-user-times", color: "#EF4444", action: "Member rejected" } };
  const recentActivity = recentMembers.length > 0
    ? recentMembers.slice(0, 8).map((m) => {
        const info = statusIcons[m.membershipStatus] || statusIcons.APPROVED;
        const ago = Math.round((Date.now() - new Date(m.createdAt).getTime()) / 3600000);
        return { action: info.action, user: `${m.firstName} ${m.lastName}`, time: ago < 1 ? "Just now" : ago < 24 ? `${ago}h ago` : `${Math.round(ago / 24)}d ago`, icon: info.icon, color: info.color };
      })
    : [
        { action: "New membership request", user: "Priya Mehta", time: "2 min ago", icon: "fas fa-user-plus", color: "#F59E0B" },
        { action: "Member approved", user: "Sunita Reddy", time: "3 hrs ago", icon: "fas fa-user-check", color: "#C6A962" },
      ];

  const quickActions = [
    { label: "Approve Members", icon: "fas fa-user-check", link: "/admin/membership-requests", color: "#C6A962" },
    { label: "Create Event", icon: "fas fa-calendar-plus", link: "/admin/events", color: "#8B5CF6" },
    { label: "Add Testimonial", icon: "fas fa-plus-circle", link: "/admin/testimonials", color: "#06B6D4" },
    { label: "Moderate Feed", icon: "fas fa-shield-alt", link: "/admin/feed", color: "#EF4444" },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "32px", color: "#C6A962" }}></i>
        <p style={{ marginTop: "16px", color: "#64748B", fontSize: "14px" }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 600, color: "#0A1628", marginBottom: "4px" }}>
            Dashboard
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>
            Welcome back. Here's what's happening across the network.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.link}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                textDecoration: "none",
                color: "#0A1628",
                fontSize: "12px",
                fontWeight: 600,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = action.color;
                e.currentTarget.style.boxShadow = `0 4px 12px ${action.color}20`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <i className={action.icon} style={{ color: action.color }}></i>
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Primary Stats - Dark Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "20px" }}>
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            style={{
              background: card.gradient,
              padding: "28px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              opacity: mounted ? 1 : 0,
              transitionDelay: `${i * 0.1}s`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
              e.currentTarget.style.boxShadow = `0 20px 40px ${card.color}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Background glow */}
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: `${card.color}10`, pointerEvents: "none" }} />
            {card.urgent && (
              <div style={{ position: "absolute", top: "12px", right: "12px", width: "10px", height: "10px", borderRadius: "50%", background: card.color, animation: "pulse 2s ease-in-out infinite" }} />
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div style={{ width: "44px", height: "44px", background: `${card.color}20`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className={card.icon} style={{ fontSize: "18px", color: card.color }}></i>
              </div>
              <Sparkline data={card.sparkData} color={card.color} />
            </div>
            <h3 style={{ fontSize: "32px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px", fontFamily: "'Cormorant Garamond', serif" }}>
              <AnimatedNumber end={card.value} />
            </h3>
            <p style={{ fontSize: "12px", color: "#8DA4BE", margin: 0, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 500 }}>
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Secondary Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "28px" }}>
        {secondaryCards.map((card, i) => (
          <div
            key={i}
            style={{
              background: "#FFFFFF",
              padding: "20px 24px",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              transition: "all 0.3s ease",
              cursor: card.link ? "pointer" : "default",
              transform: mounted ? "translateY(0)" : "translateY(10px)",
              opacity: mounted ? 1 : 0,
              transitionDelay: `${0.4 + i * 0.08}s`,
            }}
            onClick={() => card.link && (window.location.href = card.link)}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ width: "40px", height: "40px", background: `${card.color}15`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className={card.icon} style={{ fontSize: "16px", color: card.color }}></i>
            </div>
            <div>
              <h4 style={{ fontSize: "22px", fontWeight: 700, color: "#0A1628", margin: 0, fontFamily: "'Cormorant Garamond', serif" }}>
                <AnimatedNumber end={typeof card.value === "number" ? card.value : parseFloat(card.value)} suffix={card.suffix || ""} duration={1500} />
              </h4>
              <p style={{ fontSize: "11px", color: "#64748B", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</p>
            </div>
            {card.isGrowth && (
              <div style={{ marginLeft: "auto", color: "#10B981", fontSize: "12px", fontWeight: 600 }}>
                <i className="fas fa-arrow-up" style={{ marginRight: "4px" }}></i>+{card.value}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 340px", gap: "20px" }}>
        {/* Monthly Growth Chart */}
        <div style={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#0A1628", margin: 0 }}>Member Growth</h3>
              <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0" }}>Monthly new registrations</p>
            </div>
            <span style={{ fontSize: "12px", color: "#10B981", fontWeight: 600, background: "#ECFDF5", padding: "4px 10px", borderRadius: "12px" }}>
              <i className="fas fa-arrow-up" style={{ marginRight: "4px" }}></i>18.2%
            </span>
          </div>
          <MiniBarChart data={monthlyData} color="#C6A962" height={140} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
            {monthLabels.map((m, i) => (
              <span key={i} style={{ fontSize: "10px", color: "#94A3B8", textTransform: "uppercase" }}>{m}</span>
            ))}
          </div>
        </div>

        {/* Member Distribution Donut */}
        <div style={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "28px" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#0A1628", marginBottom: "4px" }}>Member Distribution</h3>
          <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "24px" }}>By membership type</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "32px" }}>
            <div style={{ position: "relative" }}>
              <DonutChart segments={donutData} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                <span style={{ fontSize: "28px", fontWeight: 700, color: "#0A1628", fontFamily: "'Cormorant Garamond', serif", display: "block", lineHeight: 1 }}>
                  <AnimatedNumber end={s.totalMembers || 0} duration={1800} />
                </span>
                <span style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", letterSpacing: "1px" }}>Total</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {donutData.map((seg, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: seg.color, flexShrink: 0 }}></div>
                  <div>
                    <span style={{ fontSize: "13px", color: "#0A1628", fontWeight: 500 }}>{seg.label}</span>
                    <span style={{ fontSize: "12px", color: "#64748B", marginLeft: "8px" }}>{seg.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div style={{ background: "#FFFFFF", borderRadius: "8px", border: "1px solid #E2E8F0", padding: "24px", maxHeight: "480px", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#0A1628", margin: 0 }}>Activity</h3>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", animation: "pulse 2s ease-in-out infinite" }}></span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {recentActivity.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px 0",
                  borderBottom: i < recentActivity.length - 1 ? "1px solid #F1F5F9" : "none",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(20px)",
                  transition: "all 0.4s ease",
                  transitionDelay: `${0.6 + i * 0.08}s`,
                }}
              >
                <div style={{ width: "32px", height: "32px", background: `${item.color}15`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={item.icon} style={{ fontSize: "12px", color: item.color }}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", color: "#0A1628", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{item.action}</p>
                  <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0" }}>{item.user} · {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
