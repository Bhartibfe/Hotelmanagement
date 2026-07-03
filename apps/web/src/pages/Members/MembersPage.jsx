import React, { useState, useEffect } from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

const MOCK_MEMBERS = [
  { id: "1", firstName: "Rajesh", lastName: "Sharma", memberType: "HOTEL_OWNER", title: "Managing Director", organizationName: "Sharma Hotels Group", city: "Mumbai", state: "Maharashtra" },
  { id: "2", firstName: "Priya", lastName: "Mehta", memberType: "CONSULTANT", title: "Partner", organizationName: "Meridian Consulting", city: "Delhi", state: "Delhi" },
  { id: "3", firstName: "Arun", lastName: "Kumar", memberType: "VENDOR", title: "CEO", organizationName: "TechHotel Solutions", city: "Bengaluru", state: "Karnataka" },
  { id: "4", firstName: "Ankit", lastName: "Patel", memberType: "PROFESSIONAL", title: "VP Operations", organizationName: "Taj Hotels", city: "Ahmedabad", state: "Gujarat" },
  { id: "5", firstName: "Sunita", lastName: "Reddy", memberType: "HOTEL_OWNER", title: "Founder & CEO", organizationName: "Heritage Haveli Hotels", city: "Jaipur", state: "Rajasthan" },
  { id: "6", firstName: "Vikram", lastName: "Singh", memberType: "VENDOR", title: "Director", organizationName: "HospitalityFund India", city: "Gurgaon", state: "Haryana" },
  { id: "7", firstName: "Deepa", lastName: "Nair", memberType: "VENDOR", title: "Principal Architect", organizationName: "Nair Design Studio", city: "Kochi", state: "Kerala" },
  { id: "8", firstName: "Arjun", lastName: "Kapoor", memberType: "PROFESSIONAL", title: "IT Head", organizationName: "ITC Hotels", city: "Kolkata", state: "West Bengal" },
  { id: "9", firstName: "Meera", lastName: "Joshi", memberType: "HOTEL_OWNER", title: "Director", organizationName: "Joshi Resort Chain", city: "Goa", state: "Goa" },
  { id: "10", firstName: "Rahul", lastName: "Verma", memberType: "VENDOR", title: "Founder", organizationName: "HotelProcure India", city: "Pune", state: "Maharashtra" },
  { id: "11", firstName: "Kavita", lastName: "Iyer", memberType: "PROFESSIONAL", title: "Revenue Manager", organizationName: "Marriott International", city: "Chennai", state: "Tamil Nadu" },
  { id: "12", firstName: "Sanjay", lastName: "Gupta", memberType: "CONSULTANT", title: "Managing Partner", organizationName: "Gupta Advisory", city: "Lucknow", state: "Uttar Pradesh" },
];

const TYPE_LABELS = {
  ALL: "All Members",
  HOTEL_OWNER: "Hotel Owners",
  VENDOR: "Vendors",
  CONSULTANT: "Consultants",
  PROFESSIONAL: "Professionals",
  OTHER: "Other",
};

const TYPE_COLORS = {
  HOTEL_OWNER: "#C6A962",
  VENDOR: "#276749",
  CONSULTANT: "#1A365D",
  PROFESSIONAL: "#553C9A",
  OTHER: "#8B8178",
};

const MembersPage = () => {
  const [activeType, setActiveType] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState(MOCK_MEMBERS);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const params = {};
        if (activeType !== "ALL") params.memberType = activeType;
        if (searchTerm) params.search = searchTerm;
        const data = await api.getUsers(params);
        if (data?.users?.length) setMembers(data.users);
      } catch {
        // fallback to mock
      }
    };
    fetchMembers();
  }, [activeType, searchTerm]);

  const filtered = members.filter((m) => {
    const name = `${m.firstName} ${m.lastName}`;
    const matchType = activeType === "ALL" || m.memberType === activeType;
    const matchSearch = !searchTerm || name.toLowerCase().includes(searchTerm.toLowerCase()) || (m.organizationName || "").toLowerCase().includes(searchTerm.toLowerCase()) || (m.city || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <Layout breadcrumb="Members" title="Members Directory">
      <section style={{ padding: "60px 0 100px", background: "#FFFFFF" }}>
        <div className="container">
          <div style={{ marginBottom: "40px" }}>
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
                  {Object.entries(TYPE_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setActiveType(key)}
                      style={{
                        padding: "10px 20px",
                        fontSize: "13px",
                        fontWeight: 600,
                        border: `1px solid ${activeType === key ? "var(--tg-accent-color)" : "var(--tg-border-color)"}`,
                        background: activeType === key ? "var(--tg-accent-color)" : "transparent",
                        color: activeType === key ? "var(--tg-primary-color)" : "var(--tg-body-font-color)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-lg-4">
                <input
                  type="text"
                  placeholder="Search by name, company, or city..."
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
            <p style={{ fontSize: "14px", color: "var(--tg-gray-three)" }}>
              Showing {filtered.length} members
            </p>
          </div>

          <div className="row">
            {filtered.map((member, i) => {
              const name = `${member.firstName} ${member.lastName}`;
              const color = TYPE_COLORS[member.memberType] || "#8B8178";
              return (
                <div key={member.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={i * 50}>
                  <Link to={`/members/${member.id}`} style={{ textDecoration: "none" }}>
                    <div
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid var(--tg-border-color)",
                        padding: "28px",
                        marginBottom: "24px",
                        borderTop: `3px solid ${color}`,
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 16px 40px rgba(10,22,40,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                        <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 700, fontSize: "18px", fontFamily: "var(--tg-heading-font-family)" }}>
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
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--tg-border-color)", paddingTop: "12px" }}>
                        <span style={{ fontSize: "13px", color: "var(--tg-gray-three)" }}>
                          <i className="flaticon-pin" style={{ marginRight: "4px" }}></i>
                          {member.city}, {member.state}
                        </span>
                        <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", padding: "3px 10px", background: `${color}15`, color }}>
                          {(member.memberType || "MEMBER").replace(/_/g, " ")}
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
              <p style={{ fontSize: "16px", color: "var(--tg-gray-three)" }}>No members found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MembersPage;
