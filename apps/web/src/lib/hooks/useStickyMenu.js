import { useEffect } from "react";
import $ from "jquery";

export const useStickyMenu = () => {
  useEffect(() => {
    const handleScroll = function () {
      var scroll = $(window).scrollTop();
      if (scroll < 50) {
        $("#sticky-header").removeClass("sticky-menu");
        $(".scroll-to-target").removeClass("open");
        $(".header-spacer").css("height", "");
      } else {
        $("#sticky-header").addClass("sticky-menu");
        $(".scroll-to-target").addClass("open");
        $(".header-spacer").css("height", "70px");
      }
    };
    $(window).on("scroll", handleScroll);
    return () => $(window).off("scroll", handleScroll);
  }, []);
};
