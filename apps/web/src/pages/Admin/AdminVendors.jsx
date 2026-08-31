import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import api from "../../services/api";
import PhotoUpload from "../../components/profile/PhotoUpload";
import { DEFAULT_VENDOR_CATEGORIES, categoryChip, categoryLabel } from "../../lib/vendorCategories";

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

const EMPTY_FORM = {
  email: "", password: "", firstName: "", lastName: "",
  companyName: "", category: "", description: "", logo: "",
  city: "", state: "", employeeCount: "", yearEstablished: "", isFeatured: false,
};

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryOptions, setCategoryOptions] = useState(DEFAULT_VENDOR_CATEGORIES);
  const [mounted, setMounted] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [starAnimating, setStarAnimating] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setMounted(true);
    const fetchVendors = async () => {
      try {
        const data = await api.getAdminVendors();
        if (data?.vendors) {
          setVendors(data.vendors);
        }
      } catch (err) {
        // keep empty array on failure
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  // Categories are admin-managed in Admin -> Homepage, same as expertise.
  useEffect(() => {
    api.getHomepageConfig().then((data) => {
      if (data?.categoryOptions?.length > 0) setCategoryOptions(data.categoryOptions);
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

  const filtered = vendors.filter(
    (v) => {
      const contactName = ((v.user?.firstName || '') + ' ' + (v.user?.lastName || '')).trim();
      return (
        !searchTerm ||
        (v.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoryLabel(v.category).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );

  const stats = [
    { label: "Total Vendors", value: vendors.length, icon: "fas fa-building", color: "#C6A962" },
    { label: "Featured", value: vendors.filter((v) => v.isFeatured).length, icon: "fas fa-star", color: "#F59E0B" },
    { label: "Categories", value: new Set(vendors.map((v) => v.category).filter(Boolean)).size, icon: "fas fa-th-large", color: "#10B981" },
    { label: "Cities", value: new Set(vendors.map((v) => v.city).filter(Boolean)).size, icon: "fas fa-map-marker-alt", color: "#8B5CF6" },
  ];

  const handleCreateVendor = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!editingId && (!form.email || !form.password || !form.firstName || !form.lastName)) {
      setFormError("Email, password, first name, and last name are required for new partners.");
      return;
    }
    setFormLoading(true);
    try {
      if (editingId) {
        const res = await api.updateVendor(editingId, {
          companyName: form.companyName, category: form.category, description: form.description,
          city: form.city, state: form.state, employeeCount: form.employeeCount,
          yearEstablished: form.yearEstablished, logo: form.logo, isFeatured: form.isFeatured,
        });
        setVendors((prev) => prev.map((v) => (v.id === editingId ? { ...v, ...res } : v)));
      } else {
        const res = await api.createVendor(form);
        setVendors((prev) => [{ ...res, user: { firstName: form.firstName, lastName: form.lastName, email: form.email } }, ...prev]);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setFormError(err.message || "Failed to save partner");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditVendor = (vendor) => {
    setForm({
      email: vendor.user?.email || "",
      password: "",
      firstName: vendor.user?.firstName || "",
      lastName: vendor.user?.lastName || "",
      companyName: vendor.companyName || "",
      category: vendor.category || "",
      description: vendor.description || "",
      logo: vendor.logo || "",
      city: vendor.city || "",
      state: vendor.state || "",
      employeeCount: vendor.employeeCount || "",
      yearEstablished: vendor.yearEstablished || "",
      isFeatured: vendor.isFeatured || false,
    });
    setEditingId(vendor.id);
    setShowForm(true);
  };

  const handleDeleteVendor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}"? This will also delete all their products.`)) return;
    try {
      await api.deleteVendor(id);
      setVendors((prev) => prev.filter((v) => v.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to remove partner");
    }
  };

  const handleToggleFeatured = async (id) => {
    setStarAnimating(id);
    try {
      await api.toggleVendorFeatured(id);
      setTimeout(() => {
        setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, isFeatured: !v.isFeatured } : v)));
        setStarAnimating(null);
      }, 300);
      setError(null);
    } catch (err) {
      setStarAnimating(null);
      setError(err.message || "Operation failed");
    }
  };

  const thStyle = {
    padding: "14px 20px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 600,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    borderBottom: "1px solid #E2E8F0",
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
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "28px",
              fontWeight: 600,
              color: "#0A1628",
              margin: 0,
              marginBottom: "6px",
            }}
          >
            Partner Management
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>
            Manage verified partners and service providers
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); if (showForm) { setForm(EMPTY_FORM); setEditingId(null); } }}
          onMouseEnter={() => setHoveredBtn("add")}
          onMouseLeave={() => setHoveredBtn(null)}
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
            transform: hoveredBtn === "add" ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          <i className={`fas fa-${showForm ? "times" : "plus"}`} style={{ fontSize: "12px" }}></i>
          {showForm ? "Cancel" : "Add Partner"}
        </button>
      </div>

      {/* Create Partner Dialog */}
      {showForm && ReactDOM.createPortal(
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}>
        <div onClick={(e) => e.stopPropagation()} style={{ background: "#FFFFFF", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "720px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#0A1628", margin: 0 }}>{editingId ? "Edit Partner" : "Add New Partner"}</h3>
            <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setEditingId(null); }} style={{ background: "none", border: "none", fontSize: "20px", color: "#94A3B8", cursor: "pointer" }}><i className="fas fa-times"></i></button>
          </div>
          {formError && (
            <div style={{ padding: "10px 16px", marginBottom: "16px", background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA", borderRadius: "8px", fontSize: "13px" }}>
              {formError}
            </div>
          )}
          <form onSubmit={handleCreateVendor}>
            {!editingId && (<>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#0A1628", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Account Credentials</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div><label style={labelStyle}>Email *</label><input style={inputStyle} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
              <div><label style={labelStyle}>Password *</label><input style={inputStyle} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
              <div><label style={labelStyle}>First Name *</label><input style={inputStyle} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required /></div>
              <div><label style={labelStyle}>Last Name *</label><input style={inputStyle} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required /></div>
            </div>
            </>)}

            <p style={{ fontSize: "13px", fontWeight: 600, color: "#0A1628", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Company Details</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div><label style={labelStyle}>Company Name</label><input style={inputStyle} value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></div>
              <div>
                <label style={labelStyle}>Category</label>
                <select style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select Category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enterprise property management systems, POS solutions, and integrated hotel technology platforms..." />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div><label style={labelStyle}>City</label><input style={inputStyle} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Bengaluru" /></div>
              <div><label style={labelStyle}>State</label><input style={inputStyle} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="Karnataka" /></div>
              <div><label style={labelStyle}>Employees</label><input style={inputStyle} value={form.employeeCount} onChange={(e) => setForm({ ...form, employeeCount: e.target.value })} placeholder="120" /></div>
              <div><label style={labelStyle}>Est. Year</label><input style={inputStyle} type="number" value={form.yearEstablished} onChange={(e) => setForm({ ...form, yearEstablished: e.target.value })} placeholder="2015" /></div>
            </div>

            <PhotoUpload value={form.logo} onChange={(val) => setForm({ ...form, logo: val })} label="Company Logo" />

            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "20px" }}>
              <label style={{ ...labelStyle, marginBottom: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                Featured on Homepage
              </label>
              <button
                type="submit"
                disabled={formLoading}
                style={{
                  padding: "12px 32px",
                  fontSize: "14px",
                  fontWeight: 600,
                  background: formLoading ? "#94A3B8" : "#C6A962",
                  color: "#0A1628",
                  border: "none",
                  borderRadius: "8px",
                  cursor: formLoading ? "not-allowed" : "pointer",
                  marginLeft: "auto",
                }}
              >
                {formLoading ? "Saving..." : editingId ? "Save Changes" : "Create Partner"}
              </button>
            </div>
          </form>
        </div>
        </div>,
        document.body
      )}

      {/* Loading Spinner */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "24px", color: "#C6A962" }}></i>
          <p style={{ marginTop: "12px", color: "#64748B", fontSize: "14px" }}>Loading...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: "12px 20px", marginBottom: "16px", background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA", borderRadius: "8px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {!loading && (
        <>
          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredStat(i)}
                onMouseLeave={() => setHoveredStat(null)}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  transition: "all 0.3s ease",
                  transform: hoveredStat === i ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: hoveredStat === i ? `0 8px 24px ${stat.color}20` : "0 1px 3px rgba(0,0,0,0.04)",
                  opacity: mounted ? 1 : 0,
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: `${stat.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i className={stat.icon} style={{ fontSize: "18px", color: stat.color }}></i>
                </div>
                <div>
                  <div style={{ fontSize: "26px", fontWeight: 700, color: "#0A1628", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{stat.label}</div>
                </div>
              </div>
            ))}
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
            <i className="fas fa-search" style={{ fontSize: "14px", color: searchFocused ? "#C6A962" : "#94A3B8", transition: "color 0.3s" }}></i>
            <input
              type="text"
              placeholder="Search partners by name, contact, category, or city..."
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
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "12px", padding: "4px" }}
              >
                <i className="fas fa-times"></i>
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
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  <th style={thStyle}>Company</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Contact Person</th>
                  <th style={thStyle}>City</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Featured</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((vendor, idx) => {
                  const catStyle = categoryChip(vendor.category);
                  const contactName = ((vendor.user?.firstName || '') + ' ' + (vendor.user?.lastName || '')).trim();
                  return (
                    <tr
                      key={vendor.id}
                      onMouseEnter={() => setHoveredRow(vendor.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: "1px solid #F1F5F9",
                        transition: "all 0.25s ease",
                        background: hoveredRow === vendor.id ? "#FAFBFC" : "transparent",
                        borderLeft: hoveredRow === vendor.id ? "3px solid #C6A962" : "3px solid transparent",
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(8px)",
                        transitionDelay: `${0.3 + idx * 0.04}s`,
                      }}
                    >
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "8px",
                              background: `${catStyle.color}12`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <i className="fas fa-building" style={{ fontSize: "14px", color: catStyle.color }}></i>
                          </div>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628" }}>{vendor.companyName}</div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "4px 12px",
                            background: catStyle.bg,
                            color: catStyle.color,
                            borderRadius: "12px",
                          }}
                        >
                          {categoryLabel(vendor.category)}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontSize: "14px", fontWeight: 500, color: "#0A1628" }}>{contactName}</div>
                        <div style={{ fontSize: "12px", color: "#94A3B8" }}>{vendor.user?.email}</div>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: "14px", color: "#475569" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <i className="fas fa-map-marker-alt" style={{ fontSize: "10px", color: "#94A3B8" }}></i>
                          {vendor.city}
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <button
                          onClick={() => handleToggleFeatured(vendor.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            transition: "all 0.3s ease",
                            transform: starAnimating === vendor.id ? "scale(1.3) rotate(72deg)" : "scale(1)",
                          }}
                        >
                          <i
                            className={vendor.isFeatured ? "fas fa-star" : "far fa-star"}
                            style={{
                              fontSize: "18px",
                              color: vendor.isFeatured ? "#C6A962" : "#CBD5E1",
                              transition: "color 0.3s ease",
                            }}
                          ></i>
                        </button>
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => handleEditVendor(vendor)}
                            onMouseEnter={() => setHoveredBtn(`edit-${vendor.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={{
                              padding: "6px 14px",
                              fontSize: "12px",
                              fontWeight: 600,
                              background: hoveredBtn === `edit-${vendor.id}` ? "#0A1628" : "transparent",
                              color: hoveredBtn === `edit-${vendor.id}` ? "#FFFFFF" : "#0A1628",
                              border: "1px solid #E2E8F0",
                              borderRadius: "6px",
                              cursor: "pointer",
                              transition: "all 0.25s ease",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVendor(vendor.id, vendor.companyName)}
                            onMouseEnter={() => setHoveredBtn(`del-${vendor.id}`)}
                            onMouseLeave={() => setHoveredBtn(null)}
                            style={{
                              padding: "6px 14px",
                              fontSize: "12px",
                              fontWeight: 600,
                              background: hoveredBtn === `del-${vendor.id}` ? "#FEF2F2" : "transparent",
                              color: "#EF4444",
                              border: "1px solid #FECACA",
                              borderRadius: "6px",
                              cursor: "pointer",
                              transition: "all 0.25s ease",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div style={{ padding: "64px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="fas fa-building" style={{ fontSize: "24px", color: "#CBD5E1" }}></i>
                </div>
                <p style={{ fontSize: "15px", color: "#64748B", fontWeight: 500, margin: 0 }}>No partners found</p>
                <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes starPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.4) rotate(72deg); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AdminVendors;
