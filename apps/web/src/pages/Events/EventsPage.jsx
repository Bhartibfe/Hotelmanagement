import React, { useState, useEffect } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";
import api from "../../services/api";

const TYPE_LABELS = { ALL: "All Events", SUMMIT: "Summits", CONFERENCE: "Conferences", NETWORKING: "Networking", WEBINAR: "Webinars" };
const TYPE_COLORS = { SUMMIT: "#C6A962", CONFERENCE: "#1A365D", NETWORKING: "#276749", WEBINAR: "#553C9A" };

const formatDateRange = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const opts = { day: "numeric", month: "short" };
  if (s.toDateString() === e.toDateString()) return s.toLocaleDateString("en-IN", { ...opts, year: "numeric" });
  return `${s.toLocaleDateString("en-IN", opts)} - ${e.toLocaleDateString("en-IN", { ...opts, year: "numeric" })}`;
};

const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg, #0A1628, #1A365D)",
  "linear-gradient(135deg, #0A1628, #276749)",
  "linear-gradient(135deg, #0A1628, #553C9A)",
  "linear-gradient(135deg, #0A1628, #C6A962)",
];

const EventCard = ({ event, index }) => {
  const [hovered, setHovered] = useState(false);
  const color = TYPE_COLORS[event.type] || "#C6A962";
  const now = new Date();
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isRunning = startDate <= now && endDate >= now;

  return (
    <Link
      to={`/events/${event.slug}`}
      style={{ textDecoration: "none", display: "block", height: "100%" }}
      data-aos="fade-up"
      data-aos-delay={index * 80}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "12px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hovered ? "0 12px 32px rgba(10, 22, 40, 0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Poster Image */}
        <div style={{ position: "relative", paddingBottom: "56.25%", overflow: "hidden" }}>
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                objectFit: "cover",
                transition: "transform 0.4s ease",
                transform: hovered ? "scale(1.05)" : "scale(1)",
              }}
            />
          ) : (
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              background: PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length],
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className="fas fa-calendar-alt" style={{ fontSize: "40px", color: "rgba(198,169,98,0.25)" }}></i>
            </div>
          )}

          {/* Date Badge */}
          <div style={{
            position: "absolute", top: "12px", left: "12px",
            background: "#FFFFFF", borderRadius: "8px", padding: "6px 10px",
            textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            minWidth: "50px",
          }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#0A1628", lineHeight: 1, fontFamily: "'Cormorant Garamond', serif" }}>
              {startDate.getDate()}
            </div>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {startDate.toLocaleDateString("en-IN", { month: "short" })}
            </div>
          </div>

          {/* Type Badge */}
          <span style={{
            position: "absolute", top: "12px", right: "12px",
            fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
            padding: "4px 10px", background: color, color: "#FFFFFF",
            borderRadius: "4px",
          }}>
            {event.type}
          </span>

          {/* Running Now Badge */}
          {isRunning && (
            <span style={{
              position: "absolute", bottom: "12px", left: "12px",
              fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
              padding: "4px 12px", background: "#10B981", color: "#FFFFFF",
              borderRadius: "12px", display: "flex", alignItems: "center", gap: "5px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FFFFFF", animation: "pulse 1.5s infinite" }}></span>
              Live Now
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h4 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "19px", fontWeight: 700, color: "#0A1628",
            margin: "0 0 10px", lineHeight: 1.3,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {event.title}
          </h4>

          {event.description && (
            <p style={{
              fontSize: "13px", color: "#64748B", lineHeight: 1.6,
              margin: "0 0 14px", flex: 1,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {event.description.replace(/<[^>]*>/g, "").substring(0, 150)}
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#475569" }}>
              <i className="far fa-calendar" style={{ fontSize: "11px", color: "#94A3B8", width: "14px" }}></i>
              {formatDateRange(event.startDate, event.endDate)}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#475569" }}>
                <i className="fas fa-map-marker-alt" style={{ fontSize: "11px", color: "#94A3B8", width: "14px" }}></i>
                {event.venue ? `${event.venue}, ${event.city}` : `${event.city}, ${event.state}`}
              </div>
              <span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 500 }}>
                <i className="fas fa-users" style={{ marginRight: "4px", fontSize: "10px" }}></i>
                {event._count?.registrations || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const EventsPage = () => {
  const [activeType, setActiveType] = useState("ALL");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeType !== "ALL") params.type = activeType;
        const data = await api.getEvents(params);
        if (data?.events) setEvents(data.events);
        else setEvents([]);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [activeType]);

  const now = new Date();
  const upcomingAndRunning = events.filter((e) => new Date(e.endDate) >= now);
  const pastEvents = events.filter((e) => new Date(e.endDate) < now).slice(0, 5);

  return (
    <Layout header={1} footer={1} breadcrumb={"Events"} title={"Events & Summits"}>
      <section style={{ padding: "60px 0 100px", background: "#FFFFFF" }}>
        <div className="container">
          {/* Filters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "40px" }}>
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveType(key)}
                style={{
                  padding: "10px 20px", fontSize: "13px", fontWeight: 600,
                  border: `1px solid ${activeType === key ? "var(--tg-accent-color)" : "var(--tg-border-color)"}`,
                  background: activeType === key ? "var(--tg-accent-color)" : "transparent",
                  color: activeType === key ? "var(--tg-primary-color)" : "var(--tg-body-font-color)",
                  cursor: "pointer", transition: "all 0.3s ease", textTransform: "uppercase", letterSpacing: "0.5px",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "28px", color: "#C6A962" }}></i>
              <p style={{ marginTop: "12px", color: "#64748B", fontSize: "14px" }}>Loading events...</p>
            </div>
          )}

          {!loading && (
            <>
              {/* Upcoming & Running Events - Grid with Posters */}
              {upcomingAndRunning.length > 0 && (
                <div style={{ marginBottom: "48px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                    <h3 style={{
                      fontFamily: "var(--tg-heading-font-family)", fontSize: "24px", fontWeight: 700,
                      color: "#0A1628", margin: 0,
                    }}>
                      Upcoming & Live Events
                    </h3>
                    <span style={{
                      fontSize: "12px", fontWeight: 600, padding: "4px 12px",
                      background: "#ECFDF5", color: "#10B981", borderRadius: "12px",
                    }}>
                      {upcomingAndRunning.length} event{upcomingAndRunning.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="row">
                    {upcomingAndRunning.map((event, i) => (
                      <div key={event.id} className="col-lg-4 col-md-6" style={{ marginBottom: "24px" }}>
                        <EventCard event={event} index={i} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Events - Compact List (last 5 only) */}
              {pastEvents.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                    <h3 style={{
                      fontFamily: "var(--tg-heading-font-family)", fontSize: "24px", fontWeight: 700,
                      color: "#0A1628", margin: 0,
                    }}>
                      Past Events
                    </h3>
                    <span style={{
                      fontSize: "12px", fontWeight: 600, padding: "4px 12px",
                      background: "#F1F5F9", color: "#64748B", borderRadius: "12px",
                    }}>
                      {pastEvents.length} recent
                    </span>
                  </div>

                  {pastEvents.map((event, i) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.slug}`}
                      data-aos="fade-up"
                      data-aos-delay={i * 60}
                      style={{
                        display: "flex", alignItems: "center", gap: "20px", padding: "18px 0",
                        borderBottom: "1px solid var(--tg-border-color)", transition: "all 0.3s ease",
                        textDecoration: "none", color: "inherit", opacity: 0.75,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "12px"; e.currentTarget.style.background = "rgba(247,245,240,0.5)"; e.currentTarget.style.opacity = "1"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "0"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.opacity = "0.75"; }}
                    >
                      <div style={{
                        width: "56px", height: "56px",
                        background: TYPE_COLORS[event.type] || "var(--tg-primary-color)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, borderRadius: "8px",
                      }}>
                        <span style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>
                          {new Date(event.startDate).getDate()}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                          {new Date(event.startDate).toLocaleDateString("en-IN", { month: "short" })}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "16px", fontWeight: 600, color: "var(--tg-primary-color)", margin: "0 0 4px" }}>{event.title}</h5>
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "12px", color: "#94A3B8" }}>
                          <span><i className="far fa-calendar" style={{ marginRight: "4px" }}></i>{formatDateRange(event.startDate, event.endDate)}</span>
                          <span><i className="fas fa-map-marker-alt" style={{ marginRight: "4px" }}></i>{event.city}{event.state && `, ${event.state}`}</span>
                        </div>
                      </div>
                      <span style={{
                        fontSize: "10px", fontWeight: 600, padding: "4px 10px",
                        background: "#FEF2F2", color: "#94A3B8", borderRadius: "4px",
                        textTransform: "uppercase", letterSpacing: "0.5px", flexShrink: 0,
                      }}>
                        Ended
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {events.length === 0 && (
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                  <i className="fas fa-calendar-alt" style={{ fontSize: "48px", color: "#CBD5E1", marginBottom: "16px", display: "block" }}></i>
                  <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", color: "#0A1628", marginBottom: "8px" }}>No events found</h5>
                  <p style={{ fontSize: "14px", color: "#64748B" }}>
                    {activeType !== "ALL" ? "No events match this filter." : "Events will appear here soon."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </Layout>
  );
};

export default EventsPage;
