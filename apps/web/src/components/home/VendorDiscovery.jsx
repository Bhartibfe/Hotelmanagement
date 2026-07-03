import React, { useState } from "react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { id: 1, icon: "flaticon-computer", title: "Technology & PMS", count: "420+ Vendors" },
  { id: 2, icon: "flaticon-profit", title: "Architecture & Design", count: "280+ Firms" },
  { id: 3, icon: "flaticon-light-bulb", title: "Interior Design", count: "350+ Studios" },
  { id: 4, icon: "flaticon-investment", title: "HVAC & Engineering", count: "190+ Companies" },
  { id: 5, icon: "flaticon-piggy-bank", title: "Procurement", count: "310+ Suppliers" },
  { id: 6, icon: "flaticon-target", title: "Marketing & Digital", count: "260+ Agencies" },
];

export const VendorDiscovery = () => {
  const [clickedId, setClickedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const handleClick = (id) => {
    setClickedId(id);
    setTimeout(() => setClickedId(null), 600);
  };

  return (
    <section style={{ padding: "100px 0", background: "#FFFFFF" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center mb-50">
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
              data-aos="fade-down"
              data-aos-duration="800"
            >
              Marketplace
            </span>
            <h2
              data-aos="zoom-in"
              data-aos-duration="1000"
              data-aos-delay="200"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontFamily: "var(--tg-heading-font-family)",
                fontWeight: 600,
                color: "var(--tg-primary-color)",
                marginBottom: "16px",
              }}
            >
              Discover Verified Vendors & Partners
            </h2>
            <p
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="400"
              style={{ maxWidth: "540px", margin: "0 auto" }}
            >
              Find trusted service providers across every category of
              hospitality operations.
            </p>
          </div>
        </div>

        <div className="row">
          {CATEGORIES.map((item, index) => (
            <div
              key={item.id}
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-duration="700"
              data-aos-delay={index * 120}
            >
              <Link
                to="/marketplace"
                style={{ textDecoration: "none" }}
                onClick={() => handleClick(item.id)}
              >
                <div
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: "#FFFFFF",
                    padding: "32px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    borderLeft: `3px solid ${hoveredId === item.id || clickedId === item.id ? "var(--tg-accent-color)" : "transparent"}`,
                    border: "1px solid #E2DDD5",
                    borderLeftWidth: "3px",
                    borderLeftColor: hoveredId === item.id || clickedId === item.id ? "var(--tg-accent-color)" : "transparent",
                    cursor: "pointer",
                    transform: clickedId === item.id
                      ? "scale(0.95) translateX(4px)"
                      : hoveredId === item.id
                      ? "translateX(12px) scale(1.02)"
                      : "translateX(0) scale(1)",
                    boxShadow: clickedId === item.id
                      ? "0 4px 15px rgba(198,169,98,0.15)"
                      : hoveredId === item.id
                      ? "0 12px 35px rgba(10,22,40,0.08)"
                      : "0 1px 4px rgba(10,22,40,0.03)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Slide-in background on hover */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: hoveredId === item.id ? "100%" : "0%",
                      height: "100%",
                      background: "rgba(198,169,98,0.03)",
                      transition: "width 0.4s ease",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      background: hoveredId === item.id ? "var(--tg-accent-color)" : "#F7F5F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.4s ease",
                      borderRadius: hoveredId === item.id ? "50%" : "0",
                      transform: clickedId === item.id ? "rotate(360deg) scale(0.8)" : hoveredId === item.id ? "rotate(10deg)" : "rotate(0deg)",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <i
                      className={item.icon}
                      style={{
                        fontSize: "24px",
                        color: hoveredId === item.id ? "#FFFFFF" : "var(--tg-accent-color)",
                        transition: "color 0.3s ease",
                      }}
                    ></i>
                  </div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <h5
                      style={{
                        fontFamily: "var(--tg-heading-font-family)",
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "var(--tg-primary-color)",
                        marginBottom: "4px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {item.title}
                    </h5>
                    <span
                      style={{
                        fontSize: "13px",
                        color: hoveredId === item.id ? "var(--tg-accent-dark)" : "var(--tg-gray-three)",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {item.count}
                    </span>
                  </div>
                  {/* Arrow that appears on hover */}
                  <div
                    style={{
                      marginLeft: "auto",
                      opacity: hoveredId === item.id ? 1 : 0,
                      transform: hoveredId === item.id ? "translateX(0)" : "translateX(-10px)",
                      transition: "all 0.3s ease",
                      color: "var(--tg-accent-color)",
                      fontSize: "18px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    →
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-20" data-aos="zoom-in" data-aos-duration="800" data-aos-delay="200">
          <Link to="/marketplace" className="btn" style={{ padding: "14px 32px", fontSize: "12px" }}>
            Browse Full Marketplace
          </Link>
        </div>
      </div>
    </section>
  );
};
