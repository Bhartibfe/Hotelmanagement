import React, { useState, useEffect } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";
import api from "../../services/api";

const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const params = { memberType: "HOTEL_OWNER" };
        if (debouncedSearch) params.search = debouncedSearch;
        const data = await api.getUsers(params);
        if (data?.users?.length) setMembers(data.users.filter((u) => u.memberType === "HOTEL_OWNER"));
      } catch {
        // fallback to mock
      }
    };
    fetchMembers();
  }, [debouncedSearch]);

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
              <div className="col-lg-8">
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
            </div>
            <p style={{ fontSize: "14px", color: "var(--tg-gray-three)", marginTop: "12px" }}>
              Showing {filtered.length} hotel owners
            </p>
          </div>

          <div className="row">
            {filtered.map((member, i) => {
              const name = `${member.firstName} ${member.lastName}`;
              return (
                <div key={member.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={i * 50}>
                  <Link to={`/members/${member.id}`} style={{ textDecoration: "none" }}>
                    <div
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid var(--tg-border-color)",
                        padding: "28px",
                        marginBottom: "24px",
                        borderTop: "3px solid #C6A962",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 16px 40px rgba(10,22,40,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                        <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#C6A962", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 700, fontSize: "18px", fontFamily: "var(--tg-heading-font-family)" }}>
                          {member.firstName.charAt(0)}
                        </div>
                        <div>
                          <h5 style={{ fontFamily: "var(--tg-heading-font-family)", fontSize: "20px", fontWeight: 600, color: "var(--tg-primary-color)", margin: 0 }}>
                            {name}
                          </h5>
                          <span style={{ fontSize: "13px", color: "var(--tg-gray-three)" }}>{member.title}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: "14px", color: "var(--tg-body-font-color)", marginBottom: "12px" }}>{member.organizationName}</p>
                      <div style={{ borderTop: "1px solid var(--tg-border-color)", paddingTop: "12px" }}>
                        <span style={{ fontSize: "13px", color: "var(--tg-gray-three)" }}>
                          <i className="flaticon-pin" style={{ marginRight: "4px" }}></i>
                          {member.city}, {member.state}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
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
