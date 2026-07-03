import React, { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../../services/api";

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLE_LABELS = {
  HOTEL_OWNER: "Hotel Owner",
  OWNER: "Hotel Owner",
  VENDOR: "Vendor / Supplier",
  SERVICE_PROVIDER: "Service Provider",
  PROFESSIONAL: "Professional",
  CONSULTANT: "Consultant",
  INVESTOR: "Investor",
};

const ROLE_COLORS = {
  HOTEL_OWNER: { bg: "#FEF9E7", color: "#C6A962" },
  OWNER: { bg: "#FEF9E7", color: "#C6A962" },
  VENDOR: { bg: "#EFF6FF", color: "#3B82F6" },
  SERVICE_PROVIDER: { bg: "#EFF6FF", color: "#3B82F6" },
  INVESTOR: { bg: "#F5F3FF", color: "#8B5CF6" },
  PROFESSIONAL: { bg: "#ECFDF5", color: "#10B981" },
  CONSULTANT: { bg: "#FFF7ED", color: "#EA580C" },
};

const STATUS_CONFIG = {
  PENDING: { bg: "#FFFBEB", color: "#F59E0B", label: "Pending", icon: "fa-clock" },
  APPROVED: { bg: "#ECFDF5", color: "#10B981", label: "Approved", icon: "fa-check-circle" },
  REJECTED: { bg: "#FEF2F2", color: "#EF4444", label: "Rejected", icon: "fa-times-circle" },
  REVISION_REQUESTED: { bg: "#FFF7ED", color: "#F97316", label: "Revision", icon: "fa-edit" },
};

const FILTER_TABS = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
  { key: "REVISION_REQUESTED", label: "Revision Requested" },
];

