import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAosRefresh } from "../../lib/hooks/useAosRefresh";
import { SectionSkeleton, SkeletonRows } from "../common/Skeleton";

export const EventsPreview = ({ config }) => {
  const [clickedId, setClickedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getEvents({ limit: "5" });
        const list = data?.events || [];
        setEvents(
          list.map((e) => {
            const d = new Date(e.startDate);
            return {
              id: e.id,
              slug: e.slug,
              title: e.title,
              location: e.venue ? `${e.venue}, ${e.city}` : `${e.city}, ${e.state}`,
              type: e.type,
              date: {
                day: d.getDate().toString().padStart(2, "0"),
                month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
              },
            };
          })
        );
      } catch {
        // keep empty
      } finally {
        setLoaded(true);
      }
    };
    fetchEvents();
  }, []);

  useAosRefresh(loaded);

  const handleClick = (id) => {
    setClickedId(id);
    setTimeout(() => setClickedId(null), 600);
  };

  if (!loaded) {
    return (
      <SectionSkeleton padding="clamp(56px, 7vw, 84px) 0" background="#FFFFFF">
        <SkeletonRows count={config?.eventsCount || 3} height="104px" />
      </SectionSkeleton>
    );
  }

  if (events.length === 0) return null;

  return (
    <section style={{ padding: "clamp(56px, 7vw, 84px) 0", background: "#FFFFFF" }}>
      <div className="container">
        <div className="row align-items-end" style={{ marginBottom: "36px" }}>
          <div className="col-lg-8">
            <span
              style={{
                color: "#C6A962",
                letterSpacing: "3px",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                display: "block",
                marginBottom: "14px",
              }}
              data-aos="fade-right"
              data-aos-duration="800"
            >
              Events & Summits
            </span>
            <h2
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="200"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontFamily: "var(--tg-heading-font-family)",
                fontWeight: 700,
                color: "#0A1628",
                margin: 0,
              }}
            >
              Upcoming Events
            </h2>
          </div>
          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <Link
              to="/events"
              className="btn btn-two"
              data-aos="fade-left"
              data-aos-duration="800"
              style={{
                padding: "12px 28px",
                fontSize: "12px",
                letterSpacing: "1.5px",
                borderRadius: "30px",
                boxShadow: "0 4px 15px rgba(10,22,40,0.12)",
                transition: "all 0.3s ease",
              }}
            >
              View All Events
            </Link>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {events.slice(0, config?.eventsCount || 3).map((item, index) => (
            <Link
              key={item.id}
              to={`/events/${item.slug}`}
              style={{ textDecoration: "none" }}
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={index * 150}
            >
              <div
                onClick={() => handleClick(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                  padding: "22px 24px",
                  border: hoveredId === item.id
                    ? "1px solid rgba(198, 169, 98, 0.4)"
                    : "1px solid rgba(10, 22, 40, 0.08)",
                  boxShadow: hoveredId === item.id
                    ? "0 12px 30px rgba(10, 22, 40, 0.08)"
                    : "0 2px 10px rgba(0, 0, 0, 0.02)",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  cursor: "pointer",
                  background: clickedId === item.id
                    ? "rgba(198,169,98,0.06)"
                    : hoveredId === item.id
                    ? "#FDFBF7"
                    : "#FFFFFF",
                  transform: clickedId === item.id
                    ? "scale(0.99)"
                    : hoveredId === item.id
                    ? "translateX(6px)"
                    : "translateX(0)",
                  borderRadius: "12px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Left accent bar */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    background: "linear-gradient(180deg, #C6A962, #9B7E38)",
                    opacity: hoveredId === item.id || clickedId === item.id ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                />
                <div
                  style={{
                    width: "68px",
                    height: "68px",
                    background: clickedId === item.id ? "#C6A962" : "#0A1628",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    transform: clickedId === item.id
                      ? "rotate(-5deg) scale(0.95)"
                      : hoveredId === item.id
                      ? "scale(1.06)"
                      : "scale(1)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(10,22,40,0.15)",
                  }}
                >
                  <span
                    style={{
                      color: clickedId === item.id ? "#0A1628" : "#C6A962",
                      fontSize: "22px",
                      fontWeight: 700,
                      lineHeight: 1,
                      fontFamily: "var(--tg-heading-font-family)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item.date.day}
                  </span>
                  <span
                    style={{
                      color: clickedId === item.id ? "#0A1628" : "#8DA4BE",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      marginTop: "2px",
                    }}
                  >
                    {item.date.month}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      fontFamily: "var(--tg-heading-font-family)",
                      fontSize: "19px",
                      fontWeight: 700,
                      color: "#0A1628",
                      marginBottom: "6px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#5A6E85",
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    <i className="flaticon-pin" style={{ marginRight: "6px", color: "#C6A962" }}></i>
                    {item.location}
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      background: clickedId === item.id
                        ? "#C6A962"
                        : hoveredId === item.id
                        ? "#0A1628"
                        : "rgba(198,169,98,0.1)",
                      padding: "8px 20px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: clickedId === item.id
                        ? "#0A1628"
                        : hoveredId === item.id
                        ? "#C6A962"
                        : "#8C7132",
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      transition: "all 0.3s ease",
                      display: "inline-block",
                    }}
                  >
                    {item.type}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Events Link */}
        <div
          className="text-center"
          style={{ marginTop: "32px" }}
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="300"
        >
          <Link
            to="/events"
            style={{
              color: "#C6A962",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "1px",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
            }}
          >
            Explore All Events <i className="fas fa-arrow-right" style={{ marginLeft: "6px", fontSize: "11px" }}></i>
          </Link>
        </div>
      </div>
    </section>
  );
};
