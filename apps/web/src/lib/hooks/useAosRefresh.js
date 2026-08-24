import { useEffect } from "react";
import AOS from "aos";

// AOS measures elements once, at init. Sections that render after their data
// arrives are invisible to it until something forces a re-scan, which is what
// makes late content pop in (or stay hidden) as the page loads.
export const useAosRefresh = (ready) => {
  useEffect(() => {
    if (!ready) return;
    const id = window.requestAnimationFrame(() => {
      if (typeof AOS.refreshHard === "function") AOS.refreshHard();
    });
    return () => window.cancelAnimationFrame(id);
  }, [ready]);
};
