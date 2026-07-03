import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

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

const CATEGORY_COLORS = {
  TECHNOLOGY: { bg: "#EFF6FF", color: "#3B82F6" },
  ARCHITECTURE: { bg: "#FEF9E7", color: "#C6A962" },
  INTERIOR_DESIGN: { bg: "#F5F3FF", color: "#8B5CF6" },
  HVAC: { bg: "#ECFDF5", color: "#10B981" },
  PROCUREMENT: { bg: "#FFF7ED", color: "#F59E0B" },
  SECURITY: { bg: "#FEF2F2", color: "#EF4444" },
  MARKETING: { bg: "#FCE7F3", color: "#EC4899" },
  RECRUITMENT: { bg: "#F0FDFA", color: "#14B8A6" },
  CONSULTING: { bg: "#EFF6FF", color: "#3B82F6" },
  LEGAL: { bg: "#F8FAFC", color: "#64748B" },
  FINANCE: { bg: "#ECFDF5", color: "#10B981" },
};

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [starAnimating, setStarAnimating] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const filtered = vendors.filter(
    (v) => {
      const contactName = ((v.user?.firstName || '') + ' ' + (v.user?.lastName || '')).trim();
      return (
        !searchTerm ||
        (v.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (CATEGORY_LABELS[v.category] || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  );

  const stats = [
    { label: "Total Vendors", value: vendors.length, icon: "fas fa-building", color: "#C6A962" },
    { label: "Featured", value: vendors.filter((v) => v.isFeatured).length, icon: "fas fa-star", color: "#F59E0B" },
    { label: "Categories", value: new Set(vendors.map((v) => v.category).filter(Boolean)).size, icon: "fas fa-th-large", color: "#10B981" },
    { label: "Cities", value: new Set(vendors.map((v) => v.city).filter(Boolean)).size, icon: "fas fa-map-marker-alt", color: "#8B5CF6" },
  ];

  const handleToggleFeatured = async (id) => {
    setStarAnimating(id);
    try {
      await api.toggleVendorFeatured(id);
    } catch (err) {
      // fallback
    }
    setTimeout(() => {
      setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, isFeatured: !v.isFeatured } : v)));
      setStarAnimating(null);
    }, 300);
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
            Vendor Management
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>
            Manage verified vendors and service providers
          </p>
        </div>
        <button
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
          <i className="fas fa-plus" style={{ fontSize: "12px" }}></i>
          Add Vendor
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "24px", color: "#C6A962" }}></i>
          <p style={{ marginTop: "12px", color: "#64748B", fontSize: "14px" }}>Loading...</p>
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
              placeholder="Search vendors by name, contact, category, or city..."
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
                  const catStyle = CATEGORY_COLORS[vendor.category] || { bg: "#F1F5F9", color: "#475569" };
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
                          {CATEGORY_LABELS[vendor.category] || vendor.category}
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
                <p style={{ fontSize: "15px", color: "#64748B", fontWeight: 500, margin: 0 }}>No vendors found</p>
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
