// Partner categories used to be the Postgres enum MarketplaceCategory, so every
// screen carried its own SCREAMING_CASE list plus a label map to render it.
// They are admin-managed free text now — edited in Admin -> Homepage and served
// in the homepage config as `categoryOptions`, exactly like `expertiseOptions`
// for experts — so the stored value IS the label and no lookup is needed.
//
// This list is only the seed and the offline fallback: it matches what the
// enum's members were renamed to in migration 20260826_vendor_category_to_text,
// so a database that has migrated but whose config has never been saved still
// filters correctly.
export const DEFAULT_VENDOR_CATEGORIES = [
  "Technology",
  "Architecture",
  "Interior Design",
  "HVAC",
  "Procurement",
  "Security",
  "Marketing",
  "Recruitment",
  "Consulting",
  "Legal",
  "Finance",
];

// Category colours can no longer be a fixed map, because an admin can add a
// category this code has never seen. Known ones keep the exact colour they had
// as enum members; anything new gets a stable colour derived from its name, so
// it looks deliberate and does not change between renders or reloads.
const KNOWN_COLORS = {
  Technology: "#2563EB",
  Architecture: "#7C3AED",
  "Interior Design": "#DB2777",
  HVAC: "#059669",
  Procurement: "#D97706",
  Security: "#DC2626",
  Marketing: "#8B5CF6",
  Recruitment: "#0891B2",
  Consulting: "#1A365D",
  Legal: "#6B7280",
  Finance: "#276749",
};

const PALETTE = [
  "#2563EB", "#7C3AED", "#DB2777", "#059669", "#D97706",
  "#DC2626", "#8B5CF6", "#0891B2", "#1A365D", "#276749",
];

export const categoryColor = (category) => {
  if (!category) return "#C6A962";
  if (KNOWN_COLORS[category]) return KNOWN_COLORS[category];

  let hash = 0;
  for (let i = 0; i < category.length; i += 1) {
    hash = (hash * 31 + category.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

// Rows written before the migration, or by a direct database edit, may still
// hold an old enum member. Map those to the label the migration renamed them
// to. An exact map rather than a de-SCREAMING_CASE helper, because "HVAC" is
// both a legacy member and a valid present-day label — a generic rule would
// render it "Hvac".
const LEGACY_ENUM_LABELS = {
  TECHNOLOGY: "Technology",
  ARCHITECTURE: "Architecture",
  INTERIOR_DESIGN: "Interior Design",
  HVAC: "HVAC",
  PROCUREMENT: "Procurement",
  SECURITY: "Security",
  MARKETING: "Marketing",
  RECRUITMENT: "Recruitment",
  CONSULTING: "Consulting",
  LEGAL: "Legal",
  FINANCE: "Finance",
};

export const categoryLabel = (category) =>
  category ? LEGACY_ENUM_LABELS[category] || category : "";

// AdminVendors renders categories as tinted chips rather than a solid accent,
// so it needs a background too. Derived from the same colour so an
// admin-added category gets a chip that matches the rest without a second map.
export const categoryChip = (category) => {
  const color = categoryColor(category);
  return { bg: `${color}15`, color };
};
