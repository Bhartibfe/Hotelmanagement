import React, { useState, useEffect } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAosRefresh } from "../../lib/hooks/useAosRefresh";
import { SkeletonCards, SkeletonKeyframes } from "../../components/common/Skeleton";

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
      <section style={{ padding: "60px 0 100px", background: "#FFFFFF" }}>
        <div className="container">
          <div style={{ marginBottom: "40px" }}>
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
            <p style={{ fontSize: "14px", color: "var(--tg-gray-three)", marginTop: "12px" }}>
              {loading ? "Loading hotel owners..." : `Showing ${filtered.length} hotel owners`}
            </p>
          </div>

          {loading && (
            <>
              <SkeletonKeyframes />
              <SkeletonCards count={6} columnClass="col-lg-4 col-md-6" height="212px" />
            </>
          )}

          <div className="row">
            {!loading && filtered.map((member, i) => {
              const name = `${member.firstName || ""} ${member.lastName || ""}`.trim();
              const location = [member.city, member.state].filter(Boolean).join(", ");
              const hasDetails = Boolean(member.organizationName || location);
              return (
                <div key={member.id} className="col-lg-4 col-md-6 d-flex" data-aos="fade-up" data-aos-delay={i * 50} style={{ marginBottom: "24px" }}>
                  <Link to={`/members/${member.id}`} style={{ textDecoration: "none", display: "flex", flex: 1 }}>
                    <div
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid var(--tg-border-color)",
                        borderTop: "3px solid #C6A962",
                        padding: "24px",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 16px 40px rgba(10,22,40,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={name}
                            style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(198,169,98,0.35)" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%",
                              background: "#C6A962",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#FFFFFF",
                              fontWeight: 700,
                              fontSize: "22px",
                              fontFamily: "var(--tg-heading-font-family)",
                              flexShrink: 0,
                            }}
                          >
                            {(member.firstName || name || "?").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <h5 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "19px", fontWeight: 600, color: "var(--tg-primary-color)", margin: 0, lineHeight: 1.3 }}>
                            {name}
                          </h5>
                          {member.title && (
                            <span style={{ fontSize: "13px", color: "var(--tg-gray-three)" }}>{member.title}</span>
                          )}
                        </div>
                      </div>

                      {/* Details render only when the owner has them filled in */}
                      {hasDetails && (
                        <div style={{ borderTop: "1px solid var(--tg-border-color)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "6px", marginTop: "auto" }}>
                          {member.organizationName && (
                            <span style={{ fontSize: "14px", color: "var(--tg-body-font-color)" }}>
                              <i className="far fa-building" style={{ marginRight: "6px", color: "#C6A962", fontSize: "12px" }}></i>
                              {member.organizationName}
                            </span>
                          )}
                          {location && (
                            <span style={{ fontSize: "13px", color: "var(--tg-gray-three)" }}>
                              <i className="flaticon-pin" style={{ marginRight: "6px", fontSize: "12px" }}></i>
                              {location}
                            </span>
                          )}
                        </div>
                      )}
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
