import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { Layout } from "../../layouts/Layout";

const ROLE_LABELS = {
  HOTEL_OWNER: "Hotel Owner",
  VENDOR: "Vendor / Supplier",
  PROFESSIONAL: "Industry Professional",
  CONSULTANT: "Consultant / Advisor",
  OTHER: "Industry Member",
};

const InfoRow = ({ label, value }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join(", ") : value;
  return (
    <div style={{ display: "flex", padding: "10px 0", borderBottom: "1px solid #F1F0ED" }}>
      <span style={{ width: "180px", flexShrink: 0, fontSize: "13px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.3px" }}>
        {label}
      </span>
      <span style={{ fontSize: "14px", color: "#0A1628", lineHeight: "1.5" }}>{display}</span>
    </div>
  );
};

const Section = ({ title, children }) => {
  const hasContent = React.Children.toArray(children).some((c) => c !== null);
  if (!hasContent) return null;
  return (
    <div style={{ marginBottom: "28px" }}>
      <h4
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "20px",
          fontWeight: 600,
          color: "#0A1628",
          marginBottom: "16px",
          paddingBottom: "10px",
          borderBottom: "2px solid #C6A962",
          display: "inline-block",
        }}
      >
        {title}
      </h4>
      <div>{children}</div>
    </div>
  );
};

