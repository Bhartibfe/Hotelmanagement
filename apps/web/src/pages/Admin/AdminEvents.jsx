import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import api from "../../services/api";
import CreateEventForm from "../../components/profile/CreateEventForm";
import FormDialog from "../../components/profile/FormDialog";

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [regPanel, setRegPanel] = useState(null); // { eventId, eventTitle, registrations }
  const [regLoading, setRegLoading] = useState(false);
  const [emailForm, setEmailForm] = useState({ open: false, userId: null, userName: "", subject: "", message: "" });
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await api.getAdminEvents();
      if (data?.events) setEvents(data.events);
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  };

  const filtered = events.filter(
    (e) =>
      !searchTerm ||
      e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.venue || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      // error
    }
  };

  const handleCreateEvent = async (eventData) => {
    const newEvent = await api.createEvent(eventData);
    setEvents((prev) => [newEvent, ...prev]);
    setShowCreateForm(false);
    setEditingEvent(null);
  };

  const handleUpdateEvent = async (eventData) => {
    const updated = await api.updateEvent(editingEvent.id, eventData);
    setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? updated : e)));
    setShowCreateForm(false);
    setEditingEvent(null);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);
    setShowCreateForm(true);
  };

  const openRegistrations = async (eventId, eventTitle) => {
    setRegLoading(true);
    setRegPanel({ eventId, eventTitle, registrations: [] });
    try {
      const data = await api.getEventRegistrations(eventId);
      setRegPanel({ eventId, eventTitle, registrations: data?.registrations || [] });
    } catch {
      setRegPanel({ eventId, eventTitle, registrations: [] });
    } finally {
      setRegLoading(false);
    }
  };

  const closeRegPanel = () => {
    setRegPanel(null);
    setEmailForm({ open: false, userId: null, userName: "", subject: "", message: "" });
  };

  const openEmailForm = (userId, userName) => {
    setEmailForm({
      open: true,
      userId,
      userName,
      subject: regPanel ? `Regarding: ${regPanel.eventTitle}` : "",
      message: "",
    });
  };

  const handleSendEmail = async (sendToAll = false) => {
    if (!emailForm.subject.trim() || !emailForm.message.trim()) return;
    setEmailSending(true);
    try {
      const payload = { subject: emailForm.subject, message: emailForm.message };
      if (!sendToAll) payload.userId = emailForm.userId;
      await api.notifyEventRegistrant(regPanel.eventId, payload);
      alert(sendToAll ? "Email sent to all registrants!" : `Email sent to ${emailForm.userName}!`);
      setEmailForm({ open: false, userId: null, userName: "", subject: "", message: "" });
    } catch {
      alert("Failed to send email");
    } finally {
      setEmailSending(false);
    }
  };

  // Lock body scroll when registrations panel is open
  useEffect(() => {
    if (regPanel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [regPanel]);

  const formatDateRange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const opts = { day: "numeric", month: "short" };
    if (s.toDateString() === e.toDateString()) return s.toLocaleDateString("en-IN", { ...opts, year: "numeric" });
    return `${s.toLocaleDateString("en-IN", opts)} - ${e.toLocaleDateString("en-IN", { ...opts, year: "numeric" })}`;
  };

  const thStyle = {
    padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: 600,
    color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", borderBottom: "1px solid #E2E8F0",
  };

  return (
    <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)", transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 600, color: "#0A1628", margin: 0, marginBottom: "6px" }}>
            Events Management
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>Create and manage events, summits, and networking sessions</p>
        </div>
        <button
          onClick={() => { setEditingEvent(null); setShowCreateForm(!showCreateForm); }}
          style={{
            padding: "10px 24px", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
            background: showCreateForm ? "#0A1628" : "#C6A962", color: showCreateForm ? "#FFFFFF" : "#0A1628",
            border: "none", borderRadius: "8px", cursor: "pointer", transition: "all 0.3s",
            display: "flex", alignItems: "center", gap: "8px",
            boxShadow: !showCreateForm ? "0 2px 8px rgba(198, 169, 98, 0.3)" : "none",
          }}
        >
          <i className={showCreateForm ? "fas fa-times" : "fas fa-plus"} style={{ fontSize: "11px" }}></i>
          {showCreateForm ? "Close" : "Create Event"}
        </button>
      </div>

      {/* Create/Edit Dialog */}
      {showCreateForm && (
        <FormDialog title={editingEvent ? "Edit Event" : "Create New Event"} onClose={() => { setShowCreateForm(false); setEditingEvent(null); }}>
          <CreateEventForm
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            initialData={editingEvent}
            onCancel={() => { setShowCreateForm(false); setEditingEvent(null); }}
          />
        </FormDialog>
      )}

      {/* Loading */}
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
            <div style={{
              background: "#FFFFFF", border: searchFocused ? "1px solid #C6A962" : "1px solid #E2E8F0",
              borderRadius: "8px", padding: "4px 16px", display: "flex", alignItems: "center", gap: "12px",
              transition: "all 0.3s ease", boxShadow: searchFocused ? "0 0 0 3px rgba(198, 169, 98, 0.1)" : "none",
              flex: 1, maxWidth: "400px",
            }}>
              <i className="fas fa-search" style={{ fontSize: "14px", color: searchFocused ? "#C6A962" : "#94A3B8" }}></i>
              <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                style={{ flex: 1, padding: "10px 0", border: "none", outline: "none", fontSize: "14px", color: "#0A1628", background: "transparent" }} />
              {searchTerm && <button onClick={() => setSearchTerm("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "12px", padding: "4px" }}><i className="fas fa-times"></i></button>}
            </div>
            <div style={{ marginLeft: "auto", display: "flex", background: "#F1F5F9", borderRadius: "8px", padding: "3px", gap: "2px" }}>
              {["grid", "list"].map((mode) => (
                <button key={mode} onClick={() => setViewMode(mode)} style={{
                  padding: "8px 14px", fontSize: "13px", fontWeight: 500,
                  background: viewMode === mode ? "#FFFFFF" : "transparent", color: viewMode === mode ? "#0A1628" : "#64748B",
                  border: "none", borderRadius: "6px", cursor: "pointer", transition: "all 0.25s ease",
                  boxShadow: viewMode === mode ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  display: "flex", alignItems: "center", gap: "6px",
                }}>
                  <i className={mode === "grid" ? "fas fa-th-large" : "fas fa-list"} style={{ fontSize: "12px" }}></i>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Grid View */}
          {viewMode === "grid" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {filtered.map((event, idx) => {
                const typeStyle = TYPE_COLORS[event.type] || { bg: "#F1F5F9", color: "#475569" };
                const isHovered = hoveredCard === event.id;
                return (
                  <div key={event.id} onMouseEnter={() => setHoveredCard(event.id)} onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden",
                      transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: isHovered ? "translateY(-4px)" : mounted ? "translateY(0)" : "translateY(12px)",
                      boxShadow: isHovered ? "0 12px 32px rgba(10, 22, 40, 0.12)" : "0 1px 3px rgba(0, 0, 0, 0.04)",
                      opacity: mounted ? 1 : 0, transitionDelay: `${idx * 0.06}s`, position: "relative",
                    }}>
                    {/* Cover */}
                    <div style={{ height: "140px", position: "relative", overflow: "hidden" }}>
                      {event.coverImage ? (
                        <img src={event.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, #0A1628, ${typeStyle.color}60)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <i className="fas fa-calendar-alt" style={{ fontSize: "40px", color: "rgba(255,255,255,0.12)" }}></i>
                        </div>
                      )}
                      {/* Hover Overlay */}
                      <div style={{
                        position: "absolute", inset: 0, background: "rgba(10, 22, 40, 0.7)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                        opacity: isHovered ? 1 : 0, transition: "opacity 0.3s ease",
                      }}>
                        <button onClick={() => openEditForm(event)} style={{
                          padding: "8px 18px", fontSize: "12px", fontWeight: 600, background: "#C6A962",
                          color: "#0A1628", border: "none", borderRadius: "6px", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: "6px",
                        }}><i className="fas fa-pen" style={{ fontSize: "10px" }}></i>Edit</button>
                        <button onClick={() => handleDelete(event.id)} style={{
                          padding: "8px 18px", fontSize: "12px", fontWeight: 600, background: "rgba(255,255,255,0.15)",
                          color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "6px", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: "6px",
                        }}><i className="fas fa-trash-alt" style={{ fontSize: "10px" }}></i>Delete</button>
                      </div>
                      {/* Status Badge */}
                      <span style={{
                        position: "absolute", top: "12px", right: "12px", fontSize: "10px", fontWeight: 700,
                        padding: "4px 10px", background: event.isPublished ? "rgba(16, 185, 129, 0.9)" : "rgba(245, 158, 11, 0.9)",
                        color: "#FFFFFF", borderRadius: "12px", textTransform: "uppercase",
                      }}>{event.isPublished ? "Published" : "Draft"}</span>
                      <span style={{
                        position: "absolute", top: "12px", left: "12px", fontSize: "10px", fontWeight: 700,
                        padding: "4px 10px", background: "rgba(255,255,255,0.15)", color: "#FFFFFF",
                        borderRadius: "12px", textTransform: "uppercase", backdropFilter: "blur(4px)",
                      }}>{event.type}</span>
                    </div>
                    {/* Content */}
                    <div style={{ padding: "20px" }}>
                      <h3 style={{
                        fontSize: "16px", fontWeight: 600, color: "#0A1628", margin: "0 0 12px",
                        fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.3,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                      }}>{event.title}</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
                          <i className="far fa-calendar" style={{ fontSize: "12px", color: "#94A3B8", width: "14px" }}></i>
                          {formatDateRange(event.startDate, event.endDate)}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
                          <i className="fas fa-map-marker-alt" style={{ fontSize: "12px", color: "#94A3B8", width: "14px" }}></i>
                          {event.venue ? `${event.venue}, ${event.city}` : `${event.city}, ${event.state}`}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div
                          onClick={(e) => { e.stopPropagation(); openRegistrations(event.id, event.title); }}
                          style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", padding: "4px 8px", borderRadius: "6px", transition: "background 0.2s" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#EFF6FF"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <i className="fas fa-users" style={{ fontSize: "12px", color: "#3B82F6" }}></i>
                          <span style={{ fontSize: "13px", color: "#3B82F6", fontWeight: 600 }}>{event._count?.registrations || 0}</span>
                          <span style={{ fontSize: "12px", color: "#3B82F6" }}>registered</span>
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", background: typeStyle.bg, color: typeStyle.color, borderRadius: "12px" }}>{event.type}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
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
                      <tr key={event.id} onMouseEnter={() => setHoveredRow(event.id)} onMouseLeave={() => setHoveredRow(null)}
                        style={{
                          borderBottom: "1px solid #F1F5F9", transition: "all 0.25s ease",
                          background: hoveredRow === event.id ? "#FAFBFC" : "transparent",
                          borderLeft: hoveredRow === event.id ? "3px solid #C6A962" : "3px solid transparent",
                          opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(8px)", transitionDelay: `${idx * 0.04}s`,
                        }}>
                        <td style={{ padding: "14px 20px", fontSize: "14px", fontWeight: 600, color: "#0A1628", maxWidth: "260px" }}>{event.title}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 12px", background: typeStyle.bg, color: typeStyle.color, borderRadius: "12px", textTransform: "uppercase" }}>{event.type}</span>
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: "13px", color: "#475569" }}>{formatDateRange(event.startDate, event.endDate)}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ fontSize: "14px", color: "#475569" }}>{event.venue || "-"}</div>
                          <div style={{ fontSize: "12px", color: "#94A3B8" }}>{event.city}</div>
                        </td>
                        <td style={{ padding: "14px 20px", textAlign: "center" }}>
                          <span
                            onClick={() => openRegistrations(event.id, event.title)}
                            style={{ fontSize: "14px", fontWeight: 600, color: "#3B82F6", cursor: "pointer", textDecoration: "underline" }}
                          >{event._count?.registrations || 0}</span>
                        </td>
                        <td style={{ padding: "14px 20px", textAlign: "center" }}>
                          <span style={{
                            fontSize: "11px", fontWeight: 700, padding: "4px 12px",
                            background: event.isPublished ? "#ECFDF5" : "#FFFBEB",
                            color: event.isPublished ? "#10B981" : "#F59E0B",
                            borderRadius: "12px", textTransform: "uppercase",
                          }}>{event.isPublished ? "Published" : "Draft"}</span>
                        </td>
                        <td style={{ padding: "14px 20px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button onClick={() => openEditForm(event)}
                              onMouseEnter={() => setHoveredBtn(`edit-${event.id}`)} onMouseLeave={() => setHoveredBtn(null)}
                              style={{
                                padding: "6px 14px", fontSize: "12px", fontWeight: 600,
                                background: hoveredBtn === `edit-${event.id}` ? "#0A1628" : "transparent",
                                color: hoveredBtn === `edit-${event.id}` ? "#FFFFFF" : "#0A1628",
                                border: "1px solid #E2E8F0", borderRadius: "6px", cursor: "pointer", transition: "all 0.25s ease",
                              }}>Edit</button>
                            <button onClick={() => handleDelete(event.id)}
                              onMouseEnter={() => setHoveredBtn(`del-${event.id}`)} onMouseLeave={() => setHoveredBtn(null)}
                              style={{
                                padding: "6px 14px", fontSize: "12px", fontWeight: 600,
                                background: hoveredBtn === `del-${event.id}` ? "#FEF2F2" : "transparent",
                                color: "#EF4444", border: "1px solid #FECACA", borderRadius: "6px", cursor: "pointer", transition: "all 0.25s ease",
                              }}>Delete</button>
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
              <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>Click "Create Event" to add one.</p>
            </div>
          )}
        </>
      )}
      {/* Registrations Panel Dialog */}
      {regPanel && ReactDOM.createPortal(
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={closeRegPanel}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#FFFFFF", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#0A1628", margin: 0 }}>Registered Candidates</h3>
                <p style={{ fontSize: "13px", color: "#64748B", margin: "4px 0 0" }}>{regPanel.eventTitle}</p>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {regPanel.registrations.length > 0 && (
                  <button
                    onClick={() => openEmailForm(null, "All Registrants")}
                    style={{ padding: "8px 16px", fontSize: "12px", fontWeight: 600, background: "#C6A962", color: "#0A1628", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <i className="fas fa-envelope" style={{ fontSize: "11px" }}></i> Email All
                  </button>
                )}
                <button onClick={closeRegPanel} style={{ background: "none", border: "none", fontSize: "20px", color: "#94A3B8", cursor: "pointer" }}><i className="fas fa-times"></i></button>
              </div>
            </div>

            {regLoading && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "24px", color: "#C6A962" }}></i>
              </div>
            )}

            {!regLoading && regPanel.registrations.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
                <i className="fas fa-user-slash" style={{ fontSize: "32px", marginBottom: "12px", display: "block" }}></i>
                <p style={{ margin: 0 }}>No registrations yet</p>
              </div>
            )}

            {!regLoading && regPanel.registrations.length > 0 && (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>Name</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>Type</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>Registered</th>
                    <th style={{ padding: "10px 16px", textAlign: "right", fontSize: "11px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {regPanel.registrations.map((reg) => (
                    <tr key={reg.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 500, color: "#0A1628" }}>
                        {reg.user.firstName} {reg.user.lastName}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#475569" }}>{reg.user.email}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", background: "#FEF9E7", color: "#C6A962", borderRadius: "10px" }}>
                          {(reg.user.memberType || "").replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#94A3B8" }}>
                        {new Date(reg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <button
                          onClick={() => openEmailForm(reg.user.id, `${reg.user.firstName} ${reg.user.lastName}`)}
                          style={{ padding: "5px 12px", fontSize: "11px", fontWeight: 600, background: "transparent", color: "#3B82F6", border: "1px solid #BFDBFE", borderRadius: "6px", cursor: "pointer" }}
                        >
                          <i className="fas fa-envelope" style={{ marginRight: "4px", fontSize: "10px" }}></i> Send Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Email Form */}
            {emailForm.open && (
              <div style={{ marginTop: "20px", padding: "20px", background: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", margin: "0 0 12px" }}>
                  <i className="fas fa-envelope" style={{ marginRight: "8px", color: "#C6A962" }}></i>
                  Send Email to: {emailForm.userId ? emailForm.userName : "All Registrants"}
                </h4>
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Subject</label>
                  <input
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Message</label>
                  <textarea
                    value={emailForm.message}
                    onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                    rows={4}
                    placeholder="Enter your message, registration link, or further instructions..."
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setEmailForm({ open: false, userId: null, userName: "", subject: "", message: "" })}
                    style={{ padding: "8px 20px", fontSize: "13px", fontWeight: 600, background: "transparent", color: "#64748B", border: "1px solid #E2E8F0", borderRadius: "6px", cursor: "pointer" }}
                  >Cancel</button>
                  <button
                    onClick={() => handleSendEmail(!emailForm.userId)}
                    disabled={emailSending || !emailForm.subject.trim() || !emailForm.message.trim()}
                    style={{
                      padding: "8px 20px", fontSize: "13px", fontWeight: 600,
                      background: emailSending ? "#94A3B8" : "#C6A962", color: "#0A1628",
                      border: "none", borderRadius: "6px", cursor: emailSending ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", gap: "6px",
                    }}
                  >
                    {emailSending ? <><i className="fas fa-spinner fa-spin" style={{ fontSize: "11px" }}></i> Sending...</> : <><i className="fas fa-paper-plane" style={{ fontSize: "11px" }}></i> Send</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminEvents;
