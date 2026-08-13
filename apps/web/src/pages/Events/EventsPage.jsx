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

  const featured = events.filter((e) => e.isFeatured);
  const nonFeatured = activeType === "ALL" ? events.filter((e) => !e.isFeatured) : events;

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
              {/* Featured Events */}
              {activeType === "ALL" && featured.length > 0 && (
                <div className="row" style={{ marginBottom: "40px" }}>
                  {featured.map((event, i) => (
                    <div key={event.id} className="col-lg-6" data-aos="fade-up" data-aos-delay={i * 150}>
                      <Link to={`/events/${event.slug}`} style={{ textDecoration: "none", display: "block", marginBottom: "30px", overflow: "hidden" }}>
                        <div style={{ height: "200px", overflow: "hidden", background: "#0A1628" }}>
                          {event.coverImage ? (
                            <img src={event.coverImage} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, #0A1628, ${TYPE_COLORS[event.type] || "#1E3A5F"})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <i className="fas fa-calendar-alt" style={{ fontSize: "48px", color: "rgba(198,169,98,0.2)" }}></i>
                            </div>
                          )}
                        </div>
                        <div style={{ background: "var(--tg-primary-color)", padding: "32px", position: "relative" }}>
                          <span style={{ position: "absolute", top: "-14px", right: "20px", background: "#C6A962", color: "#0A1628", padding: "4px 12px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Featured</span>
                          <span style={{ color: "#C6A962", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "12px" }}>{event.type}</span>
                          <h3 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "28px", fontWeight: 600, color: "#FFFFFF", marginBottom: "16px", lineHeight: 1.2 }}>{event.title}</h3>
                          <p style={{ color: "#8DA4BE", fontSize: "14px", lineHeight: 1.7, marginBottom: "20px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {event.description ? event.description.replace(/<[^>]*>/g, "").substring(0, 200) : ""}
                          </p>
                          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", borderTop: "1px solid rgba(198,169,98,0.2)", paddingTop: "16px" }}>
                            <span style={{ color: "#C6A962", fontSize: "14px" }}><i className="far fa-calendar" style={{ marginRight: "6px" }}></i>{formatDateRange(event.startDate, event.endDate)}</span>
                            <span style={{ color: "#8DA4BE", fontSize: "14px" }}><i className="fas fa-map-marker-alt" style={{ marginRight: "6px" }}></i>{event.venue ? `${event.venue}, ${event.city}` : `${event.city}, ${event.state}`}</span>
                            <span style={{ color: "#8DA4BE", fontSize: "14px" }}><i className="far fa-user" style={{ marginRight: "6px" }}></i>{event._count?.registrations || 0} registered</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* All Events List */}
              {nonFeatured.map((event, i) => (
                <Link
                  key={event.id}
                  to={`/events/${event.slug}`}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  style={{
                    display: "flex", alignItems: "center", gap: "28px", padding: "28px 0",
                    borderBottom: "1px solid var(--tg-border-color)", transition: "all 0.3s ease",
                    textDecoration: "none", color: "inherit",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "16px"; e.currentTarget.style.background = "rgba(247,245,240,0.5)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "0"; e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ width: "72px", height: "72px", background: TYPE_COLORS[event.type] || "var(--tg-primary-color)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>
                      {new Date(event.startDate).getDate()}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>
                      {new Date(event.startDate).toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "22px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "6px" }}>{event.title}</h4>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "13px", color: "var(--tg-gray-three)" }}>
                      <span><i className="far fa-calendar" style={{ marginRight: "4px" }}></i>{formatDateRange(event.startDate, event.endDate)}</span>
                      <span><i className="fas fa-map-marker-alt" style={{ marginRight: "4px" }}></i>{event.city}{event.state && `, ${event.state}`}</span>
                      <span><i className="far fa-user" style={{ marginRight: "4px" }}></i>{event._count?.registrations || 0} registered</span>
                    </div>
                  </div>
                  <span className="btn" style={{ padding: "10px 20px", fontSize: "11px", flexShrink: 0 }}>View Details</span>
                </Link>
              ))}

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
    </Layout>
  );
};

export default EventsPage;
