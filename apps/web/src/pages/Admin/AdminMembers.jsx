import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";

// Ordering modes for the public Owners directory. "manual" is the drag & drop
// sequence stored per owner; the rest are computed by the API at query time, so
// switching away and back leaves the hand-built order intact.
const SORT_MODES = [
  { value: "manual", label: "Manual (drag & drop)" },
  { value: "name_asc", label: "Name A – Z" },
  { value: "name_desc", label: "Name Z – A" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

const isSortMode = (value) => SORT_MODES.some((m) => m.value === value);

const ROLE_LABELS = {
  HOTEL_OWNER: "Hotel Owner",
  OWNER: "Hotel Owner",
  INVESTOR: "Investor",
  SERVICE_PROVIDER: "Service Provider",
  PROFESSIONAL: "Professional",
};

const ROLE_COLORS = {
  HOTEL_OWNER: { bg: "#FEF9E7", color: "#C6A962" },
  OWNER: { bg: "#FEF9E7", color: "#C6A962" },
  INVESTOR: { bg: "#F5F3FF", color: "#8B5CF6" },
  SERVICE_PROVIDER: { bg: "#EFF6FF", color: "#3B82F6" },
  PROFESSIONAL: { bg: "#ECFDF5", color: "#10B981" },
};

const STATUS_COLORS = {
  APPROVED: { bg: "#ECFDF5", color: "#10B981", label: "Active" },
  SUSPENDED: { bg: "#FEF2F2", color: "#EF4444", label: "Suspended" },
  PENDING: { bg: "#FFFBEB", color: "#F59E0B", label: "Pending" },
};

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [mounted, setMounted] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // null until the saved mode is loaded, so we fetch the list only once we know
  // which order to ask for.
  const [sortMode, setSortMode] = useState(null);
  const [total, setTotal] = useState(0);
  const [dragIndex, setDragIndex] = useState(null);
  const [orderNotice, setOrderNotice] = useState(null);
  // The pre-drag list, so a failed save can be rolled back.
  const preDragOrder = useRef(null);

  useEffect(() => {
    setMounted(true);
    let cancelled = false;
    const loadSortMode = async () => {
      try {
        const config = await api.getAdminHomepageConfig();
        if (!cancelled) setSortMode(isSortMode(config?.ownersSort) ? config.ownersSort : "manual");
      } catch (err) {
        if (!cancelled) setSortMode("manual");
      }
    };
    loadSortMode();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sortMode) return undefined;
    let cancelled = false;
    const fetchMembers = async () => {
      try {
        // limit=200: the API defaults to 20, which would silently truncate the
        // list and make reordering operate on a partial set.
        const data = await api.getAdminMembers({ limit: "200", sort: sortMode });
        if (!cancelled && data?.users) {
          setMembers(data.users);
          setTotal(typeof data.total === "number" ? data.total : data.users.length);
        }
      } catch (err) {
        // keep the current list on failure
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchMembers();
    return () => {
      cancelled = true;
    };
  }, [sortMode]);

  useEffect(() => {
    if (!orderNotice) return undefined;
    const timer = setTimeout(() => setOrderNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [orderNotice]);

  const filtered = members.filter((m) => {
    const fullName = ((m.firstName || '') + ' ' + (m.lastName || '')).trim();
    const matchRole = roleFilter === "ALL" || m.memberType === roleFilter;
    const matchSearch =
      !searchTerm ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.organizationName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  // Rows may only be dragged when the visible list is the complete list in its
  // true stored order — reordering a filtered subset has no defined meaning for
  // the full sequence.
  const filtersActive = Boolean(searchTerm) || roleFilter !== "ALL";
  const canReorder = sortMode === "manual" && !filtersActive && !loading;

  const handleSortModeChange = async (mode) => {
    const previous = sortMode;
    setSortMode(mode);
    setError(null);
    try {
      await api.setOwnersSort(mode);
      setOrderNotice("Visitor order updated");
    } catch (err) {
      setSortMode(previous);
      setError("Could not save the display order. Please try again.");
    }
  };

  const handleDragStart = (e, index) => {
    if (!canReorder) return;
    preDragOrder.current = members;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e, index) => {
    if (!canReorder || dragIndex === null || dragIndex === index) return;
    e.preventDefault();
    setMembers((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  };

  // Saves once, on drop — dragOver fires continuously and would spam the API.
  const handleDragEnd = async () => {
    const snapshot = preDragOrder.current;
    preDragOrder.current = null;
    setDragIndex(null);
    if (!snapshot) return;

    const orderedIds = members.map((m) => m.id);
    if (snapshot.map((m) => m.id).join(",") === orderedIds.join(",")) return;

    setError(null);
    try {
      await api.reorderMembers(orderedIds);
      setOrderNotice("Order saved");
    } catch (err) {
      setMembers(snapshot);
      setError("Could not save the new order. The previous order has been restored.");
    }
  };

  const stats = [
    { label: "Total Owners", value: total || members.length, icon: "fas fa-hotel", color: "#C6A962", gradient: "linear-gradient(135deg, #FEF9E7, #FFF8E1)" },
    { label: "Active", value: members.filter((m) => m.membershipStatus === "APPROVED").length, icon: "fas fa-check-circle", color: "#10B981", gradient: "linear-gradient(135deg, #ECFDF5, #D1FAE5)" },
    { label: "Suspended", value: members.filter((m) => m.membershipStatus === "SUSPENDED").length, icon: "fas fa-ban", color: "#EF4444", gradient: "linear-gradient(135deg, #FEF2F2, #FEE2E2)" },
    { label: "Cities", value: new Set(members.map((m) => m.city).filter(Boolean)).size, icon: "fas fa-map-marker-alt", color: "#8B5CF6", gradient: "linear-gradient(135deg, #F5F3FF, #EDE9FE)" },
  ];

  const getInitials = (first, last) => {
    return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase() || '?';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const handleSuspend = async (id) => {
    const member = members.find((m) => m.id === id);
    const newStatus = member.membershipStatus === "SUSPENDED" ? "APPROVED" : "SUSPENDED";
    try {
      await api.updateMember(id, { membershipStatus: newStatus });
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, membershipStatus: newStatus } : m)));
      setError(null);
    } catch (err) {
      setError(err.message || "Operation failed");
    }
  };

  const thStyle = {
    padding: "14px 20px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 600,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    borderBottom: "1px solid #E2E8F0",
  };

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "28px",
                fontWeight: 600,
                color: "#0A1628",
                margin: 0,
              }}
            >
              Hotel Owners
            </h1>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 12px",
                background: "#F1F5F9",
                color: "#64748B",
                borderRadius: "12px",
              }}
            >
              {members.length} total
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>
            Manage all verified members of the network
          </p>
        </div>
        <button
          style={{
            padding: "10px 24px",
            fontSize: "13px",
            fontWeight: 600,
            background: "#C6A962",
            color: "#0A1628",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 2px 8px rgba(198, 169, 98, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(198, 169, 98, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(198, 169, 98, 0.3)";
          }}
        >
          <i className="fas fa-file-export" style={{ fontSize: "12px" }}></i>
          Export
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "24px", color: "#C6A962" }}></i>
          <p style={{ marginTop: "12px", color: "#64748B", fontSize: "14px" }}>Loading...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: "12px 20px", marginBottom: "16px", background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA", borderRadius: "8px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {!loading && (
        <>
          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredStat(i)}
                onMouseLeave={() => setHoveredStat(null)}
                style={{
                  background: stat.gradient,
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  transition: "all 0.3s ease",
                  transform: hoveredStat === i ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: hoveredStat === i ? `0 8px 24px ${stat.color}20` : "0 1px 3px rgba(0,0,0,0.04)",
                  opacity: mounted ? 1 : 0,
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: `${stat.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i className={stat.icon} style={{ fontSize: "18px", color: stat.color }}></i>
                </div>
                <div>
                  <div style={{ fontSize: "26px", fontWeight: 700, color: "#0A1628", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search & Filter */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "center" }}>
            <div
              style={{
                background: "#FFFFFF",
                border: searchFocused ? "1px solid #C6A962" : "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "4px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "all 0.3s ease",
                boxShadow: searchFocused ? "0 0 0 3px rgba(198, 169, 98, 0.1)" : "none",
                flex: 1,
                maxWidth: "380px",
              }}
            >
              <i className="fas fa-search" style={{ fontSize: "14px", color: searchFocused ? "#C6A962" : "#94A3B8", transition: "color 0.3s" }}></i>
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  color: "#0A1628",
                  background: "transparent",
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "12px", padding: "4px" }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: "11px 16px",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                background: "#FFFFFF",
                cursor: "pointer",
                color: "#0A1628",
                transition: "border-color 0.3s",
                minWidth: "170px",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#C6A962"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; }}
            >
              <option value="ALL">All Member Types</option>
              <option value="HOTEL_OWNER">Hotel Owners</option>
              <option value="INVESTOR">Investors</option>
              <option value="SERVICE_PROVIDER">Service Providers</option>
              <option value="PROFESSIONAL">Professionals</option>
            </select>
            <select
              value={sortMode || "manual"}
              disabled={!sortMode}
              onChange={(e) => handleSortModeChange(e.target.value)}
              title="The order visitors see by default on the public Owners page"
              style={{
                padding: "11px 16px",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                background: "#FFFFFF",
                cursor: sortMode ? "pointer" : "default",
                color: "#0A1628",
                transition: "border-color 0.3s",
                minWidth: "200px",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#C6A962"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; }}
            >
              {SORT_MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  Order: {mode.label}
                </option>
              ))}
            </select>
            <span style={{ fontSize: "13px", color: "#94A3B8", marginLeft: "auto" }}>
              {filtered.length} results
            </span>
          </div>

          {/* Ordering status line */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "-12px", marginBottom: "20px", minHeight: "20px", fontSize: "13px" }}>
            {sortMode === "manual" && !filtersActive && (
              <span style={{ color: "#94A3B8" }}>
                <i className="fas fa-grip-vertical" style={{ marginRight: "6px", color: "#C6A962" }}></i>
                Drag rows to set the order visitors see on the public Owners page.
              </span>
            )}
            {sortMode === "manual" && !filtersActive && total > members.length && (
              <span style={{ color: "#F59E0B" }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: "6px" }}></i>
                Showing the first {members.length} of {total} owners — only these can be reordered.
              </span>
            )}
            {sortMode === "manual" && filtersActive && (
              <span style={{ color: "#F59E0B" }}>
                <i className="fas fa-info-circle" style={{ marginRight: "6px" }}></i>
                Clear the search and type filter to reorder owners.
              </span>
            )}
            {sortMode && sortMode !== "manual" && (
              <span style={{ color: "#94A3B8" }}>
                <i className="fas fa-info-circle" style={{ marginRight: "6px" }}></i>
                Visitors see owners sorted automatically. Switch to “Manual” to drag — your saved manual order is kept.
              </span>
            )}
            {orderNotice && (
              <span style={{ color: "#10B981", fontWeight: 600 }}>
                <i className="fas fa-check-circle" style={{ marginRight: "6px" }}></i>
                {orderNotice}
              </span>
            )}
          </div>

          {/* Table */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {sortMode === "manual" && <th style={{ ...thStyle, width: "64px" }}>#</th>}
                  <th style={thStyle}>Member</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Organization</th>
                  <th style={thStyle}>City</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Status</th>
                  <th style={thStyle}>Joined</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member, idx) => {
                  const roleStyle = ROLE_COLORS[member.memberType] || { bg: "#F1F5F9", color: "#475569" };
                  const statusStyle = STATUS_COLORS[member.membershipStatus] || STATUS_COLORS.APPROVED;
                  const fullName = ((member.firstName || '') + ' ' + (member.lastName || '')).trim();
                  return (
                    <tr
                      key={member.id}
                      draggable={canReorder}
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => e.preventDefault()}
                      onMouseEnter={() => setHoveredRow(member.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: "1px solid #F1F5F9",
                        transition: "all 0.25s ease",
                        background: hoveredRow === member.id ? "#FAFBFC" : "transparent",
                        borderLeft:
                          dragIndex === idx
                            ? "3px solid #C6A962"
                            : hoveredRow === member.id
                            ? "3px solid #C6A962"
                            : "3px solid transparent",
                        opacity: mounted ? (dragIndex === idx ? 0.6 : 1) : 0,
                        transform: mounted ? "translateY(0)" : "translateY(8px)",
                        // Skip the mount stagger while dragging, or every row
                        // re-animates on each reorder.
                        transitionDelay: dragIndex === null ? `${0.3 + idx * 0.03}s` : "0s",
                      }}
                    >
                      {sortMode === "manual" && (
                        <td style={{ padding: "14px 20px", width: "64px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              cursor: canReorder ? "grab" : "not-allowed",
                              color: canReorder ? "#C6A962" : "#CBD5E1",
                            }}
                          >
                            <i className="fas fa-grip-vertical" style={{ fontSize: "13px" }}></i>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: "#94A3B8" }}>{idx + 1}</span>
                          </div>
                        </td>
                      )}
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #0A1628, #1E293B)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#C6A962",
                              fontWeight: 700,
                              fontSize: "13px",
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(member.firstName, member.lastName)}
                          </div>
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628" }}>{fullName}</div>
                            <div style={{ fontSize: "12px", color: "#94A3B8" }}>{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "4px 12px",
                            background: roleStyle.bg,
                            color: roleStyle.color,
                            borderRadius: "12px",
                          }}
                        >
                          {ROLE_LABELS[member.memberType] || member.memberType}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: "14px", color: "#475569" }}>{member.organizationName}</td>
                      <td style={{ padding: "14px 20px", fontSize: "14px", color: "#475569" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <i className="fas fa-map-marker-alt" style={{ fontSize: "10px", color: "#94A3B8" }}></i>
                          {member.city}
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "4px 12px",
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            borderRadius: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {statusStyle.label}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: "13px", color: "#94A3B8" }}>{formatDate(member.createdAt)}</td>
                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => window.open(`/members/${member.id}`, "_blank")}
                            onMouseEnter={() => setHoveredBtn(`view-${member.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={{
                              padding: "6px 14px",
                              fontSize: "12px",
                              fontWeight: 600,
                              background: hoveredBtn === `view-${member.id}` ? "#0A1628" : "transparent",
                              color: hoveredBtn === `view-${member.id}` ? "#FFFFFF" : "#0A1628",
                              border: "1px solid #E2E8F0",
                              borderRadius: "6px",
                              cursor: "pointer",
                              transition: "all 0.25s ease",
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleSuspend(member.id)}
                            onMouseEnter={() => setHoveredBtn(`suspend-${member.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={{
                              padding: "6px 14px",
                              fontSize: "12px",
                              fontWeight: 600,
                              background:
                                member.membershipStatus === "SUSPENDED"
                                  ? hoveredBtn === `suspend-${member.id}`
                                    ? "#10B981"
                                    : "transparent"
                                  : hoveredBtn === `suspend-${member.id}`
                                  ? "#FEF2F2"
                                  : "transparent",
                              color:
                                member.membershipStatus === "SUSPENDED"
                                  ? hoveredBtn === `suspend-${member.id}`
                                    ? "#FFFFFF"
                                    : "#10B981"
                                  : "#EF4444",
                              border:
                                member.membershipStatus === "SUSPENDED"
                                  ? "1px solid #A7F3D0"
                                  : "1px solid #FECACA",
                              borderRadius: "6px",
                              cursor: "pointer",
                              transition: "all 0.25s ease",
                            }}
                          >
                            {member.membershipStatus === "SUSPENDED" ? "Activate" : "Suspend"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div
                style={{
                  padding: "64px 20px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "#F8FAFC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="fas fa-users" style={{ fontSize: "24px", color: "#CBD5E1" }}></i>
                </div>
                <p style={{ fontSize: "15px", color: "#64748B", fontWeight: 500, margin: 0 }}>No members found</p>
                <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminMembers;
