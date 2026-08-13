import React, { useState, useEffect } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import PostDetailModal from "../../components/profile/PostDetailModal";

const TYPE_FILTERS = [
  { key: "All", label: "All" },
  { key: "HOTEL_UPDATE", label: "Hotel Updates" },
  { key: "INDUSTRY_INSIGHT", label: "Industry Insights" },
  { key: "TECHNOLOGY_IMPLEMENTATION", label: "Technology" },
  { key: "BUSINESS_ANNOUNCEMENT", label: "Announcements" },
  { key: "HOSPITALITY_INNOVATION", label: "Innovation" },
  { key: "EVENT_UPDATE", label: "Events" },
];

const TYPE_COLORS = {
  HOTEL_OWNER: "#C6A962",
  VENDOR: "#276749",
  CONSULTANT: "#1A365D",
  PROFESSIONAL: "#553C9A",
  OTHER: "#8B8178",
};

const TYPE_DISPLAY = {
  HOTEL_UPDATE: "Hotel Update",
  INDUSTRY_INSIGHT: "Industry Insight",
  TECHNOLOGY_IMPLEMENTATION: "Technology",
  BUSINESS_ANNOUNCEMENT: "Announcement",
  HOSPITALITY_INNOVATION: "Innovation",
  EVENT_UPDATE: "Event Update",
  GENERAL: "General",
};

const getTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)",
  "linear-gradient(135deg, #1A365D 0%, #2D5F8A 100%)",
  "linear-gradient(135deg, #276749 0%, #3D8B6E 100%)",
  "linear-gradient(135deg, #553C9A 0%, #7C5FC9 100%)",
  "linear-gradient(135deg, #8B7355 0%, #C6A962 100%)",
];

