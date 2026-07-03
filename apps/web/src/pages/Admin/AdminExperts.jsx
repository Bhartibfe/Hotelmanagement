import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

const EXPERTISE_COLORS = [
  { bg: "#EFF6FF", color: "#3B82F6" },
  { bg: "#F5F3FF", color: "#8B5CF6" },
  { bg: "#ECFDF5", color: "#10B981" },
  { bg: "#FEF9E7", color: "#C6A962" },
  { bg: "#FFF7ED", color: "#F59E0B" },
  { bg: "#FCE7F3", color: "#EC4899" },
];

const AdminExperts = () => {
  const [experts, setExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [starAnimating, setStarAnimating] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchExperts = async () => {
      try {
        const data = await api.getAdminExperts();
        if (data?.experts) {
          setExperts(data.experts);
        }
      } catch (err) {
        // keep empty array on failure
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const filtered = experts.filter(
    (e) => {
      const fullName = ((e.user?.firstName || '') + ' ' + (e.user?.lastName || '')).trim();
      return (
        !searchTerm ||
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.user?.organizationName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.user?.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.expertise || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  );

  const handleToggleFeatured = async (id) => {
    setStarAnimating(id);
    try {
      await api.toggleExpertFeatured(id);
    } catch (err) {
      // fallback
    }
    setTimeout(() => {
      setExperts((prev) => prev.map((e) => (e.id === id ? { ...e, isFeatured: !e.isFeatured } : e)));
      setStarAnimating(null);
    }, 300);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this expert?")) return;
    try {
      await api.deleteExpert(id);
    } catch (err) {
      // fallback
    }
    setExperts((prev) => prev.filter((e) => e.id !== id));
  };

  const getInitials = (first, last) => {
    return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase() || '?';
  };

  const getExpertiseColor = (index) => {
    return EXPERTISE_COLORS[index % EXPERTISE_COLORS.length];
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
            Industry Experts
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>
            Manage industry experts and thought leaders
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
          Add Expert
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
          {/* Search Bar */}
          <div
            style={{
              background: "#FFFFFF",
              border: searchFocused ? "1px solid #C6A962" : "1px solid #E2E8F0",
              borderRadius: "8px",
              padding: "4px 16px",
              marginBottom: "28px",
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
              placeholder="Search experts by name, company, or expertise..."
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

          {/* Grid of Expert Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {filtered.map((expert, idx) => {
              const fullName = ((expert.user?.firstName || '') + ' ' + (expert.user?.lastName || '')).trim();
              return (
                <div
                  key={expert.id}
                  onMouseEnter={() => setHoveredCard(expert.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "24px",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: hoveredCard === expert.id ? "translateY(-4px)" : mounted ? "translateY(0)" : "translateY(12px)",
                    boxShadow: hoveredCard === expert.id ? "0 12px 32px rgba(10, 22, 40, 0.12)" : "0 1px 3px rgba(0, 0, 0, 0.04)",
                    opacity: mounted ? 1 : 0,
                    transitionDelay: `${idx * 0.06}s`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Featured Star */}
                  <button
                    onClick={() => handleToggleFeatured(expert.id)}
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                      transition: "all 0.3s ease",
                      transform: starAnimating === expert.id ? "scale(1.3) rotate(72deg)" : "scale(1)",
                      zIndex: 2,
                    }}
                  >
                    <i
                      className={expert.isFeatured ? "fas fa-star" : "far fa-star"}
                      style={{
                        fontSize: "18px",
                        color: expert.isFeatured ? "#C6A962" : "#CBD5E1",
                        transition: "color 0.3s ease",
                      }}
                    ></i>
                  </button>

                  {/* Avatar */}
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #0A1628, #1E293B)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#C6A962",
                        fontWeight: 700,
                        fontSize: "16px",
                        flexShrink: 0,
                        letterSpacing: "0.5px",
                        border: expert.isFeatured ? "2px solid #C6A962" : "2px solid transparent",
                        transition: "border-color 0.3s",
                      }}
                    >
                      {getInitials(expert.user?.firstName, expert.user?.lastName)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "16px", fontWeight: 600, color: "#0A1628", lineHeight: 1.3, fontFamily: "'Cormorant Garamond', serif" }}>
                        {fullName}
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748B", marginTop: "2px" }}>{expert.user?.title}</div>
                    </div>
                  </div>

                  {/* Company & City */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
                      <i className="fas fa-building" style={{ fontSize: "11px", color: "#94A3B8", width: "14px" }}></i>
                      {expert.user?.organizationName}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569" }}>
                      <i className="fas fa-map-marker-alt" style={{ fontSize: "11px", color: "#94A3B8", width: "14px" }}></i>
                      {expert.user?.city}
                    </div>
                  </div>

                  {/* Expertise Tags */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
                    {(expert.expertise || []).map((tag, tagIdx) => {
                      const tagColor = getExpertiseColor(tagIdx);
                      return (
                        <span
                          key={tag}
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "4px 10px",
                            background: tagColor.bg,
                            color: tagColor.color,
                            borderRadius: "12px",
                          }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div style={{ height: "1px", background: "#F1F5F9", marginBottom: "16px" }}></div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onMouseEnter={() => setHoveredBtn(`edit-${expert.id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      style={{
                        flex: 1,
                        padding: "8px 14px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background: hoveredBtn === `edit-${expert.id}` ? "#0A1628" : "transparent",
                        color: hoveredBtn === `edit-${expert.id}` ? "#FFFFFF" : "#0A1628",
                        border: "1px solid #E2E8F0",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <i className="fas fa-pen" style={{ fontSize: "10px" }}></i>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expert.id)}
                      onMouseEnter={() => setHoveredBtn(`del-${expert.id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      style={{
                        flex: 1,
                        padding: "8px 14px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background: hoveredBtn === `del-${expert.id}` ? "#FEF2F2" : "transparent",
                        color: "#EF4444",
                        border: "1px solid #FECACA",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
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
            <div
              style={{
                padding: "64px 20px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
              }}
            >
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-user-tie" style={{ fontSize: "24px", color: "#CBD5E1" }}></i>
              </div>
              <p style={{ fontSize: "15px", color: "#64748B", fontWeight: 500, margin: 0 }}>No experts found</p>
              <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>Try adjusting your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminExperts;
