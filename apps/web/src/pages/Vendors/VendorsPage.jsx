import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../layouts/Layout";
import api from "../../services/api";
import { useAosRefresh } from "../../lib/hooks/useAosRefresh";

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
  ALL: "All Partners",
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
        const data = await api.getVendors({ limit: "100" });
        // The API answers with { vendors, total, ... } and its own field names
        const list = data?.vendors || (Array.isArray(data) ? data : []);
        setVendors(
          list.map((v) => ({
            id: v.id,
            company: v.companyName || v.company || "",
            category: v.category,
            city: v.city,
            state: v.state,
            description: v.description || "",
            employees: v.employeeCount || v.employees,
            yearEstablished: v.yearEstablished,
            logo: v.logo,
          }))
        );
      } catch (err) {
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  useAosRefresh(!loading);

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
            </div>

            {/* Search + Filter in one row, matching the experts directory */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 18px",
                  border: "1px solid var(--tg-border-color, #E2E8F0)",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  background: "#FFFFFF",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#C6A962"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--tg-border-color)"; }}
              />
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                style={{
                  padding: "12px 16px",
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
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
            </div>

            <p style={{ fontSize: "14px", color: "var(--tg-gray-three)", margin: 0 }}>
              {loading ? "Loading partners..." : `Showing ${filtered.length} verified partners`}
            </p>
          </div>

          {/* Vendor Grid */}
          <div className="row">
            {filtered.map((vendor, i) => {
              const accent = CATEGORY_COLORS[vendor.category] || "var(--tg-accent-color)";
              const initial = (vendor.company || "?").trim().charAt(0).toUpperCase();
              const meta = [vendor.employees && `${vendor.employees} employees`, vendor.yearEstablished && `Est. ${vendor.yearEstablished}`]
                .filter(Boolean)
                .join("  ·  ");
              return (
                <div key={vendor.id} className="col-lg-3 col-md-4 col-sm-6 d-flex" data-aos="fade-up" data-aos-delay={i * 50} style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--tg-border-color)",
                      borderTop: `3px solid ${accent}`,
                      padding: "18px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 12px 28px rgba(10,22,40,0.09)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Logo + name */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          flexShrink: 0,
                          border: "1px solid var(--tg-border-color)",
                          background: "#F8FAFC",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        {vendor.logo ? (
                          <img
                            src={vendor.logo}
                            alt={vendor.company}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                          />
                        ) : (
                          <span style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "20px", fontWeight: 700, color: accent }}>
                            {initial}
                          </span>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h5
                          title={vendor.company}
                          style={{
                            fontFamily: "var(--tg-heading-font-family)",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "var(--tg-primary-color)",
                            margin: 0,
                            lineHeight: 1.3,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {vendor.company}
                        </h5>
                        <span style={{ fontSize: "12px", color: "var(--tg-gray-three)" }}>
                          <i className="flaticon-pin" style={{ fontSize: "11px", marginRight: "4px" }}></i>
                          {[vendor.city, vendor.state].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Category */}
                    <span
                      style={{
                        alignSelf: "flex-start",
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        padding: "3px 10px",
                        background: `${CATEGORY_COLORS[vendor.category] || "#C6A962"}15`,
                        color: accent,
                      }}
                    >
                      {CATEGORY_LABELS[vendor.category] || vendor.category}
                    </span>

                    {/* Description */}
                    {vendor.description && (
                      <p
                        style={{
                          fontSize: "13px",
                          lineHeight: 1.6,
                          color: "var(--tg-body-font-color)",
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {vendor.description}
                      </p>
                    )}

                    {/* Meta - only when filled in */}
                    {meta && (
                      <span
                        style={{
                          marginTop: "auto",
                          paddingTop: "10px",
                          borderTop: "1px solid var(--tg-border-color)",
                          fontSize: "12px",
                          color: "var(--tg-gray-three)",
                        }}
                      >
                        {meta}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
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
              to="/register/partner"
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
