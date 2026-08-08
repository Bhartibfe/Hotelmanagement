import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const EXPERT_PHOTOS = ["/expert2.jpg", "/expert.jpg", "/expert2.jpg", "/expert4.jpg", "/expert5.jpg"];

const MOCK_EXPERTS = [
  { id: 1, user: { firstName: "Rajesh", lastName: "Sharma", title: "Hotel Management Consultant", organizationName: "HospitalityFirst" }, bio: "25+ years transforming hotel operations across India. Specialist in luxury hospitality." },
  { id: 2, user: { firstName: "Priya", lastName: "Mehta", title: "Revenue Management Expert", organizationName: "RevMax Advisory" }, bio: "Data-driven revenue optimization for 200+ hotel properties across India." },
  { id: 3, user: { firstName: "Arjun", lastName: "Kapoor", title: "F&B Operations Specialist", organizationName: "CulinaryEdge" }, bio: "Revolutionizing hotel dining with farm-to-table concepts and sustainability." },
  { id: 4, user: { firstName: "Sneha", lastName: "Reddy", title: "Hospitality Design Architect", organizationName: "SpaceBlend Studio" }, bio: "Award-winning architect specializing in boutique hotels and heritage conversions." },
];

export const FeaturedExpertsSection = ({ config }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [experts, setExperts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.getFeaturedExperts?.()
      .then((data) => {
        if (data && data.length > 0) setExperts(data);
        else setExperts(MOCK_EXPERTS);
      })
      .catch(() => setExperts(MOCK_EXPERTS))
      .finally(() => setLoaded(true));
  }, []);

  return (
    <section style={{ padding: "clamp(48px, 6vw, 72px) 0", background: "#FFFFFF" }}>
      <div className="container">
        {/* Section Header */}
        <div className="row align-items-end" style={{ marginBottom: "36px" }}>
          <div className="col-lg-8">
            <span
              data-aos="fade-right"
              data-aos-duration="800"
              style={{
                color: "#C6A962",
                letterSpacing: "3px",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                display: "block",
                marginBottom: "16px",
              }}
            >
              Hospitality Leaders
            </span>
            <h2
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="100"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontFamily: "var(--tg-heading-font-family)",
                fontWeight: 600,
                color: "#0A1628",
              }}
            >
              Industry Experts
            </h2>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link
              to="/experts"
              className="btn btn-two"
              data-aos="fade-left"
              data-aos-duration="800"
              style={{ padding: "14px 28px", fontSize: "12px" }}
            >
              View All Experts
            </Link>
          </div>
        </div>

        {/* Expert Cards */}
        {loaded && <div className="row">
          {experts.slice(0, config?.featuredExpertsCount || 4).map((expert, index) => {
            const isHovered = hoveredId === expert.id;
            const photo = expert.user?.avatar || EXPERT_PHOTOS[index % EXPERT_PHOTOS.length];
            const hasPhoto = !!expert.user?.avatar;
            const initials = ((expert.user?.firstName?.[0] || "") + (expert.user?.lastName?.[0] || "")).toUpperCase();
            return (
              <div
                key={expert.id}
                className="col-lg-3 col-md-6"
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay={index * 100}
                style={{ marginBottom: "20px" }}
              >
                <Link to={`/experts/${expert.id}`} style={{ textDecoration: "none" }}>
                  <div
                    onMouseEnter={() => setHoveredId(expert.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      height: "clamp(280px, 40vw, 380px)",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    {/* Full photo background or initials fallback */}
                    {hasPhoto ? (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `url(${photo})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          transition: "transform 0.6s ease",
                          transform: isHovered ? "scale(1.08)" : "scale(1)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(135deg, #0A1628 0%, #1E293B 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "64px",
                            fontWeight: 700,
                            color: "#C6A962",
                            fontFamily: "var(--tg-heading-font-family)",
                            letterSpacing: "4px",
                            opacity: 0.6,
                          }}
                        >
                          {initials}
                        </span>
                      </div>
                    )}

                    {/* Bottom gradient fade */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: isHovered
                          ? "linear-gradient(to top, #0A1628 45%, rgba(10,22,40,0.3) 70%, transparent 100%)"
                          : "linear-gradient(to top, #0A1628 15%, rgba(10,22,40,0.5) 40%, transparent 65%)",
                        transition: "all 0.5s ease",
                      }}
                    />

                    {/* Gold accent line at bottom */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: isHovered ? "100%" : "0%",
                        height: "3px",
                        background: "#C6A962",
                        transition: "width 0.4s ease",
                      }}
                    />

                    {/* "View Profile" indicator on hover */}
                    <div
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        padding: "6px 14px",
                        background: "rgba(198, 169, 98, 0.95)",
                        color: "#0A1628",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? "translateY(0)" : "translateY(-8px)",
                        transition: "all 0.3s ease 0.1s",
                      }}
                    >
                      View Profile
                    </div>

                    {/* Content overlay */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "28px 24px",
                        transform: isHovered ? "translateY(0)" : "translateY(20px)",
                        transition: "transform 0.4s ease",
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: "var(--tg-heading-font-family)",
                          fontSize: "24px",
                          fontWeight: 600,
                          color: "#FFFFFF",
                          marginBottom: "4px",
                          lineHeight: 1.2,
                        }}
                      >
                        {expert.user?.firstName} {expert.user?.lastName}
                      </h4>

                      <p
                        style={{
                          fontSize: "13px",
                          color: "#C6A962",
                          fontWeight: 600,
                          marginBottom: "2px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {expert.user?.title}
                      </p>

                      <p
                        style={{
                          fontSize: "12px",
                          color: "#8DA4BE",
                          marginBottom: isHovered ? "14px" : "0",
                          transition: "margin 0.4s ease",
                        }}
                      >
                        {expert.user?.organizationName}
                      </p>

                      <p
                        style={{
                          fontSize: "13px",
                          lineHeight: 1.6,
                          color: "rgba(255,255,255,0.8)",
                          margin: 0,
                          maxHeight: isHovered ? "60px" : "0",
                          opacity: isHovered ? 1 : 0,
                          overflow: "hidden",
                          transition: "all 0.4s ease 0.1s",
                        }}
                      >
                        {expert.bio}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>}
      </div>
    </section>
  );
};
