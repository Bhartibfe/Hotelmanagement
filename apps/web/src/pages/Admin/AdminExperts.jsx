import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import api from "../../services/api";
import PhotoUpload from "../../components/profile/PhotoUpload";

const EXPERTISE_COLORS = [
  { bg: "#EFF6FF", color: "#3B82F6" },
  { bg: "#F5F3FF", color: "#8B5CF6" },
  { bg: "#ECFDF5", color: "#10B981" },
  { bg: "#FEF9E7", color: "#C6A962" },
  { bg: "#FFF7ED", color: "#F59E0B" },
  { bg: "#FCE7F3", color: "#EC4899" },
];

const DEFAULT_EXPERTISE = [
  "General Management", "Hotel Owners / Ownership", "Asset Management", "Operations",
  "Sales", "Marketing", "Revenue Management", "Finance & Accounts",
  "Human Resources (People & Culture)", "Information Technology", "Food & Beverage",
  "Design & Architecture", "Consulting & Advisory", "Hospitality Technology",
  "ESG & Sustainability", "Guest Experience",
];

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #E2E8F0",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
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

const AdminExperts = () => {
  const [experts, setExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [starAnimating, setStarAnimating] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expertiseOptions, setExpertiseOptions] = useState(DEFAULT_EXPERTISE);

  const emptyForm = {
    email: "", password: "", firstName: "", lastName: "",
    title: "", phone: "", city: "", state: "",
    organizationName: "", organizationRole: "", bio: "",
    expertise: [], currentOrganization: "", currentRole: "",
    yearsOfExperience: "", industryInsights: "",
    publishedArticles: "", speakingEngagements: "",
    awards: "", certifications: "",
    isFeatured: false, isPinned: false, avatar: "",
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setMounted(true);
    fetchExperts();
    api.getHomepageConfig().then((data) => {
      if (data?.expertiseOptions?.length > 0) setExpertiseOptions(data.expertiseOptions);
    }).catch(() => {});
  }, []);

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showForm]);

  const fetchExperts = async () => {
    try {
      const data = await api.getAdminExperts();
      if (data?.experts) setExperts(data.experts);
    } catch (err) { /* keep empty */ }
    finally { setLoading(false); }
  };

  const filtered = experts.filter((e) => {
    const fullName = ((e.user?.firstName || "") + " " + (e.user?.lastName || "")).trim();
    return (
      !searchTerm ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.user?.organizationName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.user?.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.expertise || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleToggleFeatured = async (id) => {
    setStarAnimating(id);
    try {
      await api.toggleExpertFeatured(id);
      setTimeout(() => {
        setExperts((prev) => prev.map((e) => (e.id === id ? { ...e, isFeatured: !e.isFeatured } : e)));
        setStarAnimating(null);
      }, 300);
      setError(null);
    } catch (err) {
      setStarAnimating(null);
      setError(err.message || "Operation failed");
    }
  };

  const handleTogglePinned = async (id) => {
    try {
      await api.toggleExpertPinned(id);
      setExperts((prev) => prev.map((e) => (e.id === id ? { ...e, isPinned: !e.isPinned } : e)));
      setError(null);
    } catch (err) {
      setError(err.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this expert?")) return;
    try {
      await api.deleteExpert(id);
      setExperts((prev) => prev.filter((e) => e.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message || "Operation failed");
    }
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddExpertise = (val) => {
    if (val && !form.expertise.includes(val)) {
      setForm((prev) => ({ ...prev, expertise: [...prev.expertise, val] }));
    }
  };

  const handleRemoveExpertise = (val) => {
    setForm((prev) => ({ ...prev, expertise: prev.expertise.filter((e) => e !== val) }));
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password || !form.firstName || !form.lastName) {
      setError("Email, password, first name, and last name are required");
      return;
    }
    if (form.expertise.length === 0) {
      setError("At least one specialization is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.createExpert(form);
      setShowForm(false);
      setForm(emptyForm);
      setLoading(true);
      fetchExperts();
    } catch (err) {
      setError(err.message || "Failed to create expert");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (first, last) => ((first?.[0] || "") + (last?.[0] || "")).toUpperCase() || "?";
  const getExpertiseColor = (index) => EXPERTISE_COLORS[index % EXPERTISE_COLORS.length];

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
            Industry Experts
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>
            Manage industry experts and thought leaders
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(null); }}
          onMouseEnter={() => setHoveredBtn("add")}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            padding: "10px 24px", fontSize: "13px", fontWeight: 600,
            background: showForm ? "#EF4444" : "#C6A962",
            color: showForm ? "#FFFFFF" : "#0A1628",
            border: "none", borderRadius: "8px", cursor: "pointer",
            transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: "8px",
            boxShadow: "0 2px 8px rgba(198, 169, 98, 0.3)",
            transform: hoveredBtn === "add" ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          <i className={`fas fa-${showForm ? "times" : "plus"}`} style={{ fontSize: "12px" }}></i>
          {showForm ? "Cancel" : "Add Expert"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "12px 20px", marginBottom: "16px", background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA", borderRadius: "8px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {/* Add Expert Dialog */}
      {showForm && ReactDOM.createPortal(
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => { setShowForm(false); setForm(emptyForm); }}>
        <div onClick={(e) => e.stopPropagation()} style={{
          background: "#FFFFFF", borderRadius: "12px",
          padding: "28px", width: "100%", maxWidth: "720px", maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, color: "#0A1628", margin: 0 }}>
              Create Expert Account
            </h3>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); }} style={{ background: "none", border: "none", fontSize: "20px", color: "#94A3B8", cursor: "pointer" }}><i className="fas fa-times"></i></button>
          </div>

          {/* Account Credentials */}
          <div style={{ marginBottom: "20px", padding: "16px", background: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>
              <i className="fas fa-key" style={{ marginRight: "8px", color: "#C6A962" }}></i>
              Login Credentials
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Email <span style={{ color: "#EF4444" }}>*</span></label>
                <input type="email" value={form.email} onChange={(e) => handleFormChange("email", e.target.value)} style={inputStyle} placeholder="expert@example.com" />
              </div>
              <div>
                <label style={labelStyle}>Password <span style={{ color: "#EF4444" }}>*</span></label>
                <input type="text" value={form.password} onChange={(e) => handleFormChange("password", e.target.value)} style={inputStyle} placeholder="Temporary password" />
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>
              <i className="fas fa-user" style={{ marginRight: "8px", color: "#C6A962" }}></i>
              Personal Information
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>First Name <span style={{ color: "#EF4444" }}>*</span></label>
                <input type="text" value={form.firstName} onChange={(e) => handleFormChange("firstName", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Last Name <span style={{ color: "#EF4444" }}>*</span></label>
                <input type="text" value={form.lastName} onChange={(e) => handleFormChange("lastName", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Designation / Title</label>
                <input type="text" value={form.title} onChange={(e) => handleFormChange("title", e.target.value)} style={inputStyle} placeholder="e.g. CEO, Director" />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input type="text" value={form.phone} onChange={(e) => handleFormChange("phone", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input type="text" value={form.city} onChange={(e) => handleFormChange("city", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <input type="text" value={form.state} onChange={(e) => handleFormChange("state", e.target.value)} style={inputStyle} />
              </div>
            </div>
            <PhotoUpload value={form.avatar} onChange={(val) => handleFormChange("avatar", val)} label="Expert Photo" />
          </div>

          {/* Professional Info */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>
              <i className="fas fa-briefcase" style={{ marginRight: "8px", color: "#C6A962" }}></i>
              Professional Details
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Organization Name</label>
                <input type="text" value={form.organizationName} onChange={(e) => handleFormChange("organizationName", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Role in Organization</label>
                <input type="text" value={form.organizationRole} onChange={(e) => handleFormChange("organizationRole", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Years of Experience</label>
                <input type="number" value={form.yearsOfExperience} onChange={(e) => handleFormChange("yearsOfExperience", e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Bio</label>
              <textarea value={form.bio} onChange={(e) => handleFormChange("bio", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Brief professional biography..." />
            </div>
            <div>
              <label style={labelStyle}>Industry Insights</label>
              <textarea value={form.industryInsights} onChange={(e) => handleFormChange("industryInsights", e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Key industry perspectives..." />
            </div>
          </div>

          {/* Specializations */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>
              <i className="fas fa-tags" style={{ marginRight: "8px", color: "#C6A962" }}></i>
              Specializations / Expertise <span style={{ color: "#EF4444" }}>*</span>
            </h4>
            <select
              onChange={(e) => { handleAddExpertise(e.target.value); e.target.value = ""; }}
              style={{ ...inputStyle, marginBottom: "12px", cursor: "pointer" }}
              defaultValue=""
            >
              <option value="" disabled>-- Select Specialization --</option>
              {expertiseOptions.filter((o) => !form.expertise.includes(o)).map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {form.expertise.map((tag, i) => {
                const c = getExpertiseColor(i);
                return (
                  <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", background: c.bg, color: c.color, borderRadius: "14px", fontSize: "12px", fontWeight: 600 }}>
                    {tag}
                    <button onClick={() => handleRemoveExpertise(tag)} style={{ background: "none", border: "none", color: c.color, cursor: "pointer", fontSize: "14px", padding: 0, lineHeight: 1 }}>×</button>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>
              <i className="fas fa-trophy" style={{ marginRight: "8px", color: "#C6A962" }}></i>
              Achievements (one per line)
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Awards</label>
                <textarea value={form.awards} onChange={(e) => handleFormChange("awards", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Award 1&#10;Award 2" />
              </div>
              <div>
                <label style={labelStyle}>Certifications</label>
                <textarea value={form.certifications} onChange={(e) => handleFormChange("certifications", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Certification 1&#10;Certification 2" />
              </div>
              <div>
                <label style={labelStyle}>Published Articles</label>
                <textarea value={form.publishedArticles} onChange={(e) => handleFormChange("publishedArticles", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Article 1&#10;Article 2" />
              </div>
              <div>
                <label style={labelStyle}>Speaking Engagements</label>
                <textarea value={form.speakingEngagements} onChange={(e) => handleFormChange("speakingEngagements", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Event 1&#10;Event 2" />
              </div>
            </div>
          </div>

          {/* Visibility Options */}
          <div style={{ marginBottom: "24px", padding: "16px", background: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>
              <i className="fas fa-eye" style={{ marginRight: "8px", color: "#C6A962" }}></i>
              Homepage Visibility
            </h4>
            <div style={{ display: "flex", gap: "24px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", color: "#0A1628" }}>
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => handleFormChange("isFeatured", e.target.checked)} style={{ accentColor: "#C6A962", width: "18px", height: "18px" }} />
                <span><i className="fas fa-star" style={{ color: "#C6A962", marginRight: "6px" }}></i> Starred</span>
                <span style={{ fontSize: "12px", color: "#94A3B8" }}>— Eligible to appear on homepage</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", color: "#0A1628" }}>
                <input type="checkbox" checked={form.isPinned} onChange={(e) => handleFormChange("isPinned", e.target.checked)} style={{ accentColor: "#C6A962", width: "18px", height: "18px" }} />
                <span><i className="fas fa-thumbtack" style={{ color: "#3B82F6", marginRight: "6px" }}></i> Pinned</span>
                <span style={{ fontSize: "12px", color: "#94A3B8" }}>— Always shown on homepage</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); }} style={{ padding: "10px 24px", fontSize: "13px", fontWeight: 600, background: "transparent", color: "#64748B", border: "1px solid #E2E8F0", borderRadius: "8px", cursor: "pointer" }}>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{
                padding: "10px 28px", fontSize: "13px", fontWeight: 600,
                background: "#C6A962", color: "#0A1628", border: "none", borderRadius: "8px",
                cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", gap: "8px",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? <><i className="fas fa-spinner fa-spin" style={{ fontSize: "12px" }}></i> Creating...</> : <><i className="fas fa-check" style={{ fontSize: "12px" }}></i> Create Expert</>}
            </button>
          </div>
        </div>
        </div>,
        document.body
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "24px", color: "#C6A962" }}></i>
          <p style={{ marginTop: "12px", color: "#64748B", fontSize: "14px" }}>Loading...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Search Bar */}
          <div
            style={{
              background: "#FFFFFF", border: searchFocused ? "1px solid #C6A962" : "1px solid #E2E8F0",
              borderRadius: "8px", padding: "4px 16px", marginBottom: "28px",
              display: "flex", alignItems: "center", gap: "12px",
              transition: "all 0.3s ease", boxShadow: searchFocused ? "0 0 0 3px rgba(198, 169, 98, 0.1)" : "none", maxWidth: "480px",
            }}
          >
            <i className="fas fa-search" style={{ fontSize: "14px", color: searchFocused ? "#C6A962" : "#94A3B8" }}></i>
            <input
              type="text" placeholder="Search experts..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              style={{ flex: 1, padding: "10px 0", border: "none", outline: "none", fontSize: "14px", color: "#0A1628", background: "transparent" }}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "12px", padding: "4px" }}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          {/* Grid of Expert Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {filtered.map((expert, idx) => {
              const fullName = ((expert.user?.firstName || "") + " " + (expert.user?.lastName || "")).trim();
              return (
                <div
                  key={expert.id}
                  onMouseEnter={() => setHoveredCard(expert.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "24px",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: hoveredCard === expert.id ? "translateY(-4px)" : "translateY(0)",
                    boxShadow: hoveredCard === expert.id ? "0 12px 32px rgba(10, 22, 40, 0.12)" : "0 1px 3px rgba(0, 0, 0, 0.04)",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {/* Star + Pin buttons */}
                  <div style={{ position: "absolute", top: "16px", right: "16px", display: "flex", gap: "8px", zIndex: 2 }}>
                    <button
                      onClick={() => handleTogglePinned(expert.id)}
                      title={expert.isPinned ? "Unpin from homepage" : "Pin to homepage (always shown)"}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                    >
                      <i
                        className="fas fa-thumbtack"
                        style={{
                          fontSize: "16px",
                          color: expert.isPinned ? "#3B82F6" : "#CBD5E1",
                          transform: expert.isPinned ? "rotate(0deg)" : "rotate(45deg)",
                          transition: "all 0.3s ease",
                        }}
                      ></i>
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(expert.id)}
                      title={expert.isFeatured ? "Remove from starred" : "Star (eligible for homepage)"}
                      style={{
                        background: "none", border: "none", cursor: "pointer", padding: "4px",
                        transform: starAnimating === expert.id ? "scale(1.3) rotate(72deg)" : "scale(1)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <i
                        className={expert.isFeatured ? "fas fa-star" : "far fa-star"}
                        style={{ fontSize: "18px", color: expert.isFeatured ? "#C6A962" : "#CBD5E1", transition: "color 0.3s ease" }}
                      ></i>
                    </button>
                  </div>

                  {/* Pinned badge */}
                  {expert.isPinned && (
                    <div style={{ position: "absolute", top: 0, left: 0, background: "#3B82F6", color: "#FFFFFF", fontSize: "9px", fontWeight: 700, padding: "3px 10px", letterSpacing: "1px", textTransform: "uppercase" }}>
                      Pinned
                    </div>
                  )}

                  {/* Avatar */}
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #0A1628, #1E293B)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#C6A962", fontWeight: 700, fontSize: "16px", flexShrink: 0, letterSpacing: "0.5px",
                      border: expert.isPinned ? "2px solid #3B82F6" : expert.isFeatured ? "2px solid #C6A962" : "2px solid transparent",
                    }}>
                      {getInitials(expert.user?.firstName, expert.user?.lastName)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "16px", fontWeight: 600, color: "#0A1628", lineHeight: 1.3, fontFamily: "'Cormorant Garamond', serif" }}>
                        {fullName}
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748B", marginTop: "2px" }}>{expert.user?.title}</div>
                      <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "1px" }}>{expert.user?.email}</div>
                    </div>
                  </div>

                  {/* Company & City */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                    {expert.user?.organizationName && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
                        <i className="fas fa-building" style={{ fontSize: "11px", color: "#94A3B8", width: "14px" }}></i>
                        {expert.user.organizationName}
                      </div>
                    )}
                    {expert.user?.city && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
                        <i className="fas fa-map-marker-alt" style={{ fontSize: "11px", color: "#94A3B8", width: "14px" }}></i>
                        {expert.user.city}
                      </div>
                    )}
                  </div>

                  {/* Expertise Tags */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
                    {(expert.expertise || []).slice(0, 4).map((tag, tagIdx) => {
                      const tagColor = getExpertiseColor(tagIdx);
                      return (
                        <span key={tag} style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", background: tagColor.bg, color: tagColor.color, borderRadius: "12px" }}>
                          {tag}
                        </span>
                      );
                    })}
                    {(expert.expertise || []).length > 4 && (
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", background: "#F1F5F9", color: "#64748B", borderRadius: "12px" }}>
                        +{expert.expertise.length - 4}
                      </span>
                    )}
                  </div>

                  <div style={{ height: "1px", background: "#F1F5F9", marginBottom: "16px" }}></div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleDelete(expert.id)}
                      onMouseEnter={() => setHoveredBtn(`del-${expert.id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      style={{
                        flex: 1, padding: "8px 14px", fontSize: "12px", fontWeight: 600,
                        background: hoveredBtn === `del-${expert.id}` ? "#FEF2F2" : "transparent",
                        color: "#EF4444", border: "1px solid #FECACA", borderRadius: "6px",
                        cursor: "pointer", transition: "all 0.25s ease",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      }}
                    >
                      <i className="fas fa-trash-alt" style={{ fontSize: "10px" }}></i>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div style={{ padding: "64px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-user-tie" style={{ fontSize: "24px", color: "#CBD5E1" }}></i>
              </div>
              <p style={{ fontSize: "15px", color: "#64748B", fontWeight: 500, margin: 0 }}>No experts found</p>
              <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>Click "Add Expert" to create one.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminExperts;
