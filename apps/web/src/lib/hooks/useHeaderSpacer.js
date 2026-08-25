import { useEffect } from "react";

// The site header is position: fixed, so the page relies on a spacer div to
// push content clear of it. That spacer was a hard-coded 100px (70px on
// phones), which stopped matching the moment the top bar wrapped to two lines
// or the logo scaled — the first section of every page slid underneath.
//
// Measuring keeps the two in sync at any width, including mid-rotation.
//
// It measures the header's two bands rather than the <header> itself: once
// useStickyMenu pins #sticky-header it goes position: fixed and leaves the
// flow, so the header element's own height collapses to just the top bar and
// the spacer would snap shorter mid-scroll. Summing the bands gives the height
// the header occupies unstuck, which is the amount the page has to reserve.
// The top bar is display: none on phones, so it contributes 0 there by itself.
const measure = (header) => {
  const topBar = header.querySelector(".heder-top-wrap");
  const menuBar = header.querySelector("#sticky-header");

  if (!menuBar) return header.getBoundingClientRect().height;

  return (topBar ? topBar.offsetHeight : 0) + menuBar.offsetHeight;
};

export const useHeaderSpacer = () => {
  useEffect(() => {
    const header = document.querySelector("header.transparent-header");
    if (!header) return;

    const apply = () => {
      const height = measure(header);
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

    const menuBar = header.querySelector("#sticky-header");
    if (menuBar) observer.observe(menuBar);

    return () => observer.disconnect();
  }, []);
};
