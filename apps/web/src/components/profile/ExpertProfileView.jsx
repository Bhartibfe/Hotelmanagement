import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "../../layouts/Layout";
import { getErrorMessage } from "../../lib/errors";


// Experts and advisory board members are one record split by ExpertKind, so
// both public profiles are this view with different copy and a different
// fetcher. Only the labels, the directory links, and the closing CTA differ.
const ExpertProfileView = ({ copy }) => {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Message Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [messageForm, setMessageForm] = useState({
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    organization: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const fetchExpert = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await copy.fetch(id);
        if (data) {
          setExpert(data);
        } else {
          setError(new Error(copy.notFoundError));
        }
      } catch (err) {
        // Not the same as "no such profile": a dropped connection or a 500 has
        // a different answer, and the reason is shown below rather than the
        // catch-all not-found copy.
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    setModalSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setModalSubmitted(false);
      setMessageForm({
        senderName: "",
        senderEmail: "",
        senderPhone: "",
        organization: "",
        subject: "",
        message: "",
      });
    }, 2500);
  };

  if (loading) {
    return (
      <Layout breadcrumb={copy.breadcrumb} title={copy.pageTitle}>
        <section style={{ padding: "48px 0", background: "#0A1628", textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center" }}>
          <div className="container">
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "3px solid rgba(198,169,98,0.3)",
                borderTopColor: "#C6A962",
                borderRadius: "50%",
                margin: "0 auto 20px",
                animation: "expertSpin 0.8s linear infinite",
              }}
            />
            <p style={{ fontSize: "16px", color: "#8DA4BE", fontFamily: "'Cormorant Garamond', serif" }}>
              {copy.loadingText}
            </p>
            <style>{`@keyframes expertSpin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !expert) {
    return (
      <Layout breadcrumb={copy.breadcrumb} title={copy.pageTitle}>
        <section style={{ padding: "48px 0", textAlign: "center", background: "#FFFFFF" }}>
          <div className="container">
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "#FEF2F2",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                border: "1px solid #FCA5A5",
              }}
            >
              <i className="fas fa-exclamation-triangle" style={{ fontSize: "28px", color: "#EF4444" }}></i>
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", fontWeight: 600, color: "#0A1628", marginBottom: "12px" }}>
              {error && error.status && error.status !== 404 ? "This profile could not be loaded" : copy.notFoundTitle}
            </h3>
            <p style={{ color: "#6B7280", fontSize: "15px", marginBottom: "24px", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
              {getErrorMessage(error, copy.notFoundBody)}
            </p>
            <Link
              to={copy.directoryPath}
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#C6A962",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                padding: "12px 28px",
                border: "1px solid #C6A962",
                display: "inline-block",
              }}
            >
              <i className="fas fa-arrow-left" style={{ marginRight: "8px" }}></i>
              {copy.backToDirectory}
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  // Normalize API data vs Mock format
  const isApiData = !!expert.user;
  const ep = isApiData ? (expert.expertProfile || expert) : expert;

  const salutation = isApiData ? (expert.user.salutation || "") : (expert.salutation || "");
  const firstName = isApiData ? (expert.user.firstName || "") : (expert.name ? expert.name.split(" ")[0] : "");
  const lastName = isApiData ? (expert.user.lastName || "") : (expert.name ? expert.name.split(" ").slice(1).join(" ") : "");
  const fullName = isApiData
    ? `${salutation ? salutation + " " : ""}${firstName} ${lastName}`.trim()
    : expert.name || copy.fallbackName;

  const currentRole = isApiData ? (ep.currentRole || expert.user.title || expert.user.designation || "") : expert.title || "";
  const currentOrganization = isApiData ? (ep.currentOrganization || expert.user.organizationName || "") : expert.company || "";
  const designation = isApiData ? (expert.user.designation || currentRole) : currentRole;
  const city = isApiData ? (expert.user.city || "") : expert.city || "";
  const state = isApiData ? (expert.user.state || "") : expert.state || "";
  const location = [city, state].filter(Boolean).join(", ");

  const bio = isApiData ? (ep.bio || expert.user.bio || "") : expert.bio || "";
  const yearsOfExperience = isApiData ? (ep.yearsOfExperience || expert.user.yearsInIndustry) : expert.yearsOfExperience;
  
  // Array normalized fields
  const specializations = isApiData
    ? (Array.isArray(ep.specializations) ? ep.specializations : (ep.specializations ? [ep.specializations] : (expert.expertise || [])))
    : (expert.expertise || []);

  const industryInsights = isApiData
    ? (ep.industryInsights || ep.insights || "")
    : (expert.insights || "");

  const speakingEngagements = isApiData
    ? (Array.isArray(ep.speakingEngagements) ? ep.speakingEngagements : (ep.speakingEngagements ? ep.speakingEngagements.split("\n") : []))
    : (expert.speakingEngagements || []);

  const publishedArticles = isApiData
    ? (Array.isArray(ep.publishedArticles) ? ep.publishedArticles : (ep.publishedArticles ? ep.publishedArticles.split("\n") : []))
    : (expert.publishedArticles || []);

  const awards = isApiData
    ? (Array.isArray(ep.awards) ? ep.awards : (ep.awards ? ep.awards.split("\n") : []))
    : (expert.awards || []);

  const certifications = isApiData
    ? (Array.isArray(ep.certifications) ? ep.certifications : (ep.certifications ? ep.certifications.split("\n") : []))
    : (expert.certifications || []);

  const recognition = isApiData
    ? (ep.recognition || "")
    : (expert.recognition || "");

  const phone = isApiData ? (expert.user.phone || ep.phone || "") : (expert.phone || "");
  // LinkedIn is collected on the form but deliberately not surfaced publicly.
  const avatar = isApiData ? (expert.user.avatar || ep.avatar || "") : "";

  const hasAvatar = avatar && avatar.trim() !== "";
  const photo = hasAvatar ? avatar : "";

  return (
    <Layout breadcrumb={copy.breadcrumb} title={fullName}>
      {/* Styles */}
      <style>{`
        .expert-hero-badge {
          background: rgba(198, 169, 98, 0.12);
          border: 1px solid rgba(198, 169, 98, 0.3);
          color: #C6A962;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 5px 14px;
          display: inline-block;
          margin-bottom: 14px;
        }
        .expert-card {
          background: #FFFFFF;
          border: 1px solid #E2DDD5;
          border-left: 3px solid #C6A962;
          padding: 32px;
          margin-bottom: 28px;
          box-shadow: 0 4px 18px rgba(10,22,40,0.02);
        }
        .expert-sidebar-card {
          background: #FFFFFF;
          border: 1px solid #E2DDD5;
          padding: 28px;
          margin-bottom: 24px;
        }
        .expert-spec-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          background: #F8FAFC;
          border: 1px solid #E2DDD5;
          color: #0A1628;
          font-size: 13px;
          font-weight: 600;
          margin-right: 8px;
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }
        .expert-spec-tag:hover {
          border-color: #C6A962;
          color: #C6A962;
        }
        .expert-btn-gold {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 28px;
          background: #C6A962;
          color: #0A1628;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-decoration: none;
          border: 2px solid #C6A962;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .expert-btn-gold:hover {
          background: #0A1628;
          color: #C6A962;
          border-color: #0A1628;
        }
        .expert-btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          background: transparent;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid rgba(198, 169, 98, 0.4);
          transition: all 0.3s ease;
        }
        .expert-btn-outline:hover {
          background: #C6A962;
          color: #0A1628;
          border-color: #C6A962;
        }
        .expert-modal-bg {
          position: fixed;
          inset: 0;
          background: rgba(10, 22, 40, 0.8);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .expert-modal-box {
          background: #FFFFFF;
          width: 100%;
          max-width: 580px;
          border-top: 4px solid #C6A962;
          border-radius: 4px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.3);
          overflow: hidden;
        }
      `}</style>

      {/* HERO HEADER */}
      <section style={{ position: "relative", background: "#0A1628", overflow: "hidden", color: "#FFFFFF", padding: "32px 0 60px" }}>
        {/* Backdrop photo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${photo})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            opacity: 0.1,
            filter: "blur(2px)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0A1628 0%, rgba(10,22,40,0.96) 100%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: "20px" }}>
            <Link to={copy.directoryPath} style={{ color: "#8DA4BE", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>
              <i className="fas fa-arrow-left" style={{ marginRight: "8px" }}></i> {copy.backToDirectory}
            </Link>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-8" data-aos="fade-right">
              <div style={{ display: "flex", gap: "28px", alignItems: "center", flexWrap: "wrap" }}>
                {/* Photo / Initial Avatar */}
                <div style={{ flexShrink: 0 }}>
                  <div
                    style={{
                      width: "130px",
                      height: "130px",
                      borderRadius: "50%",
                      backgroundImage: `url(${photo})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: "4px solid rgba(198,169,98,0.4)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
                    }}
                  />
                </div>

                <div>
                  <span className="expert-hero-badge">{copy.heroBadge}</span>

                  <h1
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(30px, 4vw, 42px)",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      margin: "0 0 6px",
                      lineHeight: 1.15,
                    }}
                  >
                    {fullName}
                  </h1>

                  {currentRole && (
                    <p style={{ color: "#C6A962", fontSize: "18px", fontWeight: 500, margin: "0 0 4px" }}>
                      {currentRole}
                    </p>
                  )}

                  <p style={{ color: "#8DA4BE", fontSize: "15px", margin: 0 }}>
                    {[currentOrganization, location].filter(Boolean).join(" \u2022 ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0" data-aos="fade-left">
              <div style={{ display: "inline-flex", gap: "12px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                {yearsOfExperience && (
                  <span
                    style={{
                      padding: "10px 20px",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      border: "1px solid rgba(198,169,98,0.3)",
                      color: "#C6A962",
                      display: "block",
                      width: "100%",
                      textAlign: "center",
                      marginBottom: "10px"
                    }}
                  >
                    {yearsOfExperience}+ Years Experience
                  </span>
                )}

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="expert-btn-gold"
                  style={{ width: "100%" }}
                >
                  <i className="far fa-paper-plane"></i> {copy.contactButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GOLD SEPARATOR */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C6A962, transparent)" }} />

      {/* MAIN CONTENT AREA */}
      <section style={{ padding: "60px 0 80px", background: "#F9FAFB" }}>
        <div className="container">
          {/* ROW 1: BIO & SPECIALIZATIONS (7-COL) + OVERVIEW & CONTACT (5-COL) */}
          <div className="row g-4 mb-4 align-items-stretch">
            <div className="col-lg-7 d-flex flex-column">
              {/* Bio & Specializations Combined Card */}
              <div className="expert-card flex-grow-1" data-aos="fade-up" style={{ marginBottom: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>
                    Personal Bio & Experience
                  </span>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 600, color: "#0A1628", marginBottom: "16px" }}>
                    About {firstName || fullName}
                  </h3>
                  <p style={{ fontSize: "16px", lineHeight: 1.85, color: "#4B5563", marginBottom: "24px" }}>
                    {bio}
                  </p>
                </div>

                {specializations.length > 0 && (
                  <div style={{ borderTop: "1px solid #E2DDD5", paddingTop: "18px" }}>
                    <span style={{ color: "#0A1628", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
                      Practice Areas & Specializations
                    </span>
                    <div>
                      {specializations.map((spec, i) => (
                        <span key={i} className="expert-spec-tag">
                          <i className="fas fa-check" style={{ color: "#C6A962", fontSize: "11px" }}></i>
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT 5-COL: OVERVIEW & QUICK CONTACT */}
            <div className="col-lg-5 d-flex flex-column">
              <div className="expert-sidebar-card flex-grow-1" data-aos="fade-up" style={{ marginBottom: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
                    Overview & Contact
                  </span>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, color: "#0A1628", marginBottom: "18px" }}>
                    Professional Details
                  </h4>

                  {[
                    { label: "Organization", value: currentOrganization },
                    { label: "Current Role", value: currentRole || designation },
                    { label: "Experience", value: yearsOfExperience ? `${yearsOfExperience} Years` : null },
                    { label: "Location", value: location },
                    { label: "Phone", value: phone },
                  ]
                    .filter((item) => item.value)
                    .map((item, idx, arr) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 0",
                          borderBottom: idx < arr.length - 1 ? "1px solid #E2DDD5" : "none",
                        }}
                      >
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {item.label}
                        </span>
                        <span style={{ fontSize: "14px", color: "#4B5563", textAlign: "right", maxWidth: "60%" }}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="expert-btn-gold"
                  style={{ width: "100%", marginTop: "20px" }}
                >
                  <i className="far fa-envelope"></i> Send Direct Message
                </button>
              </div>
            </div>
          </div>

          {/* ROW 2: EQUAL HEIGHT FLEX CARDS FOR SPEAKING, ARTICLES, AWARDS, RECOGNITION */}
          <div className="row g-4 align-items-stretch">
            {/* LEFT 6-COL */}
            <div className="col-lg-6 d-flex flex-column gap-4">
              {/* Speaking Engagements */}
              {speakingEngagements.length > 0 && (
                <div className="expert-card flex-grow-1" data-aos="fade-up" style={{ marginBottom: 0 }}>
                  <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>
                    Engagements
                  </span>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#0A1628", marginBottom: "20px" }}>
                    Speaking Engagements
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {speakingEngagements.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#0A1628", color: "#C6A962", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <i className="fas fa-microphone" style={{ fontSize: "14px" }}></i>
                        </div>
                        <span style={{ fontSize: "15px", color: "#0A1628", fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Awards & Certifications */}
              {(awards.length > 0 || certifications.length > 0) && (
                <div className="expert-card flex-grow-1" data-aos="fade-up" style={{ marginBottom: 0 }}>
                  <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>
                    Achievements
                  </span>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#0A1628", marginBottom: "20px" }}>
                    Awards & Certifications
                  </h4>

                  <div className="row g-4">
                    {awards.length > 0 && (
                      <div className={certifications.length > 0 ? "col-md-6" : "col-12"}>
                        <h6 style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                          Awards
                        </h6>
                        {awards.map((award, i) => (
                          <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                            <i className="fas fa-trophy" style={{ color: "#C6A962", marginTop: "4px", fontSize: "14px" }}></i>
                            <span style={{ fontSize: "14px", color: "#4B5563" }}>{award}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {certifications.length > 0 && (
                      <div className={awards.length > 0 ? "col-md-6" : "col-12"}>
                        <h6 style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                          Certifications
                        </h6>
                        {certifications.map((cert, i) => (
                          <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                            <i className="fas fa-certificate" style={{ color: "#C6A962", marginTop: "4px", fontSize: "14px" }}></i>
                            <span style={{ fontSize: "14px", color: "#4B5563" }}>{cert}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT 6-COL */}
            <div className="col-lg-6 d-flex flex-column gap-4">
              {/* Published Articles */}
              {publishedArticles.length > 0 && (
                <div className="expert-card flex-grow-1" data-aos="fade-up" style={{ marginBottom: 0 }}>
                  <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>
                    Publications
                  </span>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#0A1628", marginBottom: "20px" }}>
                    Published Articles
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {publishedArticles.map((article, i) => (
                      <div key={i} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#F8FAFC", border: "1px solid #E2DDD5", color: "#C6A962", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <i className="far fa-newspaper" style={{ fontSize: "14px" }}></i>
                        </div>
                        {article.startsWith("http") ? (
                          <a href={article} target="_blank" rel="noopener noreferrer" style={{ fontSize: "15px", color: "#C6A962", fontWeight: 600, textDecoration: "underline" }}>
                            {article}
                          </a>
                        ) : (
                          <span style={{ fontSize: "15px", color: "#0A1628", fontWeight: 500 }}>{article}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recognition */}
              {recognition && (
                <div className="expert-card flex-grow-1" data-aos="fade-up" style={{ marginBottom: 0 }}>
                  <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>
                    Recognition
                  </span>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#0A1628", marginBottom: "14px" }}>
                    Industry Recognition
                  </h4>
                  <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#4B5563", margin: 0 }}>
                    {recognition}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* THOUGHTS & VISION - WIDER & COMPACT LUXURY QUOTE SECTION */}
      {industryInsights && (
        <section style={{ padding: "45px 0", background: "#FAF9F6", position: "relative" }}>
          <div className="container" data-aos="fade-up">
            <div
              style={{
                maxWidth: "1140px",
                margin: "0 auto",
                background: "#FFFFFF",
                border: "1px solid #E2DDD5",
                borderTop: "3px solid #C6A962",
                padding: "24px 40px",
                borderRadius: "4px",
                boxShadow: "0 10px 30px rgba(10, 22, 40, 0.04)",
                textAlign: "center",
                position: "relative"
              }}
            >
              {/* Header with Fancy Gold Lines */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "14px" }}>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #C6A962)" }} />
                <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>
                  Thoughts & Vision
                </span>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #C6A962, transparent)" }} />
              </div>

              {/* Quote Text */}
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(19px, 2.5vw, 23px)",
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  color: "#0A1628",
                  margin: "0 0 16px",
                  padding: "0 10px"
                }}
              >
                <i className="fas fa-quote-left" style={{ fontSize: "20px", color: "#C6A962", marginRight: "10px", verticalAlign: "baseline" }}></i>
                &ldquo;{industryInsights}&rdquo;
              </p>

              {/* Compact Signature with Avatar */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", borderTop: "1px solid #F3F4F6", paddingTop: "12px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    backgroundImage: `url(${photo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "2px solid #C6A962",
                    flexShrink: 0
                  }}
                />
                <div style={{ textAlign: "left" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 700, color: "#0A1628", marginRight: "8px" }}>
                    {fullName}
                  </span>
                  <span style={{ fontSize: "12px", color: "#C6A962", fontWeight: 600 }}>
                    &bull; {currentRole} {currentOrganization ? `(${currentOrganization})` : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BOTTOM CTA */}
      <section style={{ padding: "60px 0", background: "#0A1628", textAlign: "center", color: "#FFFFFF" }}>
        <div className="container" data-aos="fade-up">
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", fontWeight: 600, color: "#FFFFFF", marginBottom: "12px" }}>
            Want to connect with {fullName}?
          </h3>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", marginBottom: "28px", maxWidth: "500px", margin: "0 auto 28px" }}>
            {copy.ctaBody}
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            {/* Advisory members are appointed, so that variant has no join link. */}
            {copy.joinPath && (
              <Link
                to={copy.joinPath}
                className="expert-btn-gold"
              >
                {copy.joinLabel}
              </Link>
            )}
            <Link
              to={copy.directoryPath}
              className="expert-btn-outline"
            >
              <i className="fas fa-arrow-left" style={{ marginRight: "6px" }}></i> {copy.allLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* DIRECT MESSAGE MODAL */}
      {isModalOpen && (
        <div className="expert-modal-bg" onClick={() => setIsModalOpen(false)}>
          <div className="expert-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ background: "#0A1628", color: "#FFFFFF", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "#FFFFFF", margin: 0 }}>
                Message {fullName}
              </h4>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "transparent", border: "none", color: "#8DA4BE", fontSize: "22px", cursor: "pointer" }}>
                &times;
              </button>
            </div>

            <div style={{ padding: "28px" }}>
              {modalSubmitted ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#D1FAE5", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px" }}>
                    <i className="fas fa-check"></i>
                  </div>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", color: "#0A1628", marginBottom: "8px" }}>
                    Message Delivered!
                  </h4>
                  <p style={{ color: "#6B7280", fontSize: "14px" }}>
                    Your inquiry has been sent to {fullName}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleMessageSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={messageForm.senderName}
                        onChange={(e) => setMessageForm({ ...messageForm, senderName: e.target.value })}
                        style={{ width: "100%", padding: "10px", border: "1px solid #E2DDD5", fontSize: "14px" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Your Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={messageForm.senderEmail}
                        onChange={(e) => setMessageForm({ ...messageForm, senderEmail: e.target.value })}
                        style={{ width: "100%", padding: "10px", border: "1px solid #E2DDD5", fontSize: "14px" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Phone</label>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={messageForm.senderPhone}
                        onChange={(e) => setMessageForm({ ...messageForm, senderPhone: e.target.value })}
                        style={{ width: "100%", padding: "10px", border: "1px solid #E2DDD5", fontSize: "14px" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Organization</label>
                      <input
                        type="text"
                        placeholder="Hotel / Company Name"
                        value={messageForm.organization}
                        onChange={(e) => setMessageForm({ ...messageForm, organization: e.target.value })}
                        style={{ width: "100%", padding: "10px", border: "1px solid #E2DDD5", fontSize: "14px" }}
                      />
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Subject</label>
                      <input
                        type="text"
                        placeholder="Subject of inquiry"
                        value={messageForm.subject}
                        onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                        style={{ width: "100%", padding: "10px", border: "1px solid #E2DDD5", fontSize: "14px" }}
                      />
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Message *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Write your message..."
                        value={messageForm.message}
                        onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                        style={{ width: "100%", padding: "10px", border: "1px solid #E2DDD5", fontSize: "14px" }}
                      />
                    </div>
                    <div className="col-12 mt-3">
                      <button type="submit" className="expert-btn-gold" style={{ width: "100%" }}>
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ExpertProfileView;
