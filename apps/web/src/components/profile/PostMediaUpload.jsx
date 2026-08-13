import React, { useRef, useState } from "react";

const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

const TAB_STYLE = (active) => ({
  padding: "8px 20px",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  border: `1px solid ${active ? "#C6A962" : "#E2DDD5"}`,
  background: active ? "#C6A962" : "#FFFFFF",
  color: active ? "#0A1628" : "#64748B",
  cursor: "pointer",
  transition: "all 0.3s",
});

const PostMediaUpload = ({ imageValue, youtubeUrl, thumbnailUrl, onImageChange, onYoutubeChange, onClear }) => {
  const [mode, setMode] = useState(youtubeUrl ? "youtube" : "image");
  const [ytInput, setYtInput] = useState(youtubeUrl || "");
  const [ytError, setYtError] = useState("");
  const [imgError, setImgError] = useState("");
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowed.includes(file.type)) {
      setImgError("Only JPG, PNG, WebP, and GIF files are supported.");
      return;
    }
    if (file.size > maxSize) {
      setImgError("Image must be under 5MB.");
      return;
    }

    setImgError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      onImageChange(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleYoutubeInput = (val) => {
    setYtInput(val);
    setYtError("");
    if (!val.trim()) {
      onYoutubeChange("", "");
      return;
    }
    const videoId = extractYouTubeId(val.trim());
    if (videoId) {
      const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      onYoutubeChange(val.trim(), thumb);
    } else {
      setYtError("Invalid YouTube URL. Paste a link like youtube.com/watch?v=...");
      onYoutubeChange("", "");
    }
  };

  const handleClear = () => {
    setYtInput("");
    setYtError("");
    setImgError("");
    if (fileRef.current) fileRef.current.value = "";
    onClear();
  };

  const hasMedia = imageValue || thumbnailUrl;

  return (
    <div>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0A1628", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.3px" }}>
        Media *
      </label>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", marginBottom: "16px" }}>
        <button type="button" onClick={() => { setMode("image"); if (youtubeUrl) handleClear(); }} style={TAB_STYLE(mode === "image")}>
          <i className="fas fa-image" style={{ marginRight: "6px" }}></i> Upload Image
        </button>
        <button type="button" onClick={() => { setMode("youtube"); if (imageValue) handleClear(); }} style={TAB_STYLE(mode === "youtube")}>
          <i className="fab fa-youtube" style={{ marginRight: "6px" }}></i> YouTube URL
        </button>
      </div>

      {/* Image Upload */}
      {mode === "image" && (
        <div>
          {!imageValue ? (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width: "100%",
                height: "200px",
                border: "2px dashed #E2DDD5",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s",
                background: "#FAFAFA",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C6A962"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2DDD5"; }}
            >
              <i className="fas fa-cloud-upload-alt" style={{ fontSize: "32px", color: "#C6A962", marginBottom: "8px" }}></i>
              <span style={{ fontSize: "14px", color: "#64748B", fontWeight: 500 }}>Click to upload image</span>
              <span style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>JPG, PNG, WebP, GIF (max 5MB)</span>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <img src={imageValue} alt="Preview" style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }} />
              <button
                type="button"
                onClick={handleClear}
                style={{
                  position: "absolute", top: "8px", right: "8px",
                  background: "rgba(0,0,0,0.6)", color: "#FFFFFF", border: "none",
                  width: "28px", height: "28px", borderRadius: "50%",
                  cursor: "pointer", fontSize: "14px", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}
              >
                &times;
              </button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileChange} style={{ display: "none" }} />
          {imgError && <p style={{ color: "#EF4444", fontSize: "13px", marginTop: "6px" }}>{imgError}</p>}
        </div>
      )}

      {/* YouTube URL */}
      {mode === "youtube" && (
        <div>
          <input
            type="text"
            value={ytInput}
            onChange={(e) => handleYoutubeInput(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            style={{
              width: "100%",
              padding: "12px 14px",
              border: `1px solid ${ytError ? "#EF4444" : "#E2DDD5"}`,
              fontSize: "14px",
              outline: "none",
              background: "#FFFFFF",
            }}
          />
          {ytError && <p style={{ color: "#EF4444", fontSize: "13px", marginTop: "6px" }}>{ytError}</p>}
          {thumbnailUrl && !ytError && (
            <div style={{ position: "relative", marginTop: "12px" }}>
              <img src={thumbnailUrl} alt="YouTube Thumbnail" style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }} />
              {/* Play overlay */}
              <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: "56px", height: "56px", borderRadius: "50%",
                background: "rgba(0,0,0,0.6)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <i className="fas fa-play" style={{ color: "#FFFFFF", fontSize: "20px", marginLeft: "3px" }}></i>
              </div>
              <button
                type="button"
                onClick={handleClear}
                style={{
                  position: "absolute", top: "8px", right: "8px",
                  background: "rgba(0,0,0,0.6)", color: "#FFFFFF", border: "none",
                  width: "28px", height: "28px", borderRadius: "50%",
                  cursor: "pointer", fontSize: "14px", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}
              >
                &times;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostMediaUpload;
