import React, { useEffect } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import { LOGO } from "../../lib/assets";

export const Sidebar = () => {
  useEffect(() => {
    $(".menu-tigger").on("click", function () {
      $(".extra-info,.offcanvas-overly").addClass("active");
      return false;
    });
    $(".menu-close,.offcanvas-overly").on("click", function () {
      $(".extra-info,.offcanvas-overly").removeClass("active");
    });
  }, []);

  return (
    <>
      <div className="extra-info">
        <div className="close-icon menu-close">
          <button>
            <i className="far fa-window-close"></i>
          </button>
        </div>
        <div className="logo-side mb-30">
          <Link to="/">
            <img src={LOGO} alt="Logo" />
          </Link>
        </div>
        <div className="side-info mb-30">
          <div className="contact-list mb-30">
            <h4>Office Address</h4>
            <p>
              123/A, Miranda City Likaoli <br />
              Prikano, Dope
            </p>
          </div>
          <div className="contact-list mb-30">
            <h4>Phone Number</h4>
            <p>+0989 7876 9865 9</p>
            <p>+(090) 8765 86543 85</p>
          </div>
          <div className="contact-list mb-30">
            <h4>Email Address</h4>
            <p>info@example.com</p>
            <p>example.mail@hum.com</p>
          </div>
        </div>
        <ul className="side-instagram list-wrap">
          <li>
            <a href="#">
              <img src="assets/img/images/sb_insta01.jpg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src="assets/img/images/sb_insta02.jpg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src="assets/img/images/sb_insta03.jpg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src="assets/img/images/sb_insta04.jpg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src="assets/img/images/sb_insta05.jpg" alt="" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src="assets/img/images/sb_insta06.jpg" alt="" />
            </a>
          </li>
        </ul>
        <div className="social-icon-right mt-30">
          <a href="#">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#">
            <i className="fab fa-google-plus-g"></i>
          </a>
          <a href="#">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
      <div className="offcanvas-overly"></div>
    </>
  );
};
