import React, { useState } from "react";
import PhotoUpload from "./PhotoUpload";
import MultiPhotoUpload from "./MultiPhotoUpload";

const PROPERTY_TYPES = [
  "Luxury",
  "Business",
  "Resort",
  "Heritage",
  "Boutique",
  "Budget",
];

const emptyHotel = {
  name: "",
  city: "",
  state: "",
  starRating: "",
  rooms: "",
  propertyType: "",
  photos: [],
  description: "",
};

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

const sectionWrapperStyle = (isOpen) => ({
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

const requiredStar = {
  color: "#E53E3E",
  marginLeft: "2px",
};

const HotelOwnerProfileForm = ({ onSubmit, initialData }) => {
  const [openSections, setOpenSections] = useState({
    personal: true,
    organization: false,
    hotels: false,
    experience: false,
  });

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        avatar: initialData.avatar || "",
        designation: initialData.designation || "",
        phone: initialData.phone || "",
        linkedinUrl: initialData.linkedinUrl || "",
        bio: initialData.bio || "",
        companyName: initialData.companyName || "",
        companyDescription: initialData.companyDescription || "",
        yearFounded: initialData.yearFounded || "",
        employeeCount: initialData.employeeCount || "",
        headquartersCity: initialData.headquartersCity || "",
        headquartersState: initialData.headquartersState || "",
        hotels: initialData.hotels && initialData.hotels.length > 0
          ? initialData.hotels.map((h) => ({
              name: h.name || "",
              city: h.city || "",
              state: h.state || "",
              starRating: h.starRating ? String(h.starRating) : "",
              rooms: h.rooms || h.totalRooms || "",
              propertyType: h.propertyType || h.hotelType || "",
              photos: Array.isArray(h.photos) ? h.photos : (Array.isArray(h.photoUrls) ? h.photoUrls : []),
              description: h.description || "",
            }))
          : [{ ...emptyHotel }],
        yearsInIndustry: initialData.yearsInIndustry || "",
        achievements: initialData.achievements || "",
        industryContributions: initialData.industryContributions || "",
        previousPartnerships: initialData.previousPartnerships || "",
      };
    }
    return {
      avatar: "",
      designation: "",
      phone: "",
      linkedinUrl: "",
      bio: "",
      companyName: "",
      companyDescription: "",
      yearFounded: "",
      employeeCount: "",
      headquartersCity: "",
      headquartersState: "",
      hotels: [{ ...emptyHotel }],
      yearsInIndustry: "",
      achievements: "",
      industryContributions: "",
      previousPartnerships: "",
    };
  });

  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHotelChange = (index, field, value) => {
    setFormData((prev) => {
      const hotels = [...prev.hotels];
      hotels[index] = { ...hotels[index], [field]: value };
      return { ...prev, hotels };
    });
  };

  const addHotel = () => {
    setFormData((prev) => ({
      ...prev,
      hotels: [...prev.hotels, { ...emptyHotel }],
    }));
  };

  const removeHotel = (index) => {
    setFormData((prev) => ({
      ...prev,
      hotels: prev.hotels.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    // Validation
    if (!formData.designation.trim()) {
      setValidationError("Designation is required.");
      return;
    }
    if (!formData.phone.trim()) {
      setValidationError("Phone number is required.");
      return;
    }
    if (!formData.bio.trim()) {
      setValidationError("Bio is required.");
      return;
    }
    if (!formData.companyName.trim()) {
      setValidationError("Company Name is required.");
      return;
    }
    if (formData.hotels.length === 0 || !formData.hotels[0].name.trim()) {
      setValidationError("At least one hotel with a name is required.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        hotels: formData.hotels.map((h) => ({
          ...h,
          starRating: h.starRating ? parseInt(h.starRating, 10) : null,
          rooms: h.rooms ? parseInt(h.rooms, 10) : null,
          photos: Array.isArray(h.photos) ? h.photos : [],
        })),
        yearsInIndustry: formData.yearsInIndustry
          ? parseInt(formData.yearsInIndustry, 10)
          : null,
        yearFounded: formData.yearFounded
          ? parseInt(formData.yearFounded, 10)
          : null,
        employeeCount: formData.employeeCount
          ? parseInt(formData.employeeCount, 10)
          : null,
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
      <div style={sectionWrapperStyle(openSections.personal)}>
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
              <label style={labelStyle}>
                Designation<span style={requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                placeholder="e.g. CEO, Managing Director"
                style={inputStyle}
              />
            </div>
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                Phone<span style={requiredStar}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
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

      {/* Section 2 - Organization */}
      <div style={sectionWrapperStyle(openSections.organization)}>
        <div
          style={sectionHeaderStyle}
          onClick={() => toggleSection("organization")}
        >
          <h4 style={sectionTitleStyle}>
            <i
              className="flaticon-profit"
              style={{ color: "#C6A962", fontSize: "20px" }}
            ></i>
            Organization
          </h4>
          <span style={chevronStyle(openSections.organization)}>
            <i className="fas fa-chevron-down"></i>
          </span>
        </div>
        <div style={sectionBodyStyle(openSections.organization)}>
          <div className="row">
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                Company Name<span style={requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Your company name"
                style={inputStyle}
              />
            </div>
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Year Founded</label>
              <input
                type="number"
                name="yearFounded"
                value={formData.yearFounded}
                onChange={handleChange}
                min="1900"
                max="2026"
                placeholder="e.g. 2005"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Company Description</label>
              <textarea
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your company..."
                style={textareaStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Employee Count</label>
              <input
                type="number"
                name="employeeCount"
                value={formData.employeeCount}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 500"
                style={inputStyle}
              />
            </div>
            <div className="col-lg-4" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Headquarters City</label>
              <input
                type="text"
                name="headquartersCity"
                value={formData.headquartersCity}
                onChange={handleChange}
                placeholder="City"
                style={inputStyle}
              />
            </div>
            <div className="col-lg-4" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Headquarters State</label>
              <input
                type="text"
                name="headquartersState"
                value={formData.headquartersState}
                onChange={handleChange}
                placeholder="State"
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 - Hotel Portfolio */}
      <div style={sectionWrapperStyle(openSections.hotels)}>
        <div
          style={sectionHeaderStyle}
          onClick={() => toggleSection("hotels")}
        >
          <h4 style={sectionTitleStyle}>
            <i
              className="flaticon-piggy-bank"
              style={{ color: "#C6A962", fontSize: "20px" }}
            ></i>
            Hotel Portfolio<span style={requiredStar}>*</span>
          </h4>
          <span style={chevronStyle(openSections.hotels)}>
            <i className="fas fa-chevron-down"></i>
          </span>
        </div>
        <div style={sectionBodyStyle(openSections.hotels)}>
          <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "16px" }}>
            At least 1 hotel is required<span style={requiredStar}>*</span>
          </p>
          {formData.hotels.map((hotel, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #E2DDD5",
                padding: "20px",
                marginBottom: "16px",
                position: "relative",
                background: "#FAFAFA",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#0A1628",
                  }}
                >
                  Hotel #{index + 1}
                </span>
                {formData.hotels.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHotel(index)}
                    style={{
                      background: "none",
                      border: "1px solid #E53E3E",
                      color: "#E53E3E",
                      padding: "4px 12px",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <i className="fas fa-times"></i> Remove
                  </button>
                )}
              </div>
              <div className="row">
                <div className="col-lg-6" style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>Hotel Name</label>
                  <input
                    type="text"
                    value={hotel.name}
                    onChange={(e) =>
                      handleHotelChange(index, "name", e.target.value)
                    }
                    placeholder="Hotel name"
                    style={inputStyle}
                  />
                </div>
                <div className="col-lg-3" style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>City</label>
                  <input
                    type="text"
                    value={hotel.city}
                    onChange={(e) =>
                      handleHotelChange(index, "city", e.target.value)
                    }
                    placeholder="City"
                    style={inputStyle}
                  />
                </div>
                <div className="col-lg-3" style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>State</label>
                  <input
                    type="text"
                    value={hotel.state}
                    onChange={(e) =>
                      handleHotelChange(index, "state", e.target.value)
                    }
                    placeholder="State"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4" style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>Star Rating</label>
                  <select
                    value={hotel.starRating}
                    onChange={(e) =>
                      handleHotelChange(index, "starRating", e.target.value)
                    }
                    style={inputStyle}
                  >
                    <option value="">Select Rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
                <div className="col-lg-4" style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>Rooms</label>
                  <input
                    type="number"
                    value={hotel.rooms}
                    onChange={(e) =>
                      handleHotelChange(index, "rooms", e.target.value)
                    }
                    min="0"
                    placeholder="Number of rooms"
                    style={inputStyle}
                  />
                </div>
                <div className="col-lg-4" style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>Property Type</label>
                  <select
                    value={hotel.propertyType}
                    onChange={(e) =>
                      handleHotelChange(index, "propertyType", e.target.value)
                    }
                    style={inputStyle}
                  >
                    <option value="">Select Type</option>
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12" style={{ marginBottom: "12px" }}>
                  <MultiPhotoUpload
                    value={hotel.photos}
                    onChange={(val) => handleHotelChange(index, "photos", val)}
                    label="Hotel Photos"
                    max={8}
                  />
                </div>
                <div className="col-lg-12" style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    value={hotel.description}
                    onChange={(e) =>
                      handleHotelChange(index, "description", e.target.value)
                    }
                    rows={3}
                    placeholder="Brief description of the hotel..."
                    style={textareaStyle}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addHotel}
            style={{
              background: "none",
              border: "1px dashed #C6A962",
              color: "#C6A962",
              padding: "12px 24px",
              fontSize: "14px",
              cursor: "pointer",
              width: "100%",
              fontWeight: 600,
              letterSpacing: "0.5px",
              transition: "all 0.2s",
            }}
          >
            <i className="fas fa-plus" style={{ marginRight: "8px" }}></i>
            Add Hotel
          </button>
        </div>
      </div>

      {/* Section 4 - Experience & Achievements */}
      <div style={sectionWrapperStyle(openSections.experience)}>
        <div
          style={sectionHeaderStyle}
          onClick={() => toggleSection("experience")}
        >
          <h4 style={sectionTitleStyle}>
            <i
              className="flaticon-target"
              style={{ color: "#C6A962", fontSize: "20px" }}
            ></i>
            Experience & Achievements
          </h4>
          <span style={chevronStyle(openSections.experience)}>
            <i className="fas fa-chevron-down"></i>
          </span>
        </div>
        <div style={sectionBodyStyle(openSections.experience)}>
          <div className="row">
            <div className="col-lg-4" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Years in Industry</label>
              <input
                type="number"
                name="yearsInIndustry"
                value={formData.yearsInIndustry}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 15"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Achievements</label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                rows={3}
                placeholder="Notable achievements in the hospitality industry..."
                style={textareaStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Industry Contributions</label>
              <textarea
                name="industryContributions"
                value={formData.industryContributions}
                onChange={handleChange}
                rows={3}
                placeholder="How have you contributed to the hospitality industry..."
                style={textareaStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12" style={{ marginBottom: "8px" }}>
              <label style={labelStyle}>Previous Partnerships</label>
              <textarea
                name="previousPartnerships"
                value={formData.previousPartnerships}
                onChange={handleChange}
                rows={3}
                placeholder="Key partnerships and collaborations..."
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

export default HotelOwnerProfileForm;
