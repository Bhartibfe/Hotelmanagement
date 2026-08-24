import React from "react";

// Placeholders that reserve a section's real height while its data loads, so
// the homepage settles in one step instead of jumping as each fetch returns.

const shimmer = (dark) => ({
  background: dark
    ? "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 37%, rgba(255,255,255,0.04) 63%)"
    : "linear-gradient(90deg, #EFEDE9 25%, #F7F6F3 37%, #EFEDE9 63%)",
  backgroundSize: "400% 100%",
  animation: "homeSkeletonShimmer 1.4s ease infinite",
});

export const SkeletonKeyframes = () => (
  <style>{`@keyframes homeSkeletonShimmer { 0% { background-position: 100% 50% } 100% { background-position: 0 50% } }`}</style>
);

export const SkeletonBlock = ({ height, width = "100%", radius = "4px", dark, style }) => (
  <div style={{ height, width, borderRadius: radius, ...shimmer(dark), ...style }} />
);

// Section header placeholder: eyebrow + heading + trailing button
export const SkeletonSectionHeader = ({ dark, centered }) => (
  <div
    className={centered ? "text-center" : ""}
    style={{ marginBottom: "36px", display: "flex", flexDirection: "column", alignItems: centered ? "center" : "flex-start", gap: "14px" }}
  >
    <SkeletonBlock height="12px" width="140px" dark={dark} />
    <SkeletonBlock height="38px" width={centered ? "320px" : "280px"} dark={dark} />
  </div>
);

export const SkeletonCards = ({ count = 4, columnClass = "col-lg-3 col-md-6", height = "300px", dark }) => (
  <div className="row">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={columnClass} style={{ marginBottom: "20px" }}>
        <SkeletonBlock height={height} dark={dark} />
      </div>
    ))}
  </div>
);

export const SkeletonRows = ({ count = 3, height = "104px", dark }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonBlock key={i} height={height} dark={dark} />
    ))}
  </div>
);

// Full section shell used while a homepage section is still loading
export const SectionSkeleton = ({ padding, background, dark, centered, children }) => (
  <section style={{ padding, background }}>
    <SkeletonKeyframes />
    <div className="container">
      <SkeletonSectionHeader dark={dark} centered={centered} />
      {children}
    </div>
  </section>
);
