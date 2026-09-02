import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import api from "../../services/api";
import CreatePostForm from "../../components/profile/CreatePostForm";
import FormDialog from "../../components/profile/FormDialog";
import { useAdminToast } from "../../components/admin/AdminToast";
import { ErrorNotice } from "../../components/common/ErrorNotice";

const TYPE_COLORS = {
  ANNOUNCEMENT: { bg: "#FEF9E7", color: "#C6A962" },
  ARTICLE: { bg: "#EFF6FF", color: "#3B82F6" },
  DISCUSSION: { bg: "#F5F3FF", color: "#8B5CF6" },
  SHOWCASE: { bg: "#ECFDF5", color: "#10B981" },
  HOTEL_UPDATE: { bg: "#FEF9E7", color: "#C6A962" },
  INDUSTRY_INSIGHT: { bg: "#EFF6FF", color: "#3B82F6" },
  TECHNOLOGY_IMPLEMENTATION: { bg: "#F0FDF4", color: "#10B981" },
  BUSINESS_ANNOUNCEMENT: { bg: "#FEF9E7", color: "#F59E0B" },
  HOSPITALITY_INNOVATION: { bg: "#F5F3FF", color: "#8B5CF6" },
  EVENT_UPDATE: { bg: "#FFF7ED", color: "#EA580C" },
  GENERAL: { bg: "#F1F5F9", color: "#475569" },
};

