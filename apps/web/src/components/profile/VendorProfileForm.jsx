import React, { useState } from "react";
import PhotoUpload from "./PhotoUpload";
import MultiPhotoUpload from "./MultiPhotoUpload";

const VENDOR_CATEGORIES = [
  "TECHNOLOGY",
  "ARCHITECTURE",
  "INTERIOR_DESIGN",
  "HVAC",
  "PROCUREMENT",
  "SECURITY",
  "MARKETING",
  "RECRUITMENT",
  "CONSULTING",
  "LEGAL",
  "FINANCE",
];

const CATEGORY_LABELS = {
  TECHNOLOGY: "Technology",
  ARCHITECTURE: "Architecture",
  INTERIOR_DESIGN: "Interior Design",
  HVAC: "HVAC",
  PROCUREMENT: "Procurement",
  SECURITY: "Security",
  MARKETING: "Marketing",
  RECRUITMENT: "Recruitment",
  CONSULTING: "Consulting",
  LEGAL: "Legal",
  FINANCE: "Finance",
};

const TURNOVER_RANGES = [
  "Below ₹50L",
  "₹50L-1Cr",
  "₹1Cr-5Cr",
  "₹5Cr-10Cr",
  "₹10Cr-50Cr",
  "Above ₹50Cr",
];

