import React from "react";
import { HeaderSearch } from "./HeaderSearch";
import { MobileMenu } from "./MobileMenu";
import { NavMenus } from "./NavMenus";
import { LOGO_DARK, LOGO_LIGHT } from "../../lib/assets";
import { useStickyMenu } from "../../lib/hooks/useStickyMenu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const HeaderOne = () => {
  useStickyMenu();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="transparent-header">
      <div className="heder-top-wrap" style={{ background: "var(--tg-primary-color)" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="header-top-left">
                <ul className="list-wrap">
                  <li>
                    <i className="flaticon-location"></i>India's Premier
                    Hospitality Leadership Platform
                  </li>
                  <li>
                    <i className="flaticon-mail"></i>
                    <a href="mailto:connect@hotelsircle.in">
                      connect@hotelsircle.in
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="header-top-right">
                {user ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px" }}>
                    <span style={{ color: "#8DA4BE", fontSize: "13px" }}>
                      Welcome, <strong style={{ color: "#C6A962" }}>{user.firstName}</strong>
                    </span>
                    {isAdmin && (
                      <Link to="/admin" style={{ color: "#C6A962", fontSize: "12px", fontWeight: 600, textDecoration: "none", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                        Admin Panel
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="header-social">
                    <ul className="list-wrap">
                      <li>
                        <a href="#" aria-label="LinkedIn">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#" aria-label="Twitter">
                          <i className="fab fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#" aria-label="Instagram">
                          <i className="fab fa-instagram"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
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
                      <img src={LOGO_DARK} alt="Hotel Sircle" className="logo-dark" style={{ maxHeight: "45px" }} />
                      <img src={LOGO_LIGHT} alt="Hotel Sircle" className="logo-light" style={{ maxHeight: "45px", display: "none" }} />
                    </Link>
                  </div>

                  <NavMenus />

                  <div className="header-action d-none d-md-block">
                    <ul className="list-wrap">
                      <li className="header-search">
                        <a href="#">
                          <i className="flaticon-search"></i>
                        </a>
                      </li>
                      {user ? (
                        <>
                          <li className="header-btn" style={{ position: "relative" }}>
                            <Link
                              to={`/members/${user.id}`}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                textDecoration: "none",
                                padding: "8px 16px",
                              }}
                            >
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  background: "var(--tg-accent-color)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "var(--tg-primary-color)",
                                  fontWeight: 700,
                                  fontSize: "14px",
                                  fontFamily: "var(--tg-heading-font-family)",
                                }}
                              >
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                              </div>
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  color: "var(--tg-primary-color)",
                                }}
                              >
                                {user.firstName} {user.lastName}
                              </span>
                            </Link>
                          </li>
                          {isAdmin && (
                            <li className="header-btn">
                              <Link
                                to="/admin"
                                className="btn btn-two"
                                style={{ padding: "10px 18px", fontSize: "11px" }}
                              >
                                Admin
                              </Link>
                            </li>
                          )}
                          <li className="header-btn">
                            <button
                              onClick={handleLogout}
                              className="btn transparent-btn"
                              style={{
                                padding: "10px 18px",
                                fontSize: "11px",
                                cursor: "pointer",
                                border: "1px solid var(--tg-border-color)",
                                background: "transparent",
                                color: "var(--tg-body-font-color)",
                              }}
                            >
                              Logout
                            </button>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="header-btn">
                            <Link to="/login" className="btn transparent-btn header-signin-btn" style={{ marginRight: "10px", padding: "12px 20px", fontSize: "12px" }}>
                              Sign In
                            </Link>
                          </li>
                          <li className="header-btn">
                            <Link to="/register" className="btn header-join-btn" style={{ padding: "12px 20px", fontSize: "12px" }}>
                              Join Network
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </nav>
              </div>

              <MobileMenu />
            </div>
          </div>
        </div>
      </div>

      <HeaderSearch />
    </header>
  );
};
