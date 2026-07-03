import { useEffect } from "react";
import { jarallax } from "jarallax";

export const useJarallax = () => {
  useEffect(() => {
    jarallax(document.querySelectorAll(".jarallax"), {
      speed: 0.2,
    });
  }, []);
};
