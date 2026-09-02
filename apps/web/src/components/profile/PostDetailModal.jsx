import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { useToast } from "../common/Toast";
import { getErrorMessage } from "../../lib/errors";

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
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const PostDetailModal = ({ postId, onClose }) => {
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const { toastError } = useToast();
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await api.getPost(postId);
        setPost(data);
        setLikeCount(data._count?.likes || 0);
        if (data.isLiked) setLiked(true);
      } catch (err) {
        // The modal renders its not-found branch when `post` stays null; this
        // gives that branch the actual reason to show.
        setLoadError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    if (!user) return;
    try {
      if (liked) {
        await api.unlikePost(postId);
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        await api.likePost(postId);
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } catch (err) {
      toastError(err, liked ? "remove your like" : "like this post");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    setSubmittingComment(true);
    try {
      const newComment = await api.addComment(postId, { content: commentText.trim() });
      setPost((prev) => ({
        ...prev,
        comments: [...(prev?.comments || []), newComment],
        _count: { ...prev?._count, comments: (prev?._count?.comments || 0) + 1 },
      }));
      setCommentText("");
    } catch (err) {
      // The draft is deliberately left in the box so nothing typed is lost.
      toastError(err, "post your comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const authorName = post?.author ? `${post.author.firstName} ${post.author.lastName}` : "";
  const authorType = post?.author?.memberType || "OTHER";
  const color = TYPE_COLORS[authorType] || "#8B8178";
  const videoId = post?.youtubeUrl ? extractYouTubeId(post.youtubeUrl) : null;
  const mediaUrl = post?.mediaUrls?.[0];
  const hasMedia = videoId || mediaUrl;

  const modalContent = (
    <div
      onClick={onClose}
      className="post-detail-backdrop"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(10, 22, 40, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        className="post-detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          width: "100%",
          maxWidth: hasMedia ? "560px" : "500px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "18px",
          boxShadow: "0 20px 50px -10px rgba(10, 22, 40, 0.35), 0 0 0 1px rgba(10, 22, 40, 0.06)",
          position: "relative",
          overflow: "hidden",
          animation: "postModalAppear 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: "absolute", top: "12px", right: "12px",
            background: hasMedia && videoId ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            fontSize: "13px",
            color: hasMedia && videoId ? "#FFFFFF" : "#475569",
            cursor: "pointer", zIndex: 20,
            width: "32px", height: "32px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0A1628";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.transform = "scale(1.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = hasMedia && videoId ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.85)";
            e.currentTarget.style.color = hasMedia && videoId ? "#FFFFFF" : "#475569";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <i className="fas fa-times"></i>
        </button>

        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "22px", color: "#C6A962" }}></i>
            <p style={{ marginTop: "10px", fontSize: "12px", color: "#94A3B8" }}>Loading update...</p>
          </div>
        ) : !post ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: "#64748B", fontSize: "13px" }}>
            {getErrorMessage(loadError, "This post is no longer available.")}
          </div>
        ) : (
          <div style={{ overflowY: "auto", flex: 1 }} className="post-detail-scrollable">
            {videoId ? (
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, background: "#000" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={post.title || "Video"}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : mediaUrl ? (
              <div style={{ maxHeight: "230px", overflow: "hidden", background: "#F1F5F9" }}>
                <img
                  src={mediaUrl}
                  alt={post.title || ""}
                  style={{ width: "100%", height: "230px", objectFit: "cover", display: "block" }}
                />
              </div>
            ) : null}

            <div style={{ padding: "20px 22px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {post.author?.avatar ? (
                    <img src={post.author.avatar} alt="" style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid #E2E8F0" }} />
                  ) : (
                    <div style={{
                      width: "34px", height: "34px", borderRadius: "50%", background: `linear-gradient(135deg, ${color}, #0A1628)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#FFFFFF", fontWeight: 700, fontSize: "12px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}>
                      {(authorName.charAt(0) || "U").toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h6 style={{ fontSize: "13.5px", fontWeight: 600, color: "#0A1628", margin: 0, lineHeight: 1.2 }}>{authorName}</h6>
                    <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                      {post.author?.title && `${post.author.title} · `}{getTimeAgo(post.createdAt)}
                    </span>
                  </div>
                </div>
                <span style={{
                  fontSize: "9.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
                  padding: "3px 9px", background: "rgba(198, 169, 98, 0.08)", color: "#B49138",
                  border: "1px solid rgba(198, 169, 98, 0.25)", borderRadius: "20px",
                }}>
                  {TYPE_DISPLAY[post.type] || post.type}
                </span>
              </div>

              {post.title && (
                <h4 style={{
                  fontSize: "17px", fontWeight: 700,
                  color: "#0A1628", margin: "0 0 8px", lineHeight: 1.35,
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                }}>
                  {post.title}
                </h4>
              )}

              {post.brief && (
                <div style={{
                  fontSize: "12.5px", color: "#475569", lineHeight: 1.5,
                  margin: "0 0 12px", background: "#F8FAFC",
                  padding: "8px 12px", borderLeft: "3px solid #C6A962",
                  borderRadius: "0 6px 6px 0",
                }}>
                  {post.brief}
                </div>
              )}

              <div
                className="post-modal-body-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{ fontSize: "13px", lineHeight: 1.6, color: "#334155", marginBottom: "16px" }}
              />

              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 0", borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9",
                marginBottom: "16px",
              }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <button
                    onClick={handleLike}
                    style={{
                      background: liked ? "rgba(239, 68, 68, 0.08)" : "transparent",
                      border: "none", borderRadius: "16px", cursor: user ? "pointer" : "default",
                      fontSize: "12px", color: liked ? "#EF4444" : "#64748B", fontWeight: 600,
                      padding: "4px 10px", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "5px",
                    }}
                  >
                    <i className={liked ? "fas fa-heart" : "far fa-heart"} style={{ fontSize: "13px" }}></i>
                    <span>{likeCount}</span>
                  </button>
                  <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 500, display: "flex", alignItems: "center", gap: "5px" }}>
                    <i className="far fa-comment" style={{ fontSize: "13px" }}></i>
                    <span>{post._count?.comments || 0}</span>
                  </span>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                    Comments ({post._count?.comments || 0})
                  </span>
                </div>

                {post.comments?.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
                    {post.comments.map((c) => (
                      <div key={c.id} style={{
                        display: "flex", gap: "8px", padding: "9px 12px",
                        background: "#F8FAFC", borderRadius: "10px", border: "1px solid #F1F5F9",
                      }}>
                        <div style={{
                          width: "26px", height: "26px", borderRadius: "50%", background: "#0A1628",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#C6A962", fontWeight: 700, fontSize: "10px", flexShrink: 0,
                          marginTop: "2px",
                        }}>
                          {(c.author?.firstName?.[0] || "?").toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                            <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#0A1628" }}>
                              {c.author?.firstName} {c.author?.lastName}
                            </span>
                            <span style={{ fontSize: "10px", color: "#94A3B8" }}>• {getTimeAgo(c.createdAt)}</span>
                          </div>
                          <p style={{ fontSize: "12px", color: "#334155", margin: 0, lineHeight: 1.45 }}>{c.content}</p>

                          {c.replies?.length > 0 && (
                            <div style={{ marginTop: "6px", paddingLeft: "8px", borderLeft: "2px solid #E2E8F0" }}>
                              {c.replies.map((r) => (
                                <div key={r.id} style={{ display: "flex", gap: "6px", marginBottom: "4px", marginTop: "4px" }}>
                                  <div style={{
                                    width: "20px", height: "20px", borderRadius: "50%", background: "#E2E8F0",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#475569", fontWeight: 700, fontSize: "8.5px", flexShrink: 0,
                                  }}>
                                    {(r.author?.firstName?.[0] || "?").toUpperCase()}
                                  </div>
                                  <div>
                                    <span style={{ fontSize: "10.5px", fontWeight: 600, color: "#0A1628" }}>
                                      {r.author?.firstName} {r.author?.lastName}
                                    </span>
                                    <span style={{ fontSize: "9.5px", color: "#94A3B8", marginLeft: "4px" }}>{getTimeAgo(r.createdAt)}</span>
                                    <p style={{ fontSize: "11.5px", color: "#475569", margin: "1px 0 0", lineHeight: 1.4 }}>{r.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "12px", fontStyle: "italic" }}>
                    No comments yet. Share your thoughts!
                  </p>
                )}

                {user ? (
                  <form onSubmit={handleComment} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      style={{
                        flex: 1, padding: "8px 12px", border: "1px solid #E2E8F0",
                        borderRadius: "20px", fontSize: "12px", outline: "none", background: "#F8FAFC",
                        transition: "all 0.2s ease", color: "#0A1628",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#C6A962";
                        e.currentTarget.style.background = "#FFFFFF";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(198, 169, 98, 0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#E2E8F0";
                        e.currentTarget.style.background = "#F8FAFC";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: submittingComment || !commentText.trim() ? "#94A3B8" : "#0A1628",
                        color: "#C6A962", border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "12px", cursor: submittingComment || !commentText.trim() ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease", flexShrink: 0,
                      }}
                    >
                      {submittingComment ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                    </button>
                  </form>
                ) : (
                  <p style={{ fontSize: "11.5px", color: "#94A3B8", margin: 0 }}>
                    Please sign in to join the conversation.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes postModalAppear {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .post-detail-scrollable::-webkit-scrollbar {
          width: 5px;
        }
        .post-detail-scrollable::-webkit-scrollbar-track {
          background: transparent;
        }
        .post-detail-scrollable::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }
        .post-detail-scrollable::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
        .post-modal-body-content p {
          font-size: 13px !important;
          line-height: 1.6 !important;
          margin-bottom: 8px !important;
          color: #334155 !important;
        }
        .post-modal-body-content h1,
        .post-modal-body-content h2,
        .post-modal-body-content h3 {
          font-size: 15px !important;
          font-weight: 700 !important;
          color: #0A1628 !important;
          margin: 10px 0 4px !important;
        }
        .post-modal-body-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 8px !important;
          margin: 8px 0 !important;
        }
        .post-modal-body-content ul,
        .post-modal-body-content ol {
          padding-left: 18px !important;
          margin: 6px 0 !important;
          font-size: 13px !important;
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default PostDetailModal;
