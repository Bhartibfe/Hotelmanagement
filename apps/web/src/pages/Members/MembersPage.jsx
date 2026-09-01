import React, { useState, useEffect } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAosRefresh } from "../../lib/hooks/useAosRefresh";
import { SkeletonKeyframes } from "../../components/common/Skeleton";

// "" means: let the API apply the order the admin chose in the panel.
const SORT_OPTIONS = [
  { value: "", label: "Featured order" },
  { value: "name_asc", label: "Name A – Z" },
  { value: "name_desc", label: "Name Z – A" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const params = { memberType: "HOTEL_OWNER", limit: "100" };
        if (debouncedSearch) params.search = debouncedSearch;
        if (sort) params.sort = sort;
        const data = await api.getUsers(params);
        setMembers((data?.users || []).filter((u) => u.memberType === "HOTEL_OWNER"));
      } catch {
        // leave the current list in place
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [debouncedSearch, sort]);

  useAosRefresh(!loading);

  const filtered = members.filter((m) => {
    const name = `${m.firstName} ${m.lastName}`;
    const matchSearch = !searchTerm || name.toLowerCase().includes(searchTerm.toLowerCase()) || (m.organizationName || "").toLowerCase().includes(searchTerm.toLowerCase()) || (m.city || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <Layout breadcrumb="Owners" title="Hotel Owners">
      {/* Owner cards are deliberately heavier than the expert cards: a taller
          portrait, an inset gold frame with corner marks, and a serif name.
          Written as classes rather than inline style + hover state so the whole
          grid does not re-render on every mouse move, and so the details stay
          readable on touch, where :hover never fires. */}
      <style>{`
        .owner-card {
          position: relative;
          display: block;
          aspect-ratio: 4 / 5;
          max-height: 420px;
          overflow: hidden;
          text-decoration: none;
          background: linear-gradient(150deg, #0A1628 0%, #16243A 100%);
          box-shadow: 0 10px 30px rgba(10, 22, 40, 0.10);
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .owner-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 26px 60px rgba(10, 22, 40, 0.26);
        }

        .owner-card--loading {
          background: linear-gradient(90deg, #EFEDE9 25%, #F7F6F3 37%, #EFEDE9 63%);
          background-size: 400% 100%;
          animation: homeSkeletonShimmer 1.4s ease infinite;
          box-shadow: none;
        }

        .owner-card__media {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center top;
          transform: scale(1.01);
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .owner-card:hover .owner-card__media { transform: scale(1.07); }

        /* No photo: a gold monogram inside a ring, rather than a flat initial. */
        .owner-card__monogram {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .owner-card__monogram span {
          width: 88px;
          height: 88px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(198, 169, 98, 0.55);
          border-radius: 50%;
          font-family: 'Cormorant Garamond', serif;
          font-size: 34px;
          font-weight: 600;
          letter-spacing: 2px;
          color: #C6A962;
          background: rgba(198, 169, 98, 0.06);
        }


        /* Slow diagonal highlight on hover. */
        .owner-card__sheen {
          position: absolute;
          top: 0;
          left: -60%;
          width: 45%;
          height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.16), transparent);
          transform: skewX(-18deg);
          transition: left 0.9s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        .owner-card:hover .owner-card__sheen { left: 115%; }

        /* The inset hairline is the card's signature — always on, brighter on hover. */
        .owner-card__frame {
          position: absolute;
          inset: 14px;
          border: 1px solid rgba(198, 169, 98, 0.38);
          pointer-events: none;
          transition: inset 0.45s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.45s ease;
        }
        .owner-card:hover .owner-card__frame {
          inset: 10px;
          border-color: rgba(198, 169, 98, 0.8);
        }

        .owner-card__corner {
          position: absolute;
          width: 26px;
          height: 26px;
          pointer-events: none;
          transition: all 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .owner-card__corner--tl {
          top: 14px;
          left: 14px;
          border-top: 2px solid #C6A962;
          border-left: 2px solid #C6A962;
        }
        .owner-card__corner--br {
          bottom: 14px;
          right: 14px;
          border-bottom: 2px solid #C6A962;
          border-right: 2px solid #C6A962;
        }
        .owner-card:hover .owner-card__corner--tl { top: 10px; left: 10px; }
        .owner-card:hover .owner-card__corner--br { bottom: 10px; right: 10px; }

        .owner-card__cta {
          position: absolute;
          top: 22px;
          right: 22px;
          padding: 7px 16px;
          background: #C6A962;
          color: #0A1628;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(-8px);
          transition: opacity 0.35s ease 0.08s, transform 0.35s ease 0.08s;
        }
        .owner-card:hover .owner-card__cta { opacity: 1; transform: translateY(0); }

        /* A fade rather than a plate: no edge, and it only darkens as far up
           as the name needs, so the portrait above it stays clear. */
        .owner-card__body {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 52px 24px 14px;
          background: linear-gradient(
            to top,
            rgba(8, 17, 31, 0.94) 0%,
            rgba(8, 17, 31, 0.82) 38%,
            rgba(8, 17, 31, 0.42) 72%,
            rgba(8, 17, 31, 0) 100%
          );
          transition: padding-bottom 0.45s ease;
        }
        .owner-card:hover .owner-card__body { padding-bottom: 18px; }

        /* Everything under the name is held back until hover. */
        .owner-card__detail {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
        }
        .owner-card:hover .owner-card__detail { max-height: 150px; opacity: 1; }

        /* Touch devices never fire hover, so nothing may hide behind it. */
        @media (hover: none) {
          .owner-card__detail { max-height: 150px; opacity: 1; }
          .owner-card__cta { opacity: 1; transform: translateY(0); }
        }

        .owner-card__name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(19px, 1.6vw, 23px);
          font-weight: 600;
          line-height: 1.2;
          color: #FFFFFF;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .owner-card__rule {
          display: block;
          width: 38px;
          height: 2px;
          margin: 8px 0;
          background: linear-gradient(90deg, #E8D5A3, #C6A962);
          transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .owner-card:hover .owner-card__rule { width: 72px; }

        .owner-card__role {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.82);
          margin: 0 0 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .owner-card__org {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: #C6A962;
          margin: 0 0 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .owner-card__place {
          font-size: 12px;
          color: #9DB3C8;
          margin: 0;
        }
        .owner-card__place i { margin-right: 6px; font-size: 11px; }

        @media (max-width: 991.98px) {
          .owner-card__body { padding: 44px 20px 14px; }
          .owner-card__cta { top: 18px; right: 18px; }
        }
      `}</style>

      <section style={{ padding: "28px 0 72px", background: "#FFFFFF" }}>
        <div className="container">
          <div style={{ marginBottom: "24px" }}>
            <div className="row align-items-center">
              <div className="col-lg-5">
                <span style={{ color: "var(--tg-accent-color)", letterSpacing: "3px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                  Our Network
                </span>
                <h3 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "28px", fontWeight: 600, color: "var(--tg-primary-color)", margin: 0 }}>
                  Hotel Owners
                </h3>
              </div>
              <div className="col-lg-4">
                <input
                  type="text"
                  placeholder="Search by name, hotel, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid var(--tg-border-color)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
              <div className="col-lg-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort hotel owners"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid var(--tg-border-color)",
                    fontSize: "14px",
                    outline: "none",
                    background: "#FFFFFF",
                    cursor: "pointer",
                    color: "var(--tg-primary-color)",
                  }}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      Sort: {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "var(--tg-gray-three)", margin: "10px 0 0" }}>
              {loading ? "Loading hotel owners..." : `Showing ${filtered.length} hotel owners`}
            </p>
          </div>

          {loading && (
            <>
              <SkeletonKeyframes />
              <div className="row">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="col-lg-4 col-md-6" style={{ marginBottom: "24px" }}>
                    {/* Same class as the real card, so the portrait ratio is
                        identical and the grid does not resize when data lands. */}
                    <div className="owner-card owner-card--loading" />
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="row">
            {!loading && filtered.map((member, i) => {
              const name = `${member.firstName || ""} ${member.lastName || ""}`.trim();
              const location = [member.city, member.state].filter(Boolean).join(", ");
              const initials = [member.firstName, member.lastName]
                .filter(Boolean)
                .map((part) => part.charAt(0).toUpperCase())
                .join("") || "?";
              return (
                <div key={member.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={i * 50} style={{ marginBottom: "24px" }}>
                  <Link to={`/members/${member.id}`} className="owner-card">
                    {member.avatar ? (
                      <div
                        className="owner-card__media"
                        style={{ backgroundImage: `url(${member.avatar})` }}
                        role="img"
                        aria-label={name}
                      />
                    ) : (
                      <div className="owner-card__monogram">
                        <span>{initials}</span>
                      </div>
                    )}

                    <div className="owner-card__sheen" />
                    <div className="owner-card__frame" />
                    <span className="owner-card__corner owner-card__corner--tl" />
                    <span className="owner-card__corner owner-card__corner--br" />

                    <span className="owner-card__cta">View Profile</span>

                    <div className="owner-card__body">
                      <h3 className="owner-card__name">{name}</h3>
                      <div className="owner-card__detail">
                        <span className="owner-card__rule" />
                        {member.title && <p className="owner-card__role">{member.title}</p>}
                        {member.organizationName && (
                          <p className="owner-card__org">{member.organizationName}</p>
                        )}
                        {location && (
                          <p className="owner-card__place">
                            <i className="flaticon-pin" aria-hidden="true" />
                            {location}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {!loading && filtered.length === 0 && (
            <div className="text-center" style={{ padding: "60px 0" }}>
              <p style={{ fontSize: "16px", color: "var(--tg-gray-three)" }}>No hotel owners found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MembersPage;
