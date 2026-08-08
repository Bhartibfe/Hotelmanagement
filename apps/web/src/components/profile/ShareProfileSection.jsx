import React, { useState } from "react";
import api from "../../services/api";

const ShareProfileSection = () => {
  const [shareUrl, setShareUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateLink = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.createShareToken(email || undefined);
      setShareUrl(data.shareUrl);
    } catch (err) {
      setError(err.message || "Failed to generate share link");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent("Please fill my profile on HospitalityNetwork");
    const body = encodeURIComponent(
      `Hi,\n\nI'd like you to help fill my profile on the Hospitality Network. Please use this link:\n\n${shareUrl}\n\nThank you!`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_self");
  };

  return (
    <div
      style={{
        background: "#F8FAFC",
        border: "1px solid #E2DDD5",
        padding: "24px",
        marginBottom: "32px",
      }}
    >
      <h4
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "20px",
          fontWeight: 600,
          color: "#0A1628",
          marginBottom: "8px",
        }}
      >
        Share This Form
      </h4>
      <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "16px" }}>
        Generate a link to share this form with someone who can fill it on your behalf.
      </p>

      {error && (
        <div
          style={{
            background: "#FEE2E2",
            color: "#C53030",
            padding: "10px 14px",
            marginBottom: "12px",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      {!shareUrl ? (
        <div>
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#0A1628",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Recipient Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #E2DDD5",
                fontSize: "14px",
                outline: "none",
                fontFamily: "var(--tg-body-font-family)",
              }}
            />
          </div>
          <button
            onClick={handleGenerateLink}
            disabled={loading}
            style={{
              background: "#C6A962",
              color: "#FFFFFF",
              border: "none",
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "1px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Generating..." : "Generate Shareable Link"}
          </button>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <input
              type="text"
              value={shareUrl}
              readOnly
              style={{
                flex: 1,
                padding: "10px 14px",
                border: "1px solid #E2DDD5",
                fontSize: "13px",
                background: "#FFFFFF",
                fontFamily: "monospace",
                outline: "none",
              }}
            />
            <button
              onClick={handleCopy}
              style={{
                background: copied ? "#10B981" : "#0A1628",
                color: "#FFFFFF",
                border: "none",
                padding: "10px 16px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {email && (
            <button
              onClick={handleEmailShare}
              style={{
                background: "transparent",
                color: "#C6A962",
                border: "1px solid #C6A962",
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.5px",
              }}
            >
              Send via Email to {email}
            </button>
          )}

          <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "10px", marginBottom: 0 }}>
            This link expires in 7 days. Only one person can use it.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShareProfileSection;
