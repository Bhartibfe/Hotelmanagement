import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { Layout } from "../../layouts/Layout";

const MyProfilePage = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getMyProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (loading || loadingProfile) {
    return (
      <Layout header={1} footer={1}>
        <section style={{ padding: "100px 0", background: "#FFFFFF" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <p style={{ color: "#6B7280", fontSize: "16px" }}>
                  Loading profile...
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout header={1} footer={1} breadcrumb="My Profile" title="My Profile">
      <section style={{ padding: "80px 0", background: "#FFFFFF" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                style={{
                  border: "1px solid #E2DDD5",
                  padding: "48px 40px",
                  borderTop: "3px solid #C6A962",
                }}
              >
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

                {/* Profile Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "32px",
                    paddingBottom: "24px",
                    borderBottom: "1px solid #E2DDD5",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "rgba(198, 169, 98, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {profile && profile.photoUrl ? (
                      <img
                        src={profile.photoUrl}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <i
                        className="flaticon-user"
                        style={{ fontSize: "32px", color: "#C6A962" }}
                      ></i>
                    )}
                  </div>
                  <div>
                    <h2
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "28px",
                        fontWeight: 600,
                        color: "#0A1628",
                        marginBottom: "4px",
                      }}
                    >
                      {user.firstName} {user.lastName}
                    </h2>
                    <p
                      style={{
                        color: "#6B7280",
                        fontSize: "14px",
                        margin: 0,
                      }}
                    >
                      {user.memberType
                        ? user.memberType.replace(/_/g, " ")
                        : "Member"}
                    </p>
                  </div>
                </div>

                {/* Profile Status */}
                <div
                  style={{
                    background: "#F8FAFC",
                    padding: "16px 20px",
                    marginBottom: "24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#0A1628",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Membership Status
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      padding: "4px 12px",
                      background:
                        user.membershipStatus === "APPROVED"
                          ? "#F0FDF4"
                          : "#FFFBEB",
                      color:
                        user.membershipStatus === "APPROVED"
                          ? "#166534"
                          : "#92400E",
                      border: `1px solid ${user.membershipStatus === "APPROVED" ? "#86EFAC" : "#FDE68A"}`,
                    }}
                  >
                    {user.membershipStatus || "PENDING"}
                  </span>
                </div>

                {/* Profile Data Placeholder */}
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <p style={{ color: "#9CA3AF", fontSize: "15px" }}>
                    Full profile view coming soon. Your profile data is saved and
                    under review.
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

export default MyProfilePage;
