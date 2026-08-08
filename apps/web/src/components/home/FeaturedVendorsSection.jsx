import React from "react";

const PARTNER_LOGOS = [
  { id: 1, src: "/logocompany/partner-1.jpeg", alt: "Partner 1" },
  { id: 2, src: "/logocompany/partner-2.jpeg", alt: "Partner 2" },
  { id: 3, src: "/logocompany/partner-3.jpeg", alt: "Partner 3" },
  { id: 4, src: "/logocompany/partner-4.jpeg", alt: "Partner 4" },
  { id: 5, src: "/logocompany/partner-5.jpeg", alt: "Partner 5" },
  { id: 6, src: "/logocompany/partner-6.jpeg", alt: "Partner 6" },
  { id: 7, src: "/logocompany/partner-7.jpeg", alt: "Partner 7" },
  { id: 8, src: "/logocompany/partner-8.jpeg", alt: "Partner 8" },
  { id: 9, src: "/logocompany/partner-9.jpeg", alt: "Partner 9" },
];

// Double the logos for seamless infinite scroll
const SCROLLING_LOGOS = [...PARTNER_LOGOS, ...PARTNER_LOGOS];

export const FeaturedVendorsSection = ({ config }) => {
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
          {SCROLLING_LOGOS.map((logo, i) => (
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
