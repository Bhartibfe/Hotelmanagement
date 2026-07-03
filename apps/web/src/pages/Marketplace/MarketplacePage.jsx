import React, { useState } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";

const MOCK_VENDORS = [
  { id: 1, company: "TechHotel Solutions", category: "TECHNOLOGY", city: "Bengaluru", state: "Karnataka", desc: "AI-powered PMS, revenue management, and guest experience platforms for Indian hotels.", employees: "51-200", year: 2018, verified: true },
  { id: 2, company: "Nair Design Studio", category: "INTERIOR_DESIGN", city: "Kochi", state: "Kerala", desc: "Luxury hospitality interior design specializing in heritage conversions and boutique properties.", employees: "11-50", year: 2015, verified: true },
  { id: 3, company: "HotelProcure India", category: "PROCUREMENT", city: "Pune", state: "Maharashtra", desc: "End-to-end procurement solutions for hospitality — furniture, linen, amenities, F&B supplies.", employees: "51-200", year: 2016, verified: true },
  { id: 4, company: "CoolAir Systems", category: "HVAC", city: "Chennai", state: "Tamil Nadu", desc: "Energy-efficient HVAC solutions designed for tropical hospitality environments.", employees: "201-500", year: 2010, verified: true },
  { id: 5, company: "Hospitality Architects Co.", category: "ARCHITECTURE", city: "Mumbai", state: "Maharashtra", desc: "Award-winning hospitality architecture — resorts, urban hotels, heritage restorations.", employees: "11-50", year: 2012, verified: true },
  { id: 6, company: "GuestFirst Digital", category: "MARKETING", city: "Delhi", state: "Delhi", desc: "Digital marketing, OTA management, and brand strategy for hospitality businesses.", employees: "11-50", year: 2019, verified: false },
  { id: 7, company: "SecureStay Solutions", category: "SECURITY", city: "Hyderabad", state: "Telangana", desc: "Integrated security systems — surveillance, access control, and safety compliance for hotels.", employees: "51-200", year: 2014, verified: true },
  { id: 8, company: "HospitalityHR", category: "RECRUITMENT", city: "Gurgaon", state: "Haryana", desc: "Specialized recruitment for hospitality — from GMs to line staff, across India.", employees: "11-50", year: 2017, verified: true },
  { id: 9, company: "CloudPMS India", category: "TECHNOLOGY", city: "Pune", state: "Maharashtra", desc: "Cloud-based property management system with integrated channel manager and booking engine.", employees: "11-50", year: 2020, verified: true },
];

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

  const filtered = MOCK_VENDORS.filter((v) => {
    const matchCat = activeCat === "ALL" || v.category === activeCat;
    const matchSearch = !searchTerm || v.company.toLowerCase().includes(searchTerm.toLowerCase()) || v.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Layout header={1} footer={1} breadcrumb={"Marketplace"} title={"Vendor Marketplace"}>
      <section style={{ padding: "60px 0 100px", background: "#FFFFFF" }}>
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

          <p style={{ fontSize: "14px", color: "var(--tg-gray-three)", marginBottom: "24px" }}>Showing {filtered.length} vendors</p>

          <div className="row">
            {filtered.map((vendor, i) => (
              <div key={vendor.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={i * 80}>
                <div style={{ border: "1px solid var(--tg-border-color)", marginBottom: "24px", transition: "all 0.3s ease", overflow: "hidden" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 16px 40px rgba(10,22,40,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ height: "8px", background: CAT_COLORS[vendor.category] || "var(--tg-accent-color)" }}></div>
                  <div style={{ padding: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                      <div style={{ width: "48px", height: "48px", background: `${CAT_COLORS[vendor.category]}15`, display: "flex", alignItems: "center", justifyContent: "center", color: CAT_COLORS[vendor.category], fontWeight: 700, fontSize: "18px", fontFamily: "var(--tg-heading-font-family)" }}>
                        {vendor.company.charAt(0)}
                      </div>
                      <div>
                        <h5 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "20px", fontWeight: 600, color: "var(--tg-primary-color)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                          {vendor.company}
                          {vendor.verified && <i className="fas fa-check-circle" style={{ color: "var(--tg-accent-color)", fontSize: "13px" }}></i>}
                        </h5>
                        <span style={{ fontSize: "12px", color: CAT_COLORS[vendor.category], fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{vendor.category.replace("_", " ")}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--tg-body-font-color)", marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{vendor.desc}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--tg-gray-three)", borderTop: "1px solid var(--tg-border-color)", paddingTop: "12px" }}>
                      <span><i className="flaticon-pin" style={{ marginRight: "4px" }}></i>{vendor.city}, {vendor.state}</span>
                      <span>{vendor.employees} employees</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MarketplacePage;
