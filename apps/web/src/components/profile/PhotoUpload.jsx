import React, { useRef } from "react";

const PhotoUpload = ({ value, onChange, label = "Profile Photo" }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
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
          <p
            style={{
              fontSize: "11px",
              color: "#9CA3AF",
              marginTop: "8px",
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
    </div>
  );
};

export default PhotoUpload;
