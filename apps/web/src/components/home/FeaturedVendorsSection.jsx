import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MOCK_VENDORS = [
  {
    id: 1,
    company: "Pinnacle Hospitality Supplies",
    category: "FF&E Supplier",
    city: "Mumbai",
    description:
      "Premium furniture, fixtures and equipment for luxury hotels and resorts across India.",
  },
  {
    id: 2,
    company: "TechStay Solutions",
    category: "Technology",
    city: "Bengaluru",
    description:
      "End-to-end hotel technology solutions including PMS, channel managers and guest apps.",
  },
  {
    id: 3,
    company: "GreenLeaf Amenities",
    category: "Guest Amenities",
    city: "New Delhi",
    description:
      "Eco-friendly guest amenities and toiletries for sustainable hospitality brands.",
  },
  {
    id: 4,
    company: "Royal Linen Co.",
    category: "Linen & Textiles",
    city: "Jaipur",
    description:
      "Luxury bed and bath linen manufacturer serving five-star hotel chains nationwide.",
  },
  {
    id: 5,
    company: "CulinaryEdge Equipment",
    category: "Kitchen Equipment",
    city: "Chennai",
    description:
      "Commercial kitchen equipment and consultancy for hotel and restaurant kitchens.",
  },
  {
    id: 6,
    company: "SafeGuard Security",
    category: "Security Systems",
    city: "Hyderabad",
    description:
      "Integrated security and surveillance systems designed for the hospitality industry.",
  },
  {
    id: 7,
    company: "AquaPure Systems",
    category: "Water Solutions",
    city: "Pune",
    description:
      "Water purification and management systems for hotels and resorts.",
  },
  {
    id: 8,
    company: "BrightSpace Lighting",
    category: "Lighting Design",
    city: "Ahmedabad",
    description:
      "Architectural and decorative lighting solutions for hospitality spaces.",
  },
  {
    id: 9,
    company: "CloudBooks Accounting",
    category: "Financial Services",
    city: "Kolkata",
    description:
      "Specialized accounting and financial management for hotel businesses.",
  },
  {
    id: 10,
    company: "EcoWash Laundry",
    category: "Laundry Services",
    city: "Goa",
    description:
      "Industrial laundry solutions with eco-friendly processes for hotels.",
  },
];

