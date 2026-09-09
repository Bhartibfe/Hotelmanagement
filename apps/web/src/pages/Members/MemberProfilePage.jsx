import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "../../layouts/Layout";
import { getErrorMessage } from "../../lib/errors";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

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
  const { user: currentUser } = useAuth();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // A broken avatar URL falls back to the monogram. Held in state rather than
  // hidden with e.target.nextSibling, so React still owns what is on screen.
  const [avatarBroken, setAvatarBroken] = useState(false);

  // If viewing own profile, redirect to /my-profile
  const isOwnProfile = currentUser && currentUser.id === id;

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getUser(id);
        if (data) {
          setMember(data);
        } else {
          setError(new Error("That member profile does not exist. It may have been removed."));
        }
      } catch (err) {
        // The reason matters: "no longer a member" and "you are offline" call
        // for completely different reactions from the person reading it.
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  if (isOwnProfile) {
    return <Navigate to="/my-profile" replace />;
  }

  if (loading) {
    return (
      <Layout breadcrumb="Members" title="Member Profile">
        <section style={{ padding: "48px 0", textAlign: "center" }}>
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
        <section style={{ padding: "48px 0", textAlign: "center" }}>
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
              {error && error.status && error.status !== 404 ? "This profile could not be loaded" : "Profile Not Found"}
            </h3>
            <p style={{ color: "#6B7280", fontSize: "15px", marginBottom: "24px", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
              {getErrorMessage(error, "The member profile you are looking for does not exist.")}
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
              Back to Owners Directory
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
  // LinkedIn is collected on the profile form but never shown publicly, and
  // owners keep email/phone/website private — so owners expose no contact
  // details at all and this block does not render for them.
  const hasContactInfo = Boolean(
    !isHotelOwner && (member.email || member.phone || member.websiteUrl || member.website)
  );

  return (
    <Layout breadcrumb="Members" title="Member Profile">
      {/* Written as classes rather than inline style because the sizing needs
          clamp() and a breakpoint, neither of which an inline style can express. */}
      <style>{`
        .member-hero {
          display: flex;
          align-items: center;
          gap: clamp(20px, 3vw, 34px);
        }
        .member-hero__text { min-width: 0; }

        /* Scales 112 -> 168px with the viewport. The old fixed 100px left the
           portrait smaller than the name next to it; the upper bound keeps it
           from crowding the name on a wide screen. aspect-ratio guarantees a
           true circle, so a non-square source can never render an oval. */
        .member-avatar {
          position: relative;
          /* Same figure as the expert/advisory hero
             (components/profile/ExpertProfileView.jsx), so the three detail
             pages present a person at one consistent size. */
          width: clamp(112px, 10vw, 140px);
          aspect-ratio: 1;
          flex-shrink: 0;
        }
        .member-avatar__img,
        .member-avatar__monogram {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .member-avatar__img {
          object-fit: cover;
          /* THE FIX for "doesn't fit": faces sit in the upper third of a
             portrait, and the default 50% 50% crops straight through them.
             Matches .owner-card__media on the list page. */
          object-position: center top;
          background: #16243A;
        }
        .member-avatar__monogram {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .member-avatar__monogram span {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          color: #FFFFFF;
          /* Tracks the circle instead of a fixed 36px, so the initial stays
             optically centred at every size. */
          font-size: clamp(38px, 4vw, 50px);
          line-height: 1;
        }
        /* Offset gold ring, echoing .owner-card__frame on the list page. */
        .member-avatar__frame {
          position: absolute;
          inset: -11px;
          border-radius: 50%;
          border: 1px solid rgba(198, 169, 98, 0.38);
          pointer-events: none;
        }

        @media (max-width: 575.98px) {
          /* Stacked and centred on a phone: side by side, the circle leaves too
             little room for the name and it wraps to three or four lines. */
          .member-hero {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }
      `}</style>

      {/* Profile Header. The vertical padding is deliberately tighter than the
          rest of the page: the avatar now carries the height, so the old
          40/60 left a band of empty navy above and below it. */}
      <section style={{ padding: "20px 0 28px", background: "#0A1628", position: "relative" }}>
        <div className="container">
          {/* Matches the back link at the top of the expert hero
              (components/profile/ExpertProfileView.jsx). This page previously
              only offered the way back from the closing CTA, so anyone who had
              scrolled had to go all the way down to leave. */}
          <div style={{ marginBottom: "16px" }}>
            <Link
              to="/members"
              style={{ color: "#8DA4BE", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}
            >
              <i className="fas fa-arrow-left" style={{ marginRight: "8px" }}></i> Back to Owners Directory
            </Link>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-8" data-aos="fade-right">
              <div className="member-hero">
                {/* Avatar.

                    Three things were wrong with the old 100px circle:

                    1. object-fit: cover with no object-position centres the
                       crop, and a portrait photo has the face in its upper
                       third — so heads were being cut off. The owner cards on
                       the list page already anchor to `center top` for exactly
                       this reason; this now matches them.
                    2. 100px is smaller than the name beside it, so the person
                       read as secondary to their own heading on their own page.
                    3. A flat ring on a dark ground looked unfinished next to
                       the gold-framed cards the list page shows.

                    The frame echoes .owner-card__frame so the two views share
                    one visual language. */}
                <div className="member-avatar">
                  {hasAvatar && !avatarBroken ? (
                    <img
                      className="member-avatar__img"
                      src={member.avatar}
                      alt={fullName}
                      onError={() => setAvatarBroken(true)}
                    />
                  ) : (
                    <div
                      className="member-avatar__monogram"
                      style={{ background: roleColor }}
                      aria-hidden="true"
                    >
                      <span>{(fullName.charAt(0) || "?").toUpperCase()}</span>
                    </div>
                  )}
                  <span className="member-avatar__frame" aria-hidden="true" />
                </div>

                <div className="member-hero__text">
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
              {hasContactInfo && (
                <>
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
                    {!isHotelOwner && member.email && (
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
                    {!isHotelOwner && member.phone && (
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
                    {!isHotelOwner && (member.websiteUrl || member.website) && (
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
                  </div>
                </div>
                </>
              )}
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
                  Back to Owners Directory
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
