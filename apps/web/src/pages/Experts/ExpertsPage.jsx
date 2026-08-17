import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../layouts/Layout";
import api from "../../services/api";

const DEFAULT_EXPERTISE_OPTIONS = [
  "General Management",
  "Hotel Owners / Ownership",
  "Asset Management",
  "Operations",
  "Sales",
  "Marketing",
  "Business Development",
  "Revenue Management",
  "Distribution",
  "Digital Marketing",
  "Brand Marketing & Communications",
  "Finance & Accounts",
  "Human Resources (People & Culture)",
  "Learning & Development",
  "Procurement & Supply Chain",
  "Information Technology",
  "Information Security (Cybersecurity)",
  "Artificial Intelligence & Emerging Technologies",
  "Engineering & Maintenance",
  "Projects & Development",
  "Design & Architecture",
  "Housekeeping",
  "Front Office",
  "Reservations",
  "Food & Beverage",
  "Culinary",
  "Banquets & Events",
  "Spa & Wellness",
  "Recreation",
  "Security & Loss Prevention",
  "Quality Assurance",
  "Guest Experience",
  "Customer Relations",
  "Legal & Compliance",
  "ESG & Sustainability",
  "Franchise Development",
  "Development & Feasibility",
  "Consulting & Advisory",
  "Hospitality Technology",
  "Travel & Tourism",
  "Academia & Training",
  "Purchasing",
  "Public Relations (PR)",
];


