import React, { useState } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";

const CATEGORIES = ["All", "Investment", "Technology", "Development", "Operations", "Sustainability", "Procurement"];

const InsightsPage = () => {
  const [activeCat, setActiveCat] = useState("All");

  return (
    <Layout header={1} footer={1} breadcrumb={"Insights"} title={"Industry Insights"}>
      <section style={{ padding: "28px 0 100px", background: "#FFFFFF" }}>
        <div className="container">
          {/* Filters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "40px" }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 600, border: `1px solid ${activeCat === cat ? "var(--tg-accent-color)" : "var(--tg-border-color)"}`, background: activeCat === cat ? "var(--tg-accent-color)" : "transparent", color: activeCat === cat ? "var(--tg-primary-color)" : "var(--tg-body-font-color)", cursor: "pointer", transition: "all 0.3s", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Empty State */}
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <i className="fas fa-lightbulb" style={{ fontSize: "48px", color: "#CBD5E1", marginBottom: "16px", display: "block" }}></i>
            <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", color: "#0A1628", marginBottom: "8px" }}>No insights yet</h5>
            <p style={{ fontSize: "14px", color: "#64748B" }}>
              Industry insights and articles will appear here once published.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default InsightsPage;
