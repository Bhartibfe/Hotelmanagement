import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { Layout } from "../../layouts/Layout";
import CreatePostForm from "../../components/profile/CreatePostForm";
import PostDetailModal from "../../components/profile/PostDetailModal";
import CreateEventForm from "../../components/profile/CreateEventForm";
import FormDialog from "../../components/profile/FormDialog";

const ROLE_LABELS = {
  HOTEL_OWNER: "Hotel Owner",
  VENDOR: "Vendor / Supplier",
  PROFESSIONAL: "Industry Professional",
  CONSULTANT: "Consultant / Advisor",
  OTHER: "Industry Member",
};

const InfoRow = ({ label, value }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join(", ") : value;
  return (
    <div style={{ display: "flex", padding: "10px 0", borderBottom: "1px solid #F1F0ED" }}>
      <span style={{ width: "180px", flexShrink: 0, fontSize: "13px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.3px" }}>
        {label}
      </span>
      <span style={{ fontSize: "14px", color: "#0A1628", lineHeight: "1.5" }}>{display}</span>
    </div>
  );
};

const Section = ({ title, children }) => {
  const hasContent = React.Children.toArray(children).some((c) => c !== null);
  if (!hasContent) return null;
  return (
    <div style={{ marginBottom: "28px" }}>
      <h4
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "20px",
          fontWeight: 600,
          color: "#0A1628",
          marginBottom: "16px",
          paddingBottom: "10px",
          borderBottom: "2px solid #C6A962",
          display: "inline-block",
        }}
      >
        {title}
      </h4>
      <div>{children}</div>
    </div>
  );
};

