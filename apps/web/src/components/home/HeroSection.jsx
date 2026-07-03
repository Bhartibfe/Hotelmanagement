import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="banner-area-two"
      style={{
        background:
          "linear-gradient(135deg, #0A1628 0%, #1C2A3A 50%, #0A1628 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        paddingTop: "160px",
        paddingBottom: "80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative gold line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background:
            "linear-gradient(90deg, transparent, #C6A962, transparent)",
          animation: "shimmerLine 3s ease-in-out infinite",
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${4 + i * 2}px`,
            height: `${4 + i * 2}px`,
            background: `rgba(198,169,98,${0.1 + i * 0.03})`,
            borderRadius: "50%",
            top: `${15 + i * 14}%`,
            left: `${10 + i * 15}%`,
            animation: `floatParticle ${4 + i}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.5}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8 col-md-10">
            <div className="banner-content-two">
              <span
                className="sub-title"
                style={{
                  color: "#C6A962",
                  letterSpacing: "4px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontFamily: "var(--tg-body-font-family)",
                  display: "block",
                  marginBottom: "24px",
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateX(0)" : "translateX(-30px)",
                  transition: "all 0.8s ease 0.2s",
                }}
              >
                India's Premier Hospitality Leadership Platform
              </span>
              <h1
                style={{
                  color: "#FFFFFF",
                  fontSize: "clamp(32px, 5vw, 64px)",
                  fontWeight: 600,
                  lineHeight: 1.1,
                  fontFamily: "var(--tg-heading-font-family)",
                  marginBottom: "28px",
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateX(0)" : "translateX(-40px)",
                  transition: "all 1s ease 0.5s",
                }}
              >
                Hospitality Doesn't Need
                <br />
                Another Association.
                <br />
                <span
                  style={{
                    color: "#C6A962",
                    display: "inline-block",
                    opacity: loaded ? 1 : 0,
                    transform: loaded
                      ? "translateX(0) scale(1)"
                      : "translateX(-20px) scale(0.95)",
                    transition: "all 1s ease 0.9s",
                  }}
                >
                  It Needs A Trusted Network.
                </span>
              </h1>
              <p
                style={{
                  color: "#8DA4BE",
                  fontSize: "18px",
                  lineHeight: 1.8,
                  maxWidth: "600px",
                  margin: "0 0 40px",
                  fontWeight: 400,
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateX(0)" : "translateX(-30px)",
                  transition: "all 0.8s ease 1.2s",
                }}
              >
                Connecting Hotel Owners, Vendors, Industry Experts and
                Professionals across India.
              </p>
              <div
                className="banner-btn"
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateX(0)" : "translateX(-30px)",
                  transition: "all 0.8s ease 1.5s",
                }}
              >
                <Link
                  to="/register"
                  className="btn"
                  style={{
                    background: "#C6A962",
                    color: "#0A1628",
                    padding: "18px 40px",
                    fontSize: "13px",
                    letterSpacing: "2px",
                    border: "2px solid #C6A962",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-3px) scale(1.03)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(198,169,98,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Apply for Membership
                </Link>
                <Link
                  to="/about"
                  className="btn transparent-btn"
                  style={{
                    border: "2px solid rgba(198, 169, 98, 0.4)",
                    color: "#C6A962",
                    padding: "18px 40px",
                    fontSize: "13px",
                    letterSpacing: "2px",
                    background: "transparent",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-3px) scale(1.03)";
                    e.currentTarget.style.borderColor = "#C6A962";
                    e.currentTarget.style.background = "rgba(198,169,98,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.borderColor = "rgba(198,169,98,0.4)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Explore Network
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(198,169,98,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(198,169,98,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          pointerEvents: "none",
          animation: "gridPulse 8s ease-in-out infinite",
        }}
      />

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          opacity: loaded ? 0.6 : 0,
          transition: "opacity 1s ease 2s",
          animation: "bounceDown 2s ease-in-out infinite",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            color: "#8DA4BE",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "30px",
            background: "linear-gradient(to bottom, #C6A962, transparent)",
          }}
        />
      </div>

      <style>{`
        @keyframes shimmerLine {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes floatParticle {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(-30px) translateX(15px); }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounceDown {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }
      `}</style>
    </section>
  );
};
