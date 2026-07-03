import React, { useState } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";

const MOCK_INVESTMENTS = [
  { id: 1, title: "50-Room Boutique Hotel in Jaipur", type: "HOTEL_SALE", city: "Jaipur", state: "Rajasthan", price: "₹12 Cr", rooms: 50, propertyType: "Boutique Hotel", desc: "Fully operational boutique hotel in the heart of Jaipur's old city. 85% average occupancy, strong brand presence. Owner relocating.", featured: true },
  { id: 2, title: "Beach Resort Development — South Goa", type: "JOINT_VENTURE", city: "South Goa", state: "Goa", price: "₹25 Cr", rooms: 80, propertyType: "Beach Resort", desc: "JV opportunity for an eco-friendly beach resort. Land acquired, approvals in place. Seeking operations partner with resort experience.", featured: true },
  { id: 3, title: "Heritage Property Conversion — Udaipur", type: "INVESTMENT_OPPORTUNITY", city: "Udaipur", state: "Rajasthan", price: "₹8 Cr", rooms: 30, propertyType: "Heritage Hotel", desc: "200-year-old haveli available for conversion into a luxury heritage hotel. Prime lakefront location. Architectural plans ready." },
  { id: 4, title: "Business Hotel — Pune IT Corridor", type: "HOTEL_SALE", city: "Pune", state: "Maharashtra", price: "₹18 Cr", rooms: 90, propertyType: "Business Hotel", desc: "Well-established business hotel near Hinjewadi IT Park. Strong corporate client base. Brand affiliation opportunity available." },
  { id: 5, title: "Hill Station Resort — Munnar", type: "JOINT_VENTURE", city: "Munnar", state: "Kerala", price: "₹15 Cr", rooms: 45, propertyType: "Wellness Resort", desc: "Wellness resort concept in Munnar. 5-acre property with tea garden views. Looking for JV partner with wellness expertise." },
  { id: 6, title: "Hotel Acquisition — Manali", type: "HOTEL_ACQUISITION", city: "Manali", state: "Himachal Pradesh", price: "₹6 Cr", rooms: 35, propertyType: "Leisure Hotel", desc: "Distressed asset opportunity. 35-room hotel on Mall Road requiring renovation. Strong location fundamentals." },
];

const TYPE_LABELS = { ALL: "All Types", HOTEL_SALE: "Hotel Sale", HOTEL_ACQUISITION: "Acquisition", JOINT_VENTURE: "Joint Venture", INVESTMENT_OPPORTUNITY: "Investment" };
const TYPE_COLORS = { HOTEL_SALE: "#C6A962", HOTEL_ACQUISITION: "#C53030", JOINT_VENTURE: "#276749", INVESTMENT_OPPORTUNITY: "#1A365D" };

const InvestmentsPage = () => {
  const [activeType, setActiveType] = useState("ALL");
  const filtered = activeType === "ALL" ? MOCK_INVESTMENTS : MOCK_INVESTMENTS.filter((i) => i.type === activeType);
  const featured = MOCK_INVESTMENTS.filter((i) => i.featured);

  return (
    <Layout header={1} footer={1} breadcrumb={"Investments"} title={"Investment Opportunities"}>
      <section style={{ padding: "60px 0 100px", background: "#FFFFFF" }}>
        <div className="container">
          {/* Featured */}
          {activeType === "ALL" && (
            <div className="row" style={{ marginBottom: "50px" }}>
              {featured.map((inv, i) => (
                <div key={inv.id} className="col-lg-6" data-aos="fade-up" data-aos-delay={i * 150}>
                  <div style={{ border: "1px solid var(--tg-border-color)", marginBottom: "30px", overflow: "hidden", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 20px 50px rgba(10,22,40,0.1)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}>
                    <div style={{ background: "var(--tg-primary-color)", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#C6A962", fontSize: "28px", fontWeight: 700, fontFamily: "var(--tg-heading-font-family)" }}>{inv.price}</span>
                      <span style={{ background: `${TYPE_COLORS[inv.type]}`, color: "#FFFFFF", padding: "4px 12px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{inv.type.replace(/_/g, " ")}</span>
                    </div>
                    <div style={{ padding: "24px" }}>
                      <h3 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "24px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "10px", lineHeight: 1.25 }}>{inv.title}</h3>
                      <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--tg-body-font-color)", marginBottom: "16px" }}>{inv.desc}</p>
                      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "13px", color: "var(--tg-gray-three)", borderTop: "1px solid var(--tg-border-color)", paddingTop: "12px" }}>
                        <span><i className="flaticon-pin" style={{ marginRight: "4px" }}></i>{inv.city}, {inv.state}</span>
                        <span>{inv.rooms} Rooms</span>
                        <span>{inv.propertyType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Filters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "40px" }}>
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <button key={key} onClick={() => setActiveType(key)} style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 600, border: `1px solid ${activeType === key ? "var(--tg-accent-color)" : "var(--tg-border-color)"}`, background: activeType === key ? "var(--tg-accent-color)" : "transparent", color: activeType === key ? "var(--tg-primary-color)" : "var(--tg-body-font-color)", cursor: "pointer", transition: "all 0.3s", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="row">
            {filtered.filter((inv) => activeType !== "ALL" || !inv.featured).map((inv, i) => (
              <div key={inv.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={i * 100}>
                <div style={{ border: "1px solid var(--tg-border-color)", marginBottom: "24px", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 30px rgba(10,22,40,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ height: "6px", background: TYPE_COLORS[inv.type] }}></div>
                  <div style={{ padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: TYPE_COLORS[inv.type] }}>{inv.type.replace(/_/g, " ")}</span>
                      <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--tg-accent-color)", fontFamily: "var(--tg-heading-font-family)" }}>{inv.price}</span>
                    </div>
                    <h4 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "20px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "8px", lineHeight: 1.25 }}>{inv.title}</h4>
                    <p style={{ fontSize: "13px", lineHeight: 1.7, color: "var(--tg-body-font-color)", marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{inv.desc}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--tg-gray-three)", borderTop: "1px solid var(--tg-border-color)", paddingTop: "12px" }}>
                      <span><i className="flaticon-pin" style={{ marginRight: "4px" }}></i>{inv.city}</span>
                      <span>{inv.rooms} Rooms · {inv.propertyType}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center" style={{ marginTop: "40px", padding: "40px", background: "var(--tg-section-background)" }}>
            <h4 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "24px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "12px" }}>Have a Property to List?</h4>
            <p style={{ color: "var(--tg-body-font-color)", marginBottom: "20px" }}>Hotel owners can post sale, acquisition, or JV opportunities to our verified investor network.</p>
            <Link to="/register" className="btn" style={{ padding: "14px 32px", fontSize: "12px" }}>List Your Property</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default InvestmentsPage;