const AdminFeed = () => {
  const [posts, setPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [mounted, setMounted] = useState(false);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const { toastError, toastSuccess } = useAdminToast();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.getAdminFeed();
      setPosts(data?.posts || []);
    } catch (err) {
      setLoadError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchPosts();
  }, [fetchPosts]);

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
    // Names the post in the message; a feed of near-identical rows is exactly
    // where "Operation failed" is least useful.
    const post = posts.find((p) => p.id === id);
    const label = post?.title ? `"${post.title}"` : "this post";

    let newStatus = "active";
    if (action === "hide") newStatus = "hidden";
    if (action === "pin") newStatus = "pinned";
    if (action === "unpin") newStatus = "active";
    if (action === "restore") newStatus = "active";

    if (action === "delete") {
      if (!window.confirm(`Delete ${label} permanently? Its comments and likes go with it. This cannot be undone.`)) return;
      try {
        await api.moderatePost(id, { action: "delete" });
        setPosts((prev) => prev.filter((p) => p.id !== id));
        toastSuccess(`Deleted ${label}.`);
      } catch (err) {
        toastError(err, `delete ${label}`);
      }
      return;
    }

    try {
      await api.moderatePost(id, { action });
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, isHidden: newStatus === "hidden", isPinned: newStatus === "pinned" } : p)));
      toastSuccess(`${action.charAt(0).toUpperCase()}${action.slice(1)}d ${label}.`);
    } catch (err) {
      toastError(err, `${action} ${label}`);
    }
  };

  // Deliberately uncaught: CreatePostForm renders the failure inside the dialog
  // and keeps the draft, so toasting it here would repeat it.
  const handleAdminCreatePost = async (postData) => {
    const newPost = await api.adminCreatePost(postData);
    setPosts((prev) => [newPost, ...prev]);
    setShowCreateForm(false);
    toastSuccess(`Published "${newPost?.title || postData.title}".`);
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 600, color: "#0A1628", margin: 0, marginBottom: "6px" }}>
            Feed Management
          </h1>
          <p style={{ fontSize: "14px", color: "#64748B", margin: 0 }}>
            Create and moderate community feed posts
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
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
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: "10px 24px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              background: showCreateForm ? "#0A1628" : "#C6A962",
              color: showCreateForm ? "#FFFFFF" : "#0A1628",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <i className={showCreateForm ? "fas fa-times" : "fas fa-plus"} style={{ fontSize: "11px" }}></i>
            {showCreateForm ? "Close" : "Create Post"}
          </button>
        </div>
      </div>

      {/* Create Post Dialog */}
      {showCreateForm && (
        <FormDialog title="Create New Post" onClose={() => setShowCreateForm(false)}>
          <CreatePostForm
            isAdmin
            onSubmit={handleAdminCreatePost}
            onCancel={() => setShowCreateForm(false)}
          />
        </FormDialog>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "24px", color: "#C6A962" }}></i>
          <p style={{ marginTop: "12px", color: "#64748B", fontSize: "14px" }}>Loading...</p>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: "16px" }}>
          <ErrorNotice error={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {loadError && (
        <div style={{ marginBottom: "16px", maxWidth: "640px" }}>
          <ErrorNotice error={loadError} title="Feed posts could not be loaded" onRetry={fetchPosts} />
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

          {/* Feed Grid - 4 per row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {filtered.map((post, idx) => {
              const typeStyle = TYPE_COLORS[post.type] || { bg: "#F1F5F9", color: "#475569" };
              const isHidden = post.isHidden;
              const isPinned = post.isPinned;
              const isHovered = hoveredPost === post.id;
              const authorFullName = ((post.author?.firstName || '') + ' ' + (post.author?.lastName || '')).trim();
              const postTitle = post.title || (post.content ? post.content.replace(/<[^>]*>/g, "").substring(0, 60) : "Untitled");
              const postBrief = post.brief || (post.content ? post.content.replace(/<[^>]*>/g, "").substring(0, 100) : "");
              const imageUrl = post.mediaUrls?.[0] || post.thumbnailUrl || (post.youtubeUrl ? (() => { const m = post.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/); return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null; })() : null);

              return (
                <div
                  key={post.id}
                  onMouseEnter={() => setHoveredPost(post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                  style={{
                    background: "#FFFFFF",
                    border: isPinned ? "1px solid #DDD6FE" : "1px solid #E2E8F0",
                    borderRadius: "8px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    opacity: isHidden ? 0.55 : 1,
                    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                    boxShadow: isHovered ? "0 8px 24px rgba(10,22,40,0.1)" : "0 1px 3px rgba(0,0,0,0.04)",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedPost(post)}
                >
                  {/* Image */}
                  <div style={{ position: "relative", paddingBottom: "56.25%", overflow: "hidden", background: "#F1F0ED" }}>
                    {imageUrl ? (
                      <img src={imageUrl} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: `linear-gradient(135deg, #0A1628, #1E293B)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="far fa-newspaper" style={{ fontSize: "28px", color: "rgba(198,169,98,0.3)" }}></i>
                      </div>
                    )}
                    {/* Type badge */}
                    <span style={{ position: "absolute", top: "8px", left: "8px", fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", padding: "3px 8px", background: "rgba(255,255,255,0.92)", color: "#8B7355", borderRadius: "4px" }}>
                      {post.type}
                    </span>
                    {/* Status badges */}
                    {isPinned && <span style={{ position: "absolute", top: "8px", right: "8px", fontSize: "9px", fontWeight: 700, padding: "3px 8px", background: "#8B5CF6", color: "#FFF", borderRadius: "4px" }}><i className="fas fa-thumbtack" style={{ fontSize: "8px", marginRight: "3px" }}></i>Pinned</span>}
                    {isHidden && <span style={{ position: "absolute", top: "8px", right: "8px", fontSize: "9px", fontWeight: 700, padding: "3px 8px", background: "#F59E0B", color: "#FFF", borderRadius: "4px" }}><i className="fas fa-eye-slash" style={{ fontSize: "8px", marginRight: "3px" }}></i>Hidden</span>}

                    {/* Hover overlay with actions */}
                    {isHovered && (
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", padding: "24px 10px 8px", display: "flex", gap: "4px", justifyContent: "center" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {!isPinned ? (
                          <button onClick={() => handleModerate(post.id, "pin")} style={{ padding: "4px 8px", fontSize: "10px", fontWeight: 600, background: "rgba(255,255,255,0.9)", color: "#8B5CF6", border: "none", borderRadius: "4px", cursor: "pointer" }}>Pin</button>
                        ) : (
                          <button onClick={() => handleModerate(post.id, "unpin")} style={{ padding: "4px 8px", fontSize: "10px", fontWeight: 600, background: "#8B5CF6", color: "#FFF", border: "none", borderRadius: "4px", cursor: "pointer" }}>Unpin</button>
                        )}
                        {!isHidden ? (
                          <button onClick={() => handleModerate(post.id, "hide")} style={{ padding: "4px 8px", fontSize: "10px", fontWeight: 600, background: "rgba(255,255,255,0.9)", color: "#F59E0B", border: "none", borderRadius: "4px", cursor: "pointer" }}>Hide</button>
                        ) : (
                          <button onClick={() => handleModerate(post.id, "restore")} style={{ padding: "4px 8px", fontSize: "10px", fontWeight: 600, background: "rgba(255,255,255,0.9)", color: "#10B981", border: "none", borderRadius: "4px", cursor: "pointer" }}>Restore</button>
                        )}
                        <button onClick={() => handleModerate(post.id, "delete")} style={{ padding: "4px 8px", fontSize: "10px", fontWeight: 600, background: "rgba(255,255,255,0.9)", color: "#EF4444", border: "none", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h6 style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628", margin: "0 0 4px", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {postTitle}
                    </h6>
                    <p style={{ fontSize: "12px", color: "#64748B", lineHeight: 1.5, margin: "0 0 10px", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {postBrief}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F1F5F9", paddingTop: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "linear-gradient(135deg, #0A1628, #1E293B)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C6A962", fontWeight: 700, fontSize: "9px" }}>
                          {getInitials(post.author?.firstName, post.author?.lastName)}
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: 500, color: "#475569", maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{authorFullName}</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <span style={{ fontSize: "11px", color: "#94A3B8", display: "flex", alignItems: "center", gap: "3px" }}>
                          <i className="far fa-heart" style={{ fontSize: "10px" }}></i>{post._count?.likes || 0}
                        </span>
                        <span style={{ fontSize: "11px", color: "#94A3B8", display: "flex", alignItems: "center", gap: "3px" }}>
                          <i className="far fa-comment" style={{ fontSize: "10px" }}></i>{post._count?.comments || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {!loadError && filtered.length === 0 && (
            <div style={{ padding: "64px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-rss" style={{ fontSize: "24px", color: "#CBD5E1" }}></i>
              </div>
              <p style={{ fontSize: "15px", color: "#64748B", fontWeight: 500, margin: 0 }}>No posts found</p>
              <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>
                {activeFilter !== "ALL" ? "No posts match this filter." : "Feed posts will appear here. Click 'Create Post' to add one."}
              </p>
            </div>
          )}
        </>
      )}
      {/* Post Detail Dialog */}
      {selectedPost && ReactDOM.createPortal(
        <div
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={() => setSelectedPost(null)}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#FFFFFF", borderRadius: "12px", width: "100%", maxWidth: "700px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            {/* Header */}
            <div style={{ padding: "24px 28px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #0A1628, #1E293B)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C6A962", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>
                  {getInitials(selectedPost.author?.firstName, selectedPost.author?.lastName)}
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#0A1628" }}>
                    {((selectedPost.author?.firstName || '') + ' ' + (selectedPost.author?.lastName || '')).trim()}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94A3B8" }}>
                    {selectedPost.author?.organizationName} &middot; {getTimeAgo(selectedPost.createdAt)}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedPost(null)} style={{ background: "none", border: "none", fontSize: "20px", color: "#94A3B8", cursor: "pointer" }}><i className="fas fa-times"></i></button>
            </div>

            {/* Media */}
            {(selectedPost.mediaUrls?.[0] || selectedPost.thumbnailUrl) && (
              <div style={{ width: "100%", maxHeight: "360px", overflow: "hidden" }}>
                <img
                  src={selectedPost.mediaUrls?.[0] || selectedPost.thumbnailUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", maxHeight: "360px", objectFit: "cover", display: "block" }}
                />
              </div>
            )}

            {/* Content */}
            <div style={{ padding: "24px 28px" }}>
              {selectedPost.title && (
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#0A1628", margin: "0 0 8px", fontFamily: "'Cormorant Garamond', serif" }}>
                  {selectedPost.title}
                </h3>
              )}
              {selectedPost.brief && (
                <p style={{ fontSize: "14px", color: "#64748B", fontStyle: "italic", margin: "0 0 16px", lineHeight: 1.6 }}>
                  {selectedPost.brief}
                </p>
              )}
              <div
                style={{ fontSize: "14px", color: "#475569", lineHeight: 1.7 }}
                dangerouslySetInnerHTML={{ __html: selectedPost.content || "" }}
              />

              {/* YouTube embed */}
              {selectedPost.youtubeUrl && (() => {
                const match = selectedPost.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
                return match ? (
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, marginTop: "16px", borderRadius: "8px", overflow: "hidden" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${match[1]}`}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                      allowFullScreen
                      title="YouTube video"
                    />
                  </div>
                ) : null;
              })()}

              {/* Stats */}
              <div style={{ display: "flex", gap: "24px", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #F1F5F9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#64748B" }}>
                  <i className="far fa-heart" style={{ color: "#EF4444" }}></i>
                  <span style={{ fontWeight: 600 }}>{selectedPost._count?.likes || 0}</span> likes
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#64748B" }}>
                  <i className="far fa-comment" style={{ color: "#3B82F6" }}></i>
                  <span style={{ fontWeight: 600 }}>{selectedPost._count?.comments || 0}</span> comments
                </div>
                <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", background: (TYPE_COLORS[selectedPost.type] || { bg: "#F1F5F9" }).bg, color: (TYPE_COLORS[selectedPost.type] || { color: "#475569" }).color, borderRadius: "10px", textTransform: "uppercase", marginLeft: "auto" }}>
                  {selectedPost.type}
                </span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminFeed;

