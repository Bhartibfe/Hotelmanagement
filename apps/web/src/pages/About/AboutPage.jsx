import React, { useState, useEffect } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";
import { Odometer } from "../../components/Odometer/Odometer";
import api from "../../services/api";

const CIRCLE_BENEFITS = [
  { icon: "fas fa-search-plus", title: "Deeper Reference Checks", desc: "Validate vendors, partners, and opportunities through a trusted network of fellow hotel owners who have first-hand experience." },
  { icon: "fas fa-handshake", title: "Stronger Collective Negotiating Power", desc: "Leverage the buying power of our hotel owners network to secure better rates on procurement, technology, and services." },
  { icon: "fas fa-exchange-alt", title: "Wider Deal Flow", desc: "Access investment opportunities, management contracts, and partnerships that only surface within an owners-only network." },
  { icon: "fas fa-chart-bar", title: "Broader Benchmarks", desc: "Compare your property's performance against real data shared confidentially by fellow owners — not industry averages." },
  { icon: "fas fa-bullhorn", title: "Louder Industry Voice", desc: "When owners speak together, policymakers and industry bodies listen. Shape the future of Indian hospitality as a collective." },
];

const DEFAULT_LEADERSHIP = [
  { name: "Harish Chandra", role: "Chief Executive Officer", photo: "", bio: "" },
  { name: "Jaikiran Ahluwalia", role: "Chief Business Officer", photo: "", bio: "" },
  { name: "Narinder Kamra", role: "Chief Operations Officer", photo: "", bio: "" },
];

