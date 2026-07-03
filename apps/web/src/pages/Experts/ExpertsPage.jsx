import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../layouts/Layout";
import { api } from "../../services/api";

const EXPERTISE_OPTIONS = [
  "ALL",
  "Revenue Management",
  "Hotel Operations",
  "Food & Beverage",
  "Hospitality Technology",
  "Hotel Design",
  "Sustainability",
  "Luxury Hospitality",
  "Hotel Marketing",
  "Human Resources",
  "Finance & Investment",
];

const MOCK_EXPERTS = [
  {
    id: 1,
    name: "Dr. Arvind Krishnan",
    title: "Chief Revenue Strategist",
    company: "RevMax Hospitality Advisors",
    expertise: ["Revenue Management", "Hotel Operations", "Finance & Investment"],
    city: "Mumbai",
    bio: "25+ years in hospitality revenue optimization. Former VP Revenue at Oberoi Hotels. Published author on dynamic pricing strategies for Indian hotel markets.",
  },
  {
    id: 2,
    name: "Sunita Chawla",
    title: "Director of Operations",
    company: "The Leela Palaces",
    expertise: ["Hotel Operations", "Luxury Hospitality", "Human Resources"],
    city: "Delhi",
    bio: "Seasoned operations leader with experience managing flagship luxury properties. Known for driving service excellence and operational efficiency across multi-property portfolios.",
  },
  {
    id: 3,
    name: "Chef Rajan Malhotra",
    title: "Executive Culinary Director",
    company: "Epicure Hospitality Group",
    expertise: ["Food & Beverage", "Hotel Operations"],
    city: "Bengaluru",
    bio: "Award-winning chef with experience across Michelin-starred restaurants and luxury hotels. Specialist in modern Indian cuisine and F&B concept development.",
  },
  {
    id: 4,
    name: "Priya Venkatesh",
    title: "Hospitality Tech Advisor",
    company: "HotelTech India",
    expertise: ["Hospitality Technology", "Revenue Management"],
    city: "Hyderabad",
    bio: "Technology evangelist bridging the gap between hospitality and innovation. Expert in PMS implementations, AI-driven guest personalization, and cloud migration for hotels.",
  },
  {
    id: 5,
    name: "Arjun Deshmukh",
    title: "Principal Architect",
    company: "Deshmukh & Associates",
    expertise: ["Hotel Design", "Sustainability"],
    city: "Pune",
    bio: "Award-winning hospitality architect with 50+ hotel projects across India. Pioneer in biophilic hotel design and LEED-certified sustainable hospitality properties.",
  },
  {
    id: 6,
    name: "Meera Iyer",
    title: "Sustainability Consultant",
    company: "Green Hospitality India",
    expertise: ["Sustainability", "Hotel Operations"],
    city: "Chennai",
    bio: "Leading voice in sustainable hospitality practices. Helped 200+ properties reduce carbon footprint by 40%. UN Sustainable Development Goals hospitality advisor.",
  },
  {
    id: 7,
    name: "Vikram Rathore",
    title: "Luxury Brand Strategist",
    company: "Rathore Luxury Consulting",
    expertise: ["Luxury Hospitality", "Hotel Marketing"],
    city: "Jaipur",
    bio: "Former marketing head at Aman Resorts. Specialist in positioning heritage and palace hotels for ultra-luxury international markets and UHNW traveler acquisition.",
  },
  {
    id: 8,
    name: "Deepa Menon",
    title: "Digital Marketing Director",
    company: "HospDigital Agency",
    expertise: ["Hotel Marketing", "Hospitality Technology"],
    city: "Kochi",
    bio: "Digital marketing strategist helping independent hotels compete with chains. Expert in direct booking optimization, SEO, and OTA channel management.",
  },
  {
    id: 9,
    name: "Sanjay Kapoor",
    title: "HR & Training Head",
    company: "Taj Hotels (Retired)",
    expertise: ["Human Resources", "Hotel Operations", "Luxury Hospitality"],
    city: "Mumbai",
    bio: "30-year career in hospitality HR at India's top hotel chains. Expert in talent acquisition, employee retention strategies, and hospitality training programs.",
  },
  {
    id: 10,
    name: "Nandini Sharma",
    title: "Investment Advisor",
    company: "HotelVest Capital",
    expertise: ["Finance & Investment", "Revenue Management"],
    city: "Gurgaon",
    bio: "Former investment banker turned hospitality finance expert. Has structured over INR 2,000 crore in hotel deals across acquisition, development, and refinancing.",
  },
  {
    id: 11,
    name: "Rajesh Pillai",
    title: "F&B Concept Developer",
    company: "Pillar Restaurant Group",
    expertise: ["Food & Beverage", "Hotel Marketing"],
    city: "Goa",
    bio: "Serial restaurateur and F&B consultant who has launched 30+ successful restaurant concepts in hotels. Expert in bar programs, banquet optimization, and pop-up dining.",
  },
  {
    id: 12,
    name: "Anita Bhatia",
    title: "Hotel Technology CTO",
    company: "CloudHotel Solutions",
    expertise: ["Hospitality Technology", "Finance & Investment"],
    city: "Bengaluru",
    bio: "Former CTO at a leading PMS company. Now advises hotel groups on digital transformation, contactless operations, and data-driven revenue strategies.",
  },
];

