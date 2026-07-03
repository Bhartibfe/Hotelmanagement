import React, { useState, useEffect } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { POST_IMG01, POST_IMG02, POST_IMG03 } from "../../lib/assets";

const POST_IMAGES = [POST_IMG01, POST_IMG02, POST_IMG03];

const MOCK_FEED = [
  { id: 1, author: { firstName: "Rajesh", lastName: "Sharma", memberType: "HOTEL_OWNER", title: "MD, Sharma Hotels Group" }, time: "2 hours ago", type: "HOTEL_UPDATE", content: "Excited to announce the grand opening of our 120-room luxury property in Jaipur. Three years of careful planning and execution. Grateful to our entire team and partners who made this vision a reality.", likes: 148, comments: 32 },
  { id: 2, author: { firstName: "Arun", lastName: "Kumar", memberType: "VENDOR", title: "CEO, TechHotel Solutions" }, time: "5 hours ago", type: "TECHNOLOGY_IMPLEMENTATION", content: "Just launched our AI-powered revenue management system designed specifically for Indian hospitality. Early results: 23% average RevPAR improvement across our client portfolio of 85 hotels.", likes: 267, comments: 45 },
  { id: 3, author: { firstName: "Ankit", lastName: "Patel", memberType: "PROFESSIONAL", title: "VP Operations, Taj Hotels" }, time: "1 day ago", type: "INDUSTRY_INSIGHT", content: "The biggest operational challenge for Indian hotels in 2026 isn't technology adoption — it's finding and retaining skilled talent. We need to rethink our approach to hospitality education and career pathways.", likes: 312, comments: 67 },
  { id: 4, author: { firstName: "Sunita", lastName: "Reddy", memberType: "HOTEL_OWNER", title: "CEO, Heritage Haveli Hotels" }, time: "2 days ago", type: "BUSINESS_ANNOUNCEMENT", content: "Completed the restoration of a 200-year-old haveli in Jodhpur. Converting it into a 24-key heritage hotel. Preserving architecture while adding modern amenities is a delicate balance, but the result is stunning.", likes: 189, comments: 28 },
  { id: 5, author: { firstName: "Deepa", lastName: "Nair", memberType: "VENDOR", title: "Principal, Nair Design Studio" }, time: "3 days ago", type: "HOSPITALITY_INNOVATION", content: "Just completed interior design for a 60-room wellness resort in Kerala. Biophilic design elements throughout — living walls, natural materials, water features. The property opens next month.", likes: 156, comments: 23 },
  { id: 6, author: { firstName: "Vikram", lastName: "Singh", memberType: "CONSULTANT", title: "Managing Partner, Singh Advisory" }, time: "3 days ago", type: "EVENT_UPDATE", content: "Looking forward to speaking at the India Hospitality Investment Summit next month in Mumbai. Will be sharing insights on the emerging tier-2 city hospitality market and opportunities for mid-scale brands.", likes: 98, comments: 15 },
];

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

const FeedPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [likedPosts, setLikedPosts] = useState({});
  const [posts, setPosts] = useState(MOCK_FEED);
  const { user, isApprovedMember } = useAuth();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const params = {};
        if (activeFilter !== "All") params.type = activeFilter;
        const data = await api.getFeed(params);
        if (data?.posts?.length) setPosts(data.posts);
      } catch {
        // fallback to mock
      }
    };
    fetchFeed();
  }, [activeFilter]);

  const filtered = activeFilter === "All" ? posts : posts.filter((p) => p.type === activeFilter);

  const toggleLike = (id) => setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));

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
            <div className="col-lg-8">
              {/* Filters */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "30px" }}>
                {TYPE_FILTERS.map((f) => (
                  <button key={f.key} onClick={() => setActiveFilter(f.key)} style={{ padding: "8px 16px", fontSize: "12px", fontWeight: 600, border: `1px solid ${activeFilter === f.key ? "var(--tg-accent-color)" : "var(--tg-border-color)"}`, background: activeFilter === f.key ? "var(--tg-accent-color)" : "#FFFFFF", color: activeFilter === f.key ? "var(--tg-primary-color)" : "var(--tg-body-font-color)", cursor: "pointer", transition: "all 0.3s", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Posts */}
              {filtered.map((post, i) => {
                const authorName = post.author ? `${post.author.firstName} ${post.author.lastName}` : "Unknown";
                const authorType = post.author?.memberType || "OTHER";
                const authorTitle = post.author?.title || "";
                const color = TYPE_COLORS[authorType] || "#8B8178";

                return (
                  <div key={post.id} data-aos="fade-up" data-aos-delay={i * 80} style={{ background: "#FFFFFF", padding: "28px", marginBottom: "20px", border: "1px solid var(--tg-border-color)", transition: "all 0.3s ease" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 700, fontSize: "18px", fontFamily: "var(--tg-heading-font-family)" }}>
                        {authorName.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h6 style={{ fontSize: "15px", fontWeight: 600, color: "var(--tg-primary-color)", margin: 0 }}>{authorName}</h6>
                        <span style={{ fontSize: "12px", color: "var(--tg-gray-three)" }}>{authorTitle} · {post.time || "recently"}</span>
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", padding: "4px 10px", background: "#F7F5F0", color: "var(--tg-accent-dark)" }}>{TYPE_DISPLAY[post.type] || post.type}</span>
                    </div>
                    <p style={{ fontSize: "15px", lineHeight: 1.8, color: "var(--tg-body-font-color)", marginBottom: "16px" }}>{post.content}</p>
                    {/* Post image — cycle through available images */}
                    {(post.mediaUrls?.length > 0 || i < 3) && (
                      <div style={{ marginBottom: "16px", borderRadius: "4px", overflow: "hidden" }}>
                        <img
                          src={post.mediaUrls?.[0] || POST_IMAGES[i % POST_IMAGES.length]}
                          alt=""
                          style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
                        />
                      </div>
                    )}
                    <div style={{ display: "flex", gap: "24px", borderTop: "1px solid var(--tg-border-color)", paddingTop: "12px" }}>
                      <button onClick={() => toggleLike(post.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: likedPosts[post.id] ? "var(--tg-accent-color)" : "var(--tg-gray-three)", fontWeight: likedPosts[post.id] ? 600 : 400, transition: "all 0.3s", padding: 0 }}>
                        <i className={likedPosts[post.id] ? "fas fa-thumbs-up" : "far fa-thumbs-up"} style={{ marginRight: "6px" }}></i>
                        {(post.likes || 0) + (likedPosts[post.id] ? 1 : 0)}
                      </button>
                      <span style={{ fontSize: "13px", color: "var(--tg-gray-three)" }}><i className="far fa-comment" style={{ marginRight: "6px" }}></i>{post.comments || 0}</span>
                      <span style={{ fontSize: "13px", color: "var(--tg-gray-three)", cursor: "pointer" }}><i className="far fa-share-square" style={{ marginRight: "6px" }}></i>Share</span>
                      <span style={{ fontSize: "13px", color: "var(--tg-gray-three)", cursor: "pointer" }}><i className="far fa-bookmark" style={{ marginRight: "6px" }}></i>Save</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div style={{ background: "#FFFFFF", padding: "24px", border: "1px solid var(--tg-border-color)", marginBottom: "24px" }}>
                <h5 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "20px", fontWeight: 600, color: "var(--tg-primary-color)", marginBottom: "16px" }}>Trending Topics</h5>
                {["Hospitality Technology 2026", "Revenue Management AI", "Heritage Hotel Conversions", "Hospitality Talent Crisis", "Sustainable Tourism"].map((topic, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: i < 4 ? "1px solid var(--tg-border-color)" : "none" }}>
                    <span style={{ fontSize: "14px", color: "var(--tg-primary-color)", fontWeight: 500 }}>#{topic.replace(/ /g, "")}</span>
                    <p style={{ fontSize: "12px", color: "var(--tg-gray-three)", margin: "2px 0 0" }}>{topic}</p>
                  </div>
                ))}
              </div>
              {!user && (
                <div style={{ background: "var(--tg-primary-color)", padding: "28px", textAlign: "center" }}>
                  <h5 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "20px", fontWeight: 600, color: "#C6A962", marginBottom: "12px" }}>Join the Conversation</h5>
                  <p style={{ color: "#8DA4BE", fontSize: "13px", marginBottom: "20px" }}>Apply for membership to post updates, comment, and connect with industry leaders.</p>
                  <Link to="/register" className="btn" style={{ background: "#C6A962", color: "#0A1628", border: "2px solid #C6A962", padding: "12px 24px", fontSize: "12px", letterSpacing: "1.5px" }}>Apply for Membership</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FeedPage;
