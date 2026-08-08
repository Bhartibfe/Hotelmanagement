import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../layouts/Layout";

const RoleSelectionPage = () => {
  const cardStyle = {
    background: "#FFFFFF",
    padding: "36px 28px",
    border: "1px solid #E2DDD5",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
    display: "block",
  };

  const cardHoverClass = {
    borderColor: "#C6A962",
    boxShadow: "0 4px 20px rgba(198, 169, 98, 0.15)",
  };

  return (
    <Layout header={1} footer={1} breadcrumb="Join the Network" title="Join the Network">
      <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div
                style={{
                  background: "#FFFFFF",
                  padding: "48px 40px",
                  border: "1px solid #E2DDD5",
                  borderTop: "3px solid #C6A962",
                }}
              >
                {/* Header */}
                <div className="text-center" style={{ marginBottom: "40px" }}>
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "32px",
                      fontWeight: 600,
                      color: "#0A1628",
                      marginBottom: "8px",
                    }}
                  >
                    Join Our Network
                  </h2>
                  <p style={{ color: "#6B7280", fontSize: "15px" }}>
                    Select how you'd like to join India's premier hospitality network
                  </p>
                </div>

                {/* Role Cards */}
                <div className="row" style={{ marginBottom: "24px" }}>
                  <div className="col-md-6" style={{ marginBottom: "20px" }}>
                    <Link
                      to="/register/hotel-owner"
                      style={cardStyle}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = cardHoverClass.borderColor;
                        e.currentTarget.style.boxShadow = cardHoverClass.boxShadow;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "#E2DDD5";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          background: "rgba(198, 169, 98, 0.1)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "16px",
                        }}
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#C6A962"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                      <h4
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "22px",
                          fontWeight: 600,
                          color: "#0A1628",
                          marginBottom: "8px",
                        }}
                      >
                        Hotel Owner
                      </h4>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6B7280",
                          margin: 0,
                          lineHeight: "1.5",
                        }}
                      >
                        Join as a hotel owner or hospitality leader
                      </p>
                    </Link>
                  </div>

                  <div className="col-md-6" style={{ marginBottom: "20px" }}>
                    <Link
                      to="/register/vendor"
                      style={cardStyle}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = cardHoverClass.borderColor;
                        e.currentTarget.style.boxShadow = cardHoverClass.boxShadow;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "#E2DDD5";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          background: "rgba(198, 169, 98, 0.1)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "16px",
                        }}
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#C6A962"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                      </div>
                      <h4
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "22px",
                          fontWeight: 600,
                          color: "#0A1628",
                          marginBottom: "8px",
                        }}
                      >
                        Partner
                      </h4>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6B7280",
                          margin: 0,
                          lineHeight: "1.5",
                        }}
                      >
                        Showcase your products and services to hotels
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Expert link - smaller, below */}
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "#F8FAFC",
                    border: "1px solid #E2DDD5",
                  }}
                >
                  <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
                    Are you an industry expert?{" "}
                    <Link
                      to="/register/expert"
                      style={{ color: "#C6A962", fontWeight: 600, textDecoration: "none" }}
                    >
                      Join as Expert
                    </Link>
                  </p>
                </div>

                {/* Login link */}
                <div className="text-center" style={{ marginTop: "24px" }}>
                  <p style={{ fontSize: "14px", color: "#6B7280" }}>
                    Already a member?{" "}
                    <Link
                      to="/login"
                      style={{ color: "#C6A962", fontWeight: 600, textDecoration: "none" }}
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RoleSelectionPage;
