import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../layouts/Layout";
import api from "../../services/api";
import HotelOwnerProfileForm from "../../components/profile/HotelOwnerProfileForm";
import VendorProfileForm from "../../components/profile/VendorProfileForm";

const SharedProfileFormPage = () => {
  const { token } = useParams();
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const validate = async () => {
      try {
        const data = await api.validateShareToken(token);
        setTokenData(data);
      } catch (err) {
        setError(err.message || "This link is invalid or has expired");
      } finally {
        setLoading(false);
      }
    };
    validate();
  }, [token]);

  const handleSubmit = async (data) => {
    try {
      await api.submitSharedProfile(token, data);
      setSubmitted(true);
    } catch (err) {
      throw new Error(err.message || "Failed to submit profile");
    }
  };

  if (loading) {
    return (
      <Layout header={1} footer={1}>
        <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
          <div className="container text-center">
            <p style={{ fontSize: "16px", color: "#6B7280" }}>Validating link...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout header={1} footer={1}>
        <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 text-center">
                <div
                  style={{
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    padding: "40px",
                  }}
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="2"
                    style={{ marginBottom: "16px" }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#0A1628",
                      marginBottom: "8px",
                    }}
                  >
                    Link Unavailable
                  </h3>
                  <p style={{ fontSize: "15px", color: "#6B7280" }}>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout header={1} footer={1}>
        <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 text-center">
                <div
                  style={{
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    padding: "40px",
                  }}
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#16A34A"
                    strokeWidth="2"
                    style={{ marginBottom: "16px" }}
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#0A1628",
                      marginBottom: "8px",
                    }}
                  >
                    Profile Submitted Successfully
                  </h3>
                  <p style={{ fontSize: "15px", color: "#6B7280" }}>
                    The profile for {tokenData.userName} has been submitted for review. They will be
                    notified once it's approved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout header={1} footer={1}>
      <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(198, 169, 98, 0.08)",
                    border: "1px solid rgba(198, 169, 98, 0.25)",
                    padding: "8px 20px",
                    marginBottom: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#C6A962",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Shared Profile Form
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
                  Fill Profile for {tokenData.userName}
                </h2>
                <p style={{ color: "#6B7280", fontSize: "15px" }}>
                  You are filling this profile on behalf of {tokenData.userName}. Please provide
                  accurate information.
                </p>
              </div>

              {/* Render form based on member type */}
              {tokenData.memberType === "HOTEL_OWNER" && (
                <HotelOwnerProfileForm onSubmit={handleSubmit} isSharedForm />
              )}
              {tokenData.memberType === "VENDOR" && (
                <VendorProfileForm onSubmit={handleSubmit} isSharedForm />
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SharedProfileFormPage;
