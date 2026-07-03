import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { Layout } from "../../layouts/Layout";
import HotelOwnerProfileForm from "../../components/profile/HotelOwnerProfileForm";
import VendorProfileForm from "../../components/profile/VendorProfileForm";
import ExpertProfileForm from "../../components/profile/ExpertProfileForm";

const RevisionRequestedPage = () => {
  const { user, loading, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getMyProfile();
        setProfile(data);
      } catch (err) {
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoadingProfile(false);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (loading) {
    return null;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (data) => {
    setError("");
    try {
      await api.resubmitProfile(data);
      setSuccess(true);
      await checkAuth();
      setTimeout(() => {
        navigate("/membership-pending");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to resubmit profile. Please try again.");
      throw err;
    }
  };

  const renderForm = () => {
    if (!profile) return null;

    const initialData = profile;
    const memberType = user.memberType;

    switch (memberType) {
      case "HOTEL_OWNER":
        return (
          <HotelOwnerProfileForm
            onSubmit={handleSubmit}
            initialData={initialData}
          />
        );
      case "VENDOR":
        return (
          <VendorProfileForm
            onSubmit={handleSubmit}
            initialData={initialData}
          />
        );
      case "CONSULTANT":
      case "PROFESSIONAL":
        return (
          <ExpertProfileForm
            onSubmit={handleSubmit}
            initialData={initialData}
          />
        );
      default:
        return (
          <ExpertProfileForm
            onSubmit={handleSubmit}
            initialData={initialData}
          />
        );
    }
  };

  const revisionNotes = profile?.revisionNotes || profile?.revisionNote || "";
  const flaggedFields = profile?.flaggedFields || [];

  return (
    <Layout header={1} footer={1}>
      <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* Page Header */}
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "rgba(198, 169, 98, 0.1)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                  }}
                >
                  <i
                    className="fas fa-edit"
                    style={{ fontSize: "28px", color: "#C6A962" }}
                  ></i>
                </div>

                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "36px",
                    fontWeight: 600,
                    color: "#0A1628",
                    marginBottom: "12px",
                  }}
                >
                  Revisions Requested
                </h2>

                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "16px",
                    lineHeight: "1.6",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  Our review team has requested some changes to your profile.
                  Please review the feedback below, make the necessary
                  corrections, and resubmit.
                </p>
              </div>

              {/* Revision Notes Banner */}
              {!loadingProfile && (revisionNotes || flaggedFields.length > 0) && (
                <div
                  style={{
                    background: "#FFFBEB",
                    border: "1px solid #FDE68A",
                    borderLeft: "4px solid #F59E0B",
                    padding: "20px 24px",
                    marginBottom: "32px",
                    borderRadius: "0 8px 8px 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <i
                      className="fas fa-exclamation-triangle"
                      style={{ color: "#D97706", fontSize: "16px" }}
                    ></i>
                    <h6
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#92400E",
                        margin: 0,
                      }}
                    >
                      Reviewer Feedback
                    </h6>
                  </div>

                  {revisionNotes && (
                    <p
                      style={{
                        color: "#92400E",
                        fontSize: "14px",
                        margin: "0 0 12px 0",
                        lineHeight: "1.6",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {revisionNotes}
                    </p>
                  )}

                  {flaggedFields.length > 0 && (
                    <div>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#92400E",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                        }}
                      >
                        Fields flagged for correction:
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                        }}
                      >
                        {flaggedFields.map((field) => (
                          <span
                            key={field}
                            style={{
                              fontSize: "12px",
                              fontWeight: 500,
                              padding: "4px 12px",
                              background: "#FEF3C7",
                              color: "#92400E",
                              border: "1px solid #FDE68A",
                              borderRadius: "12px",
                            }}
                          >
                            {field
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (s) => s.toUpperCase())
                              .trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div
                  style={{
                    background: "#FEE2E2",
                    color: "#C53030",
                    padding: "14px 20px",
                    marginBottom: "24px",
                    fontSize: "14px",
                    border: "1px solid #FCA5A5",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div
                  style={{
                    background: "#F0FDF4",
                    color: "#166534",
                    padding: "14px 20px",
                    marginBottom: "24px",
                    fontSize: "14px",
                    border: "1px solid #86EFAC",
                  }}
                >
                  Profile resubmitted successfully! Redirecting...
                </div>
              )}

              {/* Loading State */}
              {loadingProfile && (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <p style={{ color: "#6B7280", fontSize: "15px" }}>
                    Loading your profile data...
                  </p>
                </div>
              )}

              {/* Profile Form pre-filled with existing data */}
              {!loadingProfile && !success && profile && renderForm()}

              {/* Fallback if no profile data */}
              {!loadingProfile && !profile && !error && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <p style={{ color: "#6B7280", fontSize: "15px", marginBottom: "20px" }}>
                    Unable to load your profile data.
                  </p>
                  <button
                    className="btn"
                    onClick={() => navigate("/complete-profile")}
                    style={{
                      padding: "14px 40px",
                      fontSize: "13px",
                      letterSpacing: "2px",
                    }}
                  >
                    Go to Profile Form
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RevisionRequestedPage;
