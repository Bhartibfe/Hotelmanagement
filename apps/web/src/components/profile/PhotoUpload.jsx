import React, { useRef, useState } from "react";
import ImageCropper from "./ImageCropper";
import { downscaleImage } from "../../lib/downscaleImage";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/*
  `crop` is opt-in rather than the default. It squares the image off through
  ImageCropper, which is right for a person's photo — every one of those is
  shown in a circle — and wrong for a company logo, which must not be cropped
  at all. Opting in per call site means a logo field added later cannot
  accidentally inherit a circular crop.
*/
const PhotoUpload = ({ value, onChange, label = "Profile Photo", crop = false }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  // The image handed to the cropper: a freshly picked file, or the stored
  // photo when someone reopens it to re-frame what is already saved.
  const [cropping, setCropping] = useState(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be under 5MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      // With cropping on, the file is only a starting point — what gets saved
      // is the square the cropper returns, already downscaled by it.
      if (crop) setCropping(reader.result);
      // Without it (logos), still cap the size: a multi-megabyte logo is
      // stored as base64 and dragged across the wire on every request.
      else onChange(await downscaleImage(reader.result, "logo"));
    };
    reader.onerror = () => setError("That file could not be read. Try selecting it again.");
    reader.readAsDataURL(file);

    // Cleared so re-picking the same file still fires a change event.
    e.target.value = "";
  };

  const handleCropConfirm = (cropped) => {
    setCropping(null);
    onChange(cropped);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Circular Preview */}
        <div
          onClick={handleClick}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            border: "2px dashed #C6A962",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            overflow: "hidden",
            background: value ? "transparent" : "rgba(198, 169, 98, 0.05)",
            transition: "all 0.3s ease",
            flexShrink: 0,
          }}
        >
          {value ? (
            <img
              src={value}
              alt="Profile preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            <div style={{ textAlign: "center" }}>
              <i
                className="fas fa-camera"
                style={{
                  fontSize: "28px",
                  color: "#C6A962",
                  display: "block",
                  marginBottom: "6px",
                }}
              ></i>
              <span
                style={{
                  fontSize: "10px",
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontWeight: 600,
                }}
              >
                Upload
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div>
          <button
            type="button"
            onClick={handleClick}
            style={{
              display: "block",
              background: "none",
              border: "1px solid #C6A962",
              color: "#C6A962",
              padding: "8px 20px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
              marginBottom: "8px",
            }}
          >
            <i className="fas fa-upload" style={{ marginRight: "6px" }}></i>
            {value ? "Change Photo" : "Select Photo"}
          </button>

          {/* Re-frames the photo already saved, without needing the original
              file again — this is how existing photos get fixed. */}
          {crop && value && (
            <button
              type="button"
              onClick={() => setCropping(value)}
              style={{
                display: "block",
                background: "none",
                border: "1px solid #0A1628",
                color: "#0A1628",
                padding: "8px 20px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
                marginBottom: "8px",
              }}
            >
              <i className="fas fa-crop-simple" style={{ marginRight: "6px" }}></i>
              Adjust
            </button>
          )}

          {value && (
            <button
              type="button"
              onClick={handleRemove}
              style={{
                display: "block",
                background: "none",
                border: "1px solid #E53E3E",
                color: "#E53E3E",
                padding: "6px 20px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <i className="fas fa-times" style={{ marginRight: "4px" }}></i>
              Remove
            </button>
          )}
          {error && (
            <p style={{ fontSize: "11px", color: "#E53E3E", marginTop: "8px", marginBottom: 0, fontWeight: 600 }}>
              {error}
            </p>
          )}
          <p
            style={{
              fontSize: "11px",
              color: "#9CA3AF",
              marginTop: error ? "4px" : "8px",
              marginBottom: 0,
            }}
          >
            JPG, PNG or WebP. Max 5MB.
          </p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {cropping && (
        <ImageCropper
          src={cropping}
          title={label}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropping(null)}
        />
      )}
    </div>
  );
};

export default PhotoUpload;
