import React, { useState } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";

const TYPE_LABELS = { ALL: "All Types", HOTEL_SALE: "Hotel Sale", HOTEL_ACQUISITION: "Acquisition", JOINT_VENTURE: "Joint Venture", INVESTMENT_OPPORTUNITY: "Investment" };
const TYPE_COLORS = { HOTEL_SALE: "#C6A962", HOTEL_ACQUISITION: "#C53030", JOINT_VENTURE: "#276749", INVESTMENT_OPPORTUNITY: "#1A365D" };

const InvestmentsPage = () => {
  const [activeType, setActiveType] = useState("ALL");

  return (
    <Layout header={1} footer={1} breadcrumb={"Investments"} title={"Investment Opportunities"}>
      <section style={{ padding: "60px 0 100px", background: "#FFFFFF" }}>
        <div className="container">
          {/* Filters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "40px" }}>
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <button key={key} onClick={() => setActiveType(key)} style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 600, border: `1px solid ${activeType === key ? "var(--tg-accent-color)" : "var(--tg-border-color)"}`, background: activeType === key ? "var(--tg-accent-color)" : "transparent", color: activeType === key ? "var(--tg-primary-color)" : "var(--tg-body-font-color)", cursor: "pointer", transition: "all 0.3s", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {label}
              </button>
            ))}
          </div>

          {/* Empty State */}
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <i className="fas fa-chart-line" style={{ fontSize: "48px", color: "#CBD5E1", marginBottom: "16px", display: "block" }}></i>
            <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", color: "#0A1628", marginBottom: "8px" }}>No investment opportunities yet</h5>
            <p style={{ fontSize: "14px", color: "#64748B" }}>
              Investment listings will appear here once available.
            </p>
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
