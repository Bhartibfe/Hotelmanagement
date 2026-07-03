import React from "react";
import { scrollToTop } from "../../lib/helpers";

export const ScrollToTopButton = () => {
  return (
    <button
      className="scroll-top scroll-to-target"
      data-target="html"
      onClick={scrollToTop}
    >
      <i className="fas fa-angle-up"></i>
    </button>
  );
};
