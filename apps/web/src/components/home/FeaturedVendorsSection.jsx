import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAosRefresh } from "../../lib/hooks/useAosRefresh";
import { SectionSkeleton, SkeletonCards } from "../common/Skeleton";

export const FeaturedVendorsSection = ({ config }) => {
  const [logos, setLogos] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await api.getFeaturedVendors();
        const vendors = data?.vendors || data || [];
        const vendorLogos = vendors
          .filter((v) => v.logo)
          .map((v) => ({ id: v.id, src: v.logo, alt: v.companyName || "Partner" }));
        if (vendorLogos.length > 0) {
          setLogos(vendorLogos);
        }
      } catch {
        // no vendors available
      } finally {
        setLoaded(true);
      }
    };
    fetchVendors();
  }, []);

  useAosRefresh(loaded);

  if (!loaded) {
    return (
      <SectionSkeleton padding="clamp(40px, 5vw, 60px) 0" background="#FFFFFF" centered>
        <SkeletonCards count={4} columnClass="col-6 col-md-3" height="50px" />
      </SectionSkeleton>
    );
  }

  if (logos.length === 0) return null;

  // Double the logos for seamless infinite scroll
  const scrollingLogos = [...logos, ...logos];

  return (
    <section style={{ padding: "clamp(40px, 5vw, 60px) 0", background: "#FFFFFF", overflow: "hidden" }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: "36px" }}>
          <span
            data-aos="fade-up"
            data-aos-duration="800"
            style={{
              color: "#C6A962",
              letterSpacing: "3px",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              display: "block",
              marginBottom: "16px",
              fontFamily: "var(--tg-body-font-family)",
            }}
          >
            Trusted By Industry Leaders
          </span>
          <h2
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="100"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontFamily: "var(--tg-heading-font-family)",
              fontWeight: 600,
              color: "#0A1628",
              marginBottom: "0",
            }}
          >
            Our Partners
          </h2>
        </div>
      </div>

      {/* Infinite scrolling logo strip */}
      <div
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "60px",
            width: "max-content",
            animation: "scrollLogos 30s linear infinite",
          }}
        >
          {scrollingLogos.map((logo, i) => (
            <div
              key={`${logo.id}-${i}`}
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 20px",
              }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                style={{
                  height: "50px",
                  maxWidth: "140px",
                  objectFit: "contain",
                  opacity: 0.9,
                  transition: "all 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollLogos {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};
