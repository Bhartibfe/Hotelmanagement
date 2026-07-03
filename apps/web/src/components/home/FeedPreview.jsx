import React, { useState } from "react";
import { Link } from "react-router-dom";

const FEED_POSTS = [
  {
    id: 1,
    author: "Rajesh Sharma",
    role: "Hotel Owner",
    avatar: null,
    time: "2 hours ago",
    type: "Hotel Update",
    content:
      "Excited to announce the grand opening of our 120-room luxury property in Jaipur. Three years of careful planning and execution. Grateful to our entire team and partners.",
    likes: 48,
    comments: 12,
  },
  {
    id: 2,
    author: "Priya Mehta",
    role: "Hospitality Investor",
    avatar: null,
    time: "5 hours ago",
    type: "Investment",
    content:
      "Looking for JV partners for a boutique resort project in Goa. 40-room eco-friendly property with beach access. Interested investors, let's connect.",
    likes: 32,
    comments: 8,
  },
  {
    id: 3,
    author: "TechHotel Solutions",
    role: "Service Provider",
    avatar: null,
    time: "1 day ago",
    type: "Vendor Showcase",
    content:
      "Just launched our AI-powered revenue management system designed specifically for Indian hospitality. 23% average RevPAR improvement across our client portfolio.",
    likes: 67,
    comments: 21,
  },
];

export const FeedPreview = () => {
  const [clickedId, setClickedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});

  const handleClick = (id) => {
    setClickedId(id);
    setTimeout(() => setClickedId(null), 600);
  };

  const handleLike = (e, id) => {
    e.stopPropagation();
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      style={{ padding: "100px 0", background: "#FFFFFF" }}
    >
      <div className="container">
        <div className="row align-items-end mb-50">
          <div className="col-lg-8">
            <span
              style={{
                color: "var(--tg-accent-color)",
                letterSpacing: "3px",
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                display: "block",
                marginBottom: "16px",
              }}
              data-aos="fade-right"
              data-aos-duration="800"
            >
              Industry Feed
            </span>
            <h2
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="200"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontFamily: "var(--tg-heading-font-family)",
                fontWeight: 600,
                color: "var(--tg-primary-color)",
              }}
            >
              What's Happening in Hospitality
            </h2>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link
              to="/feed"
              className="btn btn-two"
              data-aos="fade-left"
              data-aos-duration="800"
              style={{ padding: "14px 28px", fontSize: "12px" }}
            >
              View Full Feed
            </Link>
          </div>
        </div>

        <div className="row">
          {FEED_POSTS.map((post, index) => (
            <div
              key={post.id}
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={index * 200}
            >
              <div
                onClick={() => handleClick(post.id)}
                onMouseEnter={() => setHoveredId(post.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: "#FFFFFF",
                  padding: "28px",
                  marginBottom: "30px",
                  borderTop: `3px solid ${clickedId === post.id ? "var(--tg-primary-color)" : "var(--tg-accent-color)"}`,
                  border: "1px solid #E2DDD5",
                  borderTopWidth: "3px",
                  borderTopColor: clickedId === post.id ? "var(--tg-primary-color)" : "var(--tg-accent-color)",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  cursor: "pointer",
                  transform: clickedId === post.id
                    ? "scale(0.95) translateY(4px)"
                    : hoveredId === post.id
                    ? "translateY(-10px) scale(1.02)"
                    : "translateY(0) scale(1)",
                  boxShadow: clickedId === post.id
                    ? "0 4px 12px rgba(10,22,40,0.12)"
                    : hoveredId === post.id
                    ? "0 20px 50px rgba(10,22,40,0.1)"
                    : "0 2px 6px rgba(10,22,40,0.03)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Shimmer effect on hover */}
                <div
                  style={{
                    position: "absolute",
                    top: "-50%",
                    left: hoveredId === post.id ? "150%" : "-150%",
                    width: "60%",
                    height: "200%",
                    background: "linear-gradient(90deg, transparent, rgba(198,169,98,0.06), transparent)",
                    transform: "skewX(-20deg)",
                    transition: "left 0.8s ease",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "var(--tg-primary-color)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#C6A962",
                      fontWeight: 700,
                      fontSize: "16px",
                      fontFamily: "var(--tg-heading-font-family)",
                      transition: "all 0.3s ease",
                      transform: hoveredId === post.id ? "rotate(360deg)" : "rotate(0deg)",
                    }}
                  >
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h6
                      style={{
                        fontFamily: "var(--tg-body-font-family)",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--tg-primary-color)",
                        margin: 0,
                      }}
                    >
                      {post.author}
                    </h6>
                    <span style={{ fontSize: "12px", color: "var(--tg-gray-three)" }}>
                      {post.role} · {post.time}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    display: "inline-block",
                    background: "#F7F5F0",
                    padding: "3px 10px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--tg-accent-dark)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "12px",
                    transition: "all 0.3s ease",
                    transform: hoveredId === post.id ? "translateX(5px)" : "translateX(0)",
                  }}
                >
                  {post.type}
                </span>

                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "var(--tg-body-font-color)",
                    marginBottom: "16px",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.content}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    borderTop: "1px solid var(--tg-border-color)",
                    paddingTop: "12px",
                    fontSize: "13px",
                    color: "var(--tg-gray-three)",
                  }}
                >
                  <span
                    onClick={(e) => handleLike(e, post.id)}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      color: likedPosts[post.id] ? "#C6A962" : "inherit",
                      transform: likedPosts[post.id] ? "scale(1.15)" : "scale(1)",
                      display: "inline-block",
                    }}
                  >
                    <i
                      className={likedPosts[post.id] ? "fas fa-thumbs-up" : "far fa-thumbs-up"}
                      style={{ marginRight: "6px" }}
                    ></i>
                    {post.likes + (likedPosts[post.id] ? 1 : 0)}
                  </span>
                  <span>
                    <i className="far fa-comment" style={{ marginRight: "6px" }}></i>
                    {post.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
