import { useEffect } from "react";

// The site header is position: fixed, so the page relies on a spacer div to
// push content clear of it. That spacer was a hard-coded 100px (70px on
// phones), which stopped matching the moment the top bar wrapped to two lines
// or the logo scaled — the first section of every page slid underneath.
//
// Measuring the header and publishing it as --header-height keeps the two in
// sync at any width, including mid-rotation.
export const useHeaderSpacer = () => {
  useEffect(() => {
    const header = document.querySelector("header.transparent-header");
    if (!header) return;

    const apply = () => {
      const { height } = header.getBoundingClientRect();
      if (height > 0) {
        document.documentElement.style.setProperty("--header-height", `${Math.round(height)}px`);
      }
    };

    apply();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", apply);
      window.addEventListener("orientationchange", apply);
      return () => {
        window.removeEventListener("resize", apply);
        window.removeEventListener("orientationchange", apply);
      };
    }

    const observer = new ResizeObserver(apply);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
};
