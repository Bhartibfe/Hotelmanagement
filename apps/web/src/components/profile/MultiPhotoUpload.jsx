import React, { useRef, useState } from "react";
import { downscaleImage } from "../../lib/downscaleImage";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const MultiPhotoUpload = ({ value = [], onChange, label = "Photos", max = 10 }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [error, setError] = useState("");

  const photos = Array.isArray(value) ? value : [];

  const processFiles = (files) => {
    setError("");
    const remaining = max - photos.length;
    const allFiles = Array.from(files).slice(0, remaining);

    const invalidType = allFiles.find((f) => !ALLOWED_TYPES.includes(f.type));
    if (invalidType) {
      setError(`"${invalidType.name}" is not a supported image format. Use JPG, PNG, or WebP.`);
      return;
    }

    const tooLarge = allFiles.find((f) => f.size > MAX_FILE_SIZE);
    if (tooLarge) {
      setError(`"${tooLarge.name}" exceeds the 5MB size limit.`);
      return;
    }

    const toProcess = allFiles.filter((f) => ALLOWED_TYPES.includes(f.type) && f.size <= MAX_FILE_SIZE);
    if (toProcess.length === 0) return;

    /*
      Read and downscale each file, then add them in one go. Galleries are the
      easiest place to put tens of megabytes into the database by accident —
      several phone photos at once, each stored as base64.

      Promise.all rather than the previous counter so the order of the added
      photos matches the order they were picked in, regardless of which
      finishes decoding first.
    */
    Promise.all(
      toProcess.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = async () => resolve(await downscaleImage(reader.result, "photo"));
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
          })
      )
    ).then((results) => {
      const added = results.filter(Boolean);
      if (added.length > 0) onChange([...photos, ...added]);
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
  };

  const handleRemove = (index) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  // Drag to reorder
  const handleReorderStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleReorderOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const reordered = [...photos];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    onChange(reordered);
    setDragIndex(index);
  };

  const handleReorderEnd = () => {
    setDragIndex(null);
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 600,
          color: "#0A1628",
          marginBottom: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
        <span style={{ fontWeight: 400, textTransform: "none", color: "#9CA3AF", marginLeft: "8px", letterSpacing: 0 }}>
          ({photos.length}/{max})
        </span>
      </label>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
          {photos.map((photo, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleReorderStart(e, index)}
              onDragOver={(e) => handleReorderOver(e, index)}
              onDragEnd={handleReorderEnd}
              style={{
                width: "100px",
                height: "100px",
                position: "relative",
                borderRadius: "6px",
                overflow: "hidden",
                border: dragIndex === index ? "2px solid #C6A962" : "2px solid #E2DDD5",
                cursor: "grab",
                opacity: dragIndex === index ? 0.6 : 1,
                transition: "all 0.2s ease",
              }}
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.6)",
                  border: "none",
                  color: "#FFF",
                  fontSize: "11px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <i className="fas fa-times"></i>
              </button>
              {/* Order badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: "4px",
                  left: "4px",
                  background: "rgba(0,0,0,0.5)",
                  color: "#FFF",
                  fontSize: "9px",
                  fontWeight: 700,
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {index + 1}
              </div>
              {/* Drag handle */}
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  left: "4px",
                  background: "rgba(0,0,0,0.4)",
                  color: "#FFF",
                  fontSize: "9px",
                  padding: "2px 4px",
                  borderRadius: "3px",
                }}
              >
                <i className="fas fa-grip-vertical"></i>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      {photos.length < max && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragOver ? "#C6A962" : "#D1D5DB"}`,
            borderRadius: "8px",
            padding: "24px",
            textAlign: "center",
            cursor: "pointer",
            background: dragOver ? "rgba(198,169,98,0.05)" : "#FAFAFA",
            transition: "all 0.3s ease",
          }}
        >
          <i
            className="fas fa-cloud-upload-alt"
            style={{ fontSize: "24px", color: dragOver ? "#C6A962" : "#9CA3AF", marginBottom: "8px", display: "block" }}
          ></i>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 4px" }}>
            <strong style={{ color: "#C6A962" }}>Click to upload</strong> or drag & drop
          </p>
          <p style={{ fontSize: "11px", color: "#9CA3AF", margin: 0 }}>
            JPG, PNG or WebP. Max 5MB each. Up to {max} photos.
          </p>
        </div>
      )}

      {error && (
        <p style={{ fontSize: "12px", color: "#E53E3E", marginTop: "8px", marginBottom: 0, fontWeight: 600 }}>
          {error}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default MultiPhotoUpload;
