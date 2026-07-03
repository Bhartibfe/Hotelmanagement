import React, { useState } from "react";
import { Odometer } from "../Odometer/Odometer";

const STATS = [
  { id: 1, count: 2500, suffix: "+", title: "Members", icon: "flaticon-piggy-bank" },
  { id: 2, count: 850, suffix: "+", title: "Verified Vendors", icon: "flaticon-profit" },
  { id: 3, count: 320, suffix: "+", title: "Industry Experts", icon: "flaticon-light-bulb" },
  { id: 4, count: 120, suffix: "+", title: "Cities Across India", icon: "flaticon-pin" },
];

export const NetworkStatsSection = () => {
  const [clickedId, setClickedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const handleClick = (id) => {
    setClickedId(id);
    setTimeout(() => setClickedId(null), 700);
  };

  return (
    <section
      className="counter-area-two"
      style={{
        background: "var(--tg-primary-color)",
        padding: "80px 0",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          {STATS.map((item, index) => (
            <div
              key={item.id}
              className="col-lg-3 col-md-4 col-sm-6"
              data-aos="zoom-in-up"
              data-aos-duration="800"
              data-aos-delay={index * 150}
            >
              <div
                className="counter-item-two text-center"
                onClick={() => handleClick(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  padding: "30px 20px",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  transform: clickedId === item.id
                    ? "scale(0.88) rotate(-3deg)"
                    : hoveredId === item.id
                    ? "scale(1.08) translateY(-8px)"
                    : "scale(1)",
                  borderRadius: "8px",
                  background: hoveredId === item.id
                    ? "rgba(198,169,98,0.08)"
                    : clickedId === item.id
                    ? "rgba(198,169,98,0.15)"
                    : "transparent",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {clickedId === item.id && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      border: "2px solid #C6A962",
                      borderRadius: "8px",
                      animation: "borderPulse 0.7s ease-out forwards",
                      pointerEvents: "none",
                    }}
                  />
                )}
                <h2
                  className="count"
                  style={{
                    color: "#C6A962",
                    fontFamily: "var(--tg-heading-font-family)",
                    fontSize: clickedId === item.id ? "56px" : "48px",
                    fontWeight: 600,
                    marginBottom: "8px",
                    transition: "all 0.3s ease",
                    textShadow: hoveredId === item.id ? "0 0 20px rgba(198,169,98,0.4)" : "none",
                  }}
                >
                  <Odometer end={item.count} />
                  {item.suffix}
                </h2>
                <p
                  style={{
                    color: hoveredId === item.id ? "#C6A962" : "#8DA4BE",
                    fontSize: "14px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontWeight: 500,
                    transition: "all 0.3s ease",
                  }}
                >
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes borderPulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
          100% { opacity: 0; transform: scale(1.1); }
        }
      `}</style>
    </section>
  );
};
