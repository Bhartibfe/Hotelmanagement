import React, { useState, useEffect } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";
import api from "../../services/api";

const CATEGORIES = {
  ALL: "All Categories",
  TECHNOLOGY: "Technology",
  ARCHITECTURE: "Architecture",
  INTERIOR_DESIGN: "Interior Design",
  HVAC: "HVAC",
  PROCUREMENT: "Procurement",
  SECURITY: "Security",
  MARKETING: "Marketing",
  RECRUITMENT: "Recruitment",
};

const CAT_COLORS = { TECHNOLOGY: "#1A365D", ARCHITECTURE: "#553C9A", INTERIOR_DESIGN: "#B83280", HVAC: "#276749", PROCUREMENT: "#C05621", SECURITY: "#C53030", MARKETING: "#2B6CB0", RECRUITMENT: "#285E61" };

const MarketplacePage = () => {
  const [activeCat, setActiveCat] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const data = await api.getVendors();
        if (data && data.length > 0) {
          setVendors(data);
        }
      } catch {
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const filtered = vendors.filter((v) => {
    const matchCat = activeCat === "ALL" || v.category === activeCat;
    const matchSearch = !searchTerm || (v.company || "").toLowerCase().includes(searchTerm.toLowerCase()) || (v.desc || v.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Layout header={1} footer={1} breadcrumb={"Marketplace"} title={"Vendor Marketplace"}>
      <section style={{ padding: "28px 0 100px", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row" style={{ marginBottom: "40px" }}>
            <div className="col-lg-8">
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <button key={key} onClick={() => setActiveCat(key)} style={{ padding: "8px 16px", fontSize: "12px", fontWeight: 600, border: `1px solid ${activeCat === key ? "var(--tg-accent-color)" : "var(--tg-border-color)"}`, background: activeCat === key ? "var(--tg-accent-color)" : "transparent", color: activeCat === key ? "var(--tg-primary-color)" : "var(--tg-body-font-color)", cursor: "pointer", transition: "all 0.3s", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-lg-4">
              <input type="text" placeholder="Search vendors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--tg-border-color)", fontSize: "14px", outline: "none" }} />
            </div>
          </div>

          <p style={{ fontSize: "14px", color: "var(--tg-gray-three)", marginBottom: "24px" }}>
            {loading ? "Loading vendors..." : `Showing ${filtered.length} vendors`}
          </p>

          {loading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "28px", color: "#C6A962" }}></i>
              <p style={{ marginTop: "12px", color: "#64748B", fontSize: "14px" }}>Loading vendors...</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="row">
              {filtered.map((vendor, i) => (
                <div key={vendor.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={i * 80}>
                  <div style={{ border: "1px solid var(--tg-border-color)", marginBottom: "24px", transition: "all 0.3s ease", overflow: "hidden" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 16px 40px rgba(10,22,40,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div style={{ height: "8px", background: CAT_COLORS[vendor.category] || "var(--tg-accent-color)" }}></div>
                    <div style={{ padding: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                        <div style={{ width: "48px", height: "48px", background: `${CAT_COLORS[vendor.category] || "#C6A962"}15`, display: "flex", alignItems: "center", justifyContent: "center", color: CAT_COLORS[vendor.category] || "#C6A962", fontWeight: 700, fontSize: "18px", fontFamily: "var(--tg-heading-font-family)" }}>
                          {(vendor.company || "V").charAt(0)}
                        </div>
                        <div>
                          <h5 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "20px", fontWeight: 600, color: "var(--tg-primary-color)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                            {vendor.company}
                            {vendor.verified && <i className="fas fa-check-circle" style={{ color: "var(--tg-accent-color)", fontSize: "13px" }}></i>}
                          </h5>
                          <span style={{ fontSize: "12px", color: CAT_COLORS[vendor.category] || "#C6A962", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{(vendor.category || "").replace("_", " ")}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--tg-body-font-color)", marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{vendor.desc || vendor.description}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--tg-gray-three)", borderTop: "1px solid var(--tg-border-color)", paddingTop: "12px" }}>
                        <span><i className="flaticon-pin" style={{ marginRight: "4px" }}></i>{vendor.city}{vendor.state ? `, ${vendor.state}` : ""}</span>
                        {vendor.employees && <span>{vendor.employees} employees</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <i className="fas fa-store" style={{ fontSize: "48px", color: "#CBD5E1", marginBottom: "16px", display: "block" }}></i>
              <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", color: "#0A1628", marginBottom: "8px" }}>No vendors found</h5>
              <p style={{ fontSize: "14px", color: "#64748B" }}>
                {activeCat !== "ALL" ? "No vendors match this category." : "Vendors will appear here once they join the platform."}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MarketplacePage;
