import { useEffect } from "react";
import $ from "jquery";

export const useStickyMenu = () => {
  useEffect(() => {
    const handleScroll = function () {
      var scroll = $(window).scrollTop();
      // The spacer's height is owned by useHeaderSpacer via --header-height.
      // Writing an inline height here would override it and drop the page by
      // however much the real header differs from 70px.
      if (scroll < 50) {
        $("#sticky-header").removeClass("sticky-menu");
        $(".scroll-to-target").removeClass("open");
      } else {
        $("#sticky-header").addClass("sticky-menu");
        $(".scroll-to-target").addClass("open");
      }
    };
    $(window).on("scroll", handleScroll);
    return () => $(window).off("scroll", handleScroll);
  }, []);
};
