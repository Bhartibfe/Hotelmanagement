import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

const TYPE_COLORS = {
  ANNOUNCEMENT: { bg: "#FEF9E7", color: "#C6A962" },
  ARTICLE: { bg: "#EFF6FF", color: "#3B82F6" },
  DISCUSSION: { bg: "#F5F3FF", color: "#8B5CF6" },
  SHOWCASE: { bg: "#ECFDF5", color: "#10B981" },
};

const AdminFeed = () => {
  const [posts, setPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [mounted, setMounted] = useState(false);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchPosts = async () => {
      try {
        const data = await api.getAdminFeed();
        if (data?.posts) {
          setPosts(data.posts);
        }
      } catch (err) {
        // keep empty array on failure
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filters = [
    { key: "ALL", label: "All" },
    { key: "active", label: "Active" },
    { key: "hidden", label: "Hidden" },
    { key: "pinned", label: "Pinned" },
  ];

  const getPostStatus = (p) => p.isHidden ? "hidden" : p.isPinned ? "pinned" : "active";

  const filtered = posts.filter((p) => {
    return activeFilter === "ALL" || getPostStatus(p) === activeFilter;
  });

  const totalPosts = posts.length;
  const flaggedCount = posts.filter((p) => p.isHidden).length;
  const pinnedCount = posts.filter((p) => p.isPinned).length;

  const handleModerate = async (id, action) => {
    let newStatus = "active";
    if (action === "hide") newStatus = "hidden";
    if (action === "pin") newStatus = "pinned";
    if (action === "unpin") newStatus = "active";
    if (action === "restore") newStatus = "active";
    if (action === "delete") {
      if (!window.confirm("Are you sure you want to delete this post permanently?")) return;
      try {
        await api.moderatePost(id, { action: "delete" });
      } catch (err) {
        // fallback
      }
      setPosts((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    try {
      await api.moderatePost(id, { action });
    } catch (err) {
      // fallback
    }
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, isHidden: newStatus === "hidden", isPinned: newStatus === "pinned" } : p)));
  };

  const getInitials = (first, last) => {
    return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase() || '?';
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
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
            Feed Moderation
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>
            Moderate community feed posts and discussions
          </p>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          {[
            { label: "Total Posts", value: totalPosts, color: "#3B82F6" },
            { label: "Hidden", value: flaggedCount, color: "#F59E0B" },
            { label: "Pinned", value: pinnedCount, color: "#8B5CF6" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
              }}
            >
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: stat.color }}></div>
              <span style={{ fontSize: "13px", color: "#64748B" }}>{stat.label}:</span>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#0A1628" }}>{stat.value}</span>
            </div>
          ))}
        </div>
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
          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  padding: "8px 18px",
                  fontSize: "13px",
                  fontWeight: activeFilter === f.key ? 600 : 400,
                  background: activeFilter === f.key ? "#0A1628" : "#FFFFFF",
                  color: activeFilter === f.key ? "#FFFFFF" : "#64748B",
                  border: activeFilter === f.key ? "1px solid #0A1628" : "1px solid #E2E8F0",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (activeFilter !== f.key) {
                    e.currentTarget.style.borderColor = "#C6A962";
                    e.currentTarget.style.color = "#0A1628";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFilter !== f.key) {
                    e.currentTarget.style.borderColor = "#E2E8F0";
                    e.currentTarget.style.color = "#64748B";
                  }
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Feed-style List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map((post, idx) => {
              const typeStyle = TYPE_COLORS[post.type] || { bg: "#F1F5F9", color: "#475569" };
              const isHidden = post.isHidden;
              const isPinned = post.isPinned;
              const isHovered = hoveredPost === post.id;
              const authorFullName = ((post.author?.firstName || '') + ' ' + (post.author?.lastName || '')).trim();
              return (
                <div
                  key={post.id}
                  onMouseEnter={() => setHoveredPost(post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                  style={{
                    background: "#FFFFFF",
                    border: isPinned ? "1px solid #DDD6FE" : "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "20px 24px",
                    transition: "all 0.3s ease",
                    opacity: isHidden ? 0.55 : mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(10px)",
                    transitionDelay: `${idx * 0.04}s`,
                    borderLeft: isHovered
                      ? isPinned
                        ? "3px solid #8B5CF6"
                        : "3px solid #C6A962"
                      : isPinned
                      ? "3px solid #DDD6FE"
                      : "3px solid transparent",
                    boxShadow: isHovered ? "0 4px 16px rgba(10, 22, 40, 0.06)" : "0 1px 3px rgba(0,0,0,0.02)",
                    position: "relative",
                  }}
                >
                  {/* Pinned Badge */}
                  {isPinned && (
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#8B5CF6",
                      }}
                    >
                      <i className="fas fa-thumbtack" style={{ fontSize: "10px" }}></i>
                      Pinned
                    </div>
                  )}

                  {/* Author Row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #0A1628, #1E293B)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#C6A962",
                        fontWeight: 700,
                        fontSize: "14px",
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(post.author?.firstName, post.author?.lastName)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", textDecoration: isHidden ? "line-through" : "none" }}>
                          {authorFullName}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            padding: "3px 8px",
                            background: typeStyle.bg,
                            color: typeStyle.color,
                            borderRadius: "10px",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {post.type}
                        </span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>
                        {post.author?.organizationName} &middot; {getTimeAgo(post.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p
                    style={{
                      fontSize: "14px",
                      color: isHidden ? "#94A3B8" : "#475569",
                      lineHeight: 1.6,
                      margin: "0 0 16px 0",
                      textDecoration: isHidden ? "line-through" : "none",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.content}
                  </p>

                  {/* Engagement Stats & Actions */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748B" }}>
                        <i className="far fa-heart" style={{ fontSize: "13px", color: "#EF4444" }}></i>
                        <span style={{ fontWeight: 500 }}>{post._count?.likes || 0}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748B" }}>
                        <i className="far fa-comment" style={{ fontSize: "13px", color: "#3B82F6" }}></i>
                        <span style={{ fontWeight: 500 }}>{post._count?.comments || 0}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      {/* Pin / Unpin */}
                      {!post.isPinned ? (
                        <button
                          onClick={() => handleModerate(post.id, "pin")}
                          onMouseEnter={() => setHoveredBtn(`pin-${post.id}`)}
                          onMouseLeave={() => setHoveredBtn(null)}
                          style={{
                            padding: "6px 14px",
                            fontSize: "12px",
                            fontWeight: 600,
                            background: hoveredBtn === `pin-${post.id}` ? "#F5F3FF" : "transparent",
                            color: "#8B5CF6",
                            border: "1px solid #DDD6FE",
                            borderRadius: "6px",
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <i className="fas fa-thumbtack" style={{ fontSize: "10px" }}></i>
                          Pin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleModerate(post.id, "unpin")}
                          onMouseEnter={() => setHoveredBtn(`unpin-${post.id}`)}
                          onMouseLeave={() => setHoveredBtn(null)}
                          style={{
                            padding: "6px 14px",
                            fontSize: "12px",
                            fontWeight: 600,
                            background: hoveredBtn === `unpin-${post.id}` ? "#F5F3FF" : "#8B5CF6",
                            color: hoveredBtn === `unpin-${post.id}` ? "#8B5CF6" : "#FFFFFF",
                            border: "1px solid #8B5CF6",
                            borderRadius: "6px",
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <i className="fas fa-thumbtack" style={{ fontSize: "10px" }}></i>
                          Unpin
                        </button>
                      )}

                      {/* Hide / Restore */}
                      {!post.isHidden ? (
                        <button
                          onClick={() => handleModerate(post.id, "hide")}
                          onMouseEnter={() => setHoveredBtn(`hide-${post.id}`)}
                          onMouseLeave={() => setHoveredBtn(null)}
                          style={{
                            padding: "6px 14px",
                            fontSize: "12px",
                            fontWeight: 600,
                            background: hoveredBtn === `hide-${post.id}` ? "#FFFBEB" : "transparent",
                            color: "#F59E0B",
                            border: "1px solid #FDE68A",
                            borderRadius: "6px",
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <i className="fas fa-eye-slash" style={{ fontSize: "10px" }}></i>
                          Hide
                        </button>
                      ) : (
                        <button
                          onClick={() => handleModerate(post.id, "restore")}
                          onMouseEnter={() => setHoveredBtn(`restore-${post.id}`)}
                          onMouseLeave={() => setHoveredBtn(null)}
                          style={{
                            padding: "6px 14px",
                            fontSize: "12px",
                            fontWeight: 600,
                            background: hoveredBtn === `restore-${post.id}` ? "#ECFDF5" : "transparent",
                            color: "#10B981",
                            border: "1px solid #A7F3D0",
                            borderRadius: "6px",
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <i className="fas fa-eye" style={{ fontSize: "10px" }}></i>
                          Restore
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleModerate(post.id, "delete")}
                        onMouseEnter={() => setHoveredBtn(`del-${post.id}`)}
                        onMouseLeave={() => setHoveredBtn(null)}
                        style={{
                          padding: "6px 14px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background: hoveredBtn === `del-${post.id}` ? "#FEF2F2" : "transparent",
                          color: "#EF4444",
                          border: "1px solid #FECACA",
                          borderRadius: "6px",
                          cursor: "pointer",
                          transition: "all 0.25s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <i className="fas fa-trash-alt" style={{ fontSize: "10px" }}></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div style={{ padding: "64px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-rss" style={{ fontSize: "24px", color: "#CBD5E1" }}></i>
              </div>
              <p style={{ fontSize: "15px", color: "#64748B", fontWeight: 500, margin: 0 }}>No posts found</p>
              <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>
                {activeFilter !== "ALL" ? "No posts match this filter." : "Feed posts will appear here."}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminFeed;
