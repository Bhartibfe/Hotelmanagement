import React, { useState } from "react";
import PhotoUpload from "./PhotoUpload";

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  background: "#F8FAFC",
  cursor: "pointer",
  userSelect: "none",
  borderBottom: "1px solid #E2DDD5",
};

const sectionTitleStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "20px",
  fontWeight: 600,
  color: "#0A1628",
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const sectionWrapperStyle = () => ({
  border: "1px solid #E2DDD5",
  borderLeft: "3px solid #C6A962",
  marginBottom: "24px",
  background: "#FFFFFF",
  overflow: "hidden",
});

const sectionBodyStyle = (isOpen) => ({
  padding: isOpen ? "24px 20px" : "0 20px",
  maxHeight: isOpen ? "5000px" : "0",
  overflow: "hidden",
  transition: "max-height 0.4s ease, padding 0.3s ease",
});

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #E2DDD5",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.3s",
  background: "#FFFFFF",
  fontFamily: "var(--tg-body-font-family)",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#0A1628",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "80px",
};

const chevronStyle = (isOpen) => ({
  fontSize: "18px",
  color: "#C6A962",
  transition: "transform 0.3s",
  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
});

const tagStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  background: "rgba(198, 169, 98, 0.1)",
  border: "1px solid #C6A962",
  color: "#0A1628",
  padding: "4px 12px",
  fontSize: "13px",
  marginRight: "8px",
  marginBottom: "8px",
};

const tagRemoveStyle = {
  background: "none",
  border: "none",
  color: "#C6A962",
  cursor: "pointer",
  padding: "0",
  fontSize: "14px",
  lineHeight: 1,
  fontWeight: 700,
};

const requiredStar = {
  color: "#E53E3E",
  marginLeft: "2px",
};

