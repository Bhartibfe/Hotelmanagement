// Shared styles for profile forms (ExpertProfileForm, HotelOwnerProfileForm, VendorProfileForm)

export const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  cursor: "pointer",
  background: "rgba(198, 169, 98, 0.04)",
  borderBottom: "1px solid rgba(198, 169, 98, 0.12)",
  userSelect: "none",
};

export const sectionTitleStyle = {
  fontSize: "13px",
  fontWeight: 700,
  color: "#0A1628",
  textTransform: "uppercase",
  letterSpacing: "1px",
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

export const sectionWrapperStyle = () => ({
  background: "#FFFFFF",
  borderRadius: "8px",
  border: "1px solid rgba(198, 169, 98, 0.15)",
  marginBottom: "16px",
  overflow: "hidden",
  transition: "all 0.3s ease",
});

export const sectionBodyStyle = {
  padding: "20px",
};

export const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #E2DDD5",
  borderRadius: "4px",
  fontSize: "14px",
  color: "#1F2937",
  background: "#FAFAF7",
  outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
};

export const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#0A1628",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

export const textareaStyle = {
  ...inputStyle,
  minHeight: "100px",
  resize: "vertical",
};

export const chevronStyle = (isOpen) => ({
  fontSize: "14px",
  color: "#C6A962",
  transition: "transform 0.3s ease",
  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
});

export const requiredStar = {
  color: "#C6A962",
  marginLeft: "2px",
};

export const tagStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  background: "rgba(198, 169, 98, 0.08)",
  border: "1px solid rgba(198, 169, 98, 0.2)",
  padding: "4px 10px",
  borderRadius: "4px",
  fontSize: "12px",
  color: "#0A1628",
};

// Accessibility helper for interactive non-button elements
export const interactiveProps = (handler) => ({
  role: "button",
  tabIndex: 0,
  onClick: handler,
  onKeyDown: (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler(e);
    }
  },
});
