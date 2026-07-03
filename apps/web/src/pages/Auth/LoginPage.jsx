import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../layouts/Layout";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Clear any stale tokens before fresh login
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    try {
      const user = await login(email, password);
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.profileStatus === "INCOMPLETE") {
        navigate("/complete-profile");
      } else if (user.membershipStatus === "REVISION_REQUESTED") {
        navigate("/revision-requested");
      } else if (user.membershipStatus === "PENDING") {
        navigate("/membership-pending");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout header={1} footer={1} breadcrumb="Sign In" title="Sign In">
      <section style={{ padding: "80px 0", background: "var(--tg-section-background)" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-8">
              <div
                style={{
                  background: "#FFFFFF",
                  padding: "48px 40px",
                  borderTop: "3px solid var(--tg-accent-color)",
                }}
              >
                <div className="text-center" style={{ marginBottom: "36px" }}>
                  <h2
                    style={{
                      fontFamily: "var(--tg-heading-font-family)",
                      fontSize: "32px",
                      fontWeight: 600,
                      color: "var(--tg-primary-color)",
                      marginBottom: "8px",
                    }}
                  >
                    Welcome Back
                  </h2>
                  <p style={{ color: "var(--tg-body-font-color)", fontSize: "15px" }}>
                    Sign in to your Hotel Sircle account
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
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--tg-primary-color)",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        border: "1px solid var(--tg-border-color)",
                        fontSize: "15px",
                        outline: "none",
                        transition: "border-color 0.3s",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--tg-primary-color)",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        border: "1px solid var(--tg-border-color)",
                        fontSize: "15px",
                        outline: "none",
                        transition: "border-color 0.3s",
                      }}
                    />
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
                    }}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </form>

                <div className="text-center" style={{ marginTop: "24px" }}>
                  <p style={{ fontSize: "14px", color: "var(--tg-body-font-color)" }}>
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      style={{ color: "var(--tg-accent-color)", fontWeight: 600, textDecoration: "none" }}
                    >
                      Join the Network
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

export default LoginPage;