const ExpertsPage = () => {
  const [experts, setExperts] = useState(MOCK_EXPERTS);
  const [activeExpertise, setActiveExpertise] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      try {
        const data = await api.getExperts();
        if (data && data.length > 0) {
          setExperts(data);
        }
      } catch (err) {
        setExperts(MOCK_EXPERTS);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const filtered = experts.filter((e) => {
    const matchExpertise =
      activeExpertise === "ALL" || (e.expertise && e.expertise.includes(activeExpertise));
    const matchSearch =
      !searchTerm ||
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.expertise && e.expertise.some((ex) => ex.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchExpertise && matchSearch;
  });

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ["#1A365D", "#276749", "#7C3AED", "#C6A962", "#DC2626", "#0891B2", "#DB2777", "#059669"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Layout breadcrumb="Experts" title="Industry Experts">
      <section style={{ padding: "60px 0 100px", background: "#FFFFFF" }}>
        <div className="container">
          {/* Header & Search */}
          <div style={{ marginBottom: "48px" }}>
            <div className="row align-items-center" style={{ marginBottom: "24px" }}>
              <div className="col-lg-8">
                <span
                  style={{
                    color: "var(--tg-accent-color)",
                    letterSpacing: "3px",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Expert Network
                </span>
                <h3
                  style={{
                    fontFamily: "var(--tg-heading-font-family)",
                    fontSize: "28px",
                    fontWeight: 600,
                    color: "var(--tg-primary-color)",
                    margin: 0,
                  }}
                >
                  Connect with Industry Leaders
                </h3>
              </div>
              <div className="col-lg-4">
                <input
                  type="text"
                  placeholder="Search experts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    border: "1px solid var(--tg-border-color)",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                    background: "#FFFFFF",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#C6A962";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--tg-border-color)";
                  }}
                />
              </div>
            </div>

            {/* Expertise Filters */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {EXPERTISE_OPTIONS.map((exp) => (
                <button
                  key={exp}
                  onClick={() => setActiveExpertise(exp)}
                  style={{
                    padding: "9px 16px",
                    fontSize: "12px",
                    fontWeight: 600,
                    border: `1px solid ${activeExpertise === exp ? "var(--tg-accent-color)" : "var(--tg-border-color)"}`,
                    background: activeExpertise === exp ? "var(--tg-accent-color)" : "transparent",
                    color: activeExpertise === exp ? "var(--tg-primary-color)" : "var(--tg-body-font-color)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    letterSpacing: "0.3px",
                  }}
                >
                  {exp === "ALL" ? "All Experts" : exp}
                </button>
              ))}
            </div>

            <p style={{ fontSize: "14px", color: "var(--tg-gray-three)", margin: 0 }}>
              {loading ? "Loading experts..." : `Showing ${filtered.length} industry experts`}
            </p>
          </div>

          {/* Experts Grid */}
          <div className="row">
            {filtered.map((expert, i) => (
              <div key={expert.id} className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay={i * 50}>
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid var(--tg-border-color)",
                    padding: "32px 24px",
                    marginBottom: "24px",
                    textAlign: "center",
                    transition: "all 0.4s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 20px 48px rgba(10,22,40,0.1)";
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.borderBottomColor = "#C6A962";
                    e.currentTarget.style.borderBottomWidth = "3px";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderBottomColor = "var(--tg-border-color)";
                    e.currentTarget.style.borderBottomWidth = "1px";
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: getAvatarColor(expert.name),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: "24px",
                      fontFamily: "var(--tg-heading-font-family)",
                      letterSpacing: "1px",
                    }}
                  >
                    {getInitials(expert.name)}
                  </div>

                  {/* Name */}
                  <h5
                    style={{
                      fontFamily: "var(--tg-heading-font-family)",
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "var(--tg-primary-color)",
                      marginBottom: "4px",
                      lineHeight: 1.3,
                    }}
                  >
                    {expert.name}
                  </h5>

                  {/* Title */}
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--tg-accent-color)",
                      fontWeight: 600,
                      marginBottom: "2px",
                    }}
                  >
                    {expert.title}
                  </p>

                  {/* Company */}
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--tg-gray-three)",
                      marginBottom: "4px",
                    }}
                  >
                    {expert.company}
                  </p>

                  {/* City */}
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--tg-gray-three)",
                      marginBottom: "16px",
                    }}
                  >
                    <i className="flaticon-pin" style={{ fontSize: "11px", marginRight: "4px" }}></i>
                    {expert.city}
                  </p>

                  {/* Bio */}
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.6,
                      color: "var(--tg-body-font-color)",
                      marginBottom: "20px",
                      minHeight: "84px",
                      textAlign: "left",
                    }}
                  >
                    {expert.bio.length > 140 ? expert.bio.substring(0, 140) + "..." : expert.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      justifyContent: "center",
                      borderTop: "1px solid var(--tg-border-color)",
                      paddingTop: "16px",
                    }}
                  >
                    {expert.expertise.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          padding: "3px 8px",
                          background: "var(--tg-section-background)",
                          color: "var(--tg-primary-color)",
                          border: "1px solid var(--tg-border-color)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div className="text-center" style={{ padding: "80px 0" }}>
              <i
                className="far fa-user"
                style={{
                  fontSize: "48px",
                  color: "var(--tg-border-color)",
                  marginBottom: "20px",
                  display: "block",
                }}
              ></i>
              <h4
                style={{
                  fontFamily: "var(--tg-heading-font-family)",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "var(--tg-primary-color)",
                  marginBottom: "8px",
                }}
              >
                No Experts Found
              </h4>
              <p style={{ fontSize: "15px", color: "var(--tg-gray-three)" }}>
                Try adjusting your search or expertise filter.
              </p>
            </div>
          )}
        </div>

          {/* Join as Expert CTA */}
          <div
            style={{
              background: "#0A1628",
              padding: "64px 48px",
              marginTop: "60px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, transparent, #C6A962, transparent)",
              }}
            ></div>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "32px",
                fontWeight: 600,
                color: "#FFFFFF",
                marginBottom: "12px",
              }}
            >
              Are You a Hospitality Expert?
            </h3>
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.7)",
                maxWidth: "500px",
                margin: "0 auto 32px",
                lineHeight: 1.6,
              }}
            >
              Share your expertise, build your profile, and connect with industry leaders.
            </p>
            <Link
              to="/register/expert"
              style={{
                display: "inline-block",
                padding: "14px 40px",
                background: "#C6A962",
                color: "#0A1628",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.3s ease",
                border: "2px solid #C6A962",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#C6A962";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#C6A962";
                e.currentTarget.style.color = "#0A1628";
              }}
            >
              Join as Expert
            </Link>
          </div>
      </section>
    </Layout>
  );
};

export default ExpertsPage;