const AboutPage = () => {
  const [leadershipTeam, setLeadershipTeam] = useState(DEFAULT_LEADERSHIP);
  const [hoveredLeader, setHoveredLeader] = useState(null);
  const [hoveredBenefit, setHoveredBenefit] = useState(null);
  const [stats, setStats] = useState({ members: 0, hotels: 0, vendors: 0, cities: 0 });

  useEffect(() => {
    api.getHomepageConfig().then((data) => {
      if (data?.leadershipTeam?.length > 0) setLeadershipTeam(data.leadershipTeam);
    }).catch(() => {});
    api.getPublicStats().then((data) => setStats(data)).catch(() => {});
  }, []);

  return (
    <Layout header={1} footer={1} breadcrumb={"About"} title={"About Hotel Sircle"}>

      {/* Hero / Mission */}
      <section style={{ padding: "48px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <span style={{ color: "#C6A962", letterSpacing: "3px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "16px" }}>
                Hotel Owners Grow The Circle
              </span>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontFamily: "var(--tg-heading-font-family)", fontWeight: 600, color: "#0A1628", marginBottom: "24px", lineHeight: 1.15 }}>
                Stronger Together.
                <br />
                <span style={{ color: "#C6A962" }}>Better Results.</span>
              </h2>
              <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--tg-body-font-color)", marginBottom: "20px" }}>
                Hotel Sircle is a closed, owners-only network — built exclusively for promoters, founders, and chairmen of hotel businesses. No GMs, no brand executives, no vendors.
              </p>
              <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--tg-body-font-color)", marginBottom: "12px" }}>
                Hotel owners from domestic chains, international brands, and independent properties — connected by trust, transparency, and a shared commitment to better business.
              </p>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#64748B", marginBottom: "32px", fontStyle: "italic" }}>
                Entry is possible only when the business card of the owner is received and validated — ensuring the group has only hotel owners.
              </p>
              <Link to="/register" className="btn cta-btn-gold" style={{ background: "#C6A962", color: "#0A1628", padding: "14px 32px", fontSize: "12px", letterSpacing: "2px", border: "2px solid #C6A962" }}>
                Apply for Membership
              </Link>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div style={{ background: "#0A1628", padding: "48px 40px", marginLeft: "40px", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #C6A962, transparent)" }} />
                <h3 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "26px", fontWeight: 600, color: "#C6A962", marginBottom: "20px", lineHeight: 1.3 }}>
                  "The hospitality industry doesn't need another association. It needs a trusted network that creates real value."
                </h3>
                <p style={{ color: "#8DA4BE", fontSize: "15px", lineHeight: 1.7, marginBottom: "24px" }}>
                  Owners from domestic, international & independent hotels — united under one circle for deeper collaboration, stronger negotiation, and louder representation.
                </p>
                <div style={{ borderTop: "1px solid rgba(198,169,98,0.3)", paddingTop: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#C6A962", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fas fa-hotel" style={{ color: "#0A1628", fontSize: "16px" }}></i>
                  </div>
                  <div>
                    <p style={{ color: "#FFFFFF", fontSize: "15px", fontWeight: 600, margin: 0 }}>Hotel Sircle</p>
                    <span style={{ color: "#8DA4BE", fontSize: "13px" }}>Owners. Trust. Transparency. Better Business.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: "#0A1628", padding: "60px 0", borderTop: "1px solid rgba(198,169,98,0.15)", borderBottom: "1px solid rgba(198,169,98,0.15)" }}>
        <div className="container">
          <div className="row text-center">
            {[
              { count: stats.members, suffix: "+", label: "Members" },
              { count: stats.hotels, suffix: "+", label: "Hotels" },
              { count: stats.cities, suffix: "+", label: "Cities" },
              { count: stats.vendors, suffix: "+", label: "Partners" },
            ].map((stat, i) => (
              <div key={i} className="col-lg-3 col-md-6 col-6" data-aos="zoom-in" data-aos-delay={i * 100}>
                <h3 style={{ color: "#C6A962", fontFamily: "var(--tg-heading-font-family)", fontSize: "40px", fontWeight: 600, marginBottom: "4px" }}>
                  <Odometer end={stat.count} />{stat.suffix}
                </h3>
                <p style={{ color: "#8DA4BE", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1.5px" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment Banner */}
      <section style={{ padding: "48px 0", background: "#C6A962" }}>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-10 text-center" data-aos="fade-up">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
                <i className="fas fa-shield-alt" style={{ fontSize: "28px", color: "#0A1628" }}></i>
                <h3 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "24px", fontWeight: 700, color: "#0A1628", margin: 0 }}>
                  Our Commitment: Strictly Owners Only
                </h3>
              </div>
              <p style={{ color: "#0A1628", fontSize: "15px", marginTop: "12px", marginBottom: 0, opacity: 0.8 }}>
                No GMs. No brand executives. No vendors. Every member is a verified hotel owner — promoter, founder, or chairman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join The Circle - Benefits */}
      <section style={{ padding: "100px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row justify-content-center mb-50">
            <div className="col-lg-7 text-center">
              <span style={{ color: "#C6A962", letterSpacing: "3px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "16px" }} data-aos="fade-up">
                Why Hotel Sircle
              </span>
              <h2 data-aos="fade-up" data-aos-delay="200" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontFamily: "var(--tg-heading-font-family)", fontWeight: 600, color: "#0A1628", marginBottom: "16px" }}>
                What The Circle Gives You
              </h2>
              <p data-aos="fade-up" data-aos-delay="300" style={{ color: "var(--tg-body-font-color)", fontSize: "16px", lineHeight: 1.7 }}>
                Being part of Hotel Sircle means access to opportunities, insights, and collective strength that no individual owner can achieve alone.
              </p>
            </div>
          </div>
          <div className="row">
            {CIRCLE_BENEFITS.map((b, i) => (
              <div key={i} className={i < 3 ? "col-lg-4 col-md-6" : "col-lg-6"} data-aos="fade-up" data-aos-delay={i * 100}>
                <div
                  onMouseEnter={() => setHoveredBenefit(i)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                  style={{
                    padding: "32px 28px",
                    marginBottom: "24px",
                    background: hoveredBenefit === i ? "#0A1628" : "#FAFAFA",
                    borderLeft: "3px solid #C6A962",
                    transition: "all 0.4s ease",
                    cursor: "default",
                    height: "100%",
                  }}
                >
                  <div style={{ width: "48px", height: "48px", background: hoveredBenefit === i ? "rgba(198,169,98,0.15)" : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", transition: "all 0.3s ease" }}>
                    <i className={b.icon} style={{ fontSize: "20px", color: "#C6A962" }}></i>
                  </div>
                  <h5 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "22px", fontWeight: 600, color: hoveredBenefit === i ? "#FFFFFF" : "#0A1628", marginBottom: "10px", transition: "color 0.3s" }}>
                    {b.title}
                  </h5>
                  <p style={{ fontSize: "14px", lineHeight: 1.7, color: hoveredBenefit === i ? "#8DA4BE" : "var(--tg-body-font-color)", margin: 0, transition: "color 0.3s" }}>
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section style={{ padding: "100px 0", background: "#0A1628", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, #C6A962, transparent)" }} />
        <div className="container">
          <div className="row justify-content-center mb-50">
            <div className="col-lg-7 text-center">
              <span style={{ color: "#C6A962", letterSpacing: "3px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "16px" }} data-aos="fade-up">
                Leadership
              </span>
              <h2 data-aos="fade-up" data-aos-delay="200" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontFamily: "var(--tg-heading-font-family)", fontWeight: 600, color: "#FFFFFF", marginBottom: "16px" }}>
                The Team Behind <span style={{ color: "#C6A962" }}>Hotel Sircle</span>
              </h2>
              <p data-aos="fade-up" data-aos-delay="300" style={{ color: "#8DA4BE", fontSize: "16px", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
                Three industry veterans united by a shared vision — building the infrastructure India's hospitality industry deserves.
              </p>
            </div>
          </div>
          <div className="row justify-content-center">
            {leadershipTeam.map((member, i) => {
              const isHovered = hoveredLeader === i;
              const initials = (member.name || "").split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
              return (
                <div key={i} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration="800" data-aos-delay={i * 150}>
                  <div
                    onMouseEnter={() => setHoveredLeader(i)}
                    onMouseLeave={() => setHoveredLeader(null)}
                    style={{
                      textAlign: "center",
                      padding: "40px 28px",
                      transition: "all 0.4s ease",
                      borderRadius: "4px",
                      background: isHovered ? "rgba(198,169,98,0.06)" : "transparent",
                      border: isHovered ? "1px solid rgba(198,169,98,0.2)" : "1px solid transparent",
                    }}
                  >
                    <div style={{
                      width: "140px", height: "140px", borderRadius: "50%", margin: "0 auto 24px",
                      overflow: "hidden", border: "3px solid #C6A962", transition: "all 0.4s ease",
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                      boxShadow: isHovered ? "0 12px 40px rgba(198,169,98,0.3)" : "0 4px 20px rgba(0,0,0,0.3)",
                    }}>
                      {member.photo ? (
                        <img src={member.photo} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1E293B, #0F172A)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: "42px", fontWeight: 700, color: "#C6A962", fontFamily: "var(--tg-heading-font-family)", letterSpacing: "2px" }}>{initials}</span>
                        </div>
                      )}
                    </div>
                    <h4 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "24px", fontWeight: 600, color: "#FFFFFF", marginBottom: "6px" }}>{member.name}</h4>
                    <p style={{ color: "#C6A962", fontSize: "14px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: member.bio ? "16px" : "0" }}>{member.role}</p>
                    {member.bio && (
                      <p style={{ color: "#8DA4BE", fontSize: "14px", lineHeight: 1.7, margin: 0, maxWidth: "280px", marginLeft: "auto", marginRight: "auto" }}>{member.bio}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Help Grow Our Circle */}
      <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <span style={{ color: "#C6A962", letterSpacing: "3px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "16px" }}>
                Help Grow Our Circle
              </span>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", fontFamily: "var(--tg-heading-font-family)", fontWeight: 600, color: "#0A1628", marginBottom: "20px", lineHeight: 1.2 }}>
                Know a Hotel Owner? <span style={{ color: "#C6A962" }}>Introduce Them.</span>
              </h2>
              <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--tg-body-font-color)", marginBottom: "24px" }}>
                The strength of Hotel Sircle grows with every verified owner who joins. If you know a hotel promoter, founder, or chairman who would benefit from this network, help us grow the circle.
              </p>
              <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--tg-body-font-color)", marginBottom: "32px" }}>
                Every referral is validated through our verification process — ensuring the integrity of the network is never compromised.
              </p>
              <Link to="/register" className="btn cta-btn-gold" style={{ background: "#C6A962", color: "#0A1628", padding: "14px 32px", fontSize: "12px", letterSpacing: "2px", border: "2px solid #C6A962" }}>
                Refer an Owner
              </Link>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div style={{ background: "#F8FAFC", padding: "40px", marginLeft: "40px" }}>
                <h4 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "22px", fontWeight: 600, color: "#0A1628", marginBottom: "24px" }}>
                  Tell Us Your Challenge
                </h4>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--tg-body-font-color)", marginBottom: "16px" }}>
                  Whether it's vendor selection, technology adoption, staffing, procurement pricing, or regulatory challenges — chances are, someone in the circle has faced it and solved it.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {["Vendor & Partner References", "Technology & PMS Decisions", "Procurement & Pricing Benchmarks", "Staffing & Talent Acquisition", "Regulatory & Compliance Guidance"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <i className="fas fa-check-circle" style={{ color: "#C6A962", fontSize: "16px" }}></i>
                      <span style={{ fontSize: "14px", color: "#0A1628", fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: "80px 0", background: "#0A1628", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, #C6A962, transparent)" }} />
        <div className="container">
          <h2 data-aos="fade-up" style={{ color: "#FFFFFF", fontFamily: "var(--tg-heading-font-family)", fontSize: "36px", fontWeight: 600, marginBottom: "12px" }}>
            Owners. Trust. Transparency.
          </h2>
          <h3 data-aos="fade-up" data-aos-delay="100" style={{ color: "#C6A962", fontFamily: "var(--tg-heading-font-family)", fontSize: "28px", fontWeight: 600, marginBottom: "24px" }}>
            Better Business.
          </h3>
          <p data-aos="fade-up" data-aos-delay="200" style={{ color: "#8DA4BE", fontSize: "16px", marginBottom: "32px", maxWidth: "480px", margin: "0 auto 32px" }}>
            Join verified hotel owners who are growing their business through the power of a trusted network.
          </p>
          <Link to="/register" className="btn cta-btn-gold" data-aos="fade-up" data-aos-delay="300" style={{ background: "#C6A962", color: "#0A1628", border: "2px solid #C6A962", padding: "16px 40px", fontSize: "13px", letterSpacing: "2px" }}>
            Apply for Membership
          </Link>
        </div>

        <style>{`
          .cta-btn-gold::before { display: none !important; }
          .cta-btn-gold:hover { color: inherit !important; }
        `}</style>
      </section>
    </Layout>
  );
};

export default AboutPage;
