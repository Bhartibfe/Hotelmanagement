import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../layouts/Layout";
import { useAuth } from "../../contexts/AuthContext";

const MembershipPendingPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Layout header={1} footer={1}>
      <section
        style={{
          padding: "120px 0",
          background: "linear-gradient(180deg, var(--tg-section-background) 0%, #FFFFFF 100%)",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7 col-md-10">
              <div
                style={{
                  textAlign: "center",
                  background: "#FFFFFF",
                  padding: "72px 56px",
                  borderTop: "4px solid #C6A962",
                  boxShadow: "0 24px 64px rgba(10,22,40,0.06)",
                }}
                data-aos="fade-up"
              >
                {/* Hourglass Icon */}
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: "var(--tg-primary-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 36px",
                    position: "relative",
                  }}
                >
                  <i
                    className="fas fa-hourglass-half"
                    style={{
                      fontSize: "36px",
                      color: "#C6A962",
                    }}
                  ></i>
                  <div
                    style={{
                      position: "absolute",
                      inset: "-4px",
                      borderRadius: "50%",
                      border: "2px solid rgba(198,169,98,0.2)",
                    }}
                  ></div>
                </div>

                {/* Heading */}
                <h1
                  style={{
                    fontFamily: "var(--tg-heading-font-family)",
                    fontSize: "clamp(28px, 4vw, 40px)",
                    fontWeight: 600,
                    color: "var(--tg-primary-color)",
                    marginBottom: "20px",
                    lineHeight: 1.2,
                  }}
                >
                  Application Under Review
                </h1>

                {/* Gold Divider */}
                <div
                  style={{
                    width: "60px",
                    height: "2px",
                    background: "#C6A962",
                    margin: "0 auto 28px",
                  }}
                ></div>

                {/* Description */}
                <p
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.8,
                    color: "var(--tg-body-font-color)",
                    marginBottom: "16px",
                    maxWidth: "500px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  Thank you for applying to Hotel Sircle. Your membership
                  application has been received and is currently being reviewed by our
                  verification team.
                </p>

                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.7,
                    color: "var(--tg-gray-three)",
                    marginBottom: "8px",
                  }}
                >
                  Our team carefully reviews each application to maintain the integrity and
                  quality of our verified network. This process typically takes
                  <strong style={{ color: "var(--tg-primary-color)" }}> 24-48 hours</strong>.
                </p>

                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.7,
                    color: "var(--tg-gray-three)",
                    marginBottom: "36px",
                  }}
                >
                  You will receive an email notification once your application has been approved.
                </p>

                {/* Status Steps */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0",
                    marginBottom: "40px",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    { label: "Application Submitted", icon: "fas fa-check", done: true },
                    { label: "Under Review", icon: "fas fa-search", done: false, active: true },
                    { label: "Verification Complete", icon: "fas fa-shield-alt", done: false },
                    { label: "Welcome to Network", icon: "fas fa-handshake", done: false },
                  ].map((step, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                        flex: "1 1 120px",
                        maxWidth: "140px",
                      }}
                    >
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: step.done
                            ? "#059669"
                            : step.active
                            ? "#C6A962"
                            : "var(--tg-section-background)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "10px",
                          border: step.active ? "2px solid #C6A962" : "none",
                        }}
                      >
                        <i
                          className={step.icon}
                          style={{
                            fontSize: "14px",
                            color: step.done || step.active ? "#FFFFFF" : "var(--tg-gray-three)",
                          }}
                        ></i>
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: step.done
                            ? "#059669"
                            : step.active
                            ? "var(--tg-primary-color)"
                            : "var(--tg-gray-three)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          textAlign: "center",
                          lineHeight: 1.3,
                        }}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div
                  style={{
                    background: "var(--tg-section-background)",
                    padding: "24px 28px",
                    marginBottom: "32px",
                    border: "1px solid var(--tg-border-color)",
                  }}
                >
                  <p style={{ fontSize: "14px", color: "var(--tg-body-font-color)", margin: 0 }}>
                    Have questions about your application? Contact us at{" "}
                    <a
                      href="mailto:membership@hotelsircle.in"
                      style={{ color: "#C6A962", fontWeight: 600, textDecoration: "none" }}
                    >
                      membership@hotelsircle.in
                    </a>
                  </p>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "14px 40px",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    background: "transparent",
                    color: "var(--tg-primary-color)",
                    border: "2px solid var(--tg-primary-color)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--tg-primary-color)";
                    e.target.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "var(--tg-primary-color)";
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MembershipPendingPage;
