import React, { useState } from "react";
import { Link } from "react-router-dom";

const MOCK_TESTIMONIALS = [
  {
    id: 1,
    content:
      "Being part of this network has transformed how I source vendors for my properties. The quality of connections is unmatched in the Indian hospitality space.",
    author: "Rajiv Malhotra",
    title: "Owner",
    company: "The Grand Palace Hotels",
  },
  {
    id: 2,
    content:
      "As a vendor, this platform gave us direct access to hotel decision-makers. Our business has grown threefold since joining.",
    author: "Sunita Krishnamurthy",
    title: "Director",
    company: "Pinnacle Hospitality Supplies",
  },
  {
    id: 3,
    content:
      "The networking events alone are worth the membership. I have built partnerships that would have taken years to develop otherwise.",
    author: "Arun Chadha",
    title: "CEO",
    company: "Heritage Stays India",
  },
  {
    id: 4,
    content:
      "A truly curated community. Every member brings value, and the vetting process ensures quality interactions at every touchpoint.",
    author: "Priyanka Oberoi",
    title: "General Manager",
    company: "Lakeside Resorts",
  },
  {
    id: 5,
    content:
      "The industry insights shared through this network have helped us stay ahead of market trends and make better investment decisions.",
    author: "Manoj Tiwari",
    title: "Investment Director",
    company: "Capital Hospitality Group",
  },
  {
    id: 6,
    content:
      "Finding reliable vendors used to be our biggest challenge. This network has made it effortless with verified, pre-screened partners.",
    author: "Deepika Rajan",
    title: "Procurement Head",
    company: "Sunrise Hotel Chain",
  },
  {
    id: 7,
    content:
      "The expert consultations available through the platform have been invaluable for our brand repositioning strategy.",
    author: "Harish Menon",
    title: "Brand Director",
    company: "Coastline Hospitality",
  },
  {
    id: 8,
    content:
      "What sets this network apart is the genuine spirit of collaboration. Members actually want to help each other succeed.",
    author: "Kavya Sharma",
    title: "Founder",
    company: "Boutique Stays Co.",
  },
  {
    id: 9,
    content:
      "From technology solutions to linen suppliers, every vendor on this platform has been thoroughly vetted. It saves us enormous time.",
    author: "Siddharth Kapoor",
    title: "Operations VP",
    company: "Imperial Hotels India",
  },
  {
    id: 10,
    content:
      "Joining this network was the best business decision I made last year. The ROI on membership has been exceptional.",
    author: "Anita Deshmukh",
    title: "Managing Director",
    company: "Deccan Hospitality Group",
  },
];

const AOS_ANIMATIONS = [
  "fade-up",
  "fade-left",
  "fade-right",
  "fade-up",
  "fade-right",
  "fade-left",
  "fade-up",
  "fade-left",
  "fade-right",
  "fade-up",
];

export const TestimonialsSection = () => {
  const [hoveredId, setHoveredId] = useState(null);

  // Distribute testimonials across 3 columns for masonry effect
  const columns = [[], [], []];
  MOCK_TESTIMONIALS.forEach((t, i) => {
    columns[i % 3].push({ ...t, index: i });
  });

  // Staggered margin offsets for masonry feel
  const columnOffsets = ["0px", "40px", "20px"];

  return (
    <section
      style={{
        padding: "100px 0",
        background: "#0A1628",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(198,169,98,0.04), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "8%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(198,169,98,0.03), transparent 70%)",
          pointerEvents: "none",
        }}
      />

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
            Testimonials
          </span>
          <h2
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="100"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontFamily: "var(--tg-heading-font-family)",
              fontWeight: 600,
              color: "#FFFFFF",
              marginBottom: "0",
            }}
          >
            What Our Members Say
          </h2>
        </div>

        {/* Masonry Grid */}
        <div className="row">
          {columns.map((colItems, colIndex) => (
            <div
              key={colIndex}
              className="col-lg-4 col-md-6"
              style={{
                marginTop: columnOffsets[colIndex],
              }}
            >
              {colItems.map((testimonial) => (
                <div
                  key={testimonial.id}
                  data-aos={AOS_ANIMATIONS[testimonial.index]}
                  data-aos-duration="800"
                  data-aos-delay={testimonial.index * 80}
                  onMouseEnter={() => setHoveredId(testimonial.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    padding: "30px 28px",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "4px",
                    marginBottom: "24px",
                    transition: "all 0.4s ease",
                    transform:
                      hoveredId === testimonial.id
                        ? "translateY(-4px)"
                        : "translateY(0)",
                    borderLeft:
                      hoveredId === testimonial.id
                        ? "4px solid #C6A962"
                        : "4px solid transparent",
                    boxShadow:
                      hoveredId === testimonial.id
                        ? "0 10px 30px rgba(0,0,0,0.2)"
                        : "none",
                  }}
                >
                  {/* Quote Icon */}
                  <i
                    className="fas fa-quote-left"
                    style={{
                      color: "#C6A962",
                      fontSize: "20px",
                      marginBottom: "16px",
                      display: "block",
                      opacity: 0.6,
                    }}
                  ></i>
                  {/* Content */}
                  <p
                    style={{
                      color: "#C8D6E5",
                      fontSize: "15px",
                      lineHeight: 1.75,
                      marginBottom: "20px",
                      fontFamily: "var(--tg-body-font-family)",
                    }}
                  >
                    {testimonial.content}
                  </p>
                  {/* Author */}
                  <div>
                    <h6
                      style={{
                        color: "#FFFFFF",
                        fontFamily: "var(--tg-heading-font-family)",
                        fontSize: "15px",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {testimonial.author}
                    </h6>
                    <span
                      style={{
                        color: "#C6A962",
                        fontSize: "12px",
                        fontWeight: 500,
                        letterSpacing: "0.5px",
                      }}
                    >
                      {testimonial.title}, {testimonial.company}
                    </span>
                  </div>
                </div>
              ))}
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
            to="/testimonials"
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
            View All Testimonials &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};
