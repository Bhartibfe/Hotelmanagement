import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [starAnimating, setStarAnimating] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchTestimonials = async () => {
      try {
        const data = await api.getAdminTestimonials();
        if (data?.testimonials) {
          setTestimonials(data.testimonials);
        }
      } catch (err) {
        // keep empty array on failure
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const filtered = testimonials.filter(
    (t) =>
      !searchTerm ||
      t.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.authorCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleFeatured = async (id) => {
    setStarAnimating(id);
    try {
      const t = testimonials.find((x) => x.id === id);
      await api.updateTestimonial(id, { featured: !t.isFeatured });
    } catch (err) {
      // fallback
    }
    setTimeout(() => {
      setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, featured: !t.isFeatured } : t)));
      setStarAnimating(null);
    }, 300);
  };

  const handleTogglePublished = async (id) => {
    try {
      const t = testimonials.find((x) => x.id === id);
      await api.updateTestimonial(id, { published: !t.isPublished });
    } catch (err) {
      // fallback
    }
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, published: !t.isPublished } : t)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await api.deleteTestimonial(id);
    } catch (err) {
      // fallback
    }
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const getInitials = (name) => {
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
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
            Testimonials
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>
            Manage member testimonials and reviews
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
          Add Testimonial
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
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{ flex: 1, padding: "10px 0", border: "none", outline: "none", fontSize: "14px", color: "#0A1628", background: "transparent" }}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "12px", padding: "4px" }}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          {/* Masonry-style Cards */}
          <div style={{ columnCount: 3, columnGap: "20px" }}>
            {filtered.map((testimonial, idx) => {
              const isAlternate = idx % 2 === 1;
              const isHovered = hoveredCard === testimonial.id;
              return (
                <div
                  key={testimonial.id}
                  onMouseEnter={() => setHoveredCard(testimonial.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: isAlternate ? "#FFFDF7" : "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "24px",
                    marginBottom: "20px",
                    breakInside: "avoid",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: isHovered ? "translateY(-3px)" : mounted ? "translateY(0)" : "translateY(12px)",
                    boxShadow: isHovered ? "0 8px 24px rgba(10, 22, 40, 0.1)" : "0 1px 3px rgba(0, 0, 0, 0.04)",
                    opacity: mounted ? 1 : 0,
                    transitionDelay: `${idx * 0.06}s`,
                    position: "relative",
                  }}
                >
                  {/* Quote Icon */}
                  <div style={{ marginBottom: "14px" }}>
                    <i
                      className="fas fa-quote-left"
                      style={{
                        fontSize: "24px",
                        color: isAlternate ? "#C6A96230" : "#E2E8F0",
                        transition: "color 0.3s",
                      }}
                    ></i>
                  </div>

                  {/* Content */}
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#475569",
                      lineHeight: 1.7,
                      margin: "0 0 20px 0",
                      display: "-webkit-box",
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {testimonial.content}
                  </p>

                  {/* Divider */}
                  <div style={{ height: "1px", background: isAlternate ? "#E8DFC4" : "#F1F5F9", marginBottom: "16px" }}></div>

                  {/* Author Info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #0A1628, #1E293B)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#C6A962",
                        fontWeight: 700,
                        fontSize: "13px",
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(testimonial.authorName)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", lineHeight: 1.3 }}>{testimonial.authorName}</div>
                      <div style={{ fontSize: "12px", color: "#94A3B8" }}>
                        {testimonial.authorTitle}, {testimonial.authorCompany}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {/* Featured Star */}
                    <button
                      onClick={() => handleToggleFeatured(testimonial.id)}
                      title={testimonial.featured ? "Remove from featured" : "Add to featured"}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        transition: "all 0.3s ease",
                        transform: starAnimating === testimonial.id ? "scale(1.3) rotate(72deg)" : "scale(1)",
                      }}
                    >
                      <i
                        className={testimonial.featured ? "fas fa-star" : "far fa-star"}
                        style={{ fontSize: "16px", color: testimonial.featured ? "#C6A962" : "#CBD5E1", transition: "color 0.3s" }}
                      ></i>
                    </button>

                    {/* Published Toggle */}
                    <button
                      onClick={() => handleTogglePublished(testimonial.id)}
                      title={testimonial.published ? "Unpublish" : "Publish"}
                      style={{
                        width: "40px",
                        height: "22px",
                        borderRadius: "11px",
                        border: "none",
                        background: testimonial.published ? "#C6A962" : "#CBD5E1",
                        cursor: "pointer",
                        position: "relative",
                        transition: "background 0.3s",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: "#FFFFFF",
                          position: "absolute",
                          top: "3px",
                          left: testimonial.published ? "21px" : "3px",
                          transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      ></div>
                    </button>
                    <span style={{ fontSize: "11px", color: testimonial.published ? "#10B981" : "#94A3B8", fontWeight: 500 }}>
                      {testimonial.published ? "Published" : "Draft"}
                    </span>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      onMouseEnter={() => setHoveredBtn(`del-${testimonial.id}`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      title="Delete testimonial"
                      style={{
                        marginLeft: "auto",
                        background: hoveredBtn === `del-${testimonial.id}` ? "#FEF2F2" : "transparent",
                        border: "1px solid transparent",
                        borderColor: hoveredBtn === `del-${testimonial.id}` ? "#FECACA" : "transparent",
                        borderRadius: "6px",
                        cursor: "pointer",
                        padding: "6px 8px",
                        transition: "all 0.25s ease",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <i className="fas fa-trash-alt" style={{ fontSize: "12px", color: "#EF4444" }}></i>
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
                <i className="fas fa-quote-right" style={{ fontSize: "24px", color: "#CBD5E1" }}></i>
              </div>
              <p style={{ fontSize: "15px", color: "#64748B", fontWeight: 500, margin: 0 }}>No testimonials found</p>
              <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>Try adjusting your search criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminTestimonials;
