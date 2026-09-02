import React, { useState, useEffect, useCallback } from "react";
import { Odometer } from "../Odometer/Odometer";
import api from "../../services/api";
import { ErrorNotice } from "../common/ErrorNotice";

const DEFAULT_STATS = [
  { id: 1, count: 0, suffix: "+", title: "Members", icon: "flaticon-piggy-bank", key: "members" },
  { id: 2, count: 0, suffix: "+", title: "Verified Partners", icon: "flaticon-profit", key: "vendors" },
  { id: 3, count: 0, suffix: "+", title: "Hotels", icon: "flaticon-light-bulb", key: "hotels" },
  { id: 4, count: 0, suffix: "+", title: "Cities Across India", icon: "flaticon-pin", key: "cities" },
];

export const NetworkStatsSection = ({ config }) => {
  const [realStats, setRealStats] = useState(null);
  // Zeros across the board are indistinguishable from a brand-new network, so
  // a failed count says it failed rather than quietly reporting "0 Members".
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setError(null);
    api.getPublicStats()
      .then((data) => setRealStats(data))
      .catch((err) => setError(err));
  }, []);

  useEffect(() => { load(); }, [load]);

  const STATS = DEFAULT_STATS.map((stat) => {
    if (realStats && realStats[stat.key] !== undefined) {
      return { ...stat, count: realStats[stat.key] };
    }
    return stat;
  });
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
        background: "#081220",
        borderTop: "1px solid rgba(198, 169, 98, 0.15)",
        borderBottom: "1px solid rgba(198, 169, 98, 0.15)",
        padding: "clamp(48px, 6vw, 64px) 0",
        position: "relative",
      }}
    >
      <div className="container">
        {error && (
          <div style={{ maxWidth: "640px", margin: "0 auto 24px" }}>
            <ErrorNotice error={error} title="Network numbers could not be loaded" onRetry={load} compact />
          </div>
        )}

        <div className="row justify-content-center g-3 g-md-4 home-stats-grid">
          {STATS.map((item, index) => (
            <div
              key={item.id}
              className="col-6 col-md-4 col-lg-3"
              data-aos="zoom-in-up"
              data-aos-duration="800"
              data-aos-delay={index * 150}
            >
              <div
                className="counter-item-two home-stat-card text-center"
                onClick={() => handleClick(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  padding: "32px 24px",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  transform: clickedId === item.id
                    ? "scale(0.92) rotate(-2deg)"
                    : hoveredId === item.id
                    ? "translateY(-8px)"
                    : "translateY(0)",
                  borderRadius: "16px",
                  background: hoveredId === item.id
                    ? "rgba(198,169,98,0.12)"
                    : clickedId === item.id
                    ? "rgba(198,169,98,0.18)"
                    : "rgba(255,255,255,0.03)",
                  border: hoveredId === item.id
                    ? "1px solid rgba(198, 169, 98, 0.4)"
                    : "1px solid rgba(198, 169, 98, 0.12)",
                  boxShadow: hoveredId === item.id
                    ? "0 15px 35px rgba(198, 169, 98, 0.15)"
                    : "0 4px 20px rgba(0, 0, 0, 0.2)",
                  backdropFilter: "blur(10px)",
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
                      borderRadius: "16px",
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
                    fontSize: clickedId === item.id ? "52px" : "46px",
                    fontWeight: 700,
                    marginBottom: "10px",
                    transition: "all 0.3s ease",
                    textShadow: hoveredId === item.id ? "0 0 25px rgba(198,169,98,0.5)" : "none",
                  }}
                >
                  <Odometer end={item.count} />
                  {item.suffix}
                </h2>
                <p
                  style={{
                    color: hoveredId === item.id ? "#FFFFFF" : "#8DA4BE",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontWeight: 600,
                    margin: 0,
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
