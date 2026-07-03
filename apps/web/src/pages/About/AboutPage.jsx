import React from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";
import { Odometer } from "../../components/Odometer/Odometer";
import { BrandTwo } from "../../components/Brand/BrandTwo";

const VALUES = [
  { id: 1, icon: "flaticon-target", title: "Verified Network", desc: "Every member is vetted. Every connection is meaningful. No spam, no noise — only verified hospitality stakeholders." },
  { id: 2, icon: "flaticon-light-bulb", title: "Industry-First Approach", desc: "Built by hospitality professionals for hospitality professionals. Every feature addresses real industry needs." },
  { id: 3, icon: "flaticon-profit", title: "Collaboration Over Competition", desc: "We believe the industry grows when owners, investors, vendors, and professionals work together." },
  { id: 4, icon: "flaticon-investment", title: "Transparency & Trust", desc: "Open investment listings, verified vendor profiles, and honest industry insights drive our ecosystem." },
];

const TIMELINE = [
  { year: "2024", event: "Founded with a vision to unite India's fragmented hospitality industry" },
  { year: "2025", event: "Launched the verified network — 1,000+ members in the first 6 months" },
  { year: "2026", event: "Investment Hub & Marketplace go live, connecting capital with opportunity" },
];

const AboutPage = () => {
  return (
    <Layout header={1} footer={1} breadcrumb={"About"} title={"About the Network"}>
      {/* Mission Section */}
      <section style={{ padding: "100px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <span style={{ color: "var(--tg-accent-color)", letterSpacing: "3px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "16px" }}>
                Our Mission
              </span>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontFamily: "var(--tg-heading-font-family)", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "24px", lineHeight: 1.15 }}>
                Building the Infrastructure
                <br />
                <span style={{ color: "var(--tg-accent-color)" }}>Hospitality Deserves</span>
              </h2>
              <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--tg-body-font-color)", marginBottom: "20px" }}>
                India's hospitality industry is a ₹2.5 lakh crore ecosystem — yet it operates in silos.
                Hotel owners struggle to find reliable vendors. Investors lack visibility into opportunities.
                Professionals have no unified platform to connect with decision-makers.
              </p>
              <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--tg-body-font-color)", marginBottom: "32px" }}>
                Hotel Sircle changes this. We've built a verified, trust-based ecosystem where
                every stakeholder in hospitality can connect, collaborate, invest, and grow — together.
              </p>
              <Link to="/register" className="btn" style={{ padding: "14px 32px", fontSize: "12px" }}>
                Join the Network
              </Link>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div style={{ background: "var(--tg-primary-color)", padding: "60px 48px", marginLeft: "40px" }}>
                <h3 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "28px", fontWeight: 600, color: "#C6A962", marginBottom: "24px" }}>
                  "The hospitality industry doesn't need another association. It needs a trusted network that creates real value."
                </h3>
                <div style={{ borderTop: "1px solid rgba(198,169,98,0.3)", paddingTop: "20px" }}>
                  <p style={{ color: "#FFFFFF", fontSize: "15px", fontWeight: 600, margin: 0 }}>Founding Team</p>
                  <span style={{ color: "#8DA4BE", fontSize: "13px" }}>Hotel Sircle, 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: "var(--tg-primary-color)", padding: "60px 0" }}>
        <div className="container">
          <div className="row text-center">
            {[
              { count: 2500, suffix: "+", label: "Verified Members" },
              { count: 850, suffix: "+", label: "Hotels on Platform" },
              { count: 3200, suffix: "+", label: "Service Providers" },
              { count: 120, suffix: "+", label: "Cities Covered" },
            ].map((stat, i) => (
              <div key={i} className="col-lg-3 col-md-6 col-6">
                <h3 style={{ color: "#C6A962", fontFamily: "var(--tg-heading-font-family)", fontSize: "40px", fontWeight: 600, marginBottom: "4px" }}>
                  <Odometer end={stat.count} />{stat.suffix}
                </h3>
                <p style={{ color: "#8DA4BE", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1.5px" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "100px 0", background: "var(--tg-section-background)" }}>
        <div className="container">
          <div className="row justify-content-center mb-50">
            <div className="col-lg-7 text-center">
              <span style={{ color: "var(--tg-accent-color)", letterSpacing: "3px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "16px" }} data-aos="fade-up">
                Our Principles
              </span>
              <h2 data-aos="fade-up" data-aos-delay="200" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontFamily: "var(--tg-heading-font-family)", fontWeight: 600, color: "var(--tg-primary-color)" }}>
                What We Stand For
              </h2>
            </div>
          </div>
          <div className="row">
            {VALUES.map((v, i) => (
              <div key={v.id} className="col-lg-6" data-aos="fade-up" data-aos-delay={i * 100}>
                <div style={{ display: "flex", gap: "24px", background: "#FFFFFF", padding: "32px", marginBottom: "24px", borderLeft: "3px solid var(--tg-accent-color)", transition: "all 0.3s ease" }}>
                  <div style={{ flexShrink: 0, width: "52px", height: "52px", background: "var(--tg-section-background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className={v.icon} style={{ fontSize: "24px", color: "var(--tg-accent-color)" }}></i>
                  </div>
                  <div>
                    <h5 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "22px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "8px" }}>{v.title}</h5>
                    <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--tg-body-font-color)", margin: 0 }}>{v.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: "100px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row justify-content-center mb-50">
            <div className="col-lg-7 text-center">
              <span style={{ color: "var(--tg-accent-color)", letterSpacing: "3px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "16px" }} data-aos="fade-up">Our Journey</span>
              <h2 data-aos="fade-up" data-aos-delay="200" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontFamily: "var(--tg-heading-font-family)", fontWeight: 600, color: "var(--tg-primary-color)" }}>
                Building the Network
              </h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {TIMELINE.map((t, i) => (
                <div key={i} data-aos="fade-up" data-aos-delay={i * 150} style={{ display: "flex", gap: "32px", marginBottom: "40px", alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, width: "80px", height: "80px", background: "var(--tg-primary-color)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#C6A962", fontSize: "22px", fontWeight: 700, fontFamily: "var(--tg-heading-font-family)" }}>{t.year}</span>
                  </div>
                  <div style={{ paddingTop: "8px", borderBottom: "1px solid var(--tg-border-color)", paddingBottom: "24px", flex: 1 }}>
                    <p style={{ fontSize: "17px", lineHeight: 1.7, color: "var(--tg-body-font-color)", margin: 0 }}>{t.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <BrandTwo title="Our Industry Partners" />

      {/* CTA */}
      <section style={{ padding: "80px 0", background: "var(--tg-primary-color)", textAlign: "center" }}>
        <div className="container">
          <h2 data-aos="fade-up" style={{ color: "#FFFFFF", fontFamily: "var(--tg-heading-font-family)", fontSize: "36px", fontWeight: 600, marginBottom: "16px" }}>
            Ready to Join the Network?
          </h2>
          <p data-aos="fade-up" data-aos-delay="200" style={{ color: "#8DA4BE", fontSize: "16px", marginBottom: "32px" }}>
            Connect with India's most trusted hospitality ecosystem.
          </p>
          <Link to="/register" className="btn" data-aos="fade-up" data-aos-delay="300" style={{ background: "#C6A962", color: "#0A1628", border: "2px solid #C6A962", padding: "16px 40px", fontSize: "13px", letterSpacing: "2px" }}>
            Apply for Membership
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
