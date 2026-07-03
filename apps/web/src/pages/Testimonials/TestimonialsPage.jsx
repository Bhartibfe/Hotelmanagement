import React, { useState, useEffect } from "react";
import { Layout } from "../../layouts/Layout";
import { api } from "../../services/api";

const MOCK_TESTIMONIALS = [
  {
    id: 1,
    content: "Hotel Sircle has fundamentally changed how I source vendors for my properties. Within weeks of joining, I connected with three verified suppliers who have since become long-term partners. The vetting process gives me confidence that every connection is legitimate.",
    authorName: "Rajesh Sharma",
    authorTitle: "Managing Director",
    authorCompany: "Sharma Hotels Group",
  },
  {
    id: 2,
    content: "As an investor, finding quality hospitality deals was always a challenge. This platform has given me direct access to verified hotel owners and transparent investment opportunities. I've already participated in two successful deals through the network.",
    authorName: "Priya Mehta",
    authorTitle: "Partner",
    authorCompany: "Meridian Capital",
  },
  {
    id: 3,
    content: "Being part of this network has helped us grow our client base by 40% in six months. The verified vendor marketplace ensures that hotel owners trust our services from day one. It's the most effective business development channel we've used.",
    authorName: "Anil Kapoor",
    authorTitle: "CEO",
    authorCompany: "TechHotel Solutions",
  },
  {
    id: 4,
    content: "What sets this network apart is the quality of connections. Every member is verified, every conversation is meaningful. I've found my next GM, two technology partners, and countless industry insights — all through a single platform.",
    authorName: "Sunita Reddy",
    authorTitle: "Founder & CEO",
    authorCompany: "Heritage Haveli Hotels",
  },
  {
    id: 5,
    content: "The industry events organized through the network are exceptional. The Investment Summit alone was worth the membership — I met more decision-makers in two days than I would in two years of traditional networking.",
    authorName: "Vikram Singh",
    authorTitle: "Investment Director",
    authorCompany: "HospitalityFund India",
  },
  {
    id: 6,
    content: "I was skeptical about another industry platform, but Hotel Sircle delivered from day one. The focus on verified members means no spam, no noise — just real conversations with real industry stakeholders.",
    authorName: "Deepa Nair",
    authorTitle: "Principal Architect",
    authorCompany: "Nair Design Studio",
  },
  {
    id: 7,
    content: "The insights and market intelligence shared on this platform are invaluable. The curated industry reports and expert commentary have directly influenced our expansion strategy across South India.",
    authorName: "Arjun Kapoor",
    authorTitle: "VP Operations",
    authorCompany: "ITC Hotels",
  },
  {
    id: 8,
    content: "Joining this network was the best business decision I made this year. Within the first month, I connected with three hotel owners looking for exactly the procurement services we offer. The ROI has been extraordinary.",
    authorName: "Rahul Verma",
    authorTitle: "Founder",
    authorCompany: "HotelProcure India",
  },
  {
    id: 9,
    content: "As a revenue management professional, having access to a community of hotel owners and GMs has been transformative. The discussions, case studies, and real-world insights shared here are far more valuable than any conference I've attended.",
    authorName: "Kavita Iyer",
    authorTitle: "Revenue Manager",
    authorCompany: "Marriott International",
  },
  {
    id: 10,
    content: "The network's commitment to the Indian hospitality industry is genuine and visible in everything they do. From the curated member directory to the investment opportunities — every feature addresses a real pain point we face as hotel owners.",
    authorName: "Meera Joshi",
    authorTitle: "Director",
    authorCompany: "Joshi Resort Chain",
  },
];

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState(MOCK_TESTIMONIALS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const data = await api.getTestimonials();
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      } catch (err) {
        setTestimonials(MOCK_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <Layout breadcrumb="Testimonials" title="What Our Members Say">
      {/* Hero Quote Section */}
      <section style={{ padding: "100px 0", background: "var(--tg-primary-color)", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "60px",
            fontSize: "200px",
            fontFamily: "Georgia, serif",
            color: "rgba(198,169,98,0.08)",
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          &ldquo;
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center" data-aos="fade-up">
              <i
                className="fas fa-quote-left"
                style={{
                  fontSize: "32px",
                  color: "#C6A962",
                  marginBottom: "32px",
                  display: "block",
                }}
              ></i>
              <p
                style={{
                  fontSize: "clamp(20px, 3vw, 28px)",
                  fontFamily: "var(--tg-heading-font-family)",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  lineHeight: 1.6,
                  marginBottom: "40px",
                  fontStyle: "italic",
                }}
              >
                {testimonials[0] && testimonials[0].content}
              </p>
              <div>
                <div
                  style={{
                    width: "48px",
                    height: "2px",
                    background: "#C6A962",
                    margin: "0 auto 20px",
                  }}
                ></div>
                <h5
                  style={{
                    fontFamily: "var(--tg-heading-font-family)",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    marginBottom: "4px",
                  }}
                >
                  {testimonials[0] && testimonials[0].authorName}
                </h5>
                <p style={{ color: "#C6A962", fontSize: "14px", margin: 0 }}>
                  {testimonials[0] && `${testimonials[0].authorTitle}, ${testimonials[0].authorCompany}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section style={{ padding: "100px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row justify-content-center" style={{ marginBottom: "60px" }}>
            <div className="col-lg-7 text-center">
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
                data-aos="fade-up"
              >
                Member Stories
              </span>
              <h2
                data-aos="fade-up"
                data-aos-delay="100"
                style={{
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontFamily: "var(--tg-heading-font-family)",
                  fontWeight: 600,
                  color: "var(--tg-primary-color)",
                  marginBottom: "16px",
                }}
              >
                Voices from the Network
              </h2>
              <p
                data-aos="fade-up"
                data-aos-delay="200"
                style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--tg-body-font-color)" }}
              >
                Hear directly from our members about how Hotel Sircle
                has transformed their business connections and opportunities.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center" style={{ padding: "60px 0" }}>
              <p style={{ fontSize: "16px", color: "var(--tg-gray-three)" }}>Loading testimonials...</p>
            </div>
          ) : (
            <div className="row">
              {testimonials.slice(1).map((testimonial, i) => {
                const isLarge = i % 3 === 0;
                return (
                  <div
                    key={testimonial.id}
                    className={isLarge ? "col-lg-8 col-md-12" : "col-lg-4 col-md-6"}
                    data-aos="fade-up"
                    data-aos-delay={i * 80}
                  >
                    <div
                      style={{
                        background: isLarge ? "var(--tg-primary-color)" : "var(--tg-section-background)",
                        padding: isLarge ? "48px 44px" : "36px 28px",
                        marginBottom: "30px",
                        position: "relative",
                        transition: "all 0.4s ease",
                        borderLeft: isLarge ? "none" : "3px solid var(--tg-accent-color)",
                      }}
                      onMouseEnter={(e) => {
                        if (!isLarge) {
                          e.currentTarget.style.boxShadow = "0 16px 40px rgba(10,22,40,0.08)";
                          e.currentTarget.style.transform = "translateY(-4px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLarge) {
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      <i
                        className="fas fa-quote-left"
                        style={{
                          fontSize: isLarge ? "28px" : "20px",
                          color: isLarge ? "rgba(198,169,98,0.4)" : "var(--tg-accent-color)",
                          marginBottom: "20px",
                          display: "block",
                        }}
                      ></i>

                      <p
                        style={{
                          fontSize: isLarge ? "18px" : "14px",
                          lineHeight: 1.8,
                          color: isLarge ? "#FFFFFF" : "var(--tg-body-font-color)",
                          marginBottom: "28px",
                          fontFamily: isLarge ? "var(--tg-heading-font-family)" : "inherit",
                          fontStyle: isLarge ? "italic" : "normal",
                        }}
                      >
                        {testimonial.content}
                      </p>

                      <div
                        style={{
                          borderTop: `1px solid ${isLarge ? "rgba(198,169,98,0.2)" : "var(--tg-border-color)"}`,
                          paddingTop: "20px",
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                        }}
                      >
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            background: isLarge ? "#C6A962" : "var(--tg-primary-color)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: isLarge ? "#0A1628" : "#FFFFFF",
                            fontWeight: 700,
                            fontSize: "16px",
                            fontFamily: "var(--tg-heading-font-family)",
                            flexShrink: 0,
                          }}
                        >
                          {testimonial.authorName.charAt(0)}
                        </div>
                        <div>
                          <h6
                            style={{
                              fontFamily: "var(--tg-heading-font-family)",
                              fontSize: "16px",
                              fontWeight: 600,
                              color: isLarge ? "#FFFFFF" : "var(--tg-primary-color)",
                              margin: 0,
                            }}
                          >
                            {testimonial.authorName}
                          </h6>
                          <span
                            style={{
                              fontSize: "12px",
                              color: isLarge ? "#8DA4BE" : "var(--tg-gray-three)",
                            }}
                          >
                            {testimonial.authorTitle}, {testimonial.authorCompany}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "80px 0", background: "var(--tg-section-background)", textAlign: "center" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7" data-aos="fade-up">
              <h3
                style={{
                  fontFamily: "var(--tg-heading-font-family)",
                  fontSize: "32px",
                  fontWeight: 600,
                  color: "var(--tg-primary-color)",
                  marginBottom: "16px",
                }}
              >
                Share Your Story
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: 1.7,
                  color: "var(--tg-body-font-color)",
                  marginBottom: "32px",
                }}
              >
                Are you a member of Hotel Sircle? We'd love to hear how
                the platform has helped your business grow. Your story could inspire
                the next wave of hospitality leaders.
              </p>
              <a
                href="mailto:testimonials@hotelsircle.in"
                className="btn"
                style={{
                  padding: "16px 40px",
                  fontSize: "13px",
                  letterSpacing: "2px",
                }}
              >
                Submit Your Testimonial
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TestimonialsPage;
