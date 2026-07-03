import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { Layout } from "../../layouts/Layout";
import HotelOwnerProfileForm from "../../components/profile/HotelOwnerProfileForm";
import VendorProfileForm from "../../components/profile/VendorProfileForm";
import ExpertProfileForm from "../../components/profile/ExpertProfileForm";

const CompleteProfilePage = () => {
  const { user, loading, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Determine if this is a revision flow
  const isRevision =
    user?.profileStatus === "REVISION_REQUESTED" ||
    user?.membershipStatus === "REVISION_REQUESTED";

  // Fetch existing profile data for revision cases
  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!isRevision) return;
      setLoadingProfile(true);
      try {
        const data = await api.getMyProfile();
        setProfileData(data);
      } catch (err) {
        // If we can't load existing data, user can still fill in from scratch
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user && isRevision) {
      fetchExistingProfile();
    }
  }, [user, isRevision]);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If profile is already submitted and NOT a revision, redirect
  if (
    user.profileStatus &&
    user.profileStatus !== "INCOMPLETE" &&
    !isRevision
  ) {
    return <Navigate to="/membership-pending" replace />;
  }

  const handleSubmit = async (data) => {
    setError("");
    try {
      if (isRevision) {
        await api.resubmitProfile(data);
      } else {
        await api.submitProfile(data);
      }
      setSuccess(true);
      // Refresh user data so status is updated
      await checkAuth();
      setTimeout(() => {
        navigate("/membership-pending");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to submit profile. Please try again.");
      throw err;
    }
  };

  const renderForm = () => {
    const initialData = isRevision ? profileData : undefined;

    switch (user.memberType) {
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
      case "OTHER":
      default:
        return (
          <ExpertProfileForm
            onSubmit={handleSubmit}
            initialData={initialData}
          />
        );
    }
  };

  const getMemberTypeLabel = () => {
    switch (user.memberType) {
      case "HOTEL_OWNER":
        return "Hotel Owner / Operator";
      case "VENDOR":
        return "Vendor / Service Provider";
      case "CONSULTANT":
        return "Consultant / Advisor";
      case "PROFESSIONAL":
        return "Industry Professional";
      case "OTHER":
        return "Industry Member";
      default:
        return "Member";
    }
  };

  const revisionNotes =
    profileData?.revisionNotes || profileData?.revisionNote || "";
  const flaggedFields = profileData?.flaggedFields || [];

  return (
    <Layout header={1} footer={1}>
      <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* Page Header */}
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                {/* Step Indicator */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: isRevision
                      ? "rgba(249, 115, 22, 0.08)"
                      : "rgba(198, 169, 98, 0.08)",
                    border: isRevision
                      ? "1px solid rgba(249, 115, 22, 0.25)"
                      : "1px solid rgba(198, 169, 98, 0.25)",
                    padding: "8px 20px",
                    marginBottom: "24px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: isRevision ? "#F97316" : "#C6A962",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {isRevision ? (
                    <>
                      <i
                        className="fas fa-edit"
                        style={{ fontSize: "14px" }}
                      ></i>
                      Revision Required
                    </>
                  ) : (
                    <>
                      <span
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: "#C6A962",
                          color: "#FFFFFF",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        2
                      </span>
                      Step 2 of 2
                    </>
                  )}
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
                  {isRevision
                    ? "Update Your Profile"
                    : "Complete Your Profile"}
                </h2>
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "16px",
                    maxWidth: "600px",
                    margin: "0 auto",
                    lineHeight: "1.6",
                  }}
                >
                  {isRevision ? (
                    <>
                      Welcome back,{" "}
                      <span style={{ fontWeight: 600, color: "#0A1628" }}>
                        {user.firstName}
                      </span>
                      . Please review the feedback from our team and update your
                      profile accordingly.
                    </>
                  ) : (
                    <>
                      Welcome,{" "}
                      <span style={{ fontWeight: 600, color: "#0A1628" }}>
                        {user.firstName}
                      </span>
                      . As a{" "}
                      <span style={{ fontWeight: 600, color: "#C6A962" }}>
                        {getMemberTypeLabel()}
                      </span>
                      , please complete your profile below so we can review your
                      application.
                    </>
                  )}
                </p>

                {/* Progress Bar - only show for new profiles */}
                {!isRevision && (
                  <div
                    style={{
                      maxWidth: "400px",
                      margin: "24px auto 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                        fontSize: "12px",
                        color: "#9CA3AF",
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ color: "#C6A962" }}>Account Created</span>
                      <span style={{ color: "#C6A962", fontWeight: 600 }}>
                        Profile Details
                      </span>
                    </div>
                    <div
                      style={{
                        height: "4px",
                        background: "#E2DDD5",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #C6A962 0%, #D4BC7C 100%)",
                          borderRadius: "2px",
                          transition: "width 0.5s ease",
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Revision Notes Banner */}
              {isRevision &&
                !loadingProfile &&
                (revisionNotes || flaggedFields.length > 0) && (
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
                  Profile submitted successfully! Redirecting...
                </div>
              )}

              {/* Loading existing profile for revision */}
              {isRevision && loadingProfile && (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <p style={{ color: "#6B7280", fontSize: "15px" }}>
                    Loading your profile data...
                  </p>
                </div>
              )}

              {/* Dynamic Form */}
              {!success && !(isRevision && loadingProfile) && renderForm()}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CompleteProfilePage;