const ExpertsPage = () => {
  const [experts, setExperts] = useState([]);
  const [expertiseOptions, setExpertiseOptions] = useState(DEFAULT_EXPERTISE_OPTIONS);
  const [activeExpertise, setActiveExpertise] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [showAllFilters, setShowAllFilters] = useState(false);

  const VISIBLE_FILTER_COUNT = 8;

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      try {
        const data = await api.getExperts({ limit: 100 });
        if (data?.experts?.length > 0) {
          setExperts(data.experts);
        }
      } catch (err) {
        setExperts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();

    api.getHomepageConfig().then((data) => {
      if (data?.expertiseOptions?.length > 0) {
        setExpertiseOptions(data.expertiseOptions);
      }
    }).catch(() => {});
  }, []);

  // Helper to get fields from both API and mock format
  const getName = (e) => e.user ? `${e.user.firstName} ${e.user.lastName}` : (e.name || "");
  const getTitle = (e) => e.user?.title || e.title || "";
  const getCompany = (e) => e.user?.organizationName || e.company || "";
  const getCity = (e) => e.user?.city || e.city || "";
  const getAvatar = (e) => e.user?.avatar || e.avatar || "";

  const filtered = experts.filter((e) => {
    const matchExpertise =
      activeExpertise === "ALL" || (e.expertise && e.expertise.includes(activeExpertise));
    const matchSearch =
      !searchTerm ||
      getName(e).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCompany(e).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCity(e).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.expertise && e.expertise.some((ex) => ex.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchExpertise && matchSearch;
  });

  const visibleFilters = showAllFilters ? expertiseOptions : expertiseOptions.slice(0, VISIBLE_FILTER_COUNT);
  const hasMoreFilters = expertiseOptions.length > VISIBLE_FILTER_COUNT;

  return (
    <Layout breadcrumb="Experts" title="Industry Experts">
      <section style={{ padding: "48px 0 72px", background: "#FFFFFF" }}>
        <div className="container">
          {/* Header & Search */}
          <div style={{ marginBottom: "32px" }}>
            <div className="row align-items-center" style={{ marginBottom: "16px" }}>
              <div className="col-lg-8">
                <span
                  style={{
                    color: "var(--tg-accent-color)",
                    letterSpacing: "3px",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Expert Network
                </span>
                <h3
                  style={{
                    fontFamily: "var(--tg-heading-font-family)",
                    fontSize: "28px",
                    fontWeight: 600,
                    color: "var(--tg-primary-color)",
                    margin: 0,
                  }}
                >
                  Connect with Industry Leaders
                </h3>
              </div>
              <div className="col-lg-4">
                <input
                  type="text"
                  placeholder="Search experts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    border: "1px solid var(--tg-border-color)",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                    background: "#FFFFFF",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#C6A962";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--tg-border-color)";
                  }}
                />
              </div>
            </div>

            {/* Expertise Filter Dropdown */}
            <div style={{ marginBottom: "16px" }}>
              <select
                value={activeExpertise}
                onChange={(e) => setActiveExpertise(e.target.value)}
                style={{
                  padding: "10px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "1px solid var(--tg-border-color, #E2E8F0)",
                  background: "#FFFFFF",
                  color: "var(--tg-primary-color, #0A1628)",
                  cursor: "pointer",
                  outline: "none",
                  minWidth: "220px",
                  appearance: "auto",
                }}
              >
                <option value="ALL">All Experts</option>
                {expertiseOptions.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            <p style={{ fontSize: "14px", color: "var(--tg-gray-three)", margin: 0 }}>
              {loading ? "Loading experts..." : `Showing ${filtered.length} industry experts`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "28px", color: "#C6A962" }}></i>
              <p style={{ marginTop: "16px", color: "var(--tg-gray-three)", fontSize: "14px" }}>Loading experts...</p>
            </div>
          )}

          {/* Experts Grid */}
          {!loading && <div className="row">
            {filtered.map((expert, index) => {
              const isHovered = hoveredId === expert.id;
              const avatar = getAvatar(expert);
              const hasAvatar = !!avatar;
              const name = getName(expert);
              const initials = name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
              return (
                <div
                  key={expert.id}
                  className="col-lg-3 col-md-6"
                  data-aos="fade-up"
                  data-aos-duration="800"
                  data-aos-delay={index * 50}
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
                      {/* Photo or initials fallback */}
                      {hasAvatar ? (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `url(${avatar})`,
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
                          <span style={{ fontSize: "64px", fontWeight: 700, color: "#C6A962", fontFamily: "var(--tg-heading-font-family)", letterSpacing: "4px", opacity: 0.6 }}>
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
                          {name}
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
                          {getTitle(expert)}
                        </p>

                        <p
                          style={{
                            fontSize: "12px",
                            color: "#8DA4BE",
                            marginBottom: isHovered ? "14px" : "0",
                            transition: "margin 0.4s ease",
                          }}
                        >
                          {getCompany(expert)}
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

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div className="text-center" style={{ padding: "80px 0" }}>
              <i
                className="far fa-user"
                style={{
                  fontSize: "48px",
                  color: "var(--tg-border-color)",
                  marginBottom: "20px",
                  display: "block",
                }}
              ></i>
              <h4
                style={{
                  fontFamily: "var(--tg-heading-font-family)",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "var(--tg-primary-color)",
                  marginBottom: "8px",
                }}
              >
                No Experts Found
              </h4>
              <p style={{ fontSize: "15px", color: "var(--tg-gray-three)" }}>
                Try adjusting your search or expertise filter.
              </p>
            </div>
          )}
        </div>

          {/* Join as Expert CTA */}
          <div
            style={{
              background: "#0A1628",
              padding: "48px 36px",
              marginTop: "40px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, transparent, #C6A962, transparent)",
              }}
            ></div>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "32px",
                fontWeight: 600,
                color: "#FFFFFF",
                marginBottom: "12px",
              }}
            >
              Are You a Hospitality Expert?
            </h3>
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.7)",
                maxWidth: "500px",
                margin: "0 auto 32px",
                lineHeight: 1.6,
              }}
            >
              Share your expertise, build your profile, and connect with industry leaders.
            </p>
            <Link
              to="/register/expert"
              style={{
                display: "inline-block",
                padding: "14px 40px",
                background: "#C6A962",
                color: "#0A1628",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.3s ease",
                border: "2px solid #C6A962",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#C6A962";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#C6A962";
                e.currentTarget.style.color = "#0A1628";
              }}
            >
              Join as Expert
            </Link>
          </div>
      </section>
    </Layout>
  );
};

export default ExpertsPage;
