import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "../../services/api";
import { ErrorNotice } from "../../components/common/ErrorNotice";
import HotelOwnerProfileForm from "../../components/profile/HotelOwnerProfileForm";
import VendorProfileForm from "../../components/profile/VendorProfileForm";
import ExpertProfileForm from "../../components/profile/ExpertProfileForm";

const AdminEditProfileModal = ({ user, onClose, onSaved }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Build initial data from user object for the profile forms
  const buildInitialData = () => {
    const base = {
      avatar: user.avatar || "",
      designation: user.title || "",
      phone: user.phone || "",
      linkedinUrl: user.linkedinUrl || "",
      bio: user.bio || "",
      companyName: user.organizationName || "",
      companyDescription: user.businessOverview || "",
      yearFounded: "",
      employeeCount: "",
      headquartersCity: user.city || "",
      headquartersState: user.state || "",
      yearsInIndustry: user.yearsInIndustry ? String(user.yearsInIndustry) : "",
      achievements: user.achievements || "",
      industryContributions: user.industryContributions || "",
      previousPartnerships: "",
    };

    if (user.memberType === "HOTEL_OWNER") {
      return {
        ...base,
        hotels:
          user.hotels && user.hotels.length > 0
            ? user.hotels.map((h) => ({
                name: h.name || "",
                city: h.city || "",
                state: h.state || "",
                starRating: h.starRating ? String(h.starRating) : "",
                rooms: h.rooms ? String(h.rooms) : "",
                propertyType: h.propertyType || "",
                photos: h.photos || [],
                description: h.description || "",
              }))
            : [{ name: "", city: "", state: "", starRating: "", rooms: "", propertyType: "", photos: [], description: "" }],
      };
    }

    if (user.memberType === "VENDOR" && user.vendorProfile) {
      const vp = user.vendorProfile;
      return {
        ...base,
        companyName: vp.companyName || "",
        companyDescription: vp.description || "",
        category: vp.category || "",
        yearEstablished: vp.yearEstablished ? String(vp.yearEstablished) : "",
        employeeCount: vp.employeeCount || "",
        websiteUrl: vp.website || "",
        city: vp.city || "",
        state: vp.state || "",
        previousClients: (vp.previousClients || []).join("\n"),
        // VendorProfileForm reads this as caseStudyUrls; without the alias the
        // field renders blank and saving would clear the stored case studies.
        caseStudyUrls: (vp.caseStudies || []).join("\n"),
        caseStudies: (vp.caseStudies || []).join("\n"),
        certifications: (vp.certifications || []).join("\n"),
        // The form keeps compliance in its own state, sourced from
        // initialData.compliance. Supplying it flat left every compliance field
        // blank on open, so a save wiped GST/PAN/MSME and the rest.
        compliance: {
          gstNumber: vp.gstNumber || "",
          panNumber: vp.panNumber || "",
          msmeNumber: vp.msmeRegistration || "",
          tradeLicense: vp.tradeLicense || "",
          isoCertification: vp.isoCertification || "",
          dunsNumber: vp.dunsNumber || "",
          annualTurnover: vp.annualTurnover || "",
          hotelClientsServed: vp.hotelClientsServed ? String(vp.hotelClientsServed) : "",
          serviceRegions: (vp.serviceRegions || []).join("\n"),
          insuranceDetails: vp.insuranceDetails || "",
        },
        gstNumber: vp.gstNumber || "",
        panNumber: vp.panNumber || "",
        msmeRegistration: vp.msmeRegistration || "",
        tradeLicense: vp.tradeLicense || "",
        isoCertification: vp.isoCertification || "",
        dunsNumber: vp.dunsNumber || "",
        annualTurnover: vp.annualTurnover || "",
        hotelClientsServed: vp.hotelClientsServed ? String(vp.hotelClientsServed) : "",
        serviceRegions: (vp.serviceRegions || []).join("\n"),
        insuranceDetails: vp.insuranceDetails || "",
        products:
          vp.products && vp.products.length > 0
            ? vp.products.map((p) => ({
                name: p.name || "",
                category: p.category || "",
                description: p.description || "",
                priceRange: p.priceRange || "",
                companyName: p.companyName || "",
                photos: p.photos || [],
              }))
            : [{ name: "", category: "", description: "", priceRange: "", companyName: "", photos: [] }],
      };
    }

    if (
      (user.memberType === "PROFESSIONAL" || user.memberType === "CONSULTANT") &&
      user.expertProfile
    ) {
      const ep = user.expertProfile;
      return {
        ...base,
        currentOrganization: ep.currentOrganization || "",
        currentRole: ep.currentRole || "",
        yearsOfExperience: ep.yearsOfExperience ? String(ep.yearsOfExperience) : "",
        expertise: ep.expertise || [],
        industryInsights: ep.industryInsights || "",
        publishedArticles: (ep.publishedArticles || []).join("\n"),
        speakingEngagements: (ep.speakingEngagements || []).join("\n"),
        awards: (ep.awards || []).join("\n"),
        certifications: (ep.certifications || []).join("\n"),
      };
    }

    return base;
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError(null);
    try {
      await api.adminEditProfile(user.id, formData);
      setSuccess(true);
      if (onSaved) onSaved();
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      // Kept as the error object so any per-field detail the server sent is
      // listed under the summary rather than collapsed into one line.
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const initialData = buildInitialData();

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          width: "100%",
          maxWidth: "900px",
          maxHeight: "90vh",
          overflow: "auto",
          padding: "32px",
          border: "1px solid #E2DDD5",
          borderTop: "3px solid #C6A962",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "24px",
                fontWeight: 600,
                color: "#0A1628",
                margin: 0,
              }}
            >
              Edit Profile: {user.firstName} {user.lastName}
            </h3>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "4px 0 0" }}>
              Admin editing — changes are saved directly without user review
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#6B7280",
              padding: "4px 8px",
            }}
          >
            &times;
          </button>
        </div>

        {error && (
          <div style={{ marginBottom: "16px" }}>
            <ErrorNotice error={error} title="This profile could not be saved" onDismiss={() => setError(null)} />
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#F0FDF4",
              color: "#16A34A",
              padding: "12px 16px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            Profile saved successfully!
          </div>
        )}

        {/* Render appropriate form based on member type */}
        {user.memberType === "HOTEL_OWNER" && (
          <HotelOwnerProfileForm
            onSubmit={handleSubmit}
            initialData={initialData}
            isSharedForm
            isAdminEdit
          />
        )}
        {user.memberType === "VENDOR" && (
          <VendorProfileForm
            onSubmit={handleSubmit}
            initialData={initialData}
            isSharedForm
            isAdminEdit
          />
        )}
        {(user.memberType === "PROFESSIONAL" || user.memberType === "CONSULTANT") && (
          <ExpertProfileForm
            onSubmit={handleSubmit}
            initialData={initialData}
            isAdminEdit
          />
        )}
      </div>
    </div>,
    document.body
  );
};

export default AdminEditProfileModal;
