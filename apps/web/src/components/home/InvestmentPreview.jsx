import React, { useState } from "react";
import { Link } from "react-router-dom";

const INVESTMENTS = [
  {
    id: 1,
    type: "Hotel Sale",
    title: "50-Room Boutique Hotel in Jaipur",
    location: "Jaipur, Rajasthan",
    price: "₹12 Cr",
    rooms: 50,
    tag: "Premium",
  },
  {
    id: 2,
    type: "Joint Venture",
    title: "Beach Resort Development in Goa",
    location: "South Goa",
    price: "₹25 Cr",
    rooms: 80,
    tag: "New Development",
  },
  {
    id: 3,
    type: "Investment",
    title: "Heritage Property Conversion in Udaipur",
    location: "Udaipur, Rajasthan",
    price: "₹8 Cr",
    rooms: 30,
    tag: "Heritage",
  },
];

export const InvestmentPreview = () => {
  const [clickedId, setClickedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const handleClick = (id) => {
    setClickedId(id);
    setTimeout(() => setClickedId(null), 700);
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
              Investment Hub
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
              Investment Opportunities
            </h2>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link
              to="/investments"
              className="btn btn-two"
              data-aos="fade-left"
              data-aos-duration="800"
              style={{ padding: "14px 28px", fontSize: "12px" }}
            >
              View All Opportunities
            </Link>
          </div>
        </div>

        <div className="row">
          {INVESTMENTS.map((item, index) => (
            <div
              key={item.id}
              className="col-lg-4 col-md-6"
              data-aos="zoom-in-up"
              data-aos-duration="800"
              data-aos-delay={index * 200}
            >
              <div
                onClick={() => handleClick(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  border: "1px solid var(--tg-border-color)",
                  marginBottom: "30px",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transform: clickedId === item.id
                    ? "scale(0.93) perspective(600px) rotateX(5deg)"
                    : hoveredId === item.id
                    ? "translateY(-12px) scale(1.02)"
                    : "translateY(0) scale(1)",
                  boxShadow: clickedId === item.id
                    ? "0 8px 20px rgba(198,169,98,0.2)"
                    : hoveredId === item.id
                    ? "0 25px 60px rgba(10,22,40,0.12)"
                    : "0 2px 8px rgba(10,22,40,0.03)",
                  position: "relative",
                }}
              >
                {/* Click flash effect */}
                {clickedId === item.id && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(198,169,98,0.1)",
                      animation: "flashFade 0.7s ease-out forwards",
                      pointerEvents: "none",
                      zIndex: 5,
                    }}
                  />
                )}
                <div
                  style={{
                    background: "#F7F5F0",
                    height: "200px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      background: "var(--tg-accent-color)",
                      color: "var(--tg-primary-color)",
                      padding: "4px 12px",
                      fontSize: "11px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      transition: "all 0.3s ease",
                      transform: hoveredId === item.id ? "translateY(0) scale(1.05)" : "translateY(0)",
                      zIndex: 2,
                    }}
                  >
                    {item.tag}
                  </span>
                  {/* Background pattern animation */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "radial-gradient(circle at 25% 25%, rgba(198,169,98,0.06) 0%, transparent 50%)",
                      transition: "all 0.5s ease",
                      transform: hoveredId === item.id ? "scale(1.5)" : "scale(1)",
                    }}
                  />
                  <div
                    style={{
                      textAlign: "center",
                      color: "var(--tg-gray-three)",
                      position: "relative",
                      zIndex: 1,
                      transition: "all 0.4s ease",
                      transform: hoveredId === item.id ? "scale(1.1) translateY(-5px)" : "scale(1)",
                    }}
                  >
                    <i className="flaticon-investment" style={{ fontSize: "48px" }}></i>
                    <p style={{ marginTop: "8px", fontSize: "13px" }}>{item.type}</p>
                  </div>
                </div>
                <div style={{ padding: "24px" }}>
                  <h4
                    style={{
                      fontFamily: "var(--tg-heading-font-family)",
                      fontSize: "22px",
                      fontWeight: 600,
                      color: "var(--tg-primary-color)",
                      marginBottom: "8px",
                      lineHeight: 1.3,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--tg-body-font-color)",
                      marginBottom: "16px",
                    }}
                  >
                    <i className="flaticon-pin" style={{ marginRight: "6px" }}></i>
                    {item.location}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid var(--tg-border-color)",
                      paddingTop: "16px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: clickedId === item.id ? "26px" : "22px",
                        fontWeight: 700,
                        color: "var(--tg-accent-color)",
                        fontFamily: "var(--tg-heading-font-family)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {item.price}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "var(--tg-gray-three)",
                        transition: "all 0.3s ease",
                        transform: hoveredId === item.id ? "translateX(-5px)" : "translateX(0)",
                      }}
                    >
                      {item.rooms} Rooms
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes flashFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
};
