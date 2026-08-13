import React, { useState, useEffect } from "react";
import PostMediaUpload from "./PostMediaUpload";
import RichTextEditor from "./RichTextEditor";

const POST_TYPES = [
  { value: "GENERAL", label: "General" },
  { value: "HOTEL_UPDATE", label: "Hotel Update" },
  { value: "INDUSTRY_INSIGHT", label: "Industry Insight" },
  { value: "TECHNOLOGY_IMPLEMENTATION", label: "Technology" },
  { value: "BUSINESS_ANNOUNCEMENT", label: "Announcement" },
  { value: "HOSPITALITY_INNOVATION", label: "Innovation" },
  { value: "EVENT_UPDATE", label: "Event Update" },
];

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #E2DDD5",
  fontSize: "14px",
  outline: "none",
  background: "#FFFFFF",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#0A1628",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.3px",
};

const CreatePostForm = ({ onSubmit, initialData, isAdmin, onCancel }) => {
  const [title, setTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("GENERAL");
  const [imageValue, setImageValue] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setBrief(initialData.brief || "");
      setContent(initialData.content || "");
      setType(initialData.type || "GENERAL");
      setImageValue(initialData.mediaUrls?.[0] || "");
      setYoutubeUrl(initialData.youtubeUrl || "");
      setThumbnailUrl(initialData.thumbnailUrl || "");
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) { setError("Title is required."); return; }
    if (!brief.trim()) { setError("Brief description is required."); return; }
    if (!content.trim() || content === "<br>") { setError("Content is required."); return; }
    if (!imageValue && !youtubeUrl) { setError("Please upload an image or provide a YouTube URL."); return; }

    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        brief: brief.trim(),
        content,
        type,
        mediaUrls: imageValue ? [imageValue] : [],
        youtubeUrl: youtubeUrl || null,
        thumbnailUrl: thumbnailUrl || null,
      });
      // Reset form
      setTitle("");
      setBrief("");
      setContent("");
      setType("GENERAL");
      setImageValue("");
      setYoutubeUrl("");
      setThumbnailUrl("");
    } catch (err) {
      setError(err.message || "Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ padding: "12px 16px", marginBottom: "16px", background: "#FEF2F2", color: "#EF4444", border: "1px solid #FECACA", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {/* Media Upload */}
      <div style={{ marginBottom: "20px" }}>
        <PostMediaUpload
          imageValue={imageValue}
          youtubeUrl={youtubeUrl}
          thumbnailUrl={thumbnailUrl}
          onImageChange={(dataUrl) => { setImageValue(dataUrl); setYoutubeUrl(""); setThumbnailUrl(""); }}
          onYoutubeChange={(url, thumb) => { setYoutubeUrl(url); setThumbnailUrl(thumb); setImageValue(""); }}
          onClear={() => { setImageValue(""); setYoutubeUrl(""); setThumbnailUrl(""); }}
        />
      </div>

      {/* Title */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          style={inputStyle}
          maxLength={200}
        />
      </div>

      {/* Brief Description */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Brief Description *</label>
        <input
          type="text"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="A short summary of your post"
          style={inputStyle}
          maxLength={200}
        />
        <div style={{ textAlign: "right", fontSize: "12px", color: brief.length > 180 ? "#EF4444" : "#94A3B8", marginTop: "4px" }}>
          {brief.length}/200
        </div>
      </div>

      {/* Post Type */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Category</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          {POST_TYPES.map((pt) => (
            <option key={pt.value} value={pt.value}>{pt.label}</option>
          ))}
        </select>
      </div>

      {/* Long Description (Rich Text) */}
      <div style={{ marginBottom: "24px" }}>
        <RichTextEditor
          value={content}
          onChange={setContent}
          label="Full Description *"
          placeholder="Write your detailed content here... Use the toolbar for formatting."
          minHeight={200}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "12px 28px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              background: "none",
              color: "#64748B",
              border: "1px solid #E2DDD5",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "12px 32px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            background: saving ? "#D4C48A" : "#C6A962",
            color: "#0A1628",
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {saving && <i className="fas fa-circle-notch fa-spin" style={{ fontSize: "12px" }}></i>}
          {initialData ? "Update Post" : "Publish Post"}
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm;
