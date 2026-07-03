import { useEffect } from "react";
import AOS from "aos";

export const useAos = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      mirror: true,
      once: true,
      disable: "mobile",
    });
  }, []);
};
