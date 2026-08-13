import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../layouts/Layout";
import api from "../../services/api";

const CATEGORIES = [
  "ALL",
  "TECHNOLOGY",
  "ARCHITECTURE",
  "INTERIOR_DESIGN",
  "HVAC",
  "PROCUREMENT",
  "SECURITY",
  "MARKETING",
  "RECRUITMENT",
  "CONSULTING",
  "LEGAL",
  "FINANCE",
];

const CATEGORY_LABELS = {
  ALL: "All Vendors",
  TECHNOLOGY: "Technology",
  ARCHITECTURE: "Architecture",
  INTERIOR_DESIGN: "Interior Design",
  HVAC: "HVAC",
  PROCUREMENT: "Procurement",
  SECURITY: "Security",
  MARKETING: "Marketing",
  RECRUITMENT: "Recruitment",
  CONSULTING: "Consulting",
  LEGAL: "Legal",
  FINANCE: "Finance",
};

const CATEGORY_COLORS = {
  TECHNOLOGY: "#2563EB",
  ARCHITECTURE: "#7C3AED",
  INTERIOR_DESIGN: "#DB2777",
  HVAC: "#059669",
  PROCUREMENT: "#D97706",
  SECURITY: "#DC2626",
  MARKETING: "#8B5CF6",
  RECRUITMENT: "#0891B2",
  CONSULTING: "#1A365D",
  LEGAL: "#6B7280",
  FINANCE: "#276749",
};


const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const data = await api.getVendors();
        if (data && data.length > 0) {
          setVendors(data);
        }
      } catch (err) {
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const filtered = vendors.filter((v) => {
    const matchCategory = activeCategory === "ALL" || v.category === activeCategory;
    const matchSearch =
      !searchTerm ||
      (v.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <Layout breadcrumb="Partners" title="Verified Partners">
      <section style={{ padding: "60px 0 100px", background: "#FFFFFF" }}>
        <div className="container">
          {/* Search & Filters */}
          <div style={{ marginBottom: "48px" }}>
            <div className="row align-items-center" style={{ marginBottom: "24px" }}>
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
                  Marketplace
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
                  Find Trusted Service Providers
                </h3>
              </div>
              <div className="col-lg-4">
                <input
                  type="text"
                  placeholder="Search partners..."
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

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "9px 18px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: `1px solid ${activeCategory === cat ? "var(--tg-accent-color)" : "var(--tg-border-color)"}`,
                    background: activeCategory === cat ? "var(--tg-accent-color)" : "transparent",
                    color: activeCategory === cat ? "var(--tg-primary-color)" : "var(--tg-body-font-color)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            <p style={{ fontSize: "14px", color: "var(--tg-gray-three)", margin: 0 }}>
              {loading ? "Loading partners..." : `Showing ${filtered.length} verified partners`}
            </p>
          </div>

          {/* Vendor Grid */}
          <div className="row">
            {filtered.map((vendor, i) => (
              <div key={vendor.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={i * 60}>
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid var(--tg-border-color)",
                    borderLeft: `4px solid ${CATEGORY_COLORS[vendor.category] || "var(--tg-accent-color)"}`,
                    padding: "32px 28px",
                    marginBottom: "24px",
                    transition: "all 0.4s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 20px 48px rgba(10,22,40,0.1)";
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.borderColor = CATEGORY_COLORS[vendor.category] || "var(--tg-accent-color)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "var(--tg-border-color)";
                    e.currentTarget.style.borderLeftColor = CATEGORY_COLORS[vendor.category] || "var(--tg-accent-color)";
                  }}
                >
                  {/* Category Badge */}
                  <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        padding: "4px 12px",
                        background: `${CATEGORY_COLORS[vendor.category] || "#C6A962"}15`,
                        color: CATEGORY_COLORS[vendor.category] || "#C6A962",
                      }}
                    >
                      {CATEGORY_LABELS[vendor.category] || vendor.category}
                    </span>
                    {vendor.verified && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11px",
                          color: "#059669",
                          fontWeight: 600,
                        }}
                      >
                        <i className="fas fa-check-circle" style={{ fontSize: "12px" }}></i>
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Company Name */}
                  <h4
                    style={{
                      fontFamily: "var(--tg-heading-font-family)",
                      fontSize: "22px",
                      fontWeight: 600,
                      color: "var(--tg-primary-color)",
                      marginBottom: "8px",
                      lineHeight: 1.25,
                    }}
                  >
                    {vendor.company}
                  </h4>

                  {/* City */}
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--tg-gray-three)",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <i className="flaticon-pin" style={{ fontSize: "12px" }}></i>
                    {vendor.city}, {vendor.state}
                  </p>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.7,
                      color: "var(--tg-body-font-color)",
                      marginBottom: "20px",
                      minHeight: "72px",
                    }}
                  >
                    {vendor.description}
                  </p>

                  {/* Meta Info */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid var(--tg-border-color)",
                      paddingTop: "16px",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "var(--tg-gray-three)" }}>
                      <i className="far fa-building" style={{ marginRight: "6px", color: "var(--tg-accent-color)" }}></i>
                      {vendor.employees} employees
                    </span>
                    <span style={{ fontSize: "13px", color: "var(--tg-gray-three)" }}>
                      <i className="far fa-clock" style={{ marginRight: "6px", color: "var(--tg-accent-color)" }}></i>
                      Est. {vendor.yearEstablished}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div className="text-center" style={{ padding: "80px 0" }}>
              <i
                className="far fa-building"
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
                No Partners Found
              </h4>
              <p style={{ fontSize: "15px", color: "var(--tg-gray-three)" }}>
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>

          {/* Join as Vendor CTA */}
          <div
            style={{
              background: "#0A1628",
              padding: "64px 48px",
              marginTop: "60px",
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
              Are You a Hospitality Partner?
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
              Join Hotel Sircle to showcase your services to hotel owners across India.
            </p>
            <Link
              to="/register/vendor"
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
              Join as Partner
            </Link>
          </div>
      </section>
    </Layout>
  );
};

export default VendorsPage;
