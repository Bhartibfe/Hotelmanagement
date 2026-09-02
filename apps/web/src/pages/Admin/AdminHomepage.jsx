import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAdminToast } from "../../components/admin/AdminToast";
import { ErrorNotice } from "../../components/common/ErrorNotice";
import PhotoUpload from "../../components/profile/PhotoUpload";
import { DEFAULT_VENDOR_CATEGORIES } from "../../lib/vendorCategories";

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

const SectionCard = ({ id, icon, title, subtitle, children, toggle, toggleValue, onToggleChange, expanded, onToggleSection, hoveredSection, setHoveredSection }) => {
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
        onClick={() => onToggleSection(id)}
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
              value={toggleValue}
              onChange={onToggleChange}
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
          maxHeight: expanded ? "5000px" : "0",
          overflow: "hidden",
          transition: "max-height 0.5s ease-in-out",
        }}
      >
        <div style={{ padding: "20px 24px" }}>{children}</div>
      </div>
    </div>
  );
};

const LiveStatsPreview = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.getPublicStats().then((data) => setStats(data)).catch(() => {});
  }, []);
  const items = [
    { label: "Members", value: stats?.members ?? "—", icon: "fas fa-users" },
    { label: "Hotels", value: stats?.hotels ?? "—", icon: "fas fa-hotel" },
    { label: "Partners", value: stats?.vendors ?? "—", icon: "fas fa-building" },
    { label: "Cities", value: stats?.cities ?? "—", icon: "fas fa-map-marker-alt" },
    { label: "Events", value: stats?.events ?? "—", icon: "fas fa-calendar-alt" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: "12px", padding: "20px", background: "linear-gradient(135deg, #0A1628, #1E293B)", borderRadius: "8px" }}>
      {items.map((stat, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <i className={stat.icon} style={{ fontSize: "14px", color: "#546A8B", marginBottom: "6px", display: "block" }}></i>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#C6A962", fontFamily: "'Cormorant Garamond', serif" }}>
            {stat.value}{typeof stat.value === "number" ? "+" : ""}
          </div>
          <div style={{ fontSize: "10px", color: "#8DA4BE", textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminHomepage = () => {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  // Distinct from `error`: a failed load means the form below is showing the
  // built-in defaults, not the saved settings, and saving would overwrite them.
  const [loadError, setLoadError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const { toastError, toastSuccess } = useAdminToast();
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    vendors: true,
    experts: true,
    expertise: true,
    categories: true,
    leadership: true,
    events: true,
    testimonials: true,
    stats: true,
    cta: true,
  });
  const [hoveredSection, setHoveredSection] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [newExpertise, setNewExpertise] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [config, setConfig] = useState({
    // Hero
    heroTitle: "India's Premier Hotels Owner Platforms",
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
    categoryOptions: DEFAULT_VENDOR_CATEGORIES,
    expertiseOptions: [
      "General Management",
      "Hotel Owners / Ownership",
      "Asset Management",
      "Operations",
      "Sales",
      "Marketing",
      "Business Development",
      "Revenue Management",
      "Distribution",
      "Digital Marketing",
      "Brand Marketing & Communications",
      "Finance & Accounts",
      "Human Resources (People & Culture)",
      "Learning & Development",
      "Procurement & Supply Chain",
      "Information Technology",
      "Information Security (Cybersecurity)",
      "Artificial Intelligence & Emerging Technologies",
      "Engineering & Maintenance",
      "Projects & Development",
      "Design & Architecture",
      "Housekeeping",
      "Front Office",
      "Reservations",
      "Food & Beverage",
      "Culinary",
      "Banquets & Events",
      "Spa & Wellness",
      "Recreation",
      "Security & Loss Prevention",
      "Quality Assurance",
      "Guest Experience",
      "Customer Relations",
      "Legal & Compliance",
      "ESG & Sustainability",
      "Franchise Development",
      "Development & Feasibility",
      "Consulting & Advisory",
      "Hospitality Technology",
      "Travel & Tourism",
      "Academia & Training",
      "Purchasing",
      "Public Relations (PR)",
    ],
    leadershipTeam: [
      { name: "Harish Chandra", role: "Chief Executive Officer", photo: "", bio: "" },
      { name: "Jaikiran Ahluwalia", role: "Chief Business Officer", photo: "", bio: "" },
      { name: "Narinder Kamra", role: "Chief Operations Officer", photo: "", bio: "" },
    ],
  });

  // Load saved config on mount
  useEffect(() => {
    setMounted(true);
    const loadConfig = async () => {
      setLoadError(null);
      try {
        const data = await api.getHomepageConfig();
        if (data && Object.keys(data).length > 0) {
          setConfig((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        // Critical to surface: the form silently falls back to the built-in
        // defaults, so saving would overwrite the real settings with them.
        setLoadError(err);
      }
    };
    loadConfig();
  }, [reloadKey]);

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.saveHomepageConfig(config);
      setSaved(true);
      toastSuccess("Homepage settings saved.");
    } catch (err) {
      setError(err);
      toastError(err, "save the homepage settings");
    } finally {
      setSaving(false);
    }
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

      {loadError && (
        <div style={{ marginBottom: "20px", maxWidth: "720px" }}>
          <ErrorNotice
            error={loadError}
            title="Saved settings could not be loaded — the form below shows the defaults"
            onRetry={() => setReloadKey((k) => k + 1)}
          />
        </div>
      )}

      {error && (
        <div style={{ marginBottom: "20px", maxWidth: "720px" }}>
          <ErrorNotice error={error} title="Your changes were not saved" onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Hero Section */}
      <SectionCard
        id="hero"
        icon="fas fa-image"
        title="Hero Section"
        subtitle="Main banner area with headline and call-to-action"
        expanded={expandedSections.hero}
        onToggleSection={toggleSection}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
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
        title="Featured Partners"
        subtitle="Showcase top partners on the homepage"
        toggle={true}
        toggleValue={config.showFeaturedVendors}
        onToggleChange={() => handleChange("showFeaturedVendors", !config.showFeaturedVendors)}
        expanded={expandedSections.vendors}
        onToggleSection={toggleSection}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <label style={labelStyle}>Number of Partners to Display</label>
            <p style={{ fontSize: "13px", color: "#94A3B8", margin: "4px 0 0 0" }}>
              Select how many featured partners to show on the homepage
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
        toggleValue={config.showFeaturedExperts}
        onToggleChange={() => handleChange("showFeaturedExperts", !config.showFeaturedExperts)}
        expanded={expandedSections.experts}
        onToggleSection={toggleSection}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
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
        toggleValue={config.showEvents}
        onToggleChange={() => handleChange("showEvents", !config.showEvents)}
        expanded={expandedSections.events}
        onToggleSection={toggleSection}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
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
        toggleValue={config.showTestimonials}
        onToggleChange={() => handleChange("showTestimonials", !config.showTestimonials)}
        expanded={expandedSections.testimonials}
        onToggleSection={toggleSection}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
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
        toggleValue={config.showStats}
        onToggleChange={() => handleChange("showStats", !config.showStats)}
        expanded={expandedSections.stats}
        onToggleSection={toggleSection}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
      >
        <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px" }}>
          <i className="fas fa-info-circle" style={{ marginRight: "6px", color: "#C6A962" }}></i>
          These numbers are fetched live from the database. They update automatically as members, hotels, and partners are added.
        </p>

        {/* Stats Preview - Live Data */}
        <LiveStatsPreview />

        {/* Spacer */}
        <div style={{ display: "none" }}>
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

      {/* Specializations / Expertise */}
      <SectionCard
        id="expertise"
        icon="fas fa-tags"
        title="Specializations / Expertise"
        subtitle="Manage expertise filters for experts page and profile forms"
        expanded={expandedSections.expertise}
        onToggleSection={toggleSection}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
      >
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Add New Specialization</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              placeholder="e.g. Hospitality Analytics"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#C6A962"; e.target.style.boxShadow = "0 0 0 3px rgba(198, 169, 98, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newExpertise.trim()) {
                  const trimmed = newExpertise.trim();
                  if (!config.expertiseOptions.includes(trimmed)) {
                    handleChange("expertiseOptions", [...config.expertiseOptions, trimmed]);
                  }
                  setNewExpertise("");
                }
              }}
            />
            <button
              onClick={() => {
                const trimmed = newExpertise.trim();
                if (trimmed && !config.expertiseOptions.includes(trimmed)) {
                  handleChange("expertiseOptions", [...config.expertiseOptions, trimmed]);
                }
                setNewExpertise("");
              }}
              style={{
                padding: "10px 20px",
                background: "#C6A962",
                color: "#0A1628",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              <i className="fas fa-plus" style={{ marginRight: "6px" }}></i>
              Add
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontSize: "12px", color: "#64748B" }}>
            {config.expertiseOptions?.length || 0} specializations — click × to remove
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: "300px", overflowY: "auto", padding: "4px 0" }}>
          {(config.expertiseOptions || []).map((opt) => (
            <div
              key={opt}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                background: "#F1F5F9",
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                fontSize: "13px",
                color: "#0A1628",
                transition: "all 0.2s",
              }}
            >
              <span>{opt}</span>
              <button
                onClick={() => {
                  handleChange(
                    "expertiseOptions",
                    config.expertiseOptions.filter((o) => o !== opt)
                  );
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "0 2px",
                  lineHeight: 1,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#94A3B8"; }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Partner Categories */}
      <SectionCard
        id="categories"
        icon="fas fa-th-large"
        title="Partner Categories"
        subtitle="Manage category filters for the partners page, sign-up and product forms"
        expanded={expandedSections.categories}
        onToggleSection={toggleSection}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
      >
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Add New Category</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Landscaping"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "#C6A962"; e.target.style.boxShadow = "0 0 0 3px rgba(198, 169, 98, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newCategory.trim()) {
                  const trimmed = newCategory.trim();
                  if (!(config.categoryOptions || []).includes(trimmed)) {
                    handleChange("categoryOptions", [...(config.categoryOptions || []), trimmed]);
                  }
                  setNewCategory("");
                }
              }}
            />
            <button
              onClick={() => {
                const trimmed = newCategory.trim();
                if (trimmed && !(config.categoryOptions || []).includes(trimmed)) {
                  handleChange("categoryOptions", [...(config.categoryOptions || []), trimmed]);
                }
                setNewCategory("");
              }}
              style={{
                padding: "10px 20px",
                background: "#C6A962",
                color: "#0A1628",
                border: "none",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              <i className="fas fa-plus" style={{ marginRight: "6px" }}></i>
              Add
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontSize: "12px", color: "#64748B" }}>
            {config.categoryOptions?.length || 0} categories — click × to remove.
            Removing one does not recategorise partners already using it.
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: "300px", overflowY: "auto", padding: "4px 0" }}>
          {(config.categoryOptions || []).map((opt) => (
            <div
              key={opt}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                background: "#F1F5F9",
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                fontSize: "13px",
                color: "#0A1628",
                transition: "all 0.2s",
              }}
            >
              <span>{opt}</span>
              <button
                onClick={() => {
                  handleChange(
                    "categoryOptions",
                    (config.categoryOptions || []).filter((o) => o !== opt)
                  );
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "0 2px",
                  lineHeight: 1,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#94A3B8"; }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Leadership Team */}
      <SectionCard
        id="leadership"
        icon="fas fa-users-cog"
        title="Leadership Team"
        subtitle="Manage founders and leadership shown on the About page"
        expanded={expandedSections.leadership}
        onToggleSection={toggleSection}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
      >
        {(config.leadershipTeam || []).map((member, idx) => (
          <div
            key={idx}
            style={{
              padding: "20px",
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0A1628", margin: 0 }}>
                <i className="fas fa-user-tie" style={{ marginRight: "8px", color: "#C6A962" }}></i>
                Member {idx + 1}
              </h4>
              {config.leadershipTeam.length > 1 && (
                <button
                  onClick={() => {
                    const updated = config.leadershipTeam.filter((_, i) => i !== idx);
                    handleChange("leadershipTeam", updated);
                  }}
                  style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
                >
                  <i className="fas fa-trash-alt" style={{ marginRight: "4px" }}></i> Remove
                </button>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => {
                    const updated = [...config.leadershipTeam];
                    updated[idx] = { ...updated[idx], name: e.target.value };
                    handleChange("leadershipTeam", updated);
                  }}
                  style={inputStyle}
                  placeholder="e.g. Harish Chandra"
                />
              </div>
              <div>
                <label style={labelStyle}>Role / Designation</label>
                <input
                  type="text"
                  value={member.role}
                  onChange={(e) => {
                    const updated = [...config.leadershipTeam];
                    updated[idx] = { ...updated[idx], role: e.target.value };
                    handleChange("leadershipTeam", updated);
                  }}
                  style={inputStyle}
                  placeholder="e.g. Chief Executive Officer"
                />
              </div>
            </div>
            <div style={{ marginBottom: "12px" }}>
              <PhotoUpload
                crop
                value={member.photo}
                onChange={(url) => {
                  const updated = [...config.leadershipTeam];
                  updated[idx] = { ...updated[idx], photo: url };
                  handleChange("leadershipTeam", updated);
                }}
                label="Photo"
              />
            </div>
            <div>
              <label style={labelStyle}>Brief Bio</label>
              <textarea
                value={member.bio}
                onChange={(e) => {
                  const updated = [...config.leadershipTeam];
                  updated[idx] = { ...updated[idx], bio: e.target.value };
                  handleChange("leadershipTeam", updated);
                }}
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Short professional biography..."
              />
            </div>
          </div>
        ))}
        <button
          onClick={() => {
            const updated = [...(config.leadershipTeam || []), { name: "", role: "", photo: "", bio: "" }];
            handleChange("leadershipTeam", updated);
          }}
          style={{
            padding: "10px 20px",
            background: "transparent",
            color: "#C6A962",
            border: "1px dashed #C6A962",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
            transition: "all 0.2s",
          }}
        >
          <i className="fas fa-plus" style={{ marginRight: "6px" }}></i>
          Add Team Member
        </button>
      </SectionCard>

      {/* CTA Section */}
      <SectionCard
        id="cta"
        icon="fas fa-bullhorn"
        title="CTA Section"
        subtitle="Bottom call-to-action area"
        toggle={true}
        toggleValue={config.showCta}
        onToggleChange={() => handleChange("showCta", !config.showCta)}
        expanded={expandedSections.cta}
        onToggleSection={toggleSection}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
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
