import React, { useState } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";

const MOCK_INSIGHTS = [
  { id: 1, title: "The State of Hotel Investments in India: 2026 Outlook", category: "Investment", author: "Editorial Team", date: "Jun 5, 2026", excerpt: "India's hospitality sector is poised for record investment levels in 2026, driven by domestic tourism growth, branded hotel demand, and increasing institutional investor interest.", featured: true },
  { id: 2, title: "How AI Is Transforming Revenue Management for Indian Hotels", category: "Technology", author: "Ankit Patel", date: "Jun 1, 2026", excerpt: "From dynamic pricing to demand forecasting, artificial intelligence is no longer a luxury — it's becoming the standard for competitive revenue management.", featured: true },
  { id: 3, title: "Heritage Hotel Conversions: Preserving History, Creating Value", category: "Development", author: "Sunita Reddy", date: "May 28, 2026", excerpt: "Converting historic properties into luxury hotels is a growing trend in Rajasthan, Kerala, and Maharashtra. Here's what owners need to know." },
  { id: 4, title: "The Hospitality Talent Crisis: Solutions for 2026", category: "Operations", author: "Deepa Nair", date: "May 22, 2026", excerpt: "Finding and retaining skilled hospitality professionals is the industry's biggest challenge. Leading hotel groups share their approaches." },
  { id: 5, title: "Sustainable Tourism: From Buzzword to Business Strategy", category: "Sustainability", author: "Meera Joshi", date: "May 15, 2026", excerpt: "How eco-conscious practices are becoming a competitive advantage for Indian hotels, from energy efficiency to community engagement." },
  { id: 6, title: "Procurement Optimization: Reducing Costs Without Compromising Quality", category: "Procurement", author: "Rahul Verma", date: "May 10, 2026", excerpt: "Strategic procurement can save hotels 15-20% annually. Industry experts share frameworks for smarter vendor management." },
];

const CATEGORIES = ["All", "Investment", "Technology", "Development", "Operations", "Sustainability", "Procurement"];

const InsightsPage = () => {
  const [activeCat, setActiveCat] = useState("All");
  const filtered = activeCat === "All" ? MOCK_INSIGHTS : MOCK_INSIGHTS.filter((i) => i.category === activeCat);
  const featured = MOCK_INSIGHTS.filter((i) => i.featured);

  return (
    <Layout header={1} footer={1} breadcrumb={"Insights"} title={"Industry Insights"}>
      <section style={{ padding: "60px 0 100px", background: "#FFFFFF" }}>
        <div className="container">
          {/* Featured */}
          {activeCat === "All" && (
            <div className="row" style={{ marginBottom: "60px" }}>
              {featured.map((article, i) => (
                <div key={article.id} className="col-lg-6" data-aos="fade-up" data-aos-delay={i * 150}>
                  <div style={{ borderTop: "3px solid var(--tg-accent-color)", padding: "32px", background: "var(--tg-section-background)", marginBottom: "30px", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 16px 40px rgba(10,22,40,0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "var(--tg-accent-color)", display: "block", marginBottom: "12px" }}>{article.category}</span>
                    <h3 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "26px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "12px", lineHeight: 1.25 }}>
                      <Link to={`/insights/${article.id}`} style={{ color: "inherit", textDecoration: "none" }}>{article.title}</Link>
                    </h3>
                    <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--tg-body-font-color)", marginBottom: "16px" }}>{article.excerpt}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--tg-gray-three)" }}>
                      <span>{article.author}</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Filters */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "40px" }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 600, border: `1px solid ${activeCat === cat ? "var(--tg-accent-color)" : "var(--tg-border-color)"}`, background: activeCat === cat ? "var(--tg-accent-color)" : "transparent", color: activeCat === cat ? "var(--tg-primary-color)" : "var(--tg-body-font-color)", cursor: "pointer", transition: "all 0.3s", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="row">
            {filtered.filter((a) => activeCat !== "All" || !a.featured).map((article, i) => (
              <div key={article.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={i * 100}>
                <div style={{ border: "1px solid var(--tg-border-color)", padding: "28px", marginBottom: "24px", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--tg-accent-color)"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--tg-border-color)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "var(--tg-accent-color)", display: "block", marginBottom: "12px" }}>{article.category}</span>
                  <h4 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "22px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "10px", lineHeight: 1.25 }}>
                    <Link to={`/insights/${article.id}`} style={{ color: "inherit", textDecoration: "none" }}>{article.title}</Link>
                  </h4>
                  <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--tg-body-font-color)", marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{article.excerpt}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--tg-gray-three)", borderTop: "1px solid var(--tg-border-color)", paddingTop: "12px" }}>
                    <span>{article.author}</span>
                    <span>{article.date}</span>
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

export default InsightsPage;