const FLAGGABLE_FIELDS = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "bio", label: "Bio" },
  { key: "organizationName", label: "Organization Name" },
  { key: "city", label: "City" },
  { key: "linkedinUrl", label: "LinkedIn URL" },
  { key: "businessOverview", label: "Business Overview" },
  { key: "achievements", label: "Achievements" },
  { key: "industryContributions", label: "Industry Contributions" },
  { key: "hotels", label: "Hotels" },
  { key: "vendorProfile", label: "Vendor Profile" },
  { key: "expertProfile", label: "Expert Profile" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getInitials = (first, last) => {
  return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase() || "?";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const renderStars = (count) => {
  const stars = [];
  for (let i = 0; i < (count || 0); i++) {
    stars.push(
      <i key={i} className="fas fa-star" style={{ color: "#C6A962", fontSize: "11px" }} />
    );
  }
  return stars;
};

// ─── Modal Profile Panel ────────────────────────────────────────────────────

const ProfilePanel = ({ user, onClose, onApprove, onReject, onRevision, actionLoading }) => {
  const [activeAction, setActiveAction] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [revisionNote, setRevisionNote] = useState("");
  const [flaggedFields, setFlaggedFields] = useState([]);
  const [animateIn, setAnimateIn] = useState(false);
  const modalRef = useRef(null);

  // Animate in on mount
  useEffect(() => {
    if (user) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimateIn(true);
        });
      });
    }
  }, [user]);

  // Reset state when user changes
  useEffect(() => {
    setActiveAction(null);
    setRejectReason("");
    setRevisionNote("");
    setFlaggedFields([]);
  }, [user]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && user) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const toggleField = (fieldKey) => {
    setFlaggedFields((prev) =>
      prev.includes(fieldKey) ? prev.filter((f) => f !== fieldKey) : [...prev, fieldKey]
    );
  };

  const handleApproveClick = () => {
    onApprove(user.id);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) return;
    onReject(user.id, rejectReason.trim());
  };

  const handleRevisionSubmit = () => {
    if (!revisionNote.trim() || flaggedFields.length === 0) return;
    onRevision(user.id, { flaggedFields, adminNote: revisionNote.trim() });
  };

  if (!user) return null;

  const fullName = `${user.salutation ? user.salutation + " " : ""}${user.firstName || ""} ${user.lastName || ""}`.trim();
  const memberType = user.memberType || user.role;
  const isHotelOwner = memberType === "HOTEL_OWNER" || memberType === "OWNER";
  const isVendor = memberType === "VENDOR" || memberType === "SERVICE_PROVIDER";
  const isProfessional = memberType === "PROFESSIONAL" || memberType === "CONSULTANT";
  const hotels = user.hotels || [];
  const vendorProfile = user.vendorProfile || {};
  const vendorProducts = vendorProfile.products || [];
  const expertProfile = user.expertProfile || {};
  const statusCfg = STATUS_CONFIG[user.membershipStatus] || STATUS_CONFIG.PENDING;
  const isPending = user.membershipStatus === "PENDING" || user.membershipStatus === "REVISION_REQUESTED";

  // Check if avatar is available
  const hasAvatar = user.avatar && user.avatar.trim() !== "";

  // ─── Section Component ─────────────────────────────────────────────────────
  const Section = ({ title, icon, children }) => (
    <div style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "14px",
          paddingBottom: "10px",
          borderBottom: "1px solid #F1F5F9",
        }}
      >
        <i className={`fas ${icon}`} style={{ fontSize: "13px", color: "#C6A962" }} />
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "17px",
            fontWeight: 700,
            color: "#0A1628",
            margin: 0,
          }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }) => {
    if (!value) return null;
    return (
      <div style={{ display: "flex", marginBottom: "8px", fontSize: "13px", lineHeight: 1.6 }}>
        <span style={{ color: "#64748B", minWidth: "130px", flexShrink: 0, fontWeight: 500 }}>{label}</span>
        <span style={{ color: "#0A1628", wordBreak: "break-word" }}>{value}</span>
      </div>
    );
  };

  return (
    <>
      {/* Modal animation styles */}
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10, 22, 40, 0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          opacity: animateIn ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      >
        {/* Modal */}
        <div
          ref={modalRef}
          style={{
            width: "100%",
            maxWidth: "700px",
            maxHeight: "85vh",
            background: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            opacity: animateIn ? 1 : 0,
            transform: animateIn ? "scale(1) translateY(0)" : "scale(0.95) translateY(10px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            style={{
              padding: "20px 28px",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#FAFBFC",
              flexShrink: 0,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#0A1628",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Applicant Profile
              </h2>
              <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0 0" }}>
                Review complete membership application
              </p>
            </div>
            <button
              onClick={handleClose}
              style={{
                width: "36px",
                height: "36px",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                background: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                color: "#64748B",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#C6A962";
                e.currentTarget.style.color = "#C6A962";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.color = "#64748B";
              }}
            >
              <i className="fas fa-times" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 28px",
            }}
          >
            {/* Profile Card Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
                padding: "20px",
                background: "linear-gradient(135deg, #0A1628 0%, #1E293B 100%)",
                borderRadius: "12px",
              }}
            >
              {/* Avatar - show photo or fallback to initials */}
              {hasAvatar ? (
                <img
                  src={user.avatar}
                  alt={fullName}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    border: "2px solid #C6A962",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    // If image fails to load, hide it and show initials
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(198, 169, 98, 0.15)",
                  border: "2px solid #C6A962",
                  display: hasAvatar ? "none" : "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#C6A962",
                  fontWeight: 700,
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", fontFamily: "'Cormorant Garamond', serif" }}>
                  {fullName}
                </div>
                <div style={{ fontSize: "13px", color: "#94A3B8", marginTop: "2px" }}>{user.email}</div>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: "10px",
                      background: (ROLE_COLORS[memberType] || { bg: "#F1F5F9" }).bg,
                      color: (ROLE_COLORS[memberType] || { color: "#475569" }).color,
                    }}
                  >
                    {ROLE_LABELS[memberType] || memberType}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "10px",
                      background: statusCfg.bg,
                      color: statusCfg.color,
                    }}
                  >
                    <i className={`fas ${statusCfg.icon}`} style={{ marginRight: "4px", fontSize: "9px" }} />
                    {statusCfg.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <Section title="Personal Information" icon="fa-user">
              <InfoRow label="Salutation" value={user.salutation} />
              <InfoRow label="Full Name" value={`${user.firstName || ""} ${user.lastName || ""}`} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Phone" value={user.phone} />
              <InfoRow
                label="LinkedIn"
                value={
                  user.linkedinUrl ? (
                    <a
                      href={user.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#3B82F6", textDecoration: "none" }}
                    >
                      {user.linkedinUrl}
                    </a>
                  ) : null
                }
              />
              <InfoRow label="City" value={user.city} />
              <InfoRow label="Years in Industry" value={user.yearsInIndustry} />
              <InfoRow label="Applied On" value={formatDate(user.createdAt)} />
            </Section>

            {/* Bio */}
            {user.bio && (
              <Section title="Bio" icon="fa-align-left">
                <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.7, margin: 0 }}>{user.bio}</p>
              </Section>
            )}

            {/* Organization Info */}
            {user.organizationName && (
              <Section title="Organization" icon="fa-building">
                <InfoRow label="Name" value={user.organizationName} />
                <InfoRow label="Designation" value={user.designation} />
              </Section>
            )}

            {/* Hotel Owner Specific */}
            {isHotelOwner && hotels.length > 0 && (
              <Section title={`Hotels (${hotels.length})`} icon="fa-hotel">
                {hotels.map((hotel, idx) => (
                  <div
                    key={hotel.id || idx}
                    style={{
                      padding: "14px 16px",
                      background: "#F8FAFC",
                      borderRadius: "8px",
                      border: "1px solid #F1F5F9",
                      marginBottom: idx < hotels.length - 1 ? "10px" : 0,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628" }}>
                        {hotel.name || "Unnamed Hotel"}
                      </span>
                      <div style={{ display: "flex", gap: "2px" }}>{renderStars(hotel.starRating)}</div>
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748B", display: "flex", flexWrap: "wrap", gap: "16px" }}>
                      {hotel.city && (
                        <span>
                          <i className="fas fa-map-marker-alt" style={{ marginRight: "4px", fontSize: "10px", color: "#94A3B8" }} />
                          {hotel.city}
                        </span>
                      )}
                      {hotel.totalRooms && (
                        <span>
                          <i className="fas fa-door-open" style={{ marginRight: "4px", fontSize: "10px", color: "#94A3B8" }} />
                          {hotel.totalRooms} rooms
                        </span>
                      )}
                      {hotel.hotelType && (
                        <span>
                          <i className="fas fa-tag" style={{ marginRight: "4px", fontSize: "10px", color: "#94A3B8" }} />
                          {hotel.hotelType}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </Section>
            )}

            {/* Vendor Specific */}
            {isVendor && (
              <>
                {(vendorProfile.companyName || vendorProfile.gstNumber || vendorProfile.panNumber) && (
                  <Section title="Company & Compliance" icon="fa-briefcase">
                    <InfoRow label="Company" value={vendorProfile.companyName} />
                    <InfoRow label="GST Number" value={vendorProfile.gstNumber} />
                    <InfoRow label="PAN Number" value={vendorProfile.panNumber} />
                    <InfoRow label="Annual Revenue" value={vendorProfile.annualRevenue} />
                    <InfoRow label="Employee Count" value={vendorProfile.employeeCount} />
                  </Section>
                )}
                {vendorProducts.length > 0 && (
                  <Section title={`Products (${vendorProducts.length})`} icon="fa-box">
                    {vendorProducts.map((product, idx) => (
                      <div
                        key={product.id || idx}
                        style={{
                          padding: "14px 16px",
                          background: "#F8FAFC",
                          borderRadius: "8px",
                          border: "1px solid #F1F5F9",
                          marginBottom: idx < vendorProducts.length - 1 ? "10px" : 0,
                        }}
                      >
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", marginBottom: "4px" }}>
                          {product.name || "Unnamed Product"}
                        </div>
                        {product.category && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 600,
                              padding: "2px 8px",
                              background: "#EFF6FF",
                              color: "#3B82F6",
                              borderRadius: "8px",
                              display: "inline-block",
                              marginBottom: "6px",
                            }}
                          >
                            {product.category}
                          </span>
                        )}
                        {product.description && (
                          <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0", lineHeight: 1.5 }}>
                            {product.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </Section>
                )}
              </>
            )}

            {/* Professional / Consultant Specific */}
            {isProfessional && (expertProfile.expertise || expertProfile.insights || expertProfile.articles || expertProfile.awards) && (
              <Section title="Expert Profile" icon="fa-graduation-cap">
                <InfoRow label="Expertise" value={expertProfile.expertise} />
                <InfoRow label="Specializations" value={Array.isArray(expertProfile.specializations) ? expertProfile.specializations.join(", ") : expertProfile.specializations} />
                <InfoRow label="Insights" value={expertProfile.insights} />
                <InfoRow label="Articles" value={expertProfile.articles} />
                <InfoRow label="Awards" value={expertProfile.awards} />
                <InfoRow label="Certifications" value={Array.isArray(expertProfile.certifications) ? expertProfile.certifications.join(", ") : expertProfile.certifications} />
              </Section>
            )}

            {/* Achievements */}
            {user.achievements && (
              <Section title="Achievements" icon="fa-trophy">
                <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.7, margin: 0 }}>{user.achievements}</p>
              </Section>
            )}

            {/* Industry Contributions */}
            {user.industryContributions && (
              <Section title="Industry Contributions" icon="fa-handshake">
                <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.7, margin: 0 }}>{user.industryContributions}</p>
              </Section>
            )}

            {/* Business Overview */}
            {user.businessOverview && (
              <Section title="Business Overview" icon="fa-chart-bar">
                <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.7, margin: 0 }}>{user.businessOverview}</p>
              </Section>
            )}

            {/* Profile Status */}
            {user.profileStatus && user.profileStatus !== user.membershipStatus && (
              <Section title="Profile Status" icon="fa-info-circle">
                <InfoRow label="Status" value={user.profileStatus} />
              </Section>
            )}
          </div>

          {/* Action Footer */}
          {isPending && (
            <div
              style={{
                padding: "20px 28px",
                borderTop: "1px solid #E2E8F0",
                background: "#FAFBFC",
                flexShrink: 0,
              }}
            >
              {/* Action Toggles */}
              {activeAction === null && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleApproveClick}
                    disabled={actionLoading}
                    style={{
                      flex: 1,
                      padding: "12px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      background: actionLoading ? "#A7F3D0" : "#10B981",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      cursor: actionLoading ? "not-allowed" : "pointer",
                      transition: "all 0.25s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => {
                      if (!actionLoading) e.currentTarget.style.background = "#059669";
                    }}
                    onMouseLeave={(e) => {
                      if (!actionLoading) e.currentTarget.style.background = "#10B981";
                    }}
                  >
                    {actionLoading ? (
                      <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "12px" }} />
                    ) : (
                      <i className="fas fa-check" style={{ fontSize: "12px" }} />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => setActiveAction("reject")}
                    disabled={actionLoading}
                    style={{
                      flex: 1,
                      padding: "12px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      background: "#FFFFFF",
                      color: "#EF4444",
                      border: "1px solid #FECACA",
                      borderRadius: "8px",
                      cursor: actionLoading ? "not-allowed" : "pointer",
                      transition: "all 0.25s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => {
                      if (!actionLoading) {
                        e.currentTarget.style.background = "#FEF2F2";
                        e.currentTarget.style.borderColor = "#EF4444";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!actionLoading) {
                        e.currentTarget.style.background = "#FFFFFF";
                        e.currentTarget.style.borderColor = "#FECACA";
                      }
                    }}
                  >
                    <i className="fas fa-times" style={{ fontSize: "12px" }} />
                    Reject
                  </button>
                  <button
                    onClick={() => setActiveAction("revision")}
                    disabled={actionLoading}
                    style={{
                      flex: 1,
                      padding: "12px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      background: "#FFFFFF",
                      color: "#F97316",
                      border: "1px solid #FED7AA",
                      borderRadius: "8px",
                      cursor: actionLoading ? "not-allowed" : "pointer",
                      transition: "all 0.25s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => {
                      if (!actionLoading) {
                        e.currentTarget.style.background = "#FFF7ED";
                        e.currentTarget.style.borderColor = "#F97316";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!actionLoading) {
                        e.currentTarget.style.background = "#FFFFFF";
                        e.currentTarget.style.borderColor = "#FED7AA";
                      }
                    }}
                  >
                    <i className="fas fa-edit" style={{ fontSize: "12px" }} />
                    Revision
                  </button>
                </div>
              )}

              {/* Reject Form */}
              {activeAction === "reject" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#EF4444" }}>
                      <i className="fas fa-times-circle" style={{ marginRight: "6px" }} />
                      Reject Application
                    </span>
                    <button
                      onClick={() => setActiveAction(null)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "#64748B",
                        padding: "4px 8px",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  <textarea
                    placeholder="Enter reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: "13px",
                      color: "#0A1628",
                      resize: "vertical",
                      outline: "none",
                      fontFamily: "inherit",
                      marginBottom: "12px",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#EF4444")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                  />
                  <button
                    onClick={handleRejectSubmit}
                    disabled={!rejectReason.trim() || actionLoading}
                    style={{
                      width: "100%",
                      padding: "11px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      background: !rejectReason.trim() ? "#FECACA" : "#EF4444",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      cursor: !rejectReason.trim() || actionLoading ? "not-allowed" : "pointer",
                      transition: "all 0.25s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {actionLoading ? (
                      <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "12px" }} />
                    ) : (
                      <i className="fas fa-times" style={{ fontSize: "12px" }} />
                    )}
                    Confirm Rejection
                  </button>
                </div>
              )}

              {/* Revision Form */}
              {activeAction === "revision" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#F97316" }}>
                      <i className="fas fa-edit" style={{ marginRight: "6px" }} />
                      Request Revision
                    </span>
                    <button
                      onClick={() => setActiveAction(null)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        color: "#64748B",
                        padding: "4px 8px",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569", display: "block", marginBottom: "8px" }}>
                      Flag fields that need correction:
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        maxHeight: "120px",
                        overflowY: "auto",
                        padding: "4px 0",
                      }}
                    >
                      {FLAGGABLE_FIELDS.map((field) => (
                        <button
                          key={field.key}
                          type="button"
                          onClick={() => toggleField(field.key)}
                          style={{
                            padding: "5px 12px",
                            fontSize: "11px",
                            fontWeight: 500,
                            background: flaggedFields.includes(field.key) ? "#FFF7ED" : "#F8FAFC",
                            color: flaggedFields.includes(field.key) ? "#F97316" : "#64748B",
                            border: flaggedFields.includes(field.key)
                              ? "1px solid #F97316"
                              : "1px solid #E2E8F0",
                            borderRadius: "14px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {flaggedFields.includes(field.key) && (
                            <i className="fas fa-check" style={{ marginRight: "4px", fontSize: "9px" }} />
                          )}
                          {field.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Add a note explaining what needs to be revised..."
                    value={revisionNote}
                    onChange={(e) => setRevisionNote(e.target.value)}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: "13px",
                      color: "#0A1628",
                      resize: "vertical",
                      outline: "none",
                      fontFamily: "inherit",
                      marginBottom: "12px",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#F97316")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                  />
                  <button
                    onClick={handleRevisionSubmit}
                    disabled={!revisionNote.trim() || flaggedFields.length === 0 || actionLoading}
                    style={{
                      width: "100%",
                      padding: "11px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      background:
                        !revisionNote.trim() || flaggedFields.length === 0 ? "#FED7AA" : "#F97316",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      cursor:
                        !revisionNote.trim() || flaggedFields.length === 0 || actionLoading
                          ? "not-allowed"
                          : "pointer",
                      transition: "all 0.25s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {actionLoading ? (
                      <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "12px" }} />
                    ) : (
                      <i className="fas fa-paper-plane" style={{ fontSize: "12px" }} />
                    )}
                    Send Revision Request ({flaggedFields.length} field{flaggedFields.length !== 1 ? "s" : ""})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const AdminMembershipRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("PENDING");
  const [mounted, setMounted] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  // Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ─── Fetch ─────────────────────────────────────────────────────────────────

  const fetchRequests = useCallback(async (filterStatus) => {
    setLoading(true);
    try {
      const params = { limit: "100" };
      if (filterStatus && filterStatus !== "ALL") {
        params.status = filterStatus;
      } else {
        params.status = "ALL";
      }
      const data = await api.getMembershipRequests(params);
      if (data?.users) {
        setRequests(data.users);
      }
    } catch (err) {
      // keep existing data on failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchRequests(activeFilter);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch when filter changes
  const handleFilterChange = (key) => {
    setActiveFilter(key);
    fetchRequests(key);
  };

  // ─── Counts ────────────────────────────────────────────────────────────────

  const getCount = (status) => {
    if (status === "ALL") return requests.length;
    return requests.filter((r) => r.membershipStatus === status).length;
  };

  // ─── Filtering ─────────────────────────────────────────────────────────────

  const filtered = requests.filter((r) => {
    const fullName = ((r.firstName || "") + " " + (r.lastName || "")).trim();
    const matchSearch =
      !searchTerm ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.organizationName || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const pendingCount = requests.filter((r) => r.membershipStatus === "PENDING").length;

  // ─── Modal Actions ─────────────────────────────────────────────────────────

  const openModal = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await api.approveMembership(id, { action: "APPROVE" });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, membershipStatus: "APPROVED" } : r))
      );
      setSelectedUser((prev) => (prev && prev.id === id ? { ...prev, membershipStatus: "APPROVED" } : prev));
      setTimeout(() => closeModal(), 600);
    } catch (err) {
      // silently fail
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id, reason) => {
    setActionLoading(true);
    try {
      await api.approveMembership(id, { action: "REJECT", reason });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, membershipStatus: "REJECTED" } : r))
      );
      setSelectedUser((prev) => (prev && prev.id === id ? { ...prev, membershipStatus: "REJECTED" } : prev));
      setTimeout(() => closeModal(), 600);
    } catch (err) {
      // silently fail
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevision = async (userId, data) => {
    setActionLoading(true);
    try {
      await api.requestRevision(userId, data);
      setRequests((prev) =>
        prev.map((r) => (r.id === userId ? { ...r, membershipStatus: "REVISION_REQUESTED" } : r))
      );
      setSelectedUser((prev) =>
        prev && prev.id === userId ? { ...prev, membershipStatus: "REVISION_REQUESTED" } : prev
      );
      setTimeout(() => closeModal(), 600);
    } catch (err) {
      // silently fail
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Table Header Style ────────────────────────────────────────────────────

  const thStyle = {
    padding: "14px 20px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 600,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    borderBottom: "1px solid #E2E8F0",
    whiteSpace: "nowrap",
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "28px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "28px",
                fontWeight: 600,
                color: "#0A1628",
                margin: 0,
              }}
            >
              Membership Requests
            </h1>
            {pendingCount > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "28px",
                  height: "28px",
                  padding: "0 8px",
                  background: "linear-gradient(135deg, #F59E0B, #D97706)",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700,
                  borderRadius: "14px",
                  boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)",
                }}
              >
                {pendingCount}
              </span>
            )}
          </div>
          <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>
            Review and manage pending membership applications
          </p>
        </div>
        <button
          style={{
            padding: "10px 24px",
            fontSize: "13px",
            fontWeight: 600,
            background: "#C6A962",
            color: "#0A1628",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 2px 8px rgba(198, 169, 98, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(198, 169, 98, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(198, 169, 98, 0.3)";
          }}
        >
          <i className="fas fa-download" style={{ fontSize: "12px" }} />
          Export Report
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid #F1F5F9",
              borderTopColor: "#C6A962",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "membershipSpin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "#64748B", fontSize: "14px", margin: 0 }}>Loading membership requests...</p>
          <style>{`@keyframes membershipSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {!loading && (
        <>
          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
            {FILTER_TABS.map((f) => {
              const count = getCount(f.key);
              return (
                <button
                  key={f.key}
                  onClick={() => handleFilterChange(f.key)}
                  style={{
                    padding: "8px 18px",
                    fontSize: "13px",
                    fontWeight: activeFilter === f.key ? 600 : 400,
                    background: activeFilter === f.key ? "#0A1628" : "#FFFFFF",
                    color: activeFilter === f.key ? "#FFFFFF" : "#64748B",
                    border:
                      activeFilter === f.key ? "1px solid #0A1628" : "1px solid #E2E8F0",
                    borderRadius: "20px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  onMouseEnter={(e) => {
                    if (activeFilter !== f.key) {
                      e.currentTarget.style.borderColor = "#C6A962";
                      e.currentTarget.style.color = "#0A1628";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeFilter !== f.key) {
                      e.currentTarget.style.borderColor = "#E2E8F0";
                      e.currentTarget.style.color = "#64748B";
                    }
                  }}
                >
                  {f.label}
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "1px 7px",
                      borderRadius: "10px",
                      background:
                        activeFilter === f.key ? "rgba(198,169,98,0.2)" : "#F1F5F9",
                      color: activeFilter === f.key ? "#C6A962" : "#94A3B8",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div
            style={{
              background: "#FFFFFF",
              border: searchFocused ? "1px solid #C6A962" : "1px solid #E2E8F0",
              borderRadius: "8px",
              padding: "4px 16px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.3s ease",
              boxShadow: searchFocused ? "0 0 0 3px rgba(198, 169, 98, 0.1)" : "none",
              maxWidth: "480px",
            }}
          >
            <i
              className="fas fa-search"
              style={{
                fontSize: "14px",
                color: searchFocused ? "#C6A962" : "#94A3B8",
                transition: "color 0.3s",
              }}
            />
            <input
              type="text"
              placeholder="Search by name, email, or organization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "none",
                outline: "none",
                fontSize: "14px",
                color: "#0A1628",
                background: "transparent",
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                  fontSize: "12px",
                  padding: "4px",
                }}
              >
                <i className="fas fa-times" />
              </button>
            )}
          </div>

          {/* Table */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    <th style={thStyle}>Applicant</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Organization</th>
                    <th style={thStyle}>City</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Status</th>
                    <th style={thStyle}>Applied Date</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req, idx) => {
                    const memberType = req.memberType || req.role;
                    const roleStyle = ROLE_COLORS[memberType] || { bg: "#F1F5F9", color: "#475569" };
                    const statusStyle = STATUS_CONFIG[req.membershipStatus] || STATUS_CONFIG.PENDING;
                    const fullName = ((req.firstName || "") + " " + (req.lastName || "")).trim();
                    const isPending = req.membershipStatus === "PENDING" || req.membershipStatus === "REVISION_REQUESTED";
                    return (
                      <tr
                        key={req.id}
                        onMouseEnter={() => setHoveredRow(req.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{
                          borderBottom: "1px solid #F1F5F9",
                          transition: "all 0.25s ease",
                          background: hoveredRow === req.id ? "#FAFBFC" : "transparent",
                          borderLeft:
                            hoveredRow === req.id
                              ? "3px solid #C6A962"
                              : "3px solid transparent",
                          opacity: mounted ? 1 : 0,
                          transform: mounted ? "translateY(0)" : "translateY(8px)",
                          transitionDelay: `${idx * 0.03}s`,
                        }}
                      >
                        {/* Applicant */}
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div
                              style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #0A1628, #1E293B)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#C6A962",
                                fontWeight: 700,
                                fontSize: "13px",
                                flexShrink: 0,
                                letterSpacing: "0.5px",
                              }}
                            >
                              {getInitials(req.firstName, req.lastName)}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  color: "#0A1628",
                                  lineHeight: 1.3,
                                }}
                              >
                                {fullName || "Unknown"}
                              </div>
                              <div style={{ fontSize: "12px", color: "#94A3B8" }}>{req.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Member Type */}
                        <td style={{ padding: "14px 20px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              padding: "4px 12px",
                              background: roleStyle.bg,
                              color: roleStyle.color,
                              borderRadius: "12px",
                              letterSpacing: "0.3px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {ROLE_LABELS[memberType] || memberType}
                          </span>
                        </td>

                        {/* Organization */}
                        <td style={{ padding: "14px 20px", fontSize: "14px", color: "#475569" }}>
                          {req.organizationName || "--"}
                        </td>

                        {/* City */}
                        <td style={{ padding: "14px 20px", fontSize: "14px", color: "#475569" }}>
                          {req.city ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <i
                                className="fas fa-map-marker-alt"
                                style={{ fontSize: "10px", color: "#94A3B8" }}
                              />
                              {req.city}
                            </div>
                          ) : (
                            "--"
                          )}
                        </td>

                        {/* Status */}
                        <td style={{ padding: "14px 20px", textAlign: "center" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              padding: "4px 12px",
                              background: statusStyle.bg,
                              color: statusStyle.color,
                              borderRadius: "12px",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              whiteSpace: "nowrap",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <i className={`fas ${statusStyle.icon}`} style={{ fontSize: "9px" }} />
                            {statusStyle.label}
                          </span>
                        </td>

                        {/* Applied Date */}
                        <td style={{ padding: "14px 20px", fontSize: "13px", color: "#94A3B8" }}>
                          {formatDate(req.createdAt)}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "14px 20px", textAlign: "right" }}>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              justifyContent: "flex-end",
                              alignItems: "center",
                            }}
                          >
                            <button
                              onClick={() => openModal(req)}
                              onMouseEnter={() => setHoveredBtn(`view-${req.id}`)}
                              onMouseLeave={() => setHoveredBtn(null)}
                              style={{
                                padding: "6px 14px",
                                fontSize: "12px",
                                fontWeight: 600,
                                background:
                                  hoveredBtn === `view-${req.id}` ? "#0A1628" : "#FFFFFF",
                                color:
                                  hoveredBtn === `view-${req.id}` ? "#FFFFFF" : "#0A1628",
                                border: "1px solid #0A1628",
                                borderRadius: "6px",
                                cursor: "pointer",
                                transition: "all 0.25s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <i className="fas fa-eye" style={{ fontSize: "10px" }} />
                              View Profile
                            </button>
                            {isPending && (
                              <button
                                onClick={() => openModal(req)}
                                onMouseEnter={() => setHoveredBtn(`quick-approve-${req.id}`)}
                                onMouseLeave={() => setHoveredBtn(null)}
                                style={{
                                  padding: "6px 14px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  background:
                                    hoveredBtn === `quick-approve-${req.id}`
                                      ? "#10B981"
                                      : "transparent",
                                  color:
                                    hoveredBtn === `quick-approve-${req.id}`
                                      ? "#FFFFFF"
                                      : "#10B981",
                                  border: "1px solid #A7F3D0",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  transition: "all 0.25s ease",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <i className="fas fa-check" style={{ fontSize: "10px" }} />
                                Review
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
              <div
                style={{
                  padding: "64px 20px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "#F8FAFC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="fas fa-inbox" style={{ fontSize: "24px", color: "#CBD5E1" }} />
                </div>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#64748B",
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  No membership requests found
                </p>
                <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>
                  {searchTerm
                    ? "Try adjusting your search term."
                    : activeFilter !== "ALL"
                    ? "No requests with this status. Try switching the filter."
                    : "New requests will appear here."}
                </p>
              </div>
            )}

            {/* Result Count Footer */}
            {filtered.length > 0 && (
              <div
                style={{
                  padding: "12px 20px",
                  borderTop: "1px solid #F1F5F9",
                  background: "#FAFBFC",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "12px", color: "#94A3B8" }}>
                  Showing {filtered.length} of {requests.length} request{requests.length !== 1 ? "s" : ""}
                </span>
                <span style={{ fontSize: "12px", color: "#94A3B8" }}>
                  {pendingCount} pending review
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Profile Modal */}
      {selectedUser && (
        <ProfilePanel
          user={selectedUser}
          onClose={closeModal}
          onApprove={handleApprove}
          onReject={handleReject}
          onRevision={handleRevision}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default AdminMembershipRequests;
