import React, { useState } from "react";
import { Link } from "react-router-dom";

const STAKEHOLDERS = [
  {
    id: 1,
    icon: "flaticon-piggy-bank",
    title: "Property Owners",
    description:
      "Hotel Owners, Resort Developers, and Asset Holders managing hospitality properties across India.",
    link: "/members?role=OWNER",
    count: "2,500+",
    color: "#C6A962",
  },
  {
    id: 2,
    icon: "flaticon-light-bulb",
    title: "Investors",
    description:
      "Hospitality Investors, Joint Venture Partners, and Acquisition Specialists seeking opportunities.",
    link: "/investments",
    count: "800+",
    color: "#1A365D",
  },
  {
    id: 3,
    icon: "flaticon-profit",
    title: "Service Providers",
    description:
      "Architects, PMS Providers, IT Companies, HVAC Specialists, Marketing Agencies, and Consultants.",
    link: "/marketplace",
    count: "3,200+",
    color: "#276749",
  },
  {
    id: 4,
    icon: "flaticon-investment",
    title: "Professionals",
    description:
      "Operations, Technology, Engineering, Procurement, Finance, F&B, and Guest Experience Leaders.",
    link: "/members?role=PROFESSIONAL",
    count: "5,000+",
    color: "#553C9A",
  },
];

export const StakeholderSection = () => {
  const [clickedId, setClickedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const handleClick = (id) => {
    setClickedId(id);
    setTimeout(() => setClickedId(null), 600);
  };

  return (
    <section
      className="services-area-two"
      style={{
        padding: "100px 0",
        background: "#FFFFFF",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="section-title-two mb-50">
              <span
                className="sub-title"
                data-aos="fade-down"
                data-aos-duration="800"
                style={{
                  color: "var(--tg-accent-color)",
                  letterSpacing: "3px",
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "16px",
                }}
              >
                The Ecosystem
              </span>
              <h2
                className="title"
                data-aos="zoom-in"
                data-aos-duration="1000"
                data-aos-delay="200"
                style={{
                  fontSize: "clamp(28px, 4vw, 48px)",
                  fontFamily: "var(--tg-heading-font-family)",
                  fontWeight: 600,
                  color: "var(--tg-primary-color)",
                  marginBottom: "16px",
                }}
              >
                One Network. Four Stakeholders.
              </h2>
              <p
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay="400"
                style={{ maxWidth: "560px", margin: "0 auto" }}
              >
                A verified ecosystem where every stakeholder in hospitality
                connects, collaborates, and grows.
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          {STAKEHOLDERS.map((item, index) => (
            <div
              key={item.id}
              className="col-lg-3 col-md-6"
              data-aos="flip-left"
              data-aos-duration="800"
              data-aos-delay={index * 200}
            >
              <div
                onClick={() => handleClick(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  padding: "40px 30px",
                  borderBottom: `3px solid ${item.color}`,
                  background: "#FFFFFF",
                  border: "1px solid #E2DDD5",
                  borderBottomWidth: "3px",
                  borderBottomColor: item.color,
                  marginBottom: "30px",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  height: "100%",
                  cursor: "pointer",
                  transform: clickedId === item.id
                    ? "scale(0.92) rotateY(10deg)"
                    : hoveredId === item.id
                    ? "translateY(-12px) scale(1.03)"
                    : "translateY(0) scale(1)",
                  boxShadow: clickedId === item.id
                    ? `0 5px 15px rgba(10,22,40,0.15), inset 0 0 30px ${item.color}22`
                    : hoveredId === item.id
                    ? `0 25px 50px rgba(10,22,40,0.12), 0 0 0 2px ${item.color}40`
                    : "0 2px 8px rgba(10,22,40,0.04)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Animated shine effect on hover */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: hoveredId === item.id ? "100%" : "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    transition: "left 0.6s ease",
                    pointerEvents: "none",
                  }}
                />
                {/* Click ripple */}
                {clickedId === item.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "300px",
                      height: "300px",
                      marginLeft: "-150px",
                      marginTop: "-150px",
                      borderRadius: "50%",
                      background: `${item.color}15`,
                      animation: "rippleOut 0.6s ease-out forwards",
                      pointerEvents: "none",
                    }}
                  />
                )}
                <div
                  style={{
                    fontSize: "32px",
                    color: item.color,
                    marginBottom: "20px",
                    transition: "all 0.4s ease",
                    transform: hoveredId === item.id ? "scale(1.2) rotate(5deg)" : "scale(1)",
                  }}
                >
                  <i className={item.icon}></i>
                </div>
                <h4
                  style={{
                    fontFamily: "var(--tg-heading-font-family)",
                    fontSize: "24px",
                    fontWeight: 600,
                    color: "var(--tg-primary-color)",
                    marginBottom: "12px",
                    transition: "color 0.3s ease",
                  }}
                >
                  {item.title}
                </h4>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "var(--tg-body-font-color)",
                    marginBottom: "20px",
                  }}
                >
                  {item.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: item.color,
                      fontFamily: "var(--tg-heading-font-family)",
                      transition: "all 0.3s ease",
                      transform: hoveredId === item.id ? "scale(1.1)" : "scale(1)",
                      display: "inline-block",
                    }}
                  >
                    {item.count}
                  </span>
                  <Link
                    to={item.link}
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--tg-primary-color)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      transform: hoveredId === item.id ? "translateX(5px)" : "translateX(0)",
                      display: "inline-block",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes rippleOut {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </section>
  );
};
