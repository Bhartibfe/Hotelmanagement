import React, { useState } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";
import { POST_IMG01, POST_IMG02, POST_IMG03 } from "../../lib/assets";

const EVENT_COVERS = [POST_IMG01, POST_IMG02, POST_IMG03];

const MOCK_EVENTS = [
  { id: 1, title: "India Hospitality Investment Summit 2026", type: "SUMMIT", date: "Jul 15-16, 2026", city: "Mumbai", state: "Maharashtra", venue: "The Taj Mahal Palace", desc: "India's largest gathering of hospitality investors, hotel owners, and industry leaders discussing the future of hospitality investments.", featured: true, attendees: 450 },
  { id: 2, title: "Hospitality Technology & Innovation Forum", type: "CONFERENCE", date: "Aug 22-23, 2026", city: "Bengaluru", state: "Karnataka", venue: "ITC Gardenia", desc: "Exploring AI, automation, and digital transformation in hospitality operations, revenue management, and guest experience.", featured: true, attendees: 300 },
  { id: 3, title: "Hotel Owners Networking Dinner", type: "NETWORKING", date: "Sep 5, 2026", city: "New Delhi", state: "Delhi", venue: "The Leela Palace", desc: "An exclusive evening for verified hotel owners to connect, share insights, and explore collaboration opportunities.", featured: false, attendees: 80 },
  { id: 4, title: "Revenue Management Masterclass", type: "WEBINAR", date: "Sep 18, 2026", city: "Online", state: "", venue: "Virtual", desc: "A deep-dive into modern revenue management strategies for Indian hotels, featuring case studies from leading properties.", featured: false, attendees: 200 },
  { id: 5, title: "Hospitality Procurement Expo", type: "CONFERENCE", date: "Oct 10-11, 2026", city: "Jaipur", state: "Rajasthan", venue: "Rambagh Palace", desc: "Connecting hospitality procurement heads with verified vendors across furniture, linen, technology, and F&B supplies.", featured: false, attendees: 350 },
  { id: 6, title: "South India Hotel Owners Meet", type: "NETWORKING", date: "Nov 2, 2026", city: "Chennai", state: "Tamil Nadu", venue: "ITC Grand Chola", desc: "Regional networking event for hotel owners in Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh.", featured: false, attendees: 120 },
];

const TYPE_LABELS = { ALL: "All Events", SUMMIT: "Summits", CONFERENCE: "Conferences", NETWORKING: "Networking", WEBINAR: "Webinars" };
const TYPE_COLORS = { SUMMIT: "#C6A962", CONFERENCE: "#1A365D", NETWORKING: "#276749", WEBINAR: "#553C9A" };

const EventsPage = () => {
  const [activeType, setActiveType] = useState("ALL");

  const filtered = activeType === "ALL" ? MOCK_EVENTS : MOCK_EVENTS.filter((e) => e.type === activeType);

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

          {/* Featured Events */}
          {activeType === "ALL" && (
            <div className="row" style={{ marginBottom: "40px" }}>
              {MOCK_EVENTS.filter((e) => e.featured).map((event, i) => (
                <div key={event.id} className="col-lg-6" data-aos="fade-up" data-aos-delay={i * 150}>
                  <div style={{ marginBottom: "30px", position: "relative", overflow: "hidden" }}>
                    {/* Cover image */}
                    <div style={{ height: "200px", overflow: "hidden" }}>
                      <img src={EVENT_COVERS[i % EVENT_COVERS.length]} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ background: "var(--tg-primary-color)", padding: "32px", position: "relative" }}>
                    <span style={{ position: "absolute", top: "-14px", right: "20px", background: "#C6A962", color: "#0A1628", padding: "4px 12px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Featured</span>
                    <span style={{ color: "#C6A962", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "12px" }}>{event.type}</span>
                    <h3 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "28px", fontWeight: 600, color: "#FFFFFF", marginBottom: "16px", lineHeight: 1.2 }}>{event.title}</h3>
                    <p style={{ color: "#8DA4BE", fontSize: "14px", lineHeight: 1.7, marginBottom: "20px" }}>{event.desc}</p>
                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", borderTop: "1px solid rgba(198,169,98,0.2)", paddingTop: "16px" }}>
                      <span style={{ color: "#C6A962", fontSize: "14px" }}><i className="far fa-calendar" style={{ marginRight: "6px" }}></i>{event.date}</span>
                      <span style={{ color: "#8DA4BE", fontSize: "14px" }}><i className="flaticon-pin" style={{ marginRight: "6px" }}></i>{event.venue}, {event.city}</span>
                      <span style={{ color: "#8DA4BE", fontSize: "14px" }}><i className="far fa-user" style={{ marginRight: "6px" }}></i>{event.attendees} expected</span>
                    </div>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All Events List */}
          {filtered.filter((e) => activeType !== "ALL" || !e.featured).map((event, i) => (
            <div
              key={event.id}
              data-aos="fade-up"
              data-aos-delay={i * 80}
              style={{ display: "flex", alignItems: "center", gap: "28px", padding: "28px 0", borderBottom: "1px solid var(--tg-border-color)", transition: "all 0.3s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = "16px"; e.currentTarget.style.background = "rgba(247,245,240,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "0"; e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ width: "72px", height: "72px", background: TYPE_COLORS[event.type] || "var(--tg-primary-color)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#FFFFFF", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>{event.type.slice(0, 4)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "22px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "6px" }}>{event.title}</h4>
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "13px", color: "var(--tg-gray-three)" }}>
                  <span><i className="far fa-calendar" style={{ marginRight: "4px" }}></i>{event.date}</span>
                  <span><i className="flaticon-pin" style={{ marginRight: "4px" }}></i>{event.city}{event.state && `, ${event.state}`}</span>
                  <span><i className="far fa-user" style={{ marginRight: "4px" }}></i>{event.attendees} attendees</span>
                </div>
              </div>
              <Link to="/register" className="btn" style={{ padding: "10px 20px", fontSize: "11px", flexShrink: 0 }}>Register</Link>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default EventsPage;