const FeedCard = ({ post, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const authorName = post.author ? `${post.author.firstName} ${post.author.lastName}` : "Unknown";
  const authorType = post.author?.memberType || "OTHER";
  const color = TYPE_COLORS[authorType] || "#8B8178";
  const postTitle = post.title || (post.content ? post.content.replace(/<[^>]*>/g, "").substring(0, 60) : "Untitled");
  const postBrief = post.brief || (post.content ? post.content.replace(/<[^>]*>/g, "").substring(0, 150) : "");

  // Generate YouTube thumbnail if not stored
  const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
  };
  const imageUrl = post.mediaUrls?.[0] || post.thumbnailUrl || getYouTubeThumbnail(post.youtubeUrl);
  const isYouTube = !post.mediaUrls?.[0] && post.youtubeUrl;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-aos="fade-up"
      data-aos-delay={index * 60}
      style={{
        background: "#FFFFFF",
        border: "1px solid var(--tg-border-color, #E2E8F0)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 24px rgba(10, 22, 40, 0.1)" : "0 1px 3px rgba(0,0,0,0.04)",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image Area (16:9) */}
      <div style={{ position: "relative", paddingBottom: "56.25%", overflow: "hidden", background: "#F1F0ED" }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={postTitle}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            background: PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length],
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className="far fa-newspaper" style={{ fontSize: "36px", color: "rgba(255,255,255,0.3)" }}></i>
          </div>
        )}

        {/* YouTube Play Overlay */}
        {isYouTube && imageUrl && (
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "48px", height: "48px", borderRadius: "50%", background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className="fas fa-play" style={{ color: "#FFFFFF", fontSize: "16px", marginLeft: "2px" }}></i>
          </div>
        )}

        {/* Type Badge */}
        <span style={{
          position: "absolute", top: "10px", left: "10px",
          fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
          padding: "4px 10px", background: "rgba(255,255,255,0.92)", color: "#8B7355",
          backdropFilter: "blur(4px)",
        }}>
          {TYPE_DISPLAY[post.type] || post.type}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Title */}
        <h5 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "18px", fontWeight: 600, color: "#0A1628",
          margin: "0 0 8px", lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {postTitle}
        </h5>

        {/* Brief */}
        <p style={{
          fontSize: "13px", color: "#64748B", lineHeight: 1.6,
          margin: "0 0 12px", flex: 1,
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {postBrief}
        </p>

        {/* Author + Engagement */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F1F0ED", paddingTop: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {post.author?.avatar ? (
              <img src={post.author.avatar} alt="" style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%", background: color,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#FFFFFF", fontWeight: 700, fontSize: "11px",
              }}>
                {authorName.charAt(0)}
              </div>
            )}
            <div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#0A1628", display: "block", lineHeight: 1.2 }}>
                {authorName}
              </span>
              <span style={{ fontSize: "11px", color: "#94A3B8" }}>{getTimeAgo(post.createdAt)}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: post.isLiked ? "#EF4444" : "#94A3B8", display: "flex", alignItems: "center", gap: "4px" }}>
              <i className={post.isLiked ? "fas fa-heart" : "far fa-heart"} style={{ fontSize: "11px" }}></i>
              {post._count?.likes || 0}
            </span>
            <span style={{ fontSize: "12px", color: "#94A3B8", display: "flex", alignItems: "center", gap: "4px" }}>
              <i className="far fa-comment" style={{ fontSize: "11px" }}></i>
              {post._count?.comments || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { user, isApprovedMember } = useAuth();

  const fetchFeed = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const params = {};
      if (activeFilter !== "All") params.type = activeFilter;
      const data = await api.getFeed(params);
      if (data?.posts) setPosts(data.posts);
      else setPosts([]);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [activeFilter]);

  const filtered = activeFilter === "All" ? posts : posts.filter((p) => p.type === activeFilter);

  return (
    <Layout breadcrumb="Feed" title="Industry Feed">
      <section style={{ padding: "60px 0 100px", background: "#FFFFFF" }}>
        <div className="container">
          {/* Membership notice for non-approved users */}
          {user && !isApprovedMember && (
            <div style={{ background: "rgba(198,169,98,0.08)", border: "1px solid var(--tg-accent-color)", padding: "16px 24px", marginBottom: "30px", display: "flex", alignItems: "center", gap: "12px" }}>
              <i className="fas fa-info-circle" style={{ color: "var(--tg-accent-color)", fontSize: "18px" }}></i>
              <p style={{ margin: 0, fontSize: "14px", color: "var(--tg-primary-color)" }}>Your membership is pending approval. You can browse the feed but cannot post until approved.</p>
            </div>
          )}

          <div className="row">
            {/* Main Feed */}
            <div className="col-lg-9">
              {/* Filters */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "30px" }}>
                {TYPE_FILTERS.map((f) => (
                  <button key={f.key} onClick={() => setActiveFilter(f.key)} style={{
                    padding: "8px 16px", fontSize: "12px", fontWeight: 600,
                    border: `1px solid ${activeFilter === f.key ? "var(--tg-accent-color, #C6A962)" : "var(--tg-border-color, #E2E8F0)"}`,
                    background: activeFilter === f.key ? "var(--tg-accent-color, #C6A962)" : "#FFFFFF",
                    color: activeFilter === f.key ? "var(--tg-primary-color, #0A1628)" : "var(--tg-body-font-color, #475569)",
                    cursor: "pointer", transition: "all 0.3s", textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Loading */}
              {loading && (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "28px", color: "#C6A962" }}></i>
                  <p style={{ marginTop: "12px", color: "#64748B", fontSize: "14px" }}>Loading feed...</p>
                </div>
              )}

              {/* Grid */}
              {!loading && filtered.length > 0 && (
                <div className="row">
                  {filtered.map((post, i) => (
                    <div key={post.id} className="col-lg-4 col-md-6" style={{ marginBottom: "24px" }}>
                      <FeedCard post={post} index={i} onClick={() => setSelectedPostId(post.id)} />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                  <div style={{
                    width: "72px", height: "72px", borderRadius: "50%", background: "#F8FAFC",
                    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
                  }}>
                    <i className="far fa-newspaper" style={{ fontSize: "28px", color: "#CBD5E1" }}></i>
                  </div>
                  <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#0A1628", marginBottom: "8px" }}>
                    No posts yet
                  </h5>
                  <p style={{ fontSize: "14px", color: "#64748B" }}>
                    {activeFilter !== "All" ? "No posts match this filter. Try a different category." : "Be the first to share an industry insight."}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-lg-3">
              {!user && (
                <div style={{ background: "var(--tg-primary-color, #0A1628)", padding: "28px", textAlign: "center" }}>
                  <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: "#C6A962", marginBottom: "12px" }}>Join the Conversation</h5>
                  <p style={{ color: "#8DA4BE", fontSize: "13px", marginBottom: "20px" }}>Apply for membership to post updates, comment, and connect with industry leaders.</p>
                  <Link to="/register" className="btn" style={{ background: "#C6A962", color: "#0A1628", border: "2px solid #C6A962", padding: "12px 24px", fontSize: "12px", letterSpacing: "1.5px" }}>Apply for Membership</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Post Detail Modal */}
      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          onClose={() => { setSelectedPostId(null); fetchFeed(false); }}
        />
      )}
    </Layout>
  );
};

export default FeedPage;