const MyProfilePage = () => {
  const { user, loading, isApprovedMember } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");
  const [myPosts, setMyPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("intro");

  const isIncomplete = user?.profileStatus === "INCOMPLETE";

  useEffect(() => {
    const fetchProfile = async () => {
      if (isIncomplete) {
        setLoadingProfile(false);
        return;
      }
      try {
        const data = await api.getMyProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user, isIncomplete]);

  useEffect(() => {
    if (activeTab !== "posts" || !user || isIncomplete) return;
    const fetchMyPosts = async () => {
      setLoadingPosts(true);
      try {
        const data = await api.getMyPosts();
        if (data?.posts) setMyPosts(data.posts);
      } catch {
        // silent fail
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchMyPosts();
  }, [user, isIncomplete, activeTab]);

  useEffect(() => {
    if (activeTab !== "events" || !user || isIncomplete) return;
    const fetchMyEvents = async () => {
      setLoadingEvents(true);
      try {
        const data = await api.getMyEvents();
        if (data?.events) setMyEvents(data.events);
      } catch {
        // silent
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchMyEvents();
  }, [user, isIncomplete, activeTab]);

  const handleCreateEvent = async (eventData) => {
    if (editingEvent) {
      const updated = await api.updateUserEvent(editingEvent.id, eventData);
      setMyEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? updated : e)));
    } else {
      const newEvent = await api.createUserEvent(eventData);
      setMyEvents((prev) => [newEvent, ...prev]);
    }
    setShowCreateEvent(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.deleteUserEvent(id);
      setMyEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      // error
    }
  };

  const handleCreatePost = async (postData) => {
    if (editingPost) {
      const updated = await api.updatePost(editingPost.id, postData);
      setMyPosts((prev) => prev.map((p) => (p.id === editingPost.id ? updated : p)));
    } else {
      const newPost = await api.createPost(postData);
      setMyPosts((prev) => [newPost, ...prev]);
    }
    setShowCreatePost(false);
    setEditingPost(null);
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.deletePost(id);
      setMyPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // error
    }
  };

  if (loading || loadingProfile) {
    return (
      <Layout header={1} footer={1}>
        <section style={{ padding: "100px 0", background: "#FFFFFF" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <p style={{ color: "#6B7280", fontSize: "16px" }}>
                  Loading profile...
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Show incomplete profile state with CTA to complete the form
  if (isIncomplete) {
    return (
      <Layout header={1} footer={1} breadcrumb="My Profile" title="My Profile">
        <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div
                  style={{
                    border: "1px solid #E2DDD5",
                    padding: "48px 40px",
                    borderTop: "3px solid #C6A962",
                    textAlign: "center",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "rgba(198, 169, 98, 0.1)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C6A962"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>

                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "28px",
                      fontWeight: 600,
                      color: "#0A1628",
                      marginBottom: "4px",
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </h2>
                  <p
                    style={{
                      color: "#6B7280",
                      fontSize: "14px",
                      marginBottom: "32px",
                    }}
                  >
                    {user.memberType
                      ? user.memberType.replace(/_/g, " ")
                      : "Member"}
                  </p>

                  {/* Pending Profile Banner */}
                  <div
                    style={{
                      background: "#FFFBEB",
                      border: "1px solid #FDE68A",
                      padding: "24px",
                      marginBottom: "24px",
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#D97706"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginBottom: "12px" }}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <h4
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "#0A1628",
                        marginBottom: "8px",
                      }}
                    >
                      Profile Incomplete
                    </h4>
                    <p
                      style={{
                        color: "#6B7280",
                        fontSize: "14px",
                        marginBottom: "20px",
                        lineHeight: "1.6",
                      }}
                    >
                      Your account has been created, but your profile is not yet complete.
                      Please fill in your details so we can review and approve your membership.
                    </p>
                    <Link
                      to="/complete-profile"
                      className="btn"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "14px 28px",
                        fontSize: "13px",
                        letterSpacing: "1.5px",
                      }}
                    >
                      Complete Your Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const memberType = profile?.memberType || user.memberType || "";
  const firstName = profile?.firstName || user.firstName || "";
  const lastName = profile?.lastName || user.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const title = profile?.title || "";
  const org = profile?.organizationName || "";
  const city = profile?.city || "";
  const state = profile?.state || "";
  const location = [city, state].filter(Boolean).join(", ");
  const avatar = profile?.avatar || "";
  const bio = profile?.bio || "";
  const phone = profile?.phone || "";
  const linkedinUrl = profile?.linkedinUrl || "";
  const achievements = profile?.achievements || "";
  const industryContributions = profile?.industryContributions || "";
  const businessOverview = profile?.businessOverview || "";
  const yearsInIndustry = profile?.yearsInIndustry || "";

  const hotels = profile?.hotels || [];
  const vp = profile?.vendorProfile || null;
  const vendorProducts = vp?.products || [];
  const ep = profile?.expertProfile || null;

  const isHotelOwner = memberType === "HOTEL_OWNER";
  const isVendor = memberType === "VENDOR";
  const isExpert = memberType === "PROFESSIONAL" || memberType === "CONSULTANT";

  // Expert-specific data
  const expertOrg = ep?.currentOrganization || org;
  const expertRole = ep?.currentRole || title;
  const expertBio = ep?.bio || bio;
  const yearsOfExperience = ep?.yearsOfExperience || yearsInIndustry;
  const specializations = Array.isArray(ep?.expertise) ? ep.expertise : [];
  const industryInsights = ep?.industryInsights || "";
  const speakingEngagements = Array.isArray(ep?.speakingEngagements) ? ep.speakingEngagements : [];
  const publishedArticles = Array.isArray(ep?.publishedArticles) ? ep.publishedArticles : [];
  const awards = Array.isArray(ep?.awards) ? ep.awards : [];
  const certifications = Array.isArray(ep?.certifications) ? ep.certifications : [];

  const TABS = [
    { key: "intro", label: "Intro", icon: "fas fa-user" },
    { key: "posts", label: "Posts", icon: "far fa-newspaper", count: myPosts.length },
    { key: "events", label: "Events", icon: "far fa-calendar-alt", count: myEvents.length },
  ];

  const TabBar = () => (
    <div style={{ display: "flex", gap: "0", borderBottom: "2px solid #E2DDD5", marginBottom: "30px" }}>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          style={{
            padding: "14px 28px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.5px",
            textTransform: "uppercase", background: "none", border: "none", cursor: "pointer",
            color: activeTab === tab.key ? "#C6A962" : "#64748B",
            borderBottom: activeTab === tab.key ? "2px solid #C6A962" : "2px solid transparent",
            marginBottom: "-2px", transition: "all 0.3s", display: "flex", alignItems: "center", gap: "8px",
          }}
        >
          <i className={tab.icon} style={{ fontSize: "13px" }}></i>
          {tab.label}
          {tab.count !== undefined && (
            <span style={{
              fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px",
              background: activeTab === tab.key ? "rgba(198,169,98,0.15)" : "#F1F5F9",
              color: activeTab === tab.key ? "#C6A962" : "#94A3B8",
            }}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );

  const PostsTabContent = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>{myPosts.length} {myPosts.length === 1 ? "post" : "posts"}</p>
        {isApprovedMember && (
          <button onClick={() => { setEditingPost(null); setShowCreatePost(true); }} style={{
            padding: "10px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
            background: "#C6A962", color: "#0A1628", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
          }}>
            <i className="fas fa-plus" style={{ fontSize: "10px" }}></i> Create Post
          </button>
        )}
      </div>
      {loadingPosts ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}><i className="fas fa-circle-notch fa-spin" style={{ fontSize: "20px", color: "#C6A962" }}></i></div>
      ) : myPosts.length > 0 ? (
        <div className="row">
          {myPosts.map((post) => (
            <div key={post.id} className="col-lg-4 col-md-6" style={{ marginBottom: "20px" }}>
              <div style={{ border: "1px solid #E2DDD5", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                <div onClick={() => setSelectedPostId(post.id)} style={{ height: "160px", background: "#F1F0ED", overflow: "hidden", cursor: "pointer", position: "relative" }}>
                  {(post.mediaUrls?.[0] || post.thumbnailUrl) ? (
                    <img src={post.mediaUrls?.[0] || post.thumbnailUrl} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #0A1628, #1E3A5F)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="far fa-newspaper" style={{ fontSize: "28px", color: "rgba(255,255,255,0.2)" }}></i>
                    </div>
                  )}
                  {post.youtubeUrl && !post.mediaUrls?.[0] && post.thumbnailUrl && (
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="fas fa-play" style={{ color: "#FFF", fontSize: "14px", marginLeft: "2px" }}></i>
                    </div>
                  )}
                </div>
                <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h6 onClick={() => setSelectedPostId(post.id)} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 600, color: "#0A1628", margin: "0 0 6px", cursor: "pointer", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.title || "Untitled"}
                  </h6>
                  <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 12px", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.brief || (post.content ? post.content.replace(/<[^>]*>/g, "").substring(0, 100) : "")}
                  </p>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "#94A3B8" }}>
                      <span><i className="far fa-heart" style={{ marginRight: "3px" }}></i>{post._count?.likes || 0}</span>
                      <span><i className="far fa-comment" style={{ marginRight: "3px" }}></i>{post._count?.comments || 0}</span>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={(e) => { e.stopPropagation(); setEditingPost(post); setShowCreatePost(true); }} style={{ fontSize: "11px", padding: "4px 10px", border: "1px solid #C6A962", background: "none", color: "#C6A962", cursor: "pointer" }}>Edit</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }} style={{ fontSize: "11px", padding: "4px 10px", border: "1px solid #EF4444", background: "none", color: "#EF4444", cursor: "pointer" }}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#F8FAFC", border: "1px solid #E2DDD5" }}>
          <i className="far fa-newspaper" style={{ fontSize: "36px", color: "#CBD5E1", display: "block", marginBottom: "12px" }}></i>
          <p style={{ fontSize: "15px", color: "#6B7280", margin: "0 0 4px" }}>You haven't created any posts yet.</p>
          {isApprovedMember && <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>Click "Create Post" to share an industry update.</p>}
        </div>
      )}
    </div>
  );

  const formatEventDate = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const opts = { day: "numeric", month: "short" };
    if (s.toDateString() === e.toDateString()) return s.toLocaleDateString("en-IN", { ...opts, year: "numeric" });
    return `${s.toLocaleDateString("en-IN", opts)} - ${e.toLocaleDateString("en-IN", { ...opts, year: "numeric" })}`;
  };

  const EventsTabContent = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>{myEvents.length} {myEvents.length === 1 ? "event" : "events"}</p>
        {isApprovedMember && (
          <button onClick={() => { setEditingEvent(null); setShowCreateEvent(true); }} style={{
            padding: "10px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
            background: "#C6A962", color: "#0A1628", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
          }}>
            <i className="fas fa-plus" style={{ fontSize: "10px" }}></i> Create Event
          </button>
        )}
      </div>
      {loadingEvents ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}><i className="fas fa-circle-notch fa-spin" style={{ fontSize: "20px", color: "#C6A962" }}></i></div>
      ) : myEvents.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {myEvents.map((event) => (
            <div key={event.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", border: "1px solid #E2DDD5", borderLeft: "3px solid #C6A962" }}>
              <div style={{ width: "52px", height: "52px", background: "#0A1628", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#C6A962", fontSize: "16px", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>{new Date(event.startDate).getDate()}</span>
                <span style={{ color: "rgba(198,169,98,0.7)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>{new Date(event.startDate).toLocaleDateString("en-IN", { month: "short" })}</span>
              </div>
              <div style={{ flex: 1 }}>
                <Link to={`/events/${event.slug}`} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 600, color: "#0A1628", textDecoration: "none", display: "block", marginBottom: "4px" }}>{event.title}</Link>
                <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#6B7280", flexWrap: "wrap" }}>
                  <span><i className="far fa-calendar" style={{ marginRight: "4px" }}></i>{formatEventDate(event.startDate, event.endDate)}</span>
                  <span><i className="fas fa-map-marker-alt" style={{ marginRight: "4px" }}></i>{event.city}</span>
                  <span><i className="fas fa-users" style={{ marginRight: "4px" }}></i>{event._count?.registrations || 0}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                <button onClick={() => { setEditingEvent(event); setShowCreateEvent(true); }} style={{ fontSize: "11px", padding: "4px 10px", border: "1px solid #C6A962", background: "none", color: "#C6A962", cursor: "pointer" }}>Edit</button>
                <button onClick={() => handleDeleteEvent(event.id)} style={{ fontSize: "11px", padding: "4px 10px", border: "1px solid #EF4444", background: "none", color: "#EF4444", cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#F8FAFC", border: "1px solid #E2DDD5" }}>
          <i className="fas fa-calendar-alt" style={{ fontSize: "36px", color: "#CBD5E1", display: "block", marginBottom: "12px" }}></i>
          <p style={{ fontSize: "15px", color: "#6B7280", margin: "0 0 4px" }}>You haven't created any events yet.</p>
          {isApprovedMember && <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>Click "Create Event" to get started.</p>}
        </div>
      )}
    </div>
  );

  const starIcons = (rating) => {
    const stars = [];
    for (let i = 0; i < (rating || 0); i++) {
      stars.push(<span key={i} style={{ color: "#C6A962", fontSize: "14px" }}>&#9733;</span>);
    }
    return stars;
  };

  // Revision banner (shared across all types)
  const revisionBanner = (user.membershipStatus === "REVISION_REQUESTED" || user.profileStatus === "PENDING_REVIEW" || user.profileStatus === "INCOMPLETE") ? (
    <div className="container">
      <div
        style={{
          margin: "20px 0",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          background: user.membershipStatus === "REVISION_REQUESTED" ? "#FEF2F2" : "#FFFBEB",
          border: `1px solid ${user.membershipStatus === "REVISION_REQUESTED" ? "#FECACA" : "#FDE68A"}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <i className={`fas ${user.membershipStatus === "REVISION_REQUESTED" ? "fa-exclamation-triangle" : "fa-clock"}`} style={{ fontSize: "16px", color: user.membershipStatus === "REVISION_REQUESTED" ? "#DC2626" : "#D97706" }} />
          <div>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#0A1628" }}>
              {user.membershipStatus === "REVISION_REQUESTED" ? "Revision Requested" : user.profileStatus === "INCOMPLETE" ? "Profile Incomplete" : "Profile Under Review"}
            </span>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "2px 0 0" }}>
              {user.membershipStatus === "REVISION_REQUESTED" ? "Admin has requested changes. Please update and resubmit." : user.profileStatus === "INCOMPLETE" ? "Complete your profile to get approved." : "Your profile is being reviewed."}
            </p>
          </div>
        </div>
        <Link to="/complete-profile" style={{ padding: "10px 24px", fontSize: "12px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", background: user.membershipStatus === "REVISION_REQUESTED" ? "#DC2626" : "#C6A962", color: "#FFFFFF", textDecoration: "none", whiteSpace: "nowrap" }}>
          {user.membershipStatus === "REVISION_REQUESTED" ? "Revise Profile" : user.profileStatus === "INCOMPLETE" ? "Complete Profile" : "Update Profile"}
        </Link>
      </div>
    </div>
  ) : null;

  // ─── EXPERT PROFILE LAYOUT (matches /experts/:id design) ───
  if (isExpert) {
    const eCardStyle = { background: "#FFFFFF", border: "1px solid #E2DDD5", borderLeft: "3px solid #C6A962", padding: "32px", marginBottom: "28px", boxShadow: "0 4px 18px rgba(10,22,40,0.02)" };
    const eSidebarStyle = { background: "#FFFFFF", border: "1px solid #E2DDD5", padding: "28px", marginBottom: "24px" };
    const eTagStyle = { display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 16px", background: "#F8FAFC", border: "1px solid #E2DDD5", color: "#0A1628", fontSize: "13px", fontWeight: 600, marginRight: "8px", marginBottom: "8px" };

    return (
      <Layout header={1} footer={1} breadcrumb="My Profile" title="My Profile">
        {/* HERO */}
        <section style={{ position: "relative", background: "#0A1628", overflow: "hidden", color: "#FFFFFF", padding: "70px 0 60px" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0A1628 0%, rgba(10,22,40,0.96) 100%)" }} />
          <div className="container" style={{ position: "relative", zIndex: 2 }}>
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div style={{ display: "flex", gap: "28px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ width: "130px", height: "130px", borderRadius: "50%", background: avatar ? `url(${avatar}) center/cover` : "#C6A962", border: "4px solid rgba(198,169,98,0.4)", boxShadow: "0 8px 30px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 700, fontSize: "48px", fontFamily: "'Cormorant Garamond', serif", flexShrink: 0 }}>
                    {!avatar && (firstName.charAt(0) || "?").toUpperCase()}
                  </div>
                  <div>
                    <span style={{ background: "rgba(198,169,98,0.12)", border: "1px solid rgba(198,169,98,0.3)", color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", padding: "5px 14px", display: "inline-block", marginBottom: "14px" }}>
                      Industry Expert
                    </span>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 4vw, 42px)", fontWeight: 600, color: "#FFFFFF", margin: "0 0 6px", lineHeight: 1.15 }}>{fullName}</h1>
                    {expertRole && <p style={{ color: "#C6A962", fontSize: "18px", fontWeight: 500, margin: "0 0 4px" }}>{expertRole}</p>}
                    <p style={{ color: "#8DA4BE", fontSize: "15px", margin: 0 }}>{[expertOrg, location].filter(Boolean).join(" \u2022 ")}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
                <div style={{ display: "inline-flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                  {yearsOfExperience && (
                    <span style={{ padding: "10px 20px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", border: "1px solid rgba(198,169,98,0.3)", color: "#C6A962", textAlign: "center" }}>
                      {yearsOfExperience}+ Years Experience
                    </span>
                  )}
                  {linkedinUrl && (
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px 24px", background: "transparent", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(198,169,98,0.4)" }}>
                      <i className="fab fa-linkedin-in"></i> LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C6A962, transparent)" }} />

        {revisionBanner}

        {/* MAIN CONTENT */}
        <section style={{ padding: "60px 0 80px", background: "#F9FAFB" }}>
          <div className="container">
            <div className="row g-4 mb-4 align-items-stretch">
              {/* Bio & Specializations */}
              <div className="col-lg-7 d-flex flex-column">
                <div style={{ ...eCardStyle, marginBottom: 0, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>Personal Bio & Experience</span>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 600, color: "#0A1628", marginBottom: "16px" }}>About {firstName || fullName}</h3>
                    <p style={{ fontSize: "16px", lineHeight: 1.85, color: "#4B5563", marginBottom: "24px" }}>{expertBio}</p>
                  </div>
                  {specializations.length > 0 && (
                    <div style={{ borderTop: "1px solid #E2DDD5", paddingTop: "18px" }}>
                      <span style={{ color: "#0A1628", fontSize: "12px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>Practice Areas & Specializations</span>
                      <div>{specializations.map((s, i) => <span key={i} style={eTagStyle}><i className="fas fa-check" style={{ color: "#C6A962", fontSize: "11px" }}></i>{s}</span>)}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* Overview & Contact */}
              <div className="col-lg-5 d-flex flex-column">
                <div style={{ ...eSidebarStyle, marginBottom: 0, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>Overview & Contact</span>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 600, color: "#0A1628", marginBottom: "18px" }}>Professional Details</h4>
                    {[
                      { label: "Organization", value: expertOrg },
                      { label: "Current Role", value: expertRole },
                      { label: "Experience", value: yearsOfExperience ? `${yearsOfExperience} Years` : null },
                      { label: "Location", value: location },
                      { label: "Phone", value: phone },
                      { label: "Email", value: profile?.email },
                    ].filter(r => r.value).map((r, i, a) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < a.length - 1 ? "1px solid #E2DDD5" : "none" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "0.5px" }}>{r.label}</span>
                        <span style={{ fontSize: "14px", color: "#4B5563", textAlign: "right", maxWidth: "60%" }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Speaking, Articles, Awards, Certs */}
            <div className="row g-4 align-items-stretch">
              <div className="col-lg-6 d-flex flex-column gap-4">
                {speakingEngagements.length > 0 && (
                  <div style={{ ...eCardStyle, marginBottom: 0, flex: 1 }}>
                    <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>Engagements</span>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#0A1628", marginBottom: "20px" }}>Speaking Engagements</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {speakingEngagements.map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#0A1628", color: "#C6A962", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className="fas fa-microphone" style={{ fontSize: "14px" }}></i></div>
                          <span style={{ fontSize: "15px", color: "#0A1628", fontWeight: 500 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(awards.length > 0 || certifications.length > 0) && (
                  <div style={{ ...eCardStyle, marginBottom: 0, flex: 1 }}>
                    <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>Achievements</span>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#0A1628", marginBottom: "20px" }}>Awards & Certifications</h4>
                    <div className="row g-4">
                      {awards.length > 0 && (
                        <div className={certifications.length > 0 ? "col-md-6" : "col-12"}>
                          <h6 style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Awards</h6>
                          {awards.map((a, i) => <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}><i className="fas fa-trophy" style={{ color: "#C6A962", marginTop: "4px", fontSize: "14px" }}></i><span style={{ fontSize: "14px", color: "#4B5563" }}>{a}</span></div>)}
                        </div>
                      )}
                      {certifications.length > 0 && (
                        <div className={awards.length > 0 ? "col-md-6" : "col-12"}>
                          <h6 style={{ fontSize: "13px", fontWeight: 700, color: "#0A1628", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Certifications</h6>
                          {certifications.map((c, i) => <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}><i className="fas fa-certificate" style={{ color: "#C6A962", marginTop: "4px", fontSize: "14px" }}></i><span style={{ fontSize: "14px", color: "#4B5563" }}>{c}</span></div>)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="col-lg-6 d-flex flex-column gap-4">
                {publishedArticles.length > 0 && (
                  <div style={{ ...eCardStyle, marginBottom: 0, flex: 1 }}>
                    <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>Publications</span>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#0A1628", marginBottom: "20px" }}>Published Articles</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {publishedArticles.map((article, i) => (
                        <div key={i} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#F8FAFC", border: "1px solid #E2DDD5", color: "#C6A962", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><i className="far fa-newspaper" style={{ fontSize: "14px" }}></i></div>
                          {article.startsWith("http") ? <a href={article} target="_blank" rel="noopener noreferrer" style={{ fontSize: "15px", color: "#C6A962", fontWeight: 600, textDecoration: "underline" }}>{article}</a> : <span style={{ fontSize: "15px", color: "#0A1628", fontWeight: 500 }}>{article}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Thoughts & Vision */}
        {industryInsights && (
          <section style={{ padding: "45px 0", background: "#FAF9F6" }}>
            <div className="container">
              <div style={{ maxWidth: "1140px", margin: "0 auto", background: "#FFFFFF", border: "1px solid #E2DDD5", borderTop: "3px solid #C6A962", padding: "24px 40px", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "14px" }}>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #C6A962)" }} />
                  <span style={{ color: "#C6A962", fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>Thoughts & Vision</span>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #C6A962, transparent)" }} />
                </div>
                <p style={{ fontSize: "18px", lineHeight: 1.85, color: "#374151", fontStyle: "italic", maxWidth: "800px", margin: "0 auto" }}>"{industryInsights}"</p>
              </div>
            </div>
          </section>
        )}

        {/* Tabs Section */}
        <section style={{ padding: "45px 0 60px", background: "#FFFFFF" }}>
          <div className="container">
            <TabBar />
            {activeTab === "intro" && (
              <div style={{ color: "#374151", fontSize: "15px", lineHeight: 1.7 }}>
                {expertBio && <p style={{ whiteSpace: "pre-line" }}>{expertBio}</p>}
                {!expertBio && <p style={{ color: "#94A3B8" }}>No additional intro information.</p>}
              </div>
            )}
            {activeTab === "posts" && <PostsTabContent />}
            {activeTab === "events" && <EventsTabContent />}
          </div>
        </section>

        {/* Dialogs */}
        {showCreatePost && (
          <FormDialog title={editingPost ? "Edit Post" : "Create New Post"} onClose={() => { setShowCreatePost(false); setEditingPost(null); }}>
            <CreatePostForm onSubmit={handleCreatePost} onCancel={() => { setShowCreatePost(false); setEditingPost(null); }} initialData={editingPost} />
          </FormDialog>
        )}
        {showCreateEvent && (
          <FormDialog title={editingEvent ? "Edit Event" : "Create New Event"} onClose={() => { setShowCreateEvent(false); setEditingEvent(null); }}>
            <CreateEventForm onSubmit={handleCreateEvent} onCancel={() => { setShowCreateEvent(false); setEditingEvent(null); }} initialData={editingEvent} />
          </FormDialog>
        )}
        {selectedPostId && <PostDetailModal postId={selectedPostId} onClose={() => setSelectedPostId(null)} />}
      </Layout>
    );
  }

  // ─── NON-EXPERT PROFILE LAYOUT (Hotel Owner / Vendor) ───
  return (
    <Layout header={1} footer={1} breadcrumb="My Profile" title="My Profile">
      {/* Header Banner */}
      <section style={{ padding: "60px 0 40px", background: "#0A1628" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {avatar ? (
              <img src={avatar} alt={fullName} style={{ width: "96px", height: "96px", borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(198,169,98,0.3)", flexShrink: 0 }} />
            ) : (
              <div style={{ width: "96px", height: "96px", borderRadius: "50%", background: "#C6A962", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 700, fontSize: "36px", fontFamily: "'Cormorant Garamond', serif", flexShrink: 0, border: "3px solid rgba(198,169,98,0.3)" }}>
                {(fullName.charAt(0) || "?").toUpperCase()}
              </div>
            )}
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 600, color: "#FFFFFF", margin: "0 0 4px" }}>{fullName}</h1>
              {title && <p style={{ color: "#C6A962", fontSize: "16px", fontWeight: 500, margin: "0 0 4px" }}>{title}</p>}
              <p style={{ color: "#8DA4BE", fontSize: "14px", margin: "0 0 8px" }}>{[org, location].filter(Boolean).join(" \u2022 ")}</p>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 12px", background: "rgba(198,169,98,0.15)", color: "#C6A962", letterSpacing: "0.5px" }}>{ROLE_LABELS[memberType] || memberType?.replace(/_/g, " ")}</span>
                <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 12px", background: user.membershipStatus === "APPROVED" ? "rgba(16,185,129,0.15)" : "rgba(234,179,8,0.15)", color: user.membershipStatus === "APPROVED" ? "#10B981" : "#EAB308" }}>{user.membershipStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {revisionBanner}

      {/* Profile Body */}
      <section style={{ padding: "48px 0 80px", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {error && <div style={{ background: "#FEE2E2", color: "#C53030", padding: "12px 16px", marginBottom: "20px", fontSize: "14px" }}>{error}</div>}

              <TabBar />

              {/* Intro Tab */}
              {activeTab === "intro" && (
                <>
                  {bio && <Section title="About"><p style={{ fontSize: "15px", color: "#374151", lineHeight: "1.7", whiteSpace: "pre-line" }}>{bio}</p></Section>}
                  {businessOverview && <Section title="Business Overview"><p style={{ fontSize: "15px", color: "#374151", lineHeight: "1.7", whiteSpace: "pre-line" }}>{businessOverview}</p></Section>}
                  {isHotelOwner && hotels.length > 0 && (
                    <Section title={`Properties (${hotels.length})`}>
                      {hotels.map((hotel, i) => (
                        <div key={hotel.id || i} style={{ border: "1px solid #E2DDD5", padding: "20px", marginBottom: "12px", borderLeft: "3px solid #C6A962" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, color: "#0A1628", margin: 0 }}>{hotel.name}</h5>
                            {hotel.starRating > 0 && <div>{starIcons(hotel.starRating)}</div>}
                          </div>
                          <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 8px" }}>
                            {[hotel.city, hotel.state].filter(Boolean).join(", ")}{hotel.propertyType && <span> &middot; {hotel.propertyType}</span>}{hotel.rooms && <span> &middot; {hotel.rooms} rooms</span>}
                          </p>
                          {hotel.description && <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6", margin: 0 }}>{hotel.description}</p>}
                        </div>
                      ))}
                    </Section>
                  )}
                  {isVendor && vp && (
                    <Section title="Company Profile">
                      <InfoRow label="Company Name" value={vp.companyName} />
                      <InfoRow label="Category" value={vp.category?.replace(/_/g, " ")} />
                      <InfoRow label="Location" value={[vp.city, vp.state].filter(Boolean).join(", ")} />
                      <InfoRow label="Website" value={vp.website} />
                      <InfoRow label="Phone" value={vp.phone} />
                      <InfoRow label="Employees" value={vp.employeeCount} />
                      <InfoRow label="Services" value={vp.services} />
                    </Section>
                  )}
                  {(achievements || industryContributions) && (
                    <Section title="Achievements & Contributions">
                      {achievements && <><p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", marginBottom: "6px" }}>Achievements</p><p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6", whiteSpace: "pre-line", marginBottom: "12px" }}>{achievements}</p></>}
                      {industryContributions && <><p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", marginBottom: "6px" }}>Industry Contributions</p><p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6", whiteSpace: "pre-line" }}>{industryContributions}</p></>}
                    </Section>
                  )}
                </>
              )}

              {/* Posts Tab */}
              {activeTab === "posts" && <PostsTabContent />}

              {/* Events Tab */}
              {activeTab === "events" && <EventsTabContent />}
            </div>
            <div className="col-lg-4">
              <div style={{ border: "1px solid #E2DDD5", padding: "24px", position: "sticky", top: "100px" }}>
                <h5 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, color: "#0A1628", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #E2DDD5" }}>Contact Info</h5>
                {profile?.email && <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}><i className="fas fa-envelope" style={{ color: "#C6A962", fontSize: "14px", width: "20px" }}></i><span style={{ fontSize: "14px", color: "#374151", wordBreak: "break-all" }}>{profile.email}</span></div>}
                {phone && <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}><i className="fas fa-phone" style={{ color: "#C6A962", fontSize: "14px", width: "20px" }}></i><span style={{ fontSize: "14px", color: "#374151" }}>{phone}</span></div>}
                {location && <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}><i className="fas fa-map-marker-alt" style={{ color: "#C6A962", fontSize: "14px", width: "20px" }}></i><span style={{ fontSize: "14px", color: "#374151" }}>{location}</span></div>}
                {linkedinUrl && <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}><i className="fab fa-linkedin" style={{ color: "#C6A962", fontSize: "14px", width: "20px" }}></i><a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "14px", color: "#C6A962", textDecoration: "none" }}>LinkedIn Profile</a></div>}
                {org && <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}><i className="fas fa-building" style={{ color: "#C6A962", fontSize: "14px", width: "20px" }}></i><span style={{ fontSize: "14px", color: "#374151" }}>{org}</span></div>}
                {yearsInIndustry && <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}><i className="fas fa-briefcase" style={{ color: "#C6A962", fontSize: "14px", width: "20px" }}></i><span style={{ fontSize: "14px", color: "#374151" }}>{yearsInIndustry} years in industry</span></div>}
                {profile?.createdAt && <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #E2DDD5" }}><p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>Member since {new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p></div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dialogs */}
      {showCreatePost && (
        <FormDialog title={editingPost ? "Edit Post" : "Create New Post"} onClose={() => { setShowCreatePost(false); setEditingPost(null); }}>
          <CreatePostForm onSubmit={handleCreatePost} onCancel={() => { setShowCreatePost(false); setEditingPost(null); }} initialData={editingPost} />
        </FormDialog>
      )}
      {showCreateEvent && (
        <FormDialog title={editingEvent ? "Edit Event" : "Create New Event"} onClose={() => { setShowCreateEvent(false); setEditingEvent(null); }}>
          <CreateEventForm onSubmit={handleCreateEvent} onCancel={() => { setShowCreateEvent(false); setEditingEvent(null); }} initialData={editingEvent} />
        </FormDialog>
      )}
      {selectedPostId && <PostDetailModal postId={selectedPostId} onClose={() => setSelectedPostId(null)} />}
    </Layout>
  );
};

export default MyProfilePage;
