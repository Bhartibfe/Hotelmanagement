import React, { useState } from "react";
import { Link } from "react-router-dom";

const EVENTS = [
  {
    id: 1,
    date: { day: "15", month: "JUL" },
    title: "India Hospitality Investment Summit 2026",
    location: "Mumbai, Maharashtra",
    type: "Summit",
  },
  {
    id: 2,
    date: { day: "22", month: "AUG" },
    title: "Hospitality Technology & Innovation Forum",
    location: "Bengaluru, Karnataka",
    type: "Conference",
  },
  {
    id: 3,
    date: { day: "05", month: "SEP" },
    title: "Hotel Owners Networking Dinner",
    location: "New Delhi",
    type: "Networking",
  },
  {
    id: 4,
    date: { day: "18", month: "OCT" },
    title: "Sustainable Hospitality Workshop",
    location: "Jaipur, Rajasthan",
    type: "Workshop",
  },
  {
    id: 5,
    date: { day: "10", month: "NOV" },
    title: "Hospitality Vendor Expo 2026",
    location: "Chennai, Tamil Nadu",
    type: "Expo",
  },
];

export const EventsPreview = () => {
  const [clickedId, setClickedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const handleClick = (id) => {
    setClickedId(id);
    setTimeout(() => setClickedId(null), 600);
  };

  return (
    <section style={{ padding: "100px 0", background: "#FFFFFF" }}>
      <div className="container">
        <div className="row align-items-end mb-50">
          <div className="col-lg-8">
            <span
              style={{
                color: "var(--tg-accent-color)",
                letterSpacing: "3px",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                display: "block",
                marginBottom: "16px",
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
                fontWeight: 600,
                color: "var(--tg-primary-color)",
              }}
            >
              Upcoming Events
            </h2>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link
              to="/events"
              className="btn btn-two"
              data-aos="fade-left"
              data-aos-duration="800"
              style={{ padding: "14px 28px", fontSize: "12px" }}
            >
              View All Events
            </Link>
          </div>
        </div>

        {EVENTS.map((item, index) => (
          <div
            key={item.id}
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay={index * 150}
            onClick={() => handleClick(item.id)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "30px",
              padding: "30px 20px",
              borderBottom: "1px solid var(--tg-border-color)",
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              cursor: "pointer",
              paddingLeft: clickedId === item.id
                ? "10px"
                : hoveredId === item.id
                ? "30px"
                : "20px",
              background: clickedId === item.id
                ? "rgba(198,169,98,0.04)"
                : hoveredId === item.id
                ? "rgba(10,22,40,0.015)"
                : "transparent",
              transform: clickedId === item.id
                ? "scale(0.98)"
                : "scale(1)",
              borderRadius: "4px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Left accent bar that animates in */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                width: "4px",
                height: hoveredId === item.id || clickedId === item.id ? "80%" : "0%",
                background: "var(--tg-accent-color)",
                transition: "all 0.4s ease",
                transform: "translateY(-50%)",
                borderRadius: "2px",
              }}
            />
            <div
              style={{
                width: "80px",
                height: "80px",
                background: clickedId === item.id
                  ? "var(--tg-accent-color)"
                  : "var(--tg-primary-color)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                transform: clickedId === item.id
                  ? "rotate(-5deg) scale(0.9)"
                  : hoveredId === item.id
                  ? "scale(1.08) rotate(2deg)"
                  : "scale(1)",
                borderRadius: clickedId === item.id ? "12px" : hoveredId === item.id ? "8px" : "0",
              }}
            >
              <span
                style={{
                  color: clickedId === item.id ? "#0A1628" : "#C6A962",
                  fontSize: "24px",
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
                }}
              >
                {item.date.month}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  fontFamily: "var(--tg-heading-font-family)",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "var(--tg-primary-color)",
                  marginBottom: "6px",
                  transition: "all 0.3s ease",
                  transform: hoveredId === item.id ? "translateX(5px)" : "translateX(0)",
                }}
              >
                <Link to="/events" style={{ color: "inherit", textDecoration: "none" }}>
                  {item.title}
                </Link>
              </h4>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--tg-body-font-color)",
                  margin: 0,
                  transition: "all 0.3s ease",
                  transform: hoveredId === item.id ? "translateX(5px)" : "translateX(0)",
                  transitionDelay: "0.05s",
                }}
              >
                <i className="flaticon-pin" style={{ marginRight: "6px" }}></i>
                {item.location}
              </p>
            </div>
            <div>
              <span
                style={{
                  background: clickedId === item.id
                    ? "var(--tg-accent-color)"
                    : hoveredId === item.id
                    ? "var(--tg-primary-color)"
                    : "#F7F5F0",
                  padding: "6px 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: clickedId === item.id
                    ? "#0A1628"
                    : hoveredId === item.id
                    ? "#FFFFFF"
                    : "var(--tg-primary-color)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  transition: "all 0.3s ease",
                  display: "inline-block",
                  transform: hoveredId === item.id ? "scale(1.05)" : "scale(1)",
                }}
              >
                {item.type}
              </span>
            </div>
          </div>
        ))}

        {/* View All Events Link */}
        <div
          className="text-center"
          style={{ marginTop: "40px" }}
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="300"
        >
          <Link
            to="/events"
            style={{
              color: "#C6A962",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              textDecoration: "none",
              borderBottom: "2px solid transparent",
              paddingBottom: "4px",
              transition: "all 0.3s ease",
              fontFamily: "var(--tg-body-font-family)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderBottomColor = "#C6A962";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottomColor = "transparent";
            }}
          >
            View All Events &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};
