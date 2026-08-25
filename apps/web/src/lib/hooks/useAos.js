import { useEffect } from "react";
import AOS from "aos";

// AOS must stay enabled on every viewport, even though we do not want the
// animations to play on phones.
//
// Its own `disable: "mobile"` option is a trap here: when AOS decides it is
// disabled it strips [data-aos] off the elements that happen to be in the DOM
// at init time and then returns early — before it registers the MutationObserver
// that would pick up anything rendered later. Every route in this app is
// React.lazy and every section waits on an API call, so on a phone virtually
// nothing existed yet at init. Those later elements kept their data-aos
// attribute, never got the .aos-animate class, and stayed pinned at the
// `opacity: 0` that aos.css sets — the whole site rendered blank.
//
// So: let AOS run, and let the `[data-aos]` guard in mobile.css hold the
// content visible on small screens instead of relying on AOS's own opt-out.
export const useAos = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      mirror: true,
      once: true,
    });
  }, []);
};
