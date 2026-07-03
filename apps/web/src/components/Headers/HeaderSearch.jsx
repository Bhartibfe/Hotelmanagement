import React, { useEffect } from "react";
import $ from "jquery";

export const HeaderSearch = () => {
  // search
  useEffect(() => {
    $(".header-search > a").on("click", function () {
      $(".search-popup-wrap").slideToggle();
      return false;
    });

    $(".search-close").on("click", function () {
      $(".search-popup-wrap").slideUp(500);
    });
  }, []);

  return (
    <div
      className="search-popup-wrap"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div className="search-close">
        <span>
          <i className="fas fa-times"></i>
        </span>
      </div>
      <div className="search-wrap text-center">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="title">... Search Here ...</h2>
              <div className="search-form">
                <form action="#">
                  <input
                    type="text"
                    name="search"
                    placeholder="Type keywords here"
                  />
                  <button className="search-btn">
                    <i className="fas fa-search"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
