import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../layouts/Layout";

const SALUTATIONS = ["Mr", "Mrs", "Miss", "Ms", "Dr"];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    salutation: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    memberType: "HOTEL_OWNER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(formData);
      navigate("/complete-profile");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #E2DDD5",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.3s",
    fontFamily: "var(--tg-body-font-family)",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#0A1628",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const requiredStar = {
    color: "#E53E3E",
    marginLeft: "2px",
  };

  return (
    <Layout header={1} footer={1} breadcrumb="Apply as Hotel Owner" title="Apply as Hotel Owner">
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
                <div className="text-center" style={{ marginBottom: "36px" }}>
                  {/* Step Indicator */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(198, 169, 98, 0.08)",
                      border: "1px solid rgba(198, 169, 98, 0.25)",
                      padding: "6px 16px",
                      marginBottom: "20px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#C6A962",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    <span
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: "#C6A962",
                        color: "#FFFFFF",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      1
                    </span>
                    Step 1 of 2
                  </div>

                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "32px",
                      fontWeight: 600,
                      color: "#0A1628",
                      marginBottom: "8px",
                    }}
                  >
                    Apply as Hotel Owner
                  </h2>
                  <p style={{ color: "#6B7280", fontSize: "15px" }}>
                    Join India's premier hospitality leadership network
                  </p>
                </div>

                {error && (
                  <div
                    style={{
                      background: "#FEE2E2",
                      color: "#C53030",
                      padding: "12px 16px",
                      marginBottom: "20px",
                      fontSize: "14px",
                    }}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Salutation */}
                  <div className="row">
                    <div className="col-md-4" style={{ marginBottom: "20px" }}>
                      <label style={labelStyle}>
                        Salutation<span style={requiredStar}>*</span>
                      </label>
                      <select
                        name="salutation"
                        value={formData.salutation}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                      >
                        <option value="">Select</option>
                        {SALUTATIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="row">
                    <div className="col-md-6" style={{ marginBottom: "20px" }}>
                      <label style={labelStyle}>
                        First Name<span style={requiredStar}>*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="First Name"
                        style={inputStyle}
                      />
                    </div>
                    <div className="col-md-6" style={{ marginBottom: "20px" }}>
                      <label style={labelStyle}>
                        Last Name<span style={requiredStar}>*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Last Name"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6" style={{ marginBottom: "20px" }}>
                      <label style={labelStyle}>
                        Email<span style={requiredStar}>*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        style={inputStyle}
                      />
                    </div>
                    <div className="col-md-6" style={{ marginBottom: "20px" }}>
                      <label style={labelStyle}>
                        Password<span style={requiredStar}>*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Create a password"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn"
                    disabled={loading}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      padding: "16px",
                      fontSize: "13px",
                      letterSpacing: "2px",
                      marginTop: "8px",
                    }}
                  >
                    {loading ? "Creating Account..." : "Continue to Profile"}
                  </button>
                </form>

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

                {/* Cross-registration links */}
                <div
                  style={{
                    marginTop: "24px",
                    padding: "20px",
                    background: "#F8FAFC",
                    border: "1px solid #E2DDD5",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
                    Are you a Vendor?{" "}
                    <Link
                      to="/register/vendor"
                      style={{ color: "#C6A962", fontWeight: 600, textDecoration: "none" }}
                    >
                      Register here
                    </Link>
                    .{" "}
                    Are you an Industry Expert?{" "}
                    <Link
                      to="/register/expert"
                      style={{ color: "#C6A962", fontWeight: 600, textDecoration: "none" }}
                    >
                      Register here
                    </Link>
                    .
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

export default RegisterPage;
