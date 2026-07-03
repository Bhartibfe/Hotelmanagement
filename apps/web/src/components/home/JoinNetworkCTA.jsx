import React, { useState } from "react";
import { Link } from "react-router-dom";

export const JoinNetworkCTA = () => {
  const [hoveredBtn, setHoveredBtn] = useState(null);

  return (
    <section
      style={{
        padding: "100px 0",
        background: "linear-gradient(135deg, #0A1628 0%, #1C2A3A 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background orbs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(198,169,98,0.06), transparent 70%)",
          animation: "orbFloat 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(198,169,98,0.04), transparent 70%)",
          animation: "orbFloat 6s ease-in-out infinite reverse",
          pointerEvents: "none",
        }}
      />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <span
              data-aos="fade-down"
              data-aos-duration="800"
              style={{
                color: "#C6A962",
                letterSpacing: "3px",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                display: "block",
                marginBottom: "20px",
              }}
            >
              Become a Member
            </span>
            <h2
              data-aos="zoom-in"
              data-aos-duration="1000"
              data-aos-delay="200"
              style={{
                color: "#FFFFFF",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontFamily: "var(--tg-heading-font-family)",
                fontWeight: 600,
                lineHeight: 1.15,
                marginBottom: "24px",
              }}
            >
              Join India's Premier
              <br />
              <span style={{ color: "#C6A962" }}>Hospitality Leadership Platform</span>
            </h2>
            <p
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="400"
              style={{
                color: "#8DA4BE",
                fontSize: "17px",
                lineHeight: 1.8,
                maxWidth: "520px",
                margin: "0 auto 40px",
              }}
            >
              Apply for membership and connect with verified hotel owners,
              vendors, and industry experts. Our curated application process
              ensures a trusted community of hospitality professionals.
            </p>
            <div
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="600"
              style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
            >
              <Link
                to="/register"
                className="btn"
                onMouseEnter={() => setHoveredBtn("apply")}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  background: "#C6A962",
                  color: "#0A1628",
                  border: "2px solid #C6A962",
                  padding: "18px 40px",
                  fontSize: "13px",
                  letterSpacing: "2px",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  transform: hoveredBtn === "apply" ? "translateY(-4px) scale(1.05)" : "translateY(0) scale(1)",
                  boxShadow: hoveredBtn === "apply" ? "0 15px 40px rgba(198,169,98,0.3)" : "none",
                }}
              >
                Apply for Membership
              </Link>
              <Link
                to="/contact"
                className="btn transparent-btn"
                onMouseEnter={() => setHoveredBtn("contact")}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  border: "2px solid rgba(198,169,98,0.4)",
                  color: "#C6A962",
                  padding: "18px 40px",
                  fontSize: "13px",
                  letterSpacing: "2px",
                  background: hoveredBtn === "contact" ? "rgba(198,169,98,0.1)" : "transparent",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  transform: hoveredBtn === "contact" ? "translateY(-4px) scale(1.05)" : "translateY(0) scale(1)",
                  borderColor: hoveredBtn === "contact" ? "#C6A962" : "rgba(198,169,98,0.4)",
                }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.1); }
          66% { transform: translate(-15px, 10px) scale(0.95); }
        }
      `}</style>
    </section>
  );
};
