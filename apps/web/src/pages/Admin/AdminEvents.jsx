import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

const TYPE_COLORS = {
  SUMMIT: { bg: "#FEF9E7", color: "#C6A962" },
  CONFERENCE: { bg: "#EFF6FF", color: "#3B82F6" },
  NETWORKING: { bg: "#ECFDF5", color: "#10B981" },
  WEBINAR: { bg: "#F5F3FF", color: "#8B5CF6" },
};

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [mounted, setMounted] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchEvents = async () => {
      try {
        const data = await api.getAdminEvents();
        if (data?.events) {
          setEvents(data.events);
        }
      } catch (err) {
        // keep empty array on failure
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filtered = events.filter(
    (e) =>
      !searchTerm ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.deleteEvent(id);
    } catch (err) {
      // fallback
    }
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const formatDateRange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const opts = { day: "numeric", month: "short" };
    if (start === end) return s.toLocaleDateString("en-IN", { ...opts, year: "numeric" });
    return `${s.toLocaleDateString("en-IN", opts)} - ${e.toLocaleDateString("en-IN", { ...opts, year: "numeric" })}`;
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
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
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "28px",
              fontWeight: 600,
              color: "#0A1628",
              margin: 0,
              marginBottom: "6px",
            }}
          >
            Events Management
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>
            Manage events, summits, and networking sessions
          </p>
        </div>
        <button
          onMouseEnter={() => setHoveredBtn("create")}
          onMouseLeave={() => setHoveredBtn(null)}
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
            transform: hoveredBtn === "create" ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          <i className="fas fa-plus" style={{ fontSize: "12px" }}></i>
          Create Event
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "24px", color: "#C6A962" }}></i>
          <p style={{ marginTop: "12px", color: "#64748B", fontSize: "14px" }}>Loading...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Search & View Toggle */}
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
                maxWidth: "400px",
              }}
            >
              <i className="fas fa-search" style={{ fontSize: "14px", color: searchFocused ? "#C6A962" : "#94A3B8", transition: "color 0.3s" }}></i>
              <input
                type="text"
                placeholder="Search events..."
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
                <button onClick={() => setSearchTerm("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "12px", padding: "4px" }}>
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            <div style={{ marginLeft: "auto", display: "flex", background: "#F1F5F9", borderRadius: "8px", padding: "3px", gap: "2px" }}>
              <button
                onClick={() => setViewMode("grid")}
                style={{
                  padding: "8px 14px",
                  fontSize: "13px",
                  fontWeight: 500,
                  background: viewMode === "grid" ? "#FFFFFF" : "transparent",
                  color: viewMode === "grid" ? "#0A1628" : "#64748B",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <i className="fas fa-th-large" style={{ fontSize: "12px" }}></i>
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                style={{
                  padding: "8px 14px",
                  fontSize: "13px",
                  fontWeight: 500,
                  background: viewMode === "list" ? "#FFFFFF" : "transparent",
                  color: viewMode === "list" ? "#0A1628" : "#64748B",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: viewMode === "list" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <i className="fas fa-list" style={{ fontSize: "12px" }}></i>
                List
              </button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === "grid" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {filtered.map((event, idx) => {
                const typeStyle = TYPE_COLORS[event.type] || { bg: "#F1F5F9", color: "#475569" };
                const isHovered = hoveredCard === event.id;
                return (
                  <div
                    key={event.id}
                    onMouseEnter={() => setHoveredCard(event.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      overflow: "hidden",
                      transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: isHovered ? "translateY(-4px)" : mounted ? "translateY(0)" : "translateY(12px)",
                      boxShadow: isHovered ? "0 12px 32px rgba(10, 22, 40, 0.12)" : "0 1px 3px rgba(0, 0, 0, 0.04)",
                      opacity: mounted ? 1 : 0,
                      transitionDelay: `${idx * 0.06}s`,
                      position: "relative",
                    }}
                  >
                    {/* Cover Image Placeholder */}
                    <div
                      style={{
                        height: "140px",
                        background: `linear-gradient(135deg, ${event.coverColor}, ${event.coverColor}CC)`,
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <i className="fas fa-calendar-alt" style={{ fontSize: "40px", color: "rgba(255,255,255,0.12)" }}></i>

                      {/* Hover Overlay */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "rgba(10, 22, 40, 0.7)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          opacity: isHovered ? 1 : 0,
                          transition: "opacity 0.3s ease",
                        }}
                      >
                        <button
                          style={{
                            padding: "8px 18px",
                            fontSize: "12px",
                            fontWeight: 600,
                            background: "#C6A962",
                            color: "#0A1628",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <i className="fas fa-pen" style={{ fontSize: "10px" }}></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          style={{
                            padding: "8px 18px",
                            fontSize: "12px",
                            fontWeight: 600,
                            background: "rgba(255,255,255,0.15)",
                            color: "#FFFFFF",
                            border: "1px solid rgba(255,255,255,0.3)",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <i className="fas fa-trash-alt" style={{ fontSize: "10px" }}></i>
                          Delete
                        </button>
                      </div>

                      {/* Status Badge */}
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "4px 10px",
                          background: event.status === "PUBLISHED" ? "rgba(16, 185, 129, 0.9)" : "rgba(245, 158, 11, 0.9)",
                          color: "#FFFFFF",
                          borderRadius: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {event.status === "PUBLISHED" ? "Published" : "Draft"}
                      </span>

                      {/* Type Badge */}
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "4px 10px",
                          background: "rgba(255,255,255,0.15)",
                          color: "#FFFFFF",
                          borderRadius: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {event.type}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "20px" }}>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#0A1628",
                          margin: "0 0 12px 0",
                          fontFamily: "'Cormorant Garamond', serif",
                          lineHeight: 1.3,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {event.title}
                      </h3>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
                          <i className="far fa-calendar" style={{ fontSize: "12px", color: "#94A3B8", width: "14px" }}></i>
                          {formatDateRange(event.startDate, event.endDate)}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
                          <i className="fas fa-map-marker-alt" style={{ fontSize: "12px", color: "#94A3B8", width: "14px" }}></i>
                          {event.venue}, {event.city}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <i className="fas fa-users" style={{ fontSize: "12px", color: "#94A3B8" }}></i>
                          <span style={{ fontSize: "13px", color: "#475569", fontWeight: 500 }}>{event.attendees}</span>
                          <span style={{ fontSize: "12px", color: "#94A3B8" }}>attendees</span>
                        </div>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "4px 10px",
                            background: typeStyle.bg,
                            color: typeStyle.color,
                            borderRadius: "12px",
                          }}
                        >
                          {event.type}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
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
                    <th style={thStyle}>Event</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Venue</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Attendees</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Status</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((event, idx) => {
                    const typeStyle = TYPE_COLORS[event.type] || { bg: "#F1F5F9", color: "#475569" };
                    return (
                      <tr
                        key={event.id}
                        onMouseEnter={() => setHoveredRow(event.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{
                          borderBottom: "1px solid #F1F5F9",
                          transition: "all 0.25s ease",
                          background: hoveredRow === event.id ? "#FAFBFC" : "transparent",
                          borderLeft: hoveredRow === event.id ? "3px solid #C6A962" : "3px solid transparent",
                          opacity: mounted ? 1 : 0,
                          transform: mounted ? "translateY(0)" : "translateY(8px)",
                          transitionDelay: `${idx * 0.04}s`,
                        }}
                      >
                        <td style={{ padding: "14px 20px", fontSize: "14px", fontWeight: 600, color: "#0A1628", maxWidth: "260px" }}>
                          {event.title}
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 12px", background: typeStyle.bg, color: typeStyle.color, borderRadius: "12px", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                            {event.type}
                          </span>
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: "13px", color: "#475569" }}>
                          {formatDateRange(event.startDate, event.endDate)}
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ fontSize: "14px", color: "#475569" }}>{event.venue}</div>
                          <div style={{ fontSize: "12px", color: "#94A3B8" }}>{event.city}</div>
                        </td>
                        <td style={{ padding: "14px 20px", textAlign: "center", fontSize: "14px", fontWeight: 600, color: "#0A1628" }}>
                          {event.attendees}
                        </td>
                        <td style={{ padding: "14px 20px", textAlign: "center" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              padding: "4px 12px",
                              background: event.status === "PUBLISHED" ? "#ECFDF5" : "#FFFBEB",
                              color: event.status === "PUBLISHED" ? "#10B981" : "#F59E0B",
                              borderRadius: "12px",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {event.status === "PUBLISHED" ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td style={{ padding: "14px 20px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button
                              onMouseEnter={() => setHoveredBtn(`edit-${event.id}`)}
                              onMouseLeave={() => setHoveredBtn(null)}
                              style={{
                                padding: "6px 14px",
                                fontSize: "12px",
                                fontWeight: 600,
                                background: hoveredBtn === `edit-${event.id}` ? "#0A1628" : "transparent",
                                color: hoveredBtn === `edit-${event.id}` ? "#FFFFFF" : "#0A1628",
                                border: "1px solid #E2E8F0",
                                borderRadius: "6px",
                                cursor: "pointer",
                                transition: "all 0.25s ease",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              onMouseEnter={() => setHoveredBtn(`del-${event.id}`)}
                              onMouseLeave={() => setHoveredBtn(null)}
                              style={{
                                padding: "6px 14px",
                                fontSize: "12px",
                                fontWeight: 600,
                                background: hoveredBtn === `del-${event.id}` ? "#FEF2F2" : "transparent",
                                color: "#EF4444",
                                border: "1px solid #FECACA",
                                borderRadius: "6px",
                                cursor: "pointer",
                                transition: "all 0.25s ease",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div style={{ padding: "64px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fas fa-calendar-alt" style={{ fontSize: "24px", color: "#CBD5E1" }}></i>
                  </div>
                  <p style={{ fontSize: "15px", color: "#64748B", fontWeight: 500, margin: 0 }}>No events found</p>
                  <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* Grid Empty State */}
          {viewMode === "grid" && filtered.length === 0 && (
            <div style={{ padding: "64px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-calendar-alt" style={{ fontSize: "24px", color: "#CBD5E1" }}></i>
              </div>
              <p style={{ fontSize: "15px", color: "#64748B", fontWeight: 500, margin: 0 }}>No events found</p>
              <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>Try adjusting your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminEvents;