const ExpertProfileForm = ({ onSubmit, initialData }) => {
  const [openSections, setOpenSections] = useState({
    personal: true,
    professional: false,
    thoughts: false,
    achievements: false,
  });

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      const ep = initialData.expertProfile || initialData;
      return {
        avatar: initialData.avatar || ep.avatar || "",
        designation: initialData.designation || ep.designation || "",
        phone: initialData.phone || ep.phone || "",
        linkedinUrl: initialData.linkedinUrl || ep.linkedinUrl || "",
        bio: initialData.bio || ep.bio || "",
        currentOrganization: ep.currentOrganization || initialData.organizationName || "",
        currentRole: ep.currentRole || initialData.designation || "",
        yearsOfExperience: ep.yearsOfExperience || initialData.yearsInIndustry || "",
        specializations: Array.isArray(ep.specializations) ? ep.specializations : [],
        industryInsights: ep.industryInsights || ep.insights || "",
        publishedArticles: Array.isArray(ep.publishedArticles) ? ep.publishedArticles.join("\n") : (ep.publishedArticles || ep.articles || ""),
        speakingEngagements: Array.isArray(ep.speakingEngagements) ? ep.speakingEngagements.join("\n") : (ep.speakingEngagements || ""),
        awards: Array.isArray(ep.awards) ? ep.awards.join("\n") : (ep.awards || ""),
        certifications: Array.isArray(ep.certifications) ? ep.certifications.join("\n") : (ep.certifications || ""),
        recognition: ep.recognition || "",
      };
    }
    return {
      avatar: "",
      designation: "",
      phone: "",
      linkedinUrl: "",
      bio: "",
      currentOrganization: "",
      currentRole: "",
      yearsOfExperience: "",
      specializations: [],
      industryInsights: "",
      publishedArticles: "",
      speakingEngagements: "",
      awards: "",
      certifications: "",
      recognition: "",
    };
  });

  const [specializationInput, setSpecializationInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecializationKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = specializationInput.trim().replace(/,$/g, "");
      if (value && !formData.specializations.includes(value)) {
        setFormData((prev) => ({
          ...prev,
          specializations: [...prev.specializations, value],
        }));
      }
      setSpecializationInput("");
    }
  };

  const removeSpecialization = (index) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    // Validation
    if (!formData.bio.trim()) {
      setValidationError("Bio is required.");
      return;
    }
    if (!formData.currentOrganization.trim()) {
      setValidationError("Current Organization is required.");
      return;
    }
    if (!formData.currentRole.trim()) {
      setValidationError("Current Role is required.");
      return;
    }
    if (formData.specializations.length === 0) {
      setValidationError("At least one specialization is required.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        yearsOfExperience: formData.yearsOfExperience
          ? parseInt(formData.yearsOfExperience, 10)
          : null,
        publishedArticles: formData.publishedArticles
          ? formData.publishedArticles
              .split("\n")
              .map((u) => u.trim())
              .filter(Boolean)
          : [],
        speakingEngagements: formData.speakingEngagements
          ? formData.speakingEngagements
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        awards: formData.awards
          ? formData.awards
              .split("\n")
              .map((a) => a.trim())
              .filter(Boolean)
          : [],
        certifications: formData.certifications
          ? formData.certifications
              .split("\n")
              .map((c) => c.trim())
              .filter(Boolean)
          : [],
      };
      await onSubmit(payload);
    } catch (err) {
      // error handling is done by parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Validation Error */}
      {validationError && (
        <div
          style={{
            background: "#FEE2E2",
            color: "#C53030",
            padding: "14px 20px",
            marginBottom: "24px",
            fontSize: "14px",
            border: "1px solid #FCA5A5",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <i className="fas fa-exclamation-circle"></i>
          {validationError}
        </div>
      )}
      {/* Section 1 - Personal Details */}
      <div style={sectionWrapperStyle()}>
        <div
          style={sectionHeaderStyle}
          onClick={() => toggleSection("personal")}
        >
          <h4 style={sectionTitleStyle}>
            <i
              className="flaticon-user"
              style={{ color: "#C6A962", fontSize: "20px" }}
            ></i>
            Personal Details
          </h4>
          <span style={chevronStyle(openSections.personal)}>
            <i className="fas fa-chevron-down"></i>
          </span>
        </div>
        <div style={sectionBodyStyle(openSections.personal)}>
          <div className="row">
            <div className="col-lg-12" style={{ marginBottom: "16px" }}>
              <PhotoUpload
                value={formData.avatar}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, avatar: val }))
                }
                label="Profile Photo"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Senior Consultant, Director"
                style={inputStyle}
              />
            </div>
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9+\-\s]+"
                inputMode="tel"
                placeholder="+91 XXXXX XXXXX"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>LinkedIn URL</label>
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12" style={{ marginBottom: "8px" }}>
              <label style={labelStyle}>
                Bio<span style={requiredStar}>*</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Tell us about yourself..."
                style={textareaStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 - Professional Background */}
      <div style={sectionWrapperStyle()}>
        <div
          style={sectionHeaderStyle}
          onClick={() => toggleSection("professional")}
        >
          <h4 style={sectionTitleStyle}>
            <i
              className="flaticon-light-bulb"
              style={{ color: "#C6A962", fontSize: "20px" }}
            ></i>
            Professional Background
          </h4>
          <span style={chevronStyle(openSections.professional)}>
            <i className="fas fa-chevron-down"></i>
          </span>
        </div>
        <div style={sectionBodyStyle(openSections.professional)}>
          <div className="row">
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                Current Organization<span style={requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="currentOrganization"
                value={formData.currentOrganization}
                onChange={handleChange}
                required
                placeholder="Your current organization"
                style={inputStyle}
              />
            </div>
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                Current Role<span style={requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="currentRole"
                value={formData.currentRole}
                onChange={handleChange}
                required
                placeholder="e.g. Lead Consultant, Partner"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 12"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                Specializations / Expertise<span style={requiredStar}>*</span>
                {" "}
                <span style={{ fontWeight: 400, textTransform: "none", fontSize: "11px", color: "#9CA3AF" }}>
                  (type and press Enter or comma to add; at least 1 required)
                </span>
              </label>
              <input
                type="text"
                value={specializationInput}
                onChange={(e) => setSpecializationInput(e.target.value)}
                onKeyDown={handleSpecializationKeyDown}
                placeholder="e.g. Revenue Management, F&B Strategy, Hotel Design"
                style={inputStyle}
              />
              {formData.specializations.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  {formData.specializations.map((spec, index) => (
                    <span key={index} style={tagStyle}>
                      {spec}
                      <button
                        type="button"
                        onClick={() => removeSpecialization(index)}
                        style={tagRemoveStyle}
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 - Thoughts & Vision */}
      <div style={sectionWrapperStyle()}>
        <div
          style={sectionHeaderStyle}
          onClick={() => toggleSection("thoughts")}
        >
          <h4 style={sectionTitleStyle}>
            <i
              className="flaticon-investment"
              style={{ color: "#C6A962", fontSize: "20px" }}
            ></i>
            Thoughts & Vision
          </h4>
          <span style={chevronStyle(openSections.thoughts)}>
            <i className="fas fa-chevron-down"></i>
          </span>
        </div>
        <div style={sectionBodyStyle(openSections.thoughts)}>
          <div className="row">
            <div className="col-lg-12" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Industry Insights</label>
              <textarea
                name="industryInsights"
                value={formData.industryInsights}
                onChange={handleChange}
                rows={6}
                placeholder="Share your perspective on the current state and future of the hospitality industry..."
                style={textareaStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Published Articles (URLs, one per line)</label>
              <textarea
                name="publishedArticles"
                value={formData.publishedArticles}
                onChange={handleChange}
                rows={4}
                placeholder={"https://medium.com/your-article\nhttps://yoursite.com/blog-post"}
                style={textareaStyle}
              />
            </div>
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                Speaking Engagements (one per line)
              </label>
              <textarea
                name="speakingEngagements"
                value={formData.speakingEngagements}
                onChange={handleChange}
                rows={4}
                placeholder={"HICSA 2024 - Keynote Speaker\nHotelivate Summit - Panelist"}
                style={textareaStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 4 - Achievements */}
      <div style={sectionWrapperStyle()}>
        <div
          style={sectionHeaderStyle}
          onClick={() => toggleSection("achievements")}
        >
          <h4 style={sectionTitleStyle}>
            <i
              className="flaticon-target"
              style={{ color: "#C6A962", fontSize: "20px" }}
            ></i>
            Achievements
          </h4>
          <span style={chevronStyle(openSections.achievements)}>
            <i className="fas fa-chevron-down"></i>
          </span>
        </div>
        <div style={sectionBodyStyle(openSections.achievements)}>
          <div className="row">
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Awards (one per line)</label>
              <textarea
                name="awards"
                value={formData.awards}
                onChange={handleChange}
                rows={4}
                placeholder={"Best Hospitality Consultant 2023\nIndustry Innovation Award"}
                style={textareaStyle}
              />
            </div>
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Certifications (one per line)</label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                rows={4}
                placeholder={"Certified Hospitality Educator\nSix Sigma Black Belt"}
                style={textareaStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12" style={{ marginBottom: "8px" }}>
              <label style={labelStyle}>Recognition</label>
              <textarea
                name="recognition"
                value={formData.recognition}
                onChange={handleChange}
                rows={4}
                placeholder="Industry recognition, media features, notable mentions..."
                style={textareaStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ textAlign: "center", marginTop: "32px" }}>
        <button
          type="submit"
          className="btn"
          disabled={submitting}
          style={{
            padding: "16px 48px",
            fontSize: "13px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            minWidth: "280px",
          }}
        >
          {submitting ? "Submitting..." : "Submit Profile for Review"}
        </button>
      </div>
    </form>
  );
};

export default ExpertProfileForm;
