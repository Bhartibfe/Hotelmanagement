import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

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

export const TestimonialsSection = ({ config }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await api.getTestimonials?.();
        if (data?.testimonials?.length > 0) {
          setTestimonials(data.testimonials.map((t) => ({
            id: t.id,
            content: t.content,
            author: t.authorName,
            title: t.authorTitle || "",
            company: t.authorCompany || "",
          })));
        }
      } catch {
        // no testimonials available
      }
    };
    fetchTestimonials();
  }, []);

  if (testimonials.length === 0) return null;

  const count = config?.testimonialsCount || 4;
  const displayTestimonials = testimonials.slice(0, count);
  const columns = [[], [], []];
  displayTestimonials.forEach((t, i) => {
    columns[i % 3].push({ ...t, index: i });
  });

  const columnOffsets = ["0px", "24px", "12px"];

  return (
    <section
      style={{
        padding: "clamp(48px, 6vw, 72px) 0",
        background: "#0A1628",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
        <div className="text-center" style={{ marginBottom: "36px" }}>
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
                  data-aos={AOS_ANIMATIONS[testimonial.index] || "fade-up"}
                  data-aos-duration="800"
                  data-aos-delay={testimonial.index * 80}
                  onMouseEnter={() => setHoveredId(testimonial.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    padding: "24px 22px",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "4px",
                    marginBottom: "16px",
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
                      {testimonial.title}{testimonial.company ? `, ${testimonial.company}` : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
