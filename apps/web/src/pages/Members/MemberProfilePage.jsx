import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "../../layouts/Layout";
import { api } from "../../services/api";

const ROLE_LABELS = {
  HOTEL_OWNER: "Hotel Owner",
  OWNER: "Hotel Owner",
  VENDOR: "Vendor / Supplier",
  SERVICE_PROVIDER: "Service Provider",
  PROFESSIONAL: "Industry Professional",
  CONSULTANT: "Consultant / Advisor",
  INVESTOR: "Investor",
};

const ROLE_COLORS = {
  HOTEL_OWNER: "#C6A962",
  OWNER: "#C6A962",
  VENDOR: "#3B82F6",
  SERVICE_PROVIDER: "#3B82F6",
  INVESTOR: "#1A365D",
  PROFESSIONAL: "#553C9A",
  CONSULTANT: "#EA580C",
};

const TIER_COLORS = {
  PLATINUM: "#8B8B8B",
  GOLD: "#C6A962",
  SILVER: "#6B7280",
};

const MemberProfilePage = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getUser(id);
        if (data) {
          setMember(data);
        } else {
          setError("Member not found.");
        }
      } catch (err) {
        setError("Failed to load member profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <Layout breadcrumb="Members" title="Member Profile">
        <section style={{ padding: "120px 0", textAlign: "center" }}>
          <div className="container">
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "3px solid #E2DDD5",
                borderTopColor: "#C6A962",
                borderRadius: "50%",
                margin: "0 auto 20px",
                animation: "profileSpin 0.8s linear infinite",
              }}
            />
            <p style={{ fontSize: "16px", color: "#6B7280", fontFamily: "'Cormorant Garamond', serif" }}>
              Loading profile...
            </p>
            <style>{`@keyframes profileSpin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !member) {
    return (
      <Layout breadcrumb="Members" title="Member Profile">
        <section style={{ padding: "120px 0", textAlign: "center" }}>
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
              }}
            >
              <i className="fas fa-exclamation-triangle" style={{ fontSize: "28px", color: "#EF4444" }}></i>
            </div>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "28px",
                fontWeight: 600,
                color: "#0A1628",
                marginBottom: "12px",
              }}
            >
              Profile Not Found
            </h3>
            <p style={{ color: "#6B7280", fontSize: "15px", marginBottom: "24px" }}>
              {error || "The member profile you are looking for does not exist."}
            </p>
            <Link
              to="/members"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#C6A962",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              <i className="fas fa-arrow-left" style={{ marginRight: "8px" }}></i>
              Back to Members Directory
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  // Derive fields from the member data
  const memberType = member.memberType || member.role || "HOTEL_OWNER";
  const roleColor = ROLE_COLORS[memberType] || "#C6A962";
  const isHotelOwner = memberType === "HOTEL_OWNER" || memberType === "OWNER";
  const isVendor = memberType === "VENDOR" || memberType === "SERVICE_PROVIDER";
  const isProfessional = memberType === "PROFESSIONAL" || memberType === "CONSULTANT";

  const fullName = `${member.salutation ? member.salutation + " " : ""}${member.firstName || ""} ${member.lastName || ""}`.trim() || member.name || "Member";
  const displayTitle = member.designation || member.title || "";
  const displayOrg = member.organizationName || member.companyName || member.company || "";
  const displayCity = member.city || "";
  const displayState = member.state || "";
  const location = [displayCity, displayState].filter(Boolean).join(", ");
  const hasAvatar = member.avatar && member.avatar.trim() !== "";
  const bio = member.bio || "";
  const hotels = member.hotels || [];
  const vendorProfile = member.vendorProfile || {};
  const vendorProducts = vendorProfile.products || [];
  const expertProfile = member.expertProfile || {};
  const achievements = member.achievements || [];
  const memberSince = member.memberSince || (member.createdAt ? new Date(member.createdAt).getFullYear().toString() : "");

  return (
    <Layout breadcrumb="Members" title="Member Profile">
      {/* Profile Header */}
      <section style={{ padding: "80px 0 60px", background: "#0A1628", position: "relative" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8" data-aos="fade-right">
              <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
                {/* Avatar */}
                {hasAvatar ? (
                  <img
                    src={member.avatar}
                    alt={fullName}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid rgba(198,169,98,0.3)",
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: roleColor,
                    display: hasAvatar ? "none" : "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "36px",
                    fontFamily: "'Cormorant Garamond', serif",
                    flexShrink: 0,
                    border: "3px solid rgba(198,169,98,0.3)",
                  }}
                >
                  {(fullName.charAt(0) || "?").toUpperCase()}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <h1
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(28px, 4vw, 40px)",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        margin: 0,
                      }}
                    >
                      {fullName}
                    </h1>
                    {member.verified && (
                      <i className="fas fa-check-circle" style={{ color: "#C6A962", fontSize: "20px" }}></i>
                    )}
                  </div>
                  {displayTitle && (
                    <p style={{ color: "#C6A962", fontSize: "17px", fontWeight: 500, marginBottom: "4px" }}>
                      {displayTitle}
                    </p>
                  )}
                  <p style={{ color: "#8DA4BE", fontSize: "15px", margin: 0 }}>
                    {[displayOrg, location].filter(Boolean).join(" \u2022 ")}
                  </p>
                  <div style={{ marginTop: "10px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "4px 12px",
                        borderRadius: "12px",
                        background: "rgba(198, 169, 98, 0.15)",
                        color: "#C6A962",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {ROLE_LABELS[memberType] || memberType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end" data-aos="fade-left">
              <div style={{ display: "inline-flex", gap: "12px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end", marginTop: "16px" }}>
                {member.membershipTier && (
                  <span
                    style={{
                      padding: "8px 20px",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      background: TIER_COLORS[member.membershipTier] || "#C6A962",
                      color: "#FFFFFF",
                    }}
                  >
                    {member.membershipTier} Member
                  </span>
                )}
                {memberSince && (
                  <span
                    style={{
                      padding: "8px 20px",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      border: "1px solid rgba(198,169,98,0.3)",
                      color: "#8DA4BE",
                    }}
                  >
                    Since {memberSince}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      {bio && (
        <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-8" data-aos="fade-up">
                <p
                  style={{
                    fontSize: "18px",
                    lineHeight: 1.9,
                    color: "#4B5563",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    borderLeft: "3px solid #C6A962",
                    paddingLeft: "24px",
                  }}
                >
                  {bio}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gold Divider */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C6A962, transparent)" }}></div>

      {/* HOTEL_OWNER: Organization Info */}
      {isHotelOwner && displayOrg && (
        <section style={{ padding: "80px 0", background: "#F9FAFB" }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-12" style={{ marginBottom: "40px" }}>
                <span
                  style={{
                    color: "#C6A962",
                    letterSpacing: "3px",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "12px",
                  }}
                  data-aos="fade-up"
                >
                  Organization
                </span>
                <h2
                  data-aos="fade-up"
                  data-aos-delay="100"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: 600,
                    color: "#0A1628",
                  }}
                >
                  {displayOrg}
                </h2>
              </div>
            </div>
            <div className="row" data-aos="fade-up" data-aos-delay="200">
              <div className="col-lg-8">
                {member.companyDescription && (
                  <p style={{ fontSize: "16px", lineHeight: 1.8, color: "#4B5563", marginBottom: "32px" }}>
                    {member.companyDescription}
                  </p>
                )}
              </div>
              <div className="col-lg-4">
                <div style={{ background: "#FFFFFF", padding: "28px", border: "1px solid #E2DDD5" }}>
                  {[
                    { label: "Designation", value: member.designation },
                    { label: "Founded", value: member.yearFounded },
                    { label: "Headquarters", value: [member.headquartersCity, member.headquartersState].filter(Boolean).join(", ") },
                    { label: "Employees", value: member.employeeCount },
                  ].filter((item) => item.value).map((item, idx, arr) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom: idx < arr.length - 1 ? "1px solid #E2DDD5" : "none",
                      }}
                    >
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#0A1628", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: "14px", color: "#4B5563" }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* HOTEL_OWNER: Hotels Section */}
      {isHotelOwner && hotels.length > 0 && (
        <>
          <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C6A962, transparent)" }}></div>
          <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
            <div className="container">
              <div style={{ marginBottom: "40px" }}>
                <span
                  style={{
                    color: "#C6A962",
                    letterSpacing: "3px",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "12px",
                  }}
                  data-aos="fade-up"
                >
                  Properties
                </span>
                <h2
                  data-aos="fade-up"
                  data-aos-delay="100"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: 600,
                    color: "#0A1628",
                  }}
                >
                  Hotel Portfolio
                </h2>
              </div>
              <div className="row">
                {hotels.map((hotel, i) => (
                  <div key={hotel.id || i} className="col-lg-6" data-aos="fade-up" data-aos-delay={i * 100}>
                    <div
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E2DDD5",
                        padding: "28px",
                        marginBottom: "24px",
                        borderLeft: "3px solid #C6A962",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 12px 32px rgba(10,22,40,0.06)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <h5
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "20px",
                          fontWeight: 600,
                          color: "#0A1628",
                          marginBottom: "12px",
                        }}
                      >
                        {hotel.name || "Unnamed Hotel"}
                      </h5>
                      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "13px", color: "#6B7280" }}>
                        {(hotel.city || hotel.location) && (
                          <span><i className="fas fa-map-marker-alt" style={{ marginRight: "4px", color: "#C6A962" }}></i>{hotel.city || hotel.location}</span>
                        )}
                        {(hotel.propertyType || hotel.category || hotel.hotelType) && (
                          <span><i className="far fa-building" style={{ marginRight: "4px", color: "#C6A962" }}></i>{hotel.propertyType || hotel.category || hotel.hotelType}</span>
                        )}
                        {(hotel.rooms || hotel.totalRooms) && (
                          <span><i className="fas fa-bed" style={{ marginRight: "4px", color: "#C6A962" }}></i>{hotel.rooms || hotel.totalRooms} rooms</span>
                        )}
                        {hotel.starRating && (
                          <span>
                            {Array.from({ length: hotel.starRating }, (_, i) => (
                              <i key={i} className="fas fa-star" style={{ color: "#C6A962", fontSize: "11px", marginRight: "1px" }}></i>
                            ))}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* VENDOR: Company Details */}
      {isVendor && (vendorProfile.companyName || displayOrg) && (
        <>
          <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C6A962, transparent)" }}></div>
          <section style={{ padding: "80px 0", background: "#F9FAFB" }}>
            <div className="container">
              <div style={{ marginBottom: "40px" }}>
                <span style={{ color: "#C6A962", letterSpacing: "3px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "12px" }} data-aos="fade-up">
                  Company
                </span>
                <h2 data-aos="fade-up" data-aos-delay="100" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, color: "#0A1628" }}>
                  {vendorProfile.companyName || displayOrg}
                </h2>
              </div>
              <div className="row" data-aos="fade-up" data-aos-delay="200">
                <div className="col-lg-8">
                  {(vendorProfile.companyDescription || member.companyDescription) && (
                    <p style={{ fontSize: "16px", lineHeight: 1.8, color: "#4B5563", marginBottom: "32px" }}>
                      {vendorProfile.companyDescription || member.companyDescription}
                    </p>
                  )}
                </div>
                <div className="col-lg-4">
                  <div style={{ background: "#FFFFFF", padding: "28px", border: "1px solid #E2DDD5" }}>
                    {[
                      { label: "Category", value: vendorProfile.category || member.category },
                      { label: "Employees", value: vendorProfile.employeeCount || member.employeeCount },
                      { label: "GST", value: vendorProfile.gstNumber },
                      { label: "Years in Industry", value: member.yearsInIndustry },
                    ].filter((item) => item.value).map((item, idx, arr) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: idx < arr.length - 1 ? "1px solid #E2DDD5" : "none" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#0A1628", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</span>
                        <span style={{ fontSize: "14px", color: "#4B5563" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* VENDOR: Products */}
      {isVendor && vendorProducts.length > 0 && (
        <>
          <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C6A962, transparent)" }}></div>
          <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
            <div className="container">
              <div style={{ marginBottom: "40px" }}>
                <span style={{ color: "#C6A962", letterSpacing: "3px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "12px" }} data-aos="fade-up">
                  Offerings
                </span>
                <h2 data-aos="fade-up" data-aos-delay="100" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, color: "#0A1628" }}>
                  Products & Services
                </h2>
              </div>
              <div className="row">
                {vendorProducts.map((product, i) => (
                  <div key={product.id || i} className="col-lg-6" data-aos="fade-up" data-aos-delay={i * 100}>
                    <div style={{ background: "#FFFFFF", border: "1px solid #E2DDD5", padding: "28px", marginBottom: "24px", borderLeft: "3px solid #3B82F6", transition: "all 0.3s ease" }}>
                      <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#0A1628", marginBottom: "8px" }}>
                        {product.name || "Unnamed Product"}
                      </h5>
                      {product.category && (
                        <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", background: "#EFF6FF", color: "#3B82F6", borderRadius: "8px", display: "inline-block", marginBottom: "8px" }}>
                          {product.category}
                        </span>
                      )}
                      {product.description && (
                        <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6, margin: "8px 0 0" }}>{product.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* PROFESSIONAL/CONSULTANT: Expert Profile */}
      {isProfessional && (expertProfile.expertise || expertProfile.specializations || expertProfile.currentOrganization) && (
        <>
          <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C6A962, transparent)" }}></div>
          <section style={{ padding: "80px 0", background: "#F9FAFB" }}>
            <div className="container">
              <div style={{ marginBottom: "40px" }}>
                <span style={{ color: "#C6A962", letterSpacing: "3px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "12px" }} data-aos="fade-up">
                  Expertise
                </span>
                <h2 data-aos="fade-up" data-aos-delay="100" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, color: "#0A1628" }}>
                  Professional Profile
                </h2>
              </div>
              <div className="row" data-aos="fade-up" data-aos-delay="200">
                <div className="col-lg-8">
                  {expertProfile.expertise && (
                    <p style={{ fontSize: "16px", lineHeight: 1.8, color: "#4B5563", marginBottom: "24px" }}>{expertProfile.expertise}</p>
                  )}
                  {expertProfile.specializations && (
                    <div style={{ marginBottom: "24px" }}>
                      <h6 style={{ fontSize: "13px", fontWeight: 600, color: "#0A1628", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
                        Specializations
                      </h6>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {(Array.isArray(expertProfile.specializations) ? expertProfile.specializations : [expertProfile.specializations]).map((spec, i) => (
                          <span key={i} style={{ fontSize: "13px", padding: "6px 14px", background: "rgba(198, 169, 98, 0.1)", border: "1px solid #C6A962", color: "#0A1628", borderRadius: "20px" }}>
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {expertProfile.insights && (
                    <div style={{ marginBottom: "24px" }}>
                      <h6 style={{ fontSize: "13px", fontWeight: 600, color: "#0A1628", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Industry Insights</h6>
                      <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#4B5563" }}>{expertProfile.insights}</p>
                    </div>
                  )}
                </div>
                <div className="col-lg-4">
                  <div style={{ background: "#FFFFFF", padding: "28px", border: "1px solid #E2DDD5" }}>
                    {[
                      { label: "Organization", value: expertProfile.currentOrganization || displayOrg },
                      { label: "Role", value: expertProfile.currentRole || member.designation },
                      { label: "Experience", value: expertProfile.yearsOfExperience ? `${expertProfile.yearsOfExperience} years` : member.yearsInIndustry ? `${member.yearsInIndustry} years` : null },
                    ].filter((item) => item.value).map((item, idx, arr) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: idx < arr.length - 1 ? "1px solid #E2DDD5" : "none" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#0A1628", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</span>
                        <span style={{ fontSize: "14px", color: "#4B5563" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Achievements - All member types */}
      {achievements && ((Array.isArray(achievements) && achievements.length > 0) || (!Array.isArray(achievements) && achievements)) && (
        <>
          <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C6A962, transparent)" }}></div>
          <section style={{ padding: "80px 0", background: "#F9FAFB" }}>
            <div className="container">
              <div style={{ marginBottom: "40px" }}>
                <span style={{ color: "#C6A962", letterSpacing: "3px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "12px" }} data-aos="fade-up">
                  Recognition
                </span>
                <h2 data-aos="fade-up" data-aos-delay="100" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, color: "#0A1628" }}>
                  Awards & Achievements
                </h2>
              </div>
              {Array.isArray(achievements) ? (
                <div className="row">
                  {achievements.map((ach, i) => (
                    <div key={i} className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay={i * 80}>
                      <div style={{ background: "#FFFFFF", padding: "28px 24px", marginBottom: "24px", textAlign: "center", border: "1px solid #E2DDD5", transition: "all 0.3s ease" }}>
                        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#0A1628", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                          <i className="fas fa-trophy" style={{ color: "#C6A962", fontSize: "22px" }}></i>
                        </div>
                        <h6 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 600, color: "#0A1628", marginBottom: "6px", lineHeight: 1.3 }}>
                          {typeof ach === "string" ? ach : ach.title}
                        </h6>
                        {ach.year && <p style={{ fontSize: "13px", color: "#C6A962", fontWeight: 600, marginBottom: "2px" }}>{ach.year}</p>}
                        {ach.org && <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>{ach.org}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="row">
                  <div className="col-lg-8" data-aos="fade-up">
                    <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#4B5563" }}>{achievements}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Gold Divider */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C6A962, transparent)" }}></div>

      {/* Contact Section */}
      <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8" data-aos="fade-up">
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <span style={{ color: "#C6A962", letterSpacing: "3px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
                  Get in Touch
                </span>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 600, color: "#0A1628" }}>
                  Contact {(member.firstName || fullName.split(" ")[0])}
                </h2>
              </div>
              <div style={{ background: "#F9FAFB", padding: "40px", border: "1px solid #E2DDD5" }}>
                <div className="row">
                  {member.email && (
                    <div className="col-md-6" style={{ marginBottom: "24px" }}>
                      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                        <div style={{ width: "44px", height: "44px", background: "#0A1628", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <i className="far fa-envelope" style={{ color: "#C6A962", fontSize: "16px" }}></i>
                        </div>
                        <div>
                          <span style={{ fontSize: "12px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "2px" }}>Email</span>
                          <span style={{ fontSize: "14px", color: "#0A1628", fontWeight: 500 }}>{member.email}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {member.phone && (
                    <div className="col-md-6" style={{ marginBottom: "24px" }}>
                      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                        <div style={{ width: "44px", height: "44px", background: "#0A1628", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <i className="fas fa-phone-alt" style={{ color: "#C6A962", fontSize: "16px" }}></i>
                        </div>
                        <div>
                          <span style={{ fontSize: "12px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "2px" }}>Phone</span>
                          <span style={{ fontSize: "14px", color: "#0A1628", fontWeight: 500 }}>{member.phone}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {(member.websiteUrl || member.website) && (
                    <div className="col-md-6" style={{ marginBottom: "24px" }}>
                      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                        <div style={{ width: "44px", height: "44px", background: "#0A1628", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <i className="fas fa-globe" style={{ color: "#C6A962", fontSize: "16px" }}></i>
                        </div>
                        <div>
                          <span style={{ fontSize: "12px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "2px" }}>Website</span>
                          <span style={{ fontSize: "14px", color: "#0A1628", fontWeight: 500 }}>{member.websiteUrl || member.website}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {(member.linkedinUrl || member.linkedin) && (
                    <div className="col-md-6" style={{ marginBottom: "24px" }}>
                      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                        <div style={{ width: "44px", height: "44px", background: "#0A1628", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <i className="fab fa-linkedin-in" style={{ color: "#C6A962", fontSize: "16px" }}></i>
                        </div>
                        <div>
                          <span style={{ fontSize: "12px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "2px" }}>LinkedIn</span>
                          <span style={{ fontSize: "14px", color: "#0A1628", fontWeight: 500 }}>{member.linkedinUrl || member.linkedin}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center" style={{ marginTop: "32px" }}>
                <Link
                  to="/members"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#C6A962",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                  }}
                >
                  <i className="fas fa-arrow-left" style={{ marginRight: "8px" }}></i>
                  Back to Members Directory
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MemberProfilePage;
