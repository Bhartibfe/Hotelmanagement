import { useEffect } from "react";
import WOW from "wow.js";

export const useWow = () => {
  useEffect(() => {
    const wow = new WOW({
      boxClass: "wow",
      animateClass: "animated",
      offset: 0,
      mobile: false,
      live: true,
    });
    wow.init();
  }, []);
};
