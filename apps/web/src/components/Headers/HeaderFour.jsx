import React from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { HeaderSearch } from "./HeaderSearch";
import { LOGO } from "../../lib/assets";
import { MobileMenu } from "./MobileMenu";
import { NavMenus } from "./NavMenus";
import { useStickyMenu } from "../../lib/hooks/useStickyMenu";

export const HeaderFour = () => {
  // menu sticky
  useStickyMenu();

  return (
    <>
      <div id="header-fixed-height"></div>

      <header className="header-style-four">
        <div className="heder-top-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <div className="header-top-left">
                  <ul className="list-wrap">
                    <li>
                      <i className="flaticon-location"></i>256 Avenue, Mark
                      Street, Newyork City
                    </li>
                    <li>
                      <i className="flaticon-mail"></i>
                      <a href="mailto:gerow@gmail.com">gerow@gmail.com</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="header-top-right">
                  <div className="header-social">
                    <ul className="list-wrap">
                      <li>
                        <a href="#">
                          <i className="fab fa-facebook-f"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-instagram"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-pinterest-p"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="header-top-btn">
                    <Link to="/contact">
                      <i className="flaticon-briefcase"></i>Get a Quote
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="sticky-header" className="menu-area">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="mobile-nav-toggler">
                  <i className="fas fa-bars"></i>
                </div>
                <div className="menu-wrap">
                  <nav className="menu-nav">
                    <div className="logo">
                      <Link to="/">
                        <img src={LOGO} alt="Logo" />
                      </Link>
                    </div>

                    {/* nav links */}
                    <NavMenus />

                    <div className="header-action">
                      <ul className="list-wrap">
                        <li className="header-search">
                          <a href="#">
                            <i className="flaticon-search"></i>
                          </a>
                        </li>
                        <li className="offcanvas-menu offcanvas-menu-two">
                          <a href="#" className="menu-tigger">
                            <span></span>
                            <span></span>
                            <span></span>
                          </a>
                        </li>
                        <li className="header-contact-two">
                          <div className="icon">
                            <i className="flaticon-phone-call"></i>
                          </div>
                          <div className="content">
                            <span>Hot Line Number</span>
                            <a href="tel:0123456789">+123 8989 444</a>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>

                {/* Mobile Menu  */}
                <MobileMenu />
              </div>
            </div>
          </div>
        </div>

        {/* header-search */}
        <HeaderSearch />

        {/* sidebar */}
        <Sidebar />
      </header>
    </>
  );
};
