import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const HeroSection = ({ config }) => {
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
          "radial-gradient(circle at 50% 30%, rgba(198, 169, 98, 0.12) 0%, transparent 60%), linear-gradient(135deg, #0A1628 0%, #152232 50%, #0A1628 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "clamp(80px, 10vw, 120px)",
        paddingBottom: "clamp(40px, 5vw, 60px)",
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
            background: `rgba(198,169,98,${0.15 + i * 0.04})`,
            boxShadow: "0 0 10px rgba(198,169,98,0.5)",
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
                  background: "rgba(198, 169, 98, 0.1)",
                  border: "1px solid rgba(198, 169, 98, 0.3)",
                  padding: "6px 18px",
                  borderRadius: "30px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                  letterSpacing: "3px",
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontFamily: "var(--tg-body-font-family)",
                  display: "inline-block",
                  marginBottom: "22px",
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateX(0)" : "translateX(-30px)",
                  transition: "all 0.8s ease 0.2s",
                }}
              >
                {config?.heroTitle || "India's Premier Hotels Owner Platforms"}
              </span>
              <h1
                style={{
                  color: "#FFFFFF",
                  fontSize: "clamp(30px, 4.5vw, 58px)",
                  fontWeight: 600,
                  lineHeight: 1.1,
                  fontFamily: "var(--tg-heading-font-family)",
                  marginBottom: "22px",
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
                    background: "linear-gradient(135deg, #F3E5AB 0%, #C6A962 50%, #9B7E38 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
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
                <br />
                <span
                  style={{
                    fontSize: "clamp(16px, 2vw, 22px)",
                    color: "#9DB3C8",
                    fontWeight: 400,
                    display: "inline-block",
                    marginTop: "12px",
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "translateX(0)" : "translateX(-20px)",
                    transition: "all 0.8s ease 1.2s",
                  }}
                >
                  Built by hotel owners, for hotel owners.
                </span>
              </h1>
              <p
                style={{
                  color: "#9DB3C8",
                  fontSize: "16px",
                  lineHeight: 1.7,
                  maxWidth: "560px",
                  margin: "0 0 32px",
                  fontWeight: 400,
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateX(0)" : "translateX(-30px)",
                  transition: "all 0.8s ease 1.2s",
                }}
              >
                {config?.heroSubtitle || "Built by hotel owners, for hotel owners."}
              </p>
              <div
                className="banner-btn"
                style={{
                  display: "flex",
                  gap: "14px",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateX(0)" : "translateX(-30px)",
                  transition: "all 0.8s ease 1.5s",
                }}
              >
                <Link
                  to={config?.heroCtaLink || "/register"}
                  className="btn cta-btn-gold"
                  style={{
                    background: "linear-gradient(135deg, #D4B66E 0%, #C6A962 100%)",
                    color: "#0A1628",
                    padding: "14px 34px",
                    fontSize: "12px",
                    letterSpacing: "2px",
                    fontWeight: 700,
                    borderRadius: "30px",
                    border: "2px solid #C6A962",
                    boxShadow: "0 6px 20px rgba(198,169,98,0.25)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#0A1628";
                    e.currentTarget.style.color = "#C6A962";
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(198,169,98,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #D4B66E 0%, #C6A962 100%)";
                    e.currentTarget.style.color = "#0A1628";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(198,169,98,0.25)";
                  }}
                >
                  {config?.heroCtaText || "Apply for Membership"}
                </Link>
                <Link
                  to="/about"
                  className="btn cta-btn-gold"
                  style={{
                    border: "2px solid rgba(198, 169, 98, 0.4)",
                    color: "#C6A962",
                    padding: "14px 34px",
                    fontSize: "12px",
                    letterSpacing: "2px",
                    fontWeight: 600,
                    borderRadius: "30px",
                    background: "rgba(198, 169, 98, 0.05)",
                    backdropFilter: "blur(5px)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.borderColor = "#C6A962";
                    e.currentTarget.style.background = "rgba(198,169,98,0.15)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(198,169,98,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "rgba(198,169,98,0.4)";
                    e.currentTarget.style.background = "rgba(198, 169, 98, 0.05)";
                    e.currentTarget.style.boxShadow = "none";
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
          bottom: "28px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          opacity: loaded ? 0.6 : 0,
          transition: "opacity 1s ease 2s",
          animation: "bounceDown 2s ease-in-out infinite",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            color: "#C6A962",
            fontSize: "10px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "24px",
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
        .cta-btn-gold::before {
          display: none !important;
        }
        .cta-btn-gold:hover {
          color: inherit !important;
        }
      `}</style>
    </section>
  );
};