const emptyProduct = {
  name: "",
  category: "",
  description: "",
  priceRange: "",
  photos: [],
  makerCompanyName: "",
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

const requiredStar = {
  color: "#E53E3E",
  marginLeft: "2px",
};

const VendorProfileForm = ({ onSubmit, initialData }) => {
  const [openSections, setOpenSections] = useState({
    personal: true,
    company: false,
    products: false,
    portfolio: false,
    compliance: false,
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
        yearEstablished: initialData.yearEstablished || "",
        employeeCount: initialData.employeeCount || "",
        websiteUrl: initialData.websiteUrl || "",
        category: initialData.category || "",
        products: initialData.products && initialData.products.length > 0
          ? initialData.products.map((p) => ({
              name: p.name || "",
              category: p.category || "",
              description: p.description || "",
              priceRange: p.priceRange || "",
              photos: Array.isArray(p.photos) ? p.photos : (Array.isArray(p.photoUrls) ? p.photoUrls : []),
              makerCompanyName: p.makerCompanyName || "",
            }))
          : [{ ...emptyProduct }],
        previousClients: Array.isArray(initialData.previousClients) ? initialData.previousClients.join("\n") : (initialData.previousClients || ""),
        caseStudyUrls: Array.isArray(initialData.caseStudyUrls) ? initialData.caseStudyUrls.join("\n") : (initialData.caseStudyUrls || ""),
        yearsInIndustry: initialData.yearsInIndustry || "",
        certifications: Array.isArray(initialData.certifications) ? initialData.certifications.join("\n") : (initialData.certifications || ""),
        customerReferences: initialData.customerReferences || "",
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
      yearEstablished: "",
      employeeCount: "",
      websiteUrl: "",
      category: "",
      products: [{ ...emptyProduct }],
      previousClients: "",
      caseStudyUrls: "",
      yearsInIndustry: "",
      certifications: "",
      customerReferences: "",
    };
  });

  const [compliance, setCompliance] = useState(() => {
    const c = initialData?.compliance || initialData?.vendorProfile || {};
    return {
      gstNumber: c.gstNumber || "",
      panNumber: c.panNumber || "",
      msmeNumber: c.msmeNumber || "",
      tradeLicense: c.tradeLicense || "",
      isoCertification: c.isoCertification || "",
      dunsNumber: c.dunsNumber || "",
      annualTurnover: c.annualTurnover || "",
      hotelClientsServed: c.hotelClientsServed || "",
      serviceRegions: Array.isArray(c.serviceRegions) ? c.serviceRegions.join("\n") : (c.serviceRegions || ""),
      insuranceDetails: c.insuranceDetails || "",
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

  const handleComplianceChange = (e) => {
    const { name, value } = e.target;
    setCompliance((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    setFormData((prev) => {
      const products = [...prev.products];
      products[index] = { ...products[index], [field]: value };
      return { ...prev, products };
    });
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { ...emptyProduct }],
    }));
  };

  const removeProduct = (index) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    // Validation
    if (!formData.companyName.trim()) {
      setValidationError("Company Name is required.");
      return;
    }
    if (!formData.category) {
      setValidationError("Category is required.");
      return;
    }
    if (!compliance.gstNumber.trim()) {
      setValidationError("GST Number is required.");
      return;
    }
    if (!compliance.panNumber.trim()) {
      setValidationError("PAN Number is required.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        yearEstablished: formData.yearEstablished
          ? parseInt(formData.yearEstablished, 10)
          : null,
        employeeCount: formData.employeeCount
          ? parseInt(formData.employeeCount, 10)
          : null,
        yearsInIndustry: formData.yearsInIndustry
          ? parseInt(formData.yearsInIndustry, 10)
          : null,
        products: formData.products.map((p) => ({
          ...p,
          photos: Array.isArray(p.photos) ? p.photos : [],
        })),
        previousClients: formData.previousClients
          ? formData.previousClients
              .split("\n")
              .map((c) => c.trim())
              .filter(Boolean)
          : [],
        caseStudyUrls: formData.caseStudyUrls
          ? formData.caseStudyUrls
              .split("\n")
              .map((u) => u.trim())
              .filter(Boolean)
          : [],
        certifications: formData.certifications
          ? formData.certifications
              .split("\n")
              .map((c) => c.trim())
              .filter(Boolean)
          : [],
        compliance: {
          ...compliance,
          hotelClientsServed: compliance.hotelClientsServed
            ? parseInt(compliance.hotelClientsServed, 10)
            : null,
          serviceRegions: compliance.serviceRegions
            ? compliance.serviceRegions
                .split("\n")
                .map((r) => r.trim())
                .filter(Boolean)
            : [],
        },
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
                placeholder="e.g. CEO, Managing Director"
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
              <label style={labelStyle}>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about yourself..."
                style={textareaStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 - Company Details */}
      <div style={sectionWrapperStyle()}>
        <div
          style={sectionHeaderStyle}
          onClick={() => toggleSection("company")}
        >
          <h4 style={sectionTitleStyle}>
            <i
              className="flaticon-profit"
              style={{ color: "#C6A962", fontSize: "20px" }}
            ></i>
            Company Details
          </h4>
          <span style={chevronStyle(openSections.company)}>
            <i className="fas fa-chevron-down"></i>
          </span>
        </div>
        <div style={sectionBodyStyle(openSections.company)}>
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
              <label style={labelStyle}>
                Category<span style={requiredStar}>*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">Select Category</option>
                {VENDOR_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
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
                placeholder="Describe your company and the services you provide..."
                style={textareaStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Year Established</label>
              <input
                type="number"
                name="yearEstablished"
                value={formData.yearEstablished}
                onChange={handleChange}
                min="1900"
                max="2026"
                placeholder="e.g. 2010"
                style={inputStyle}
              />
            </div>
            <div className="col-lg-4" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Employee Count</label>
              <input
                type="number"
                name="employeeCount"
                value={formData.employeeCount}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 50"
                style={inputStyle}
              />
            </div>
            <div className="col-lg-4" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Website URL</label>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://yourcompany.com"
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 - Products/Services */}
      <div style={sectionWrapperStyle()}>
        <div
          style={sectionHeaderStyle}
          onClick={() => toggleSection("products")}
        >
          <h4 style={sectionTitleStyle}>
            <i
              className="flaticon-investment"
              style={{ color: "#C6A962", fontSize: "20px" }}
            ></i>
            Products / Services<span style={requiredStar}>*</span>
          </h4>
          <span style={chevronStyle(openSections.products)}>
            <i className="fas fa-chevron-down"></i>
          </span>
        </div>
        <div style={sectionBodyStyle(openSections.products)}>
          <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "16px" }}>
            At least 1 product/service is required<span style={requiredStar}>*</span>
          </p>
          {formData.products.map((product, index) => (
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
                  Product/Service #{index + 1}
                </span>
                {formData.products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
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
                  <label style={labelStyle}>Product / Service Name</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) =>
                      handleProductChange(index, "name", e.target.value)
                    }
                    placeholder="Product or service name"
                    style={inputStyle}
                  />
                </div>
                <div className="col-lg-6" style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>Category</label>
                  <select
                    value={product.category}
                    onChange={(e) =>
                      handleProductChange(index, "category", e.target.value)
                    }
                    style={inputStyle}
                  >
                    <option value="">Select Category</option>
                    {VENDOR_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12" style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    value={product.description}
                    onChange={(e) =>
                      handleProductChange(index, "description", e.target.value)
                    }
                    rows={3}
                    placeholder="Describe this product or service..."
                    style={textareaStyle}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-4" style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>Price Range</label>
                  <input
                    type="text"
                    value={product.priceRange}
                    onChange={(e) =>
                      handleProductChange(index, "priceRange", e.target.value)
                    }
                    placeholder="e.g. INR 50,000 - 2,00,000"
                    style={inputStyle}
                  />
                </div>
                <div className="col-lg-4" style={{ marginBottom: "12px" }}>
                  <label style={labelStyle}>Maker Company Name</label>
                  <input
                    type="text"
                    value={product.makerCompanyName}
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "makerCompanyName",
                        e.target.value
                      )
                    }
                    placeholder="Manufacturing company"
                    style={inputStyle}
                  />
                </div>
                <div className="col-lg-4" style={{ marginBottom: "12px" }}>
                  <MultiPhotoUpload
                    value={product.photos}
                    onChange={(val) => handleProductChange(index, "photos", val)}
                    label="Product Photos"
                    max={6}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addProduct}
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
            Add Product / Service
          </button>
        </div>
      </div>

      {/* Section 4 - Portfolio & Experience */}
      <div style={sectionWrapperStyle()}>
        <div
          style={sectionHeaderStyle}
          onClick={() => toggleSection("portfolio")}
        >
          <h4 style={sectionTitleStyle}>
            <i
              className="flaticon-target"
              style={{ color: "#C6A962", fontSize: "20px" }}
            ></i>
            Portfolio & Experience
          </h4>
          <span style={chevronStyle(openSections.portfolio)}>
            <i className="fas fa-chevron-down"></i>
          </span>
        </div>
        <div style={sectionBodyStyle(openSections.portfolio)}>
          <div className="row">
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Previous Clients (one per line)</label>
              <textarea
                name="previousClients"
                value={formData.previousClients}
                onChange={handleChange}
                rows={4}
                placeholder={"Taj Hotels\nOberoi Group\nITC Hotels"}
                style={textareaStyle}
              />
            </div>
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Case Study URLs (one per line)</label>
              <textarea
                name="caseStudyUrls"
                value={formData.caseStudyUrls}
                onChange={handleChange}
                rows={4}
                placeholder={"https://yoursite.com/case-study-1\nhttps://yoursite.com/case-study-2"}
                style={textareaStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Years in Industry</label>
              <input
                type="number"
                name="yearsInIndustry"
                value={formData.yearsInIndustry}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 10"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Certifications (one per line)</label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                rows={4}
                placeholder={"ISO 9001:2015\nISO 27001\nFSSAI Certified"}
                style={textareaStyle}
              />
            </div>
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Customer References</label>
              <textarea
                name="customerReferences"
                value={formData.customerReferences}
                onChange={handleChange}
                rows={4}
                placeholder="References from satisfied customers..."
                style={textareaStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 5 - Compliance & Registration */}
      <div style={sectionWrapperStyle()}>
        <div
          style={sectionHeaderStyle}
          onClick={() => toggleSection("compliance")}
        >
          <h4 style={sectionTitleStyle}>
            <i
              className="fas fa-file-contract"
              style={{ color: "#C6A962", fontSize: "20px" }}
            ></i>
            Compliance & Registration
          </h4>
          <span style={chevronStyle(openSections.compliance)}>
            <i className="fas fa-chevron-down"></i>
          </span>
        </div>
        <div style={sectionBodyStyle(openSections.compliance)}>
          <div className="row">
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                GST Number<span style={requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="gstNumber"
                value={compliance.gstNumber}
                onChange={handleComplianceChange}
                required
                pattern="[0-9A-Z]{15}"
                maxLength={15}
                placeholder="e.g., 22AAAAA0000A1Z5"
                style={inputStyle}
              />
            </div>
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                PAN Number<span style={requiredStar}>*</span>
              </label>
              <input
                type="text"
                name="panNumber"
                value={compliance.panNumber}
                onChange={handleComplianceChange}
                required
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                maxLength={10}
                placeholder="e.g., ABCDE1234F"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>MSME Registration Number</label>
              <input
                type="text"
                name="msmeNumber"
                value={compliance.msmeNumber}
                onChange={handleComplianceChange}
                placeholder="MSME / Udyam registration number"
                style={inputStyle}
              />
            </div>
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Trade License Number</label>
              <input
                type="text"
                name="tradeLicense"
                value={compliance.tradeLicense}
                onChange={handleComplianceChange}
                placeholder="Trade license number"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>ISO Certification</label>
              <input
                type="text"
                name="isoCertification"
                value={compliance.isoCertification}
                onChange={handleComplianceChange}
                placeholder="e.g. ISO 9001:2015"
                style={inputStyle}
              />
            </div>
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>DUNS Number</label>
              <input
                type="text"
                name="dunsNumber"
                value={compliance.dunsNumber}
                onChange={handleComplianceChange}
                placeholder="D-U-N-S number"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Annual Turnover Range</label>
              <select
                name="annualTurnover"
                value={compliance.annualTurnover}
                onChange={handleComplianceChange}
                style={inputStyle}
              >
                <option value="">Select Range</option>
                {TURNOVER_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Number of Hotel Clients Served</label>
              <input
                type="number"
                name="hotelClientsServed"
                value={compliance.hotelClientsServed}
                onChange={handleComplianceChange}
                min="0"
                placeholder="e.g. 50"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Service Regions (one per line)</label>
              <textarea
                name="serviceRegions"
                value={compliance.serviceRegions}
                onChange={handleComplianceChange}
                rows={4}
                placeholder={"North India\nWest India\nPan India"}
                style={textareaStyle}
              />
            </div>
            <div className="col-lg-6" style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Insurance Details</label>
              <textarea
                name="insuranceDetails"
                value={compliance.insuranceDetails}
                onChange={handleComplianceChange}
                rows={4}
                placeholder="Details of business insurance coverage..."
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

export default VendorProfileForm;