const MyProfilePage = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");

  const isIncomplete = user?.profileStatus === "INCOMPLETE";

  useEffect(() => {
    const fetchProfile = async () => {
      if (isIncomplete) {
        setLoadingProfile(false);
        return;
      }
      try {
        const data = await api.getMyProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user, isIncomplete]);

  if (loading || loadingProfile) {
    return (
      <Layout header={1} footer={1}>
        <section style={{ padding: "100px 0", background: "#FFFFFF" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <p style={{ color: "#6B7280", fontSize: "16px" }}>
                  Loading profile...
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Show incomplete profile state with CTA to complete the form
  if (isIncomplete) {
    return (
      <Layout header={1} footer={1} breadcrumb="My Profile" title="My Profile">
        <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div
                  style={{
                    border: "1px solid #E2DDD5",
                    padding: "48px 40px",
                    borderTop: "3px solid #C6A962",
                    textAlign: "center",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "rgba(198, 169, 98, 0.1)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C6A962"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>

                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "28px",
                      fontWeight: 600,
                      color: "#0A1628",
                      marginBottom: "4px",
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </h2>
                  <p
                    style={{
                      color: "#6B7280",
                      fontSize: "14px",
                      marginBottom: "32px",
                    }}
                  >
                    {user.memberType
                      ? user.memberType.replace(/_/g, " ")
                      : "Member"}
                  </p>

                  {/* Pending Profile Banner */}
                  <div
                    style={{
                      background: "#FFFBEB",
                      border: "1px solid #FDE68A",
                      padding: "24px",
                      marginBottom: "24px",
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#D97706"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginBottom: "12px" }}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <h4
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "#0A1628",
                        marginBottom: "8px",
                      }}
                    >
                      Profile Incomplete
                    </h4>
                    <p
                      style={{
                        color: "#6B7280",
                        fontSize: "14px",
                        marginBottom: "20px",
                        lineHeight: "1.6",
                      }}
                    >
                      Your account has been created, but your profile is not yet complete.
                      Please fill in your details so we can review and approve your membership.
                    </p>
                    <Link
                      to="/complete-profile"
                      className="btn"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "14px 28px",
                        fontSize: "13px",
                        letterSpacing: "1.5px",
                      }}
                    >
                      Complete Your Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const memberType = profile?.memberType || user.memberType || "";
  const firstName = profile?.firstName || user.firstName || "";
  const lastName = profile?.lastName || user.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const title = profile?.title || "";
  const org = profile?.organizationName || "";
  const city = profile?.city || "";
  const state = profile?.state || "";
  const location = [city, state].filter(Boolean).join(", ");
  const avatar = profile?.avatar || "";
  const bio = profile?.bio || "";
  const phone = profile?.phone || "";
  const linkedinUrl = profile?.linkedinUrl || "";
  const achievements = profile?.achievements || "";
  const industryContributions = profile?.industryContributions || "";
  const businessOverview = profile?.businessOverview || "";
  const yearsInIndustry = profile?.yearsInIndustry || "";

  const hotels = profile?.hotels || [];
  const vp = profile?.vendorProfile || null;
  const vendorProducts = vp?.products || [];
  const ep = profile?.expertProfile || null;

  const isHotelOwner = memberType === "HOTEL_OWNER";
  const isVendor = memberType === "VENDOR";
  const isExpert = memberType === "PROFESSIONAL" || memberType === "CONSULTANT";

  // Expert-specific data
  const expertOrg = ep?.currentOrganization || org;
  const expertRole = ep?.currentRole || title;
  const expertBio = ep?.bio || bio;
  const yearsOfExperience = ep?.yearsOfExperience || yearsInIndustry;
  const specializations = Array.isArray(ep?.expertise) ? ep.expertise : [];
  const industryInsights = ep?.industryInsights || "";
  const speakingEngagements = Array.isArray(ep?.speakingEngagements) ? ep.speakingEngagements : [];
  const publishedArticles = Array.isArray(ep?.publishedArticles) ? ep.publishedArticles : [];
  const awards = Array.isArray(ep?.awards) ? ep.awards : [];
  const certifications = Array.isArray(ep?.certifications) ? ep.certifications : [];

  const starIcons = (rating) => {
    const stars = [];
    for (let i = 0; i < (rating || 0); i++) {
      stars.push(<span key={i} style={{ color: "#C6A962", fontSize: "14px" }}>&#9733;</span>);
    }
    return stars;
  };

  // Revision banner (shared across all types)
  const revisionBanner = (user.membershipStatus === "REVISION_REQUESTED" || user.profileStatus === "PENDING_REVIEW" || user.profileStatus === "INCOMPLETE") ? (
    <div className="container">
      <div
        style={{
          margin: "20px 0",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          background: user.membershipStatus === "REVISION_REQUESTED" ? "#FEF2F2" : "#FFFBEB",
          border: `1px solid ${user.membershipStatus === "REVISION_REQUESTED" ? "#FECACA" : "#FDE68A"}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <i className={`fas ${user.membershipStatus === "REVISION_REQUESTED" ? "fa-exclamation-triangle" : "fa-clock"}`} style={{ fontSize: "16px", color: user.membershipStatus === "REVISION_REQUESTED" ? "#DC2626" : "#D97706" }} />
          <div>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628" }}>
              {user.membershipStatus === "REVISION_REQUESTED" ? "Revision Requested" : user.profileStatus === "INCOMPLETE" ? "Profile Incomplete" : "Profile Under Review"}
            </span>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "2px 0 0" }}>
              {user.membershipStatus === "REVISION_REQUESTED" ? "Admin has requested changes. Please update and resubmit." : user.profileStatus === "INCOMPLETE" ? "Complete your profile to get approved." : "Your profile is being reviewed."}
            </p>
          </div>
        </div>
        <Link to="/complete-profile" style={{ padding: "10px 24px", fontSize: "12px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", background: user.membershipStatus === "REVISION_REQUESTED" ? "#DC2626" : "#C6A962", color: "#FFFFFF", textDecoration: "none", whiteSpace: "nowrap" }}>
          {user.membershipStatus === "REVISION_REQUESTED" ? "Revise Profile" : user.profileStatus === "INCOMPLETE" ? "Complete Profile" : "Update Profile"}
        </Link>
      </div>
    </div>
  ) : null;

  // ─── EXPERT PROFILE LAYOUT (matches /experts/:id design) ───
  if (isExpert) {
    const eCardStyle = { background: "#FFFFFF", border: "1px solid #E2DDD5", borderLeft: "3px solid #C6A962", padding: "32px", marginBottom: "28px", boxShadow: "0 4px 18px rgba(10,22,40,0.02)" };
    const eSidebarStyle = { background: "#FFFFFF", border: "1px solid #E2DDD5", padding: "28px", marginBottom: "24px" };
    const eTagStyle = { display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 16px", background: "#F8FAFC", border: "1px solid #E2DDD5", color: "#0A1628", fontSize: "13px", fontWeight: 600, marginRight: "8px", marginBottom: "8px" };

    return (
      <Layout header={1} footer={1} breadcrumb="My Profile" title="My Profile">
        {/* HERO */}
        <section style={{ position: "relative", background: "#0A1628", overflow: "hidden", color: "#FFFFFF", padding: "70px 0 60px" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0A1628 0%, rgba(10,22,40,0.96) 100%)" }} />
          <div className="container" style={{ position: "relative", zIndex: 2 }}>
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div style={{ display: "flex", gap: "28px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ width: "130px", height: "130px", borderRadius: "50%", background: avatar ? `url(${avatar}) center/cover` : "#C6A962", border: "4px solid rgba(198,169,98,0.4)", boxShadow: "0 8px 30px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 700, fontSize: "48px", fontFamily: "'Cormorant Garamond', serif", flexShrink: 0 }}>
                    {!avatar && (firstName.charAt(0) || "?").toUpperCase()}
                  </div>
                  <div>
                    <span style={{ background: "rgba(198,169,98,0.12)", border: "1px solid rgba(198,169,98,0.3)", color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", padding: "5px 14px", display: "inline-block", marginBottom: "14px" }}>
                      Industry Expert
                    </span>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 4vw, 42px)", fontWeight: 600, color: "#FFFFFF", margin: "0 0 6px", lineHeight: 1.15 }}>{fullName}</h1>
                    {expertRole && <p style={{ color: "#C6A962", fontSize: "18px", fontWeight: 500, margin: "0 0 4px" }}>{expertRole}</p>}
                    <p style={{ color: "#8DA4BE", fontSize: "15px", margin: 0 }}>{[expertOrg, location].filter(Boolean).join(" \u2022 ")}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
                <div style={{ display: "inline-flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                  {yearsOfExperience && (
                    <span style={{ padding: "10px 20px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", border: "1px solid rgba(198,169,98,0.3)", color: "#C6A962", textAlign: "center" }}>
                      {yearsOfExperience}+ Years Experience
                    </span>
                  )}
                  {linkedinUrl && (
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px 24px", background: "transparent", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(198,169,98,0.4)" }}>
                      <i className="fab fa-linkedin-in"></i> LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C6A962, transparent)" }} />

        {revisionBanner}

        {/* MAIN CONTENT */}
        <section style={{ padding: "60px 0 80px", background: "#F9FAFB" }}>
          <div className="container">
            <div className="row g-4 mb-4 align-items-stretch">
              {/* Bio & Specializations */}
              <div className="col-lg-7 d-flex flex-column">
                <div style={{ ...eCardStyle, marginBottom: 0, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>Personal Bio & Experience</span>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 600, color: "#0A1628", marginBottom: "16px" }}>About {firstName || fullName}</h3>
                    <p style={{ fontSize: "16px", lineHeight: 1.85, color: "#4B5563", marginBottom: "24px" }}>{expertBio}</p>
                  </div>
                  {specializations.length > 0 && (
                    <div style={{ borderTop: "1px solid #E2DDD5", paddingTop: "18px" }}>
                      <span style={{ color: "#0A1628", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>Practice Areas & Specializations</span>
                      <div>{specializations.map((s, i) => <span key={i} style={eTagStyle}><i className="fas fa-check" style={{ color: "#C6A962", fontSize: "11px" }}></i>{s}</span>)}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* Overview & Contact */}
              <div className="col-lg-5 d-flex flex-column">
                <div style={{ ...eSidebarStyle, marginBottom: 0, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>Overview & Contact</span>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, color: "#0A1628", marginBottom: "18px" }}>Professional Details</h4>
                    {[
                      { label: "Organization", value: expertOrg },
                      { label: "Current Role", value: expertRole },
                      { label: "Experience", value: yearsOfExperience ? `${yearsOfExperience} Years` : null },
                      { label: "Location", value: location },
                      { label: "Phone", value: phone },
                      { label: "Email", value: profile?.email },
                    ].filter(r => r.value).map((r, i, a) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < a.length - 1 ? "1px solid #E2DDD5" : "none" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "0.5px" }}>{r.label}</span>
                        <span style={{ fontSize: "14px", color: "#4B5563", textAlign: "right", maxWidth: "60%" }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Speaking, Articles, Awards, Certs */}
            <div className="row g-4 align-items-stretch">
              <div className="col-lg-6 d-flex flex-column gap-4">
                {speakingEngagements.length > 0 && (
                  <div style={{ ...eCardStyle, marginBottom: 0, flex: 1 }}>
                    <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>Engagements</span>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#0A1628", marginBottom: "20px" }}>Speaking Engagements</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {speakingEngagements.map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#0A1628", color: "#C6A962", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className="fas fa-microphone" style={{ fontSize: "14px" }}></i></div>
                          <span style={{ fontSize: "15px", color: "#0A1628", fontWeight: 500 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(awards.length > 0 || certifications.length > 0) && (
                  <div style={{ ...eCardStyle, marginBottom: 0, flex: 1 }}>
                    <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>Achievements</span>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#0A1628", marginBottom: "20px" }}>Awards & Certifications</h4>
                    <div className="row g-4">
                      {awards.length > 0 && (
                        <div className={certifications.length > 0 ? "col-md-6" : "col-12"}>
                          <h6 style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Awards</h6>
                          {awards.map((a, i) => <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}><i className="fas fa-trophy" style={{ color: "#C6A962", marginTop: "4px", fontSize: "14px" }}></i><span style={{ fontSize: "14px", color: "#4B5563" }}>{a}</span></div>)}
                        </div>
                      )}
                      {certifications.length > 0 && (
                        <div className={awards.length > 0 ? "col-md-6" : "col-12"}>
                          <h6 style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Certifications</h6>
                          {certifications.map((c, i) => <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}><i className="fas fa-certificate" style={{ color: "#C6A962", marginTop: "4px", fontSize: "14px" }}></i><span style={{ fontSize: "14px", color: "#4B5563" }}>{c}</span></div>)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="col-lg-6 d-flex flex-column gap-4">
                {publishedArticles.length > 0 && (
                  <div style={{ ...eCardStyle, marginBottom: 0, flex: 1 }}>
                    <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>Publications</span>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#0A1628", marginBottom: "20px" }}>Published Articles</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {publishedArticles.map((article, i) => (
                        <div key={i} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#F8FAFC", border: "1px solid #E2DDD5", color: "#C6A962", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className="far fa-newspaper" style={{ fontSize: "14px" }}></i></div>
                          {article.startsWith("http") ? <a href={article} target="_blank" rel="noopener noreferrer" style={{ fontSize: "15px", color: "#C6A962", fontWeight: 600, textDecoration: "underline" }}>{article}</a> : <span style={{ fontSize: "15px", color: "#0A1628", fontWeight: 500 }}>{article}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Thoughts & Vision */}
        {industryInsights && (
          <section style={{ padding: "45px 0", background: "#FAF9F6" }}>
            <div className="container">
              <div style={{ maxWidth: "1140px", margin: "0 auto", background: "#FFFFFF", border: "1px solid #E2DDD5", borderTop: "3px solid #C6A962", padding: "24px 40px", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "14px" }}>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #C6A962)" }} />
                  <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>Thoughts & Vision</span>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #C6A962, transparent)" }} />
                </div>
                <p style={{ fontSize: "18px", lineHeight: 1.85, color: "#374151", fontStyle: "italic", maxWidth: "800px", margin: "0 auto" }}>"{industryInsights}"</p>
              </div>
            </div>
          </section>
        )}
      </Layout>
    );
  }

  // ─── NON-EXPERT PROFILE LAYOUT (Hotel Owner / Vendor) ───
  return (
    <Layout header={1} footer={1} breadcrumb="My Profile" title="My Profile">
      {/* Header Banner */}
      <section style={{ padding: "60px 0 40px", background: "#0A1628" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {avatar ? (
              <img src={avatar} alt={fullName} style={{ width: "96px", height: "96px", borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(198,169,98,0.3)", flexShrink: 0 }} />
            ) : (
              <div style={{ width: "96px", height: "96px", borderRadius: "50%", background: "#C6A962", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 700, fontSize: "36px", fontFamily: "'Cormorant Garamond', serif", flexShrink: 0, border: "3px solid rgba(198,169,98,0.3)" }}>
                {(fullName.charAt(0) || "?").toUpperCase()}
              </div>
            )}
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 600, color: "#FFFFFF", margin: "0 0 4px" }}>{fullName}</h1>
              {title && <p style={{ color: "#C6A962", fontSize: "16px", fontWeight: 500, margin: "0 0 4px" }}>{title}</p>}
              <p style={{ color: "#8DA4BE", fontSize: "14px", margin: "0 0 8px" }}>{[org, location].filter(Boolean).join(" \u2022 ")}</p>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 12px", background: "rgba(198,169,98,0.15)", color: "#C6A962", letterSpacing: "0.5px" }}>{ROLE_LABELS[memberType] || memberType?.replace(/_/g, " ")}</span>
                <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 12px", background: user.membershipStatus === "APPROVED" ? "rgba(16,185,129,0.15)" : "rgba(234,179,8,0.15)", color: user.membershipStatus === "APPROVED" ? "#10B981" : "#EAB308" }}>{user.membershipStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {revisionBanner}

      {/* Profile Body */}
      <section style={{ padding: "48px 0 80px", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {error && <div style={{ background: "#FEE2E2", color: "#C53030", padding: "12px 16px", marginBottom: "20px", fontSize: "14px" }}>{error}</div>}
              {bio && <Section title="About"><p style={{ fontSize: "15px", color: "#374151", lineHeight: "1.7", whiteSpace: "pre-line" }}>{bio}</p></Section>}
              {businessOverview && <Section title="Business Overview"><p style={{ fontSize: "15px", color: "#374151", lineHeight: "1.7", whiteSpace: "pre-line" }}>{businessOverview}</p></Section>}
              {isHotelOwner && hotels.length > 0 && (
                <Section title={`Properties (${hotels.length})`}>
                  {hotels.map((hotel, i) => (
                    <div key={hotel.id || i} style={{ border: "1px solid #E2DDD5", padding: "20px", marginBottom: "12px", borderLeft: "3px solid #C6A962" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, color: "#0A1628", margin: 0 }}>{hotel.name}</h5>
                        {hotel.starRating > 0 && <div>{starIcons(hotel.starRating)}</div>}
                      </div>
                      <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 8px" }}>
                        {[hotel.city, hotel.state].filter(Boolean).join(", ")}{hotel.propertyType && <span> &middot; {hotel.propertyType}</span>}{hotel.rooms && <span> &middot; {hotel.rooms} rooms</span>}
                      </p>
                      {hotel.description && <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6", margin: 0 }}>{hotel.description}</p>}
                    </div>
                  ))}
                </Section>
              )}
              {isVendor && vp && (
                <Section title="Company Profile">
                  <InfoRow label="Company Name" value={vp.companyName} />
                  <InfoRow label="Category" value={vp.category?.replace(/_/g, " ")} />
                  <InfoRow label="Location" value={[vp.city, vp.state].filter(Boolean).join(", ")} />
                  <InfoRow label="Website" value={vp.website} />
                  <InfoRow label="Phone" value={vp.phone} />
                  <InfoRow label="Employees" value={vp.employeeCount} />
                  <InfoRow label="Services" value={vp.services} />
                </Section>
              )}
              {(achievements || industryContributions) && (
                <Section title="Achievements & Contributions">
                  {achievements && <><p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", marginBottom: "6px" }}>Achievements</p><p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6", whiteSpace: "pre-line", marginBottom: "12px" }}>{achievements}</p></>}
                  {industryContributions && <><p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", marginBottom: "6px" }}>Industry Contributions</p><p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6", whiteSpace: "pre-line" }}>{industryContributions}</p></>}
                </Section>
              )}
            </div>
            <div className="col-lg-4">
              <div style={{ border: "1px solid #E2DDD5", padding: "24px", position: "sticky", top: "100px" }}>
                <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, color: "#0A1628", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #E2DDD5" }}>Contact Info</h5>
                {profile?.email && <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}><i className="fas fa-envelope" style={{ color: "#C6A962", fontSize: "14px", width: "20px" }}></i><span style={{ fontSize: "14px", color: "#374151", wordBreak: "break-all" }}>{profile.email}</span></div>}
                {phone && <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}><i className="fas fa-phone" style={{ color: "#C6A962", fontSize: "14px", width: "20px" }}></i><span style={{ fontSize: "14px", color: "#374151" }}>{phone}</span></div>}
                {location && <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}><i className="fas fa-map-marker-alt" style={{ color: "#C6A962", fontSize: "14px", width: "20px" }}></i><span style={{ fontSize: "14px", color: "#374151" }}>{location}</span></div>}
                {linkedinUrl && <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}><i className="fab fa-linkedin" style={{ color: "#C6A962", fontSize: "14px", width: "20px" }}></i><a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "14px", color: "#C6A962", textDecoration: "none" }}>LinkedIn Profile</a></div>}
                {org && <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}><i className="fas fa-building" style={{ color: "#C6A962", fontSize: "14px", width: "20px" }}></i><span style={{ fontSize: "14px", color: "#374151" }}>{org}</span></div>}
                {yearsInIndustry && <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}><i className="fas fa-briefcase" style={{ color: "#C6A962", fontSize: "14px", width: "20px" }}></i><span style={{ fontSize: "14px", color: "#374151" }}>{yearsInIndustry} years in industry</span></div>}
                {profile?.createdAt && <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #E2DDD5" }}><p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>Member since {new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p></div>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MyProfilePage;
