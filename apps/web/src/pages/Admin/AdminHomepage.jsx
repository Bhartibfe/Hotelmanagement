import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

const AdminHomepage = () => {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    vendors: true,
    experts: true,
    events: true,
    testimonials: true,
    stats: true,
    cta: true,
  });
  const [hoveredSection, setHoveredSection] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const [config, setConfig] = useState({
    // Hero
    heroTitle: "India's Premier Hospitality Leadership Platform",
    heroSubtitle: "Connecting Hotel Owners, Investors, Vendors & Professionals",
    heroCtaText: "Join the Network",
    heroCtaLink: "/register",
    // Sections
    showFeaturedVendors: true,
    featuredVendorsCount: 6,
    showFeaturedExperts: true,
    featuredExpertsCount: 4,
    showEvents: true,
    eventsCount: 3,
    showTestimonials: true,
    testimonialsCount: 4,
    showStats: true,
    statMembers: "2500+",
    statHotels: "850+",
    statProviders: "3200+",
    statCities: "120+",
    showCta: true,
    ctaTitle: "Ready to Join the Network?",
    ctaDescription: "Connect with India's most trusted hospitality ecosystem.",
    ctaButtonText: "Apply for Membership",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (err) {
      // fallback
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #E2E8F0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
    background: "#FFFFFF",
    color: "#0A1628",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "6px",
  };

  const ToggleSwitch = ({ value, onChange }) => (
    <button
      onClick={onChange}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        border: "none",
        background: value ? "#C6A962" : "#CBD5E1",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background: "#FFFFFF",
          position: "absolute",
          top: "3px",
          left: value ? "23px" : "3px",
          transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      ></div>
    </button>
  );

  const CountSelector = ({ value, onChange, min = 1, max = 12 }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          border: "1px solid #E2E8F0",
          background: "#FFFFFF",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          color: "#64748B",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C6A962"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; }}
      >
        -
      </button>
      <span style={{ fontSize: "16px", fontWeight: 600, color: "#0A1628", minWidth: "24px", textAlign: "center" }}>{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          border: "1px solid #E2E8F0",
          background: "#FFFFFF",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          color: "#64748B",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C6A962"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; }}
      >
        +
      </button>
    </div>
  );

  const SectionCard = ({ id, icon, title, subtitle, children, toggle, toggleKey, expanded }) => {
    const isHovered = hoveredSection === id;
    return (
      <div
        onMouseEnter={() => setHoveredSection(id)}
        onMouseLeave={() => setHoveredSection(null)}
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          marginBottom: "16px",
          transition: "all 0.3s ease",
          boxShadow: isHovered ? "0 4px 16px rgba(10, 22, 40, 0.06)" : "0 1px 3px rgba(0,0,0,0.02)",
          overflow: "hidden",
        }}
      >
        {/* Section Header */}
        <div
          style={{
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            cursor: "pointer",
            borderBottom: expanded ? "1px solid #F1F5F9" : "none",
            transition: "background 0.2s",
            background: isHovered ? "#FAFBFC" : "transparent",
          }}
          onClick={() => toggleSection(id)}
        >
          {/* Drag Handle (Visual Only) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", cursor: "grab", padding: "4px 2px" }}>
            <div style={{ display: "flex", gap: "3px" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#CBD5E1" }}></div>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#CBD5E1" }}></div>
            </div>
            <div style={{ display: "flex", gap: "3px" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#CBD5E1" }}></div>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#CBD5E1" }}></div>
            </div>
            <div style={{ display: "flex", gap: "3px" }}>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#CBD5E1" }}></div>
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#CBD5E1" }}></div>
            </div>
          </div>

          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "#F8FAFC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i className={icon} style={{ fontSize: "14px", color: "#64748B" }}></i>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "#0A1628" }}>{title}</div>
            {subtitle && <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>{subtitle}</div>}
          </div>

          {toggle && (
            <div onClick={(e) => e.stopPropagation()}>
              <ToggleSwitch
                value={config[toggleKey]}
                onChange={() => handleChange(toggleKey, !config[toggleKey])}
              />
            </div>
          )}

          <i
            className={`fas fa-chevron-${expanded ? "up" : "down"}`}
            style={{ fontSize: "12px", color: "#94A3B8", transition: "transform 0.3s", marginLeft: "8px" }}
          ></i>
        </div>

        {/* Content */}
        <div
          style={{
            maxHeight: expanded ? "600px" : "0",
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div style={{ padding: "20px 24px" }}>{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 600, color: "#0A1628", margin: 0, marginBottom: "6px" }}>
            Homepage Configuration
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>
            Customize the homepage content and layout
          </p>
        </div>
        <button
          onClick={handleSave}
          onMouseEnter={() => setHoveredBtn("save")}
          onMouseLeave={() => setHoveredBtn(null)}
          disabled={saving}
          style={{
            padding: "10px 28px",
            fontSize: "13px",
            fontWeight: 600,
            background: saved ? "#10B981" : "#C6A962",
            color: saved ? "#FFFFFF" : "#0A1628",
            border: "none",
            borderRadius: "8px",
            cursor: saving ? "wait" : "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: saved
              ? "0 2px 8px rgba(16, 185, 129, 0.3)"
              : hoveredBtn === "save"
              ? "0 4px 16px rgba(198, 169, 98, 0.4)"
              : "0 2px 8px rgba(198, 169, 98, 0.3)",
            transform: hoveredBtn === "save" ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          {saving ? (
            <>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: "12px" }}></i>
              Saving...
            </>
          ) : saved ? (
            <>
              <i className="fas fa-check" style={{ fontSize: "12px" }}></i>
              Saved!
            </>
          ) : (
            <>
              <i className="fas fa-save" style={{ fontSize: "12px" }}></i>
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Hero Section */}
      <SectionCard
        id="hero"
        icon="fas fa-image"
        title="Hero Section"
        subtitle="Main banner area with headline and call-to-action"
        expanded={expandedSections.hero}
      >
        {/* Hero Preview */}
        <div
          style={{
            background: "linear-gradient(135deg, #0A1628, #1E293B)",
            borderRadius: "8px",
            padding: "32px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#FFFFFF", margin: "0 0 8px 0" }}>
            {config.heroTitle || "Hero Title"}
          </h2>
          <p style={{ fontSize: "14px", color: "#94A3B8", margin: "0 0 16px 0" }}>
            {config.heroSubtitle || "Hero Subtitle"}
          </p>
          <span
            style={{
              display: "inline-block",
              padding: "8px 20px",
              background: "#C6A962",
              color: "#0A1628",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {config.heroCtaText || "CTA Button"}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Hero Title</label>
            <input
              type="text"
              value={config.heroTitle}
              onChange={(e) => handleChange("heroTitle", e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#C6A962"; e.target.style.boxShadow = "0 0 0 3px rgba(198, 169, 98, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div>
            <label style={labelStyle}>Hero Subtitle</label>
            <input
              type="text"
              value={config.heroSubtitle}
              onChange={(e) => handleChange("heroSubtitle", e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#C6A962"; e.target.style.boxShadow = "0 0 0 3px rgba(198, 169, 98, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div>
            <label style={labelStyle}>CTA Button Text</label>
            <input
              type="text"
              value={config.heroCtaText}
              onChange={(e) => handleChange("heroCtaText", e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#C6A962"; e.target.style.boxShadow = "0 0 0 3px rgba(198, 169, 98, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div>
            <label style={labelStyle}>CTA Button Link</label>
            <input
              type="text"
              value={config.heroCtaLink}
              onChange={(e) => handleChange("heroCtaLink", e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#C6A962"; e.target.style.boxShadow = "0 0 0 3px rgba(198, 169, 98, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
            />
          </div>
        </div>
      </SectionCard>

      {/* Featured Vendors */}
      <SectionCard
        id="vendors"
        icon="fas fa-building"
        title="Featured Vendors"
        subtitle="Showcase top vendors on the homepage"
        toggle={true}
        toggleKey="showFeaturedVendors"
        expanded={expandedSections.vendors}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <label style={labelStyle}>Number of Vendors to Display</label>
            <p style={{ fontSize: "13px", color: "#94A3B8", margin: "4px 0 0 0" }}>
              Select how many featured vendors to show on the homepage
            </p>
          </div>
          <CountSelector
            value={config.featuredVendorsCount}
            onChange={(val) => handleChange("featuredVendorsCount", val)}
            max={12}
          />
        </div>
      </SectionCard>

      {/* Featured Experts */}
      <SectionCard
        id="experts"
        icon="fas fa-user-tie"
        title="Featured Experts"
        subtitle="Display industry experts on the homepage"
        toggle={true}
        toggleKey="showFeaturedExperts"
        expanded={expandedSections.experts}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <label style={labelStyle}>Number of Experts to Display</label>
            <p style={{ fontSize: "13px", color: "#94A3B8", margin: "4px 0 0 0" }}>
              Select how many featured experts to show on the homepage
            </p>
          </div>
          <CountSelector
            value={config.featuredExpertsCount}
            onChange={(val) => handleChange("featuredExpertsCount", val)}
            max={8}
          />
        </div>
      </SectionCard>

      {/* Events */}
      <SectionCard
        id="events"
        icon="fas fa-calendar-alt"
        title="Events"
        subtitle="Show upcoming events on the homepage"
        toggle={true}
        toggleKey="showEvents"
        expanded={expandedSections.events}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <label style={labelStyle}>Number of Events to Display</label>
            <p style={{ fontSize: "13px", color: "#94A3B8", margin: "4px 0 0 0" }}>
              Select how many upcoming events to feature
            </p>
          </div>
          <CountSelector
            value={config.eventsCount}
            onChange={(val) => handleChange("eventsCount", val)}
            max={6}
          />
        </div>
      </SectionCard>

      {/* Testimonials */}
      <SectionCard
        id="testimonials"
        icon="fas fa-quote-right"
        title="Testimonials"
        subtitle="Member testimonials carousel"
        toggle={true}
        toggleKey="showTestimonials"
        expanded={expandedSections.testimonials}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <label style={labelStyle}>Number of Testimonials to Display</label>
            <p style={{ fontSize: "13px", color: "#94A3B8", margin: "4px 0 0 0" }}>
              Select how many testimonials to show in the carousel
            </p>
          </div>
          <CountSelector
            value={config.testimonialsCount}
            onChange={(val) => handleChange("testimonialsCount", val)}
            max={8}
          />
        </div>
      </SectionCard>

      {/* Statistics Bar */}
      <SectionCard
        id="stats"
        icon="fas fa-chart-bar"
        title="Statistics Bar"
        subtitle="Key numbers displayed in a banner"
        toggle={true}
        toggleKey="showStats"
        expanded={expandedSections.stats}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Members Count</label>
            <input
              type="text"
              value={config.statMembers}
              onChange={(e) => handleChange("statMembers", e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#C6A962"; e.target.style.boxShadow = "0 0 0 3px rgba(198, 169, 98, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div>
            <label style={labelStyle}>Hotels Count</label>
            <input
              type="text"
              value={config.statHotels}
              onChange={(e) => handleChange("statHotels", e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#C6A962"; e.target.style.boxShadow = "0 0 0 3px rgba(198, 169, 98, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div>
            <label style={labelStyle}>Service Providers</label>
            <input
              type="text"
              value={config.statProviders}
              onChange={(e) => handleChange("statProviders", e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#C6A962"; e.target.style.boxShadow = "0 0 0 3px rgba(198, 169, 98, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div>
            <label style={labelStyle}>Cities Covered</label>
            <input
              type="text"
              value={config.statCities}
              onChange={(e) => handleChange("statCities", e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#C6A962"; e.target.style.boxShadow = "0 0 0 3px rgba(198, 169, 98, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        {/* Stats Preview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "16px",
            marginTop: "20px",
            padding: "20px",
            background: "linear-gradient(135deg, #0A1628, #1E293B)",
            borderRadius: "8px",
          }}
        >
          {[
            { label: "Members", value: config.statMembers },
            { label: "Hotels", value: config.statHotels },
            { label: "Service Providers", value: config.statProviders },
            { label: "Cities", value: config.statCities },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#C6A962", fontFamily: "'Cormorant Garamond', serif" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "11px", color: "#8DA4BE", textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* CTA Section */}
      <SectionCard
        id="cta"
        icon="fas fa-bullhorn"
        title="CTA Section"
        subtitle="Bottom call-to-action area"
        toggle={true}
        toggleKey="showCta"
        expanded={expandedSections.cta}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={labelStyle}>CTA Title</label>
            <input
              type="text"
              value={config.ctaTitle}
              onChange={(e) => handleChange("ctaTitle", e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#C6A962"; e.target.style.boxShadow = "0 0 0 3px rgba(198, 169, 98, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div>
            <label style={labelStyle}>CTA Button Text</label>
            <input
              type="text"
              value={config.ctaButtonText}
              onChange={(e) => handleChange("ctaButtonText", e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#C6A962"; e.target.style.boxShadow = "0 0 0 3px rgba(198, 169, 98, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
            />
          </div>
        </div>
        <div>
          <label style={labelStyle}>CTA Description</label>
          <textarea
            value={config.ctaDescription}
            onChange={(e) => handleChange("ctaDescription", e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => { e.target.style.borderColor = "#C6A962"; e.target.style.boxShadow = "0 0 0 3px rgba(198, 169, 98, 0.1)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* CTA Preview */}
        <div
          style={{
            marginTop: "20px",
            padding: "32px",
            background: "linear-gradient(135deg, #0A1628, #1E293B)",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, color: "#FFFFFF", margin: "0 0 8px 0" }}>
            {config.ctaTitle || "CTA Title"}
          </h3>
          <p style={{ fontSize: "14px", color: "#94A3B8", margin: "0 0 20px 0", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
            {config.ctaDescription || "CTA Description"}
          </p>
          <span
            style={{
              display: "inline-block",
              padding: "10px 28px",
              background: "#C6A962",
              color: "#0A1628",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {config.ctaButtonText || "Button Text"}
          </span>
        </div>
      </SectionCard>
    </div>
  );
};

export default AdminHomepage;
