import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "../../layouts/Layout";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const TYPE_COLORS = { SUMMIT: "#C6A962", CONFERENCE: "#1A365D", NETWORKING: "#276749", WEBINAR: "#553C9A" };
const TYPE_LABELS = { SUMMIT: "Summit", CONFERENCE: "Conference", NETWORKING: "Networking", WEBINAR: "Webinar" };

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const formatDateRange = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const sameDay = s.toDateString() === e.toDateString();
  if (sameDay) return formatDate(start);
  return `${s.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${e.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
};

const EventDetailPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [checkingReg, setCheckingReg] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api.getEvent(slug);
        setEvent(data);
        // Check registration if logged in
        if (user && data?.id) {
          try {
            const regData = await api.checkEventRegistration(data.id);
            setRegistered(regData.registered);
          } catch {
            // not registered
          }
        }
      } catch {
        // event not found
      } finally {
        setLoading(false);
        setCheckingReg(false);
      }
    };
    fetchEvent();
  }, [slug, user]);

  const handleRegister = async () => {
    if (!user || !event) return;
    setRegistering(true);
    try {
      if (registered) {
        await api.unregisterForEvent(event.id);
        setRegistered(false);
        setEvent((prev) => ({ ...prev, _count: { ...prev._count, registrations: (prev._count?.registrations || 1) - 1 } }));
      } else {
        await api.registerForEvent(event.id);
        setRegistered(true);
        setEvent((prev) => ({ ...prev, _count: { ...prev._count, registrations: (prev._count?.registrations || 0) + 1 } }));
      }
    } catch {
      // error
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <Layout breadcrumb="Events" title="Event Details">
        <section style={{ padding: "48px 0", textAlign: "center" }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "28px", color: "#C6A962" }}></i>
          <p style={{ marginTop: "12px", color: "#64748B", fontSize: "14px" }}>Loading event...</p>
        </section>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout breadcrumb="Events" title="Event Not Found">
        <section style={{ padding: "48px 0", textAlign: "center" }}>
          <i className="fas fa-calendar-times" style={{ fontSize: "48px", color: "#CBD5E1", marginBottom: "16px" }}></i>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", color: "#0A1628", marginBottom: "12px" }}>Event Not Found</h3>
          <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "24px" }}>This event may have been removed or doesn't exist.</p>
          <Link to="/events" className="btn" style={{ padding: "12px 28px", fontSize: "12px" }}>Browse Events</Link>
        </section>
      </Layout>
    );
  }

  const typeColor = TYPE_COLORS[event.type] || "#0A1628";
  const attendeeCount = event._count?.registrations || 0;
  const isFull = event.maxAttendees && attendeeCount >= event.maxAttendees;
  const isPast = new Date(event.endDate) < new Date();

  return (
    <Layout breadcrumb="Events" title={event.title}>
      {/* Hero Section */}
      <section style={{ position: "relative", background: "#0A1628", overflow: "hidden" }}>
        {/* Cover Image */}
        {event.coverImage ? (
          <div style={{ position: "absolute", inset: 0 }}>
            <img src={event.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
          </div>
        ) : (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, #0A1628 0%, ${typeColor}40 100%)` }} />
        )}

        <div className="container" style={{ position: "relative", zIndex: 2, padding: "80px 0 60px" }}>
          <div className="row align-items-end">
            <div className="col-lg-8">
              {/* Type Badge */}
              <span style={{
                display: "inline-block", padding: "6px 16px", background: typeColor,
                color: "#FFFFFF", fontSize: "11px", fontWeight: 700, letterSpacing: "2px",
                textTransform: "uppercase", marginBottom: "20px",
              }}>
                {TYPE_LABELS[event.type] || event.type}
              </span>

              {/* Title */}
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 600, color: "#FFFFFF", lineHeight: 1.2, margin: "0 0 16px",
              }}>
                {event.title}
              </h1>

              {/* Meta Info */}
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", color: "#8DA4BE", fontSize: "15px" }}>
                <span><i className="far fa-calendar" style={{ color: "#C6A962", marginRight: "8px" }}></i>{formatDateRange(event.startDate, event.endDate)}</span>
                {event.venue && <span><i className="fas fa-map-marker-alt" style={{ color: "#C6A962", marginRight: "8px" }}></i>{event.venue}, {event.city}</span>}
                {!event.venue && <span><i className="fas fa-map-marker-alt" style={{ color: "#C6A962", marginRight: "8px" }}></i>{event.city}, {event.state}</span>}
              </div>
            </div>

            <div className="col-lg-4 mt-4 mt-lg-0 text-lg-end">
              {isPast ? (
                <span style={{ padding: "14px 28px", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", background: "rgba(255,255,255,0.1)", color: "#8DA4BE", display: "inline-block" }}>
                  Event Ended
                </span>
              ) : !user ? (
                <Link to="/login" style={{
                  display: "inline-block", padding: "14px 32px", fontSize: "12px", fontWeight: 700,
                  letterSpacing: "1.5px", textTransform: "uppercase", background: "#C6A962",
                  color: "#0A1628", textDecoration: "none",
                }}>
                  Login to Register
                </Link>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering || (isFull && !registered)}
                  style={{
                    padding: "14px 32px", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px",
                    textTransform: "uppercase", border: "none", cursor: registering || (isFull && !registered) ? "not-allowed" : "pointer",
                    background: registered ? "transparent" : "#C6A962",
                    color: registered ? "#FFFFFF" : "#0A1628",
                    border: registered ? "2px solid #C6A962" : "2px solid #C6A962",
                    transition: "all 0.3s",
                  }}
                >
                  {registering ? <i className="fas fa-circle-notch fa-spin"></i> :
                    registered ? "Registered \u2713" :
                    isFull ? "Event Full" : "Register Now"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C6A962, transparent)" }} />
      </section>

      {/* Key Info Bar */}
      <section style={{ background: "#F9FAFB", borderBottom: "1px solid #E2DDD5" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "0", flexWrap: "wrap" }}>
            {[
              { icon: "far fa-calendar-alt", label: "Date", value: formatDateRange(event.startDate, event.endDate) },
              { icon: "far fa-clock", label: "Time", value: formatTime(event.startDate) },
              { icon: "fas fa-map-marker-alt", label: "Location", value: `${event.city}, ${event.state}` },
              { icon: "fas fa-users", label: "Attendees", value: event.maxAttendees ? `${attendeeCount} / ${event.maxAttendees}` : `${attendeeCount} registered` },
            ].map((item, i) => (
              <div key={i} style={{
                flex: 1, minWidth: "200px", padding: "20px 24px",
                borderRight: i < 3 ? "1px solid #E2DDD5" : "none",
                display: "flex", alignItems: "center", gap: "14px",
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%", background: "#0A1628",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <i className={item.icon} style={{ color: "#C6A962", fontSize: "14px" }}></i>
                </div>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>{item.label}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628" }}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: "50px 0 80px", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row">
            {/* Left Column - Main Content */}
            <div className="col-lg-8">
              {/* About */}
              <div style={{ marginBottom: "40px" }}>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600,
                  color: "#0A1628", marginBottom: "20px", paddingBottom: "12px",
                  borderBottom: "2px solid #C6A962", display: "inline-block",
                }}>
                  About This Event
                </h3>
                <div
                  dangerouslySetInnerHTML={{ __html: event.description }}
                  style={{ fontSize: "15px", lineHeight: 1.8, color: "#374151" }}
                />
              </div>

              {/* Highlights */}
              {event.highlights?.length > 0 && (
                <div style={{ marginBottom: "40px" }}>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600,
                    color: "#0A1628", marginBottom: "20px", paddingBottom: "12px",
                    borderBottom: "2px solid #C6A962", display: "inline-block",
                  }}>
                    Event Highlights
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {event.highlights.map((h, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px 18px", background: "#F8FAFC", border: "1px solid #E2DDD5", borderLeft: "3px solid #C6A962" }}>
                        <i className="fas fa-check-circle" style={{ color: "#C6A962", fontSize: "16px", marginTop: "2px", flexShrink: 0 }}></i>
                        <span style={{ fontSize: "15px", color: "#0A1628", fontWeight: 500 }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agenda */}
              {event.agenda && (
                <div style={{ marginBottom: "40px" }}>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600,
                    color: "#0A1628", marginBottom: "20px", paddingBottom: "12px",
                    borderBottom: "2px solid #C6A962", display: "inline-block",
                  }}>
                    Agenda & Schedule
                  </h3>
                  <div
                    dangerouslySetInnerHTML={{ __html: event.agenda }}
                    style={{ fontSize: "15px", lineHeight: 1.8, color: "#374151" }}
                  />
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="col-lg-4">
              {/* Registration Card */}
              <div style={{ border: "1px solid #E2DDD5", padding: "28px", marginBottom: "24px", borderTop: "3px solid #C6A962", position: "sticky", top: "100px" }}>
                <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#0A1628", marginBottom: "16px" }}>
                  Registration
                </h5>

                {/* Attendee Progress */}
                {event.maxAttendees && (
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                      <span style={{ color: "#64748B" }}>{attendeeCount} registered</span>
                      <span style={{ color: "#0A1628", fontWeight: 600 }}>{event.maxAttendees} max</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "#E2DDD5", overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(100, (attendeeCount / event.maxAttendees) * 100)}%`, height: "100%", background: isFull ? "#EF4444" : "#C6A962", transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                )}

                {!event.maxAttendees && (
                  <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "16px" }}>
                    <i className="fas fa-users" style={{ color: "#C6A962", marginRight: "8px" }}></i>
                    {attendeeCount} people registered
                  </p>
                )}

                {isPast ? (
                  <div style={{ padding: "12px", background: "#F1F5F9", textAlign: "center", fontSize: "14px", color: "#64748B" }}>This event has ended</div>
                ) : !user ? (
                  <Link to="/login" style={{
                    display: "block", padding: "14px", textAlign: "center", fontSize: "12px",
                    fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
                    background: "#C6A962", color: "#0A1628", textDecoration: "none",
                  }}>Login to Register</Link>
                ) : (
                  <button onClick={handleRegister} disabled={registering || (isFull && !registered)} style={{
                    width: "100%", padding: "14px", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px",
                    textTransform: "uppercase", border: registered ? "2px solid #C6A962" : "none",
                    background: registered ? "transparent" : isFull ? "#94A3B8" : "#C6A962",
                    color: registered ? "#C6A962" : "#0A1628", cursor: registering || (isFull && !registered) ? "not-allowed" : "pointer",
                  }}>
                    {registering ? <i className="fas fa-circle-notch fa-spin"></i> :
                      registered ? "Cancel Registration" : isFull ? "Event Full" : "Register Now"}
                  </button>
                )}

                {event.registrationUrl && !isPast && (
                  <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" style={{
                    display: "block", marginTop: "12px", padding: "12px", textAlign: "center",
                    fontSize: "12px", fontWeight: 600, color: "#C6A962", border: "1px solid #E2DDD5",
                    textDecoration: "none", textTransform: "uppercase", letterSpacing: "1px",
                  }}>
                    <i className="fas fa-external-link-alt" style={{ marginRight: "6px" }}></i>External Registration
                  </a>
                )}
              </div>

              {/* Event Details Card */}
              <div style={{ border: "1px solid #E2DDD5", padding: "24px", marginBottom: "24px" }}>
                <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, color: "#0A1628", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #E2DDD5" }}>
                  Event Details
                </h5>
                {[
                  { icon: "far fa-calendar-alt", label: "Start", value: formatDate(event.startDate) },
                  { icon: "far fa-calendar-check", label: "End", value: formatDate(event.endDate) },
                  event.venue && { icon: "fas fa-building", label: "Venue", value: event.venue },
                  { icon: "fas fa-map-marker-alt", label: "City", value: `${event.city}, ${event.state}` },
                  { icon: "fas fa-globe-asia", label: "Country", value: event.country || "India" },
                ].filter(Boolean).map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <i className={item.icon} style={{ color: "#C6A962", fontSize: "14px", width: "20px", textAlign: "center" }}></i>
                    <div>
                      <span style={{ fontSize: "11px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block" }}>{item.label}</span>
                      <span style={{ fontSize: "14px", color: "#0A1628", fontWeight: 500 }}>{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Organizer Card */}
              {(event.organizerName || event.createdBy) && (
                <div style={{ border: "1px solid #E2DDD5", padding: "24px" }}>
                  <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, color: "#0A1628", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #E2DDD5" }}>
                    Organized By
                  </h5>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {(event.organizerAvatar || event.createdBy?.avatar) ? (
                      <img src={event.organizerAvatar || event.createdBy.avatar} alt="" style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "50%", background: "#C6A962",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#FFFFFF", fontWeight: 700, fontSize: "18px", fontFamily: "'Cormorant Garamond', serif",
                      }}>
                        {(event.organizerName || event.createdBy?.firstName || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h6 style={{ fontSize: "15px", fontWeight: 600, color: "#0A1628", margin: 0 }}>
                        {event.organizerName || `${event.createdBy?.firstName} ${event.createdBy?.lastName}`}
                      </h6>
                      {event.createdBy?.title && (
                        <span style={{ fontSize: "13px", color: "#64748B" }}>{event.createdBy.title}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EventDetailPage;