export const FeaturedVendorsSection = () => {
  const [vendors, setVendors] = useState(MOCK_VENDORS);
  const [hoveredId, setHoveredId] = useState(null);
  const [clickedId, setClickedId] = useState(null);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        if (typeof api !== "undefined" && api.getFeaturedVendors) {
          const data = await api.getFeaturedVendors();
          if (data && data.length > 0) {
            setVendors(data);
          }
        }
      } catch (err) {
        // Fallback to mock data silently
      }
    };
    loadVendors();
  }, []);

  const handleClick = (id) => {
    setClickedId(id);
    setTimeout(() => setClickedId(null), 500);
  };

  const firstRow = vendors.slice(0, 3);
  const secondRow = vendors.slice(3, 10);

  return (
    <section style={{ padding: "100px 0", background: "#FFFFFF" }}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center" style={{ marginBottom: "60px" }}>
          <span
            data-aos="fade-up"
            data-aos-duration="800"
            style={{
              color: "#C6A962",
              letterSpacing: "3px",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              display: "block",
              marginBottom: "16px",
              fontFamily: "var(--tg-body-font-family)",
            }}
          >
            Trusted Partners
          </span>
          <h2
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="100"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontFamily: "var(--tg-heading-font-family)",
              fontWeight: 600,
              color: "#0A1628",
              marginBottom: "0",
            }}
          >
            Featured Vendors
          </h2>
        </div>

        {/* First Row: 3 larger cards */}
        <div className="row" style={{ marginBottom: "30px" }}>
          {firstRow.map((vendor, index) => (
            <div
              key={vendor.id}
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={index * 150}
              style={{ marginBottom: "30px" }}
            >
              <div
                onClick={() => handleClick(vendor.id)}
                onMouseEnter={() => setHoveredId(vendor.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  padding: "32px 28px",
                  background: "#FAFAFA",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  transform:
                    clickedId === vendor.id
                      ? "scale(0.96)"
                      : hoveredId === vendor.id
                      ? "translateY(-8px)"
                      : "translateY(0)",
                  boxShadow:
                    hoveredId === vendor.id
                      ? "0 20px 40px rgba(10,22,40,0.1)"
                      : "0 2px 8px rgba(10,22,40,0.04)",
                  borderLeft:
                    hoveredId === vendor.id || clickedId === vendor.id
                      ? "4px solid #C6A962"
                      : "4px solid transparent",
                  position: "relative",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "var(--tg-heading-font-family)",
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#0A1628",
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {vendor.company}
                  </h4>
                </div>
                <span
                  style={{
                    display: "inline-block",
                    background: "#C6A962",
                    color: "#0A1628",
                    padding: "4px 14px",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    borderRadius: "2px",
                    marginBottom: "14px",
                  }}
                >
                  {vendor.category}
                </span>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6B7B8D",
                    lineHeight: 1.6,
                    marginBottom: "14px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {vendor.description}
                </p>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#8DA4BE",
                    fontWeight: 500,
                  }}
                >
                  <i
                    className="flaticon-pin"
                    style={{ marginRight: "6px", color: "#C6A962" }}
                  ></i>
                  {vendor.city}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row: remaining 7 cards in compact grid */}
        <div className="row">
          {secondRow.map((vendor, index) => (
            <div
              key={vendor.id}
              className="col-lg-3 col-md-6"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={index * 100}
              style={{ marginBottom: "24px" }}
            >
              <div
                onClick={() => handleClick(vendor.id)}
                onMouseEnter={() => setHoveredId(vendor.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  padding: "24px 20px",
                  background: "#FAFAFA",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  transform:
                    clickedId === vendor.id
                      ? "scale(0.96)"
                      : hoveredId === vendor.id
                      ? "translateY(-8px)"
                      : "translateY(0)",
                  boxShadow:
                    hoveredId === vendor.id
                      ? "0 16px 32px rgba(10,22,40,0.1)"
                      : "0 2px 8px rgba(10,22,40,0.04)",
                  borderLeft:
                    hoveredId === vendor.id || clickedId === vendor.id
                      ? "4px solid #C6A962"
                      : "4px solid transparent",
                  height: "100%",
                }}
              >
                <h5
                  style={{
                    fontFamily: "var(--tg-heading-font-family)",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#0A1628",
                    marginBottom: "10px",
                    lineHeight: 1.3,
                  }}
                >
                  {vendor.company}
                </h5>
                <span
                  style={{
                    display: "inline-block",
                    background: "#C6A962",
                    color: "#0A1628",
                    padding: "3px 10px",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    borderRadius: "2px",
                    marginBottom: "10px",
                  }}
                >
                  {vendor.category}
                </span>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6B7B8D",
                    lineHeight: 1.5,
                    marginBottom: "10px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {vendor.description}
                </p>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#8DA4BE",
                    fontWeight: 500,
                  }}
                >
                  <i
                    className="flaticon-pin"
                    style={{ marginRight: "5px", color: "#C6A962" }}
                  ></i>
                  {vendor.city}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div
          className="text-center"
          style={{ marginTop: "40px" }}
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="300"
        >
          <Link
            to="/vendors"
            style={{
              color: "#C6A962",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              textDecoration: "none",
              borderBottom: "2px solid transparent",
              paddingBottom: "4px",
              transition: "all 0.3s ease",
              fontFamily: "var(--tg-body-font-family)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderBottomColor = "#C6A962";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottomColor = "transparent";
            }}
          >
            View All Vendors &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};
