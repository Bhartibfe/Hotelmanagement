import React, { useState } from "react";
import { Link } from "react-router-dom";
const EXPERT_PHOTOS = ["/expert2.jpg", "/expert.jpg", "/expert2.jpg", "/expert4.jpg", "/expert5.jpg"];

const MOCK_EXPERTS = [
  { id: 1, name: "Rajesh Sharma", title: "Hotel Management Consultant", company: "HospitalityFirst", bio: "25+ years transforming hotel operations across India. Specialist in luxury hospitality." },
  { id: 2, name: "Priya Mehta", title: "Revenue Management Expert", company: "RevMax Advisory", bio: "Data-driven revenue optimization for 200+ hotel properties across India." },
  { id: 3, name: "Arjun Kapoor", title: "F&B Operations Specialist", company: "CulinaryEdge", bio: "Revolutionizing hotel dining with farm-to-table concepts and sustainability." },
  { id: 4, name: "Sneha Reddy", title: "Hospitality Design Architect", company: "SpaceBlend Studio", bio: "Award-winning architect specializing in boutique hotels and heritage conversions." },
  { id: 5, name: "Vikram Singh", title: "Hotel Investment Advisor", company: "Capital Hospitality", bio: "Advising on hospitality investments worth ₹2,000+ Cr across the country." },
  { id: 6, name: "Ananya Desai", title: "Guest Experience Strategist", company: "GuestJoy Labs", bio: "Building personalized guest journeys through technology and service design." },
  { id: 7, name: "Karthik Nair", title: "Digital Marketing Lead", company: "HotelGrowth Digital", bio: "Scaling hotel brands through SEO, OTA optimization, and digital campaigns." },
  { id: 8, name: "Meera Joshi", title: "Sustainability Consultant", company: "GreenStay Advisors", bio: "Helping hotels achieve green certifications and sustainable operations." },
];

export const FeaturedExpertsSection = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section style={{ padding: "100px 0", background: "#FFFFFF" }}>
      <div className="container">
        {/* Section Header */}
        <div className="row align-items-end" style={{ marginBottom: "50px" }}>
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
        <div className="row">
          {MOCK_EXPERTS.map((expert, index) => {
            const isHovered = hoveredId === expert.id;
            return (
              <div
                key={expert.id}
                className="col-lg-3 col-md-6"
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay={index * 100}
                style={{ marginBottom: "30px" }}
              >
                <Link to="/experts" style={{ textDecoration: "none" }}>
                  <div
                    onMouseEnter={() => setHoveredId(expert.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      height: "420px",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    {/* Full photo background */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url(${EXPERT_PHOTOS[index % EXPERT_PHOTOS.length]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transition: "transform 0.6s ease",
                        transform: isHovered ? "scale(1.08)" : "scale(1)",
                      }}
                    />

                    {/* Bottom gradient fade — always visible, stronger on hover */}
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
                      {/* Name */}
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
                        {expert.name}
                      </h4>

                      {/* Title */}
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#C6A962",
                          fontWeight: 600,
                          marginBottom: "2px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {expert.title}
                      </p>

                      {/* Company */}
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#8DA4BE",
                          marginBottom: isHovered ? "14px" : "0",
                          transition: "margin 0.4s ease",
                        }}
                      >
                        {expert.company}
                      </p>

                      {/* Bio — slides in on hover */}
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
        </div>
      </div>
    </section>
  );
};
