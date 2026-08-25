import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import cn from "classnames";
import { LOGO } from "../../lib/assets";
import { useAuth } from "../../contexts/AuthContext";
import { SOCIAL_LINKS, externalLinkProps } from "../../lib/socialLinks";
import { NAV_LINKS, isNavLinkActive } from "./navLinks";

// This used to clone the desktop <ul> with jQuery's .html() and append it here.
// The clone produced plain <a href> tags, so every tap on a phone did a full
// document reload of the SPA, and nothing ever removed
// body.mobile-menu-visible — which also locks body scrolling. Rendering the
// same list in React fixes both and lets the drawer carry the sign-in actions
// that .header-action hides below 992px.
export const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const close = useCallback(() => setOpen(false), []);

  // The toggler button lives in each header component, so listen for it on the
  // document instead of threading state through six of them.
  useEffect(() => {
    const onDocumentClick = (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".mobile-nav-toggler")) {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  // Close on navigation — otherwise the drawer stays over the page it just
  // navigated to, with body scroll still locked.
  useEffect(close, [pathname, close]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  // Both elements: <html> carries the mobile overflow-x rule, which stops
  // <body>'s overflow from propagating to the viewport, so locking body alone
  // would leave the page scrolling behind the open drawer.
  useEffect(() => {
    const roots = [document.documentElement, document.body];
    roots.forEach((el) => el.classList.toggle("mobile-menu-visible", open));
    return () => roots.forEach((el) => el.classList.remove("mobile-menu-visible"));
  }, [open]);

  const handleLogout = () => {
    close();
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="mobile-menu" aria-hidden={!open}>
        <nav className="menu-box">
          <div className="close-btn" onClick={close} role="button" tabIndex={0} aria-label="Close menu">
            <i className="fas fa-times"></i>
          </div>
          <div className="nav-logo">
            <Link to="/" onClick={close}>
              <img src={LOGO} alt="Hotel Sircle" />
            </Link>
          </div>

          <div className="menu-outer">
            <ul className="navigation">
              {NAV_LINKS.map((link) => (
                <li key={link.to} className={cn({ current: isNavLinkActive(link.to, pathname) })}>
                  <Link to={link.to} onClick={close}>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {user ? (
            <>
              <div className="mobile-auth-user">
                <div className="mobile-auth-avatar">
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: "block", fontSize: "14px", color: "#0A1628" }}>
                    {user.firstName} {user.lastName}
                  </strong>
                  <span style={{ fontSize: "12px", color: "#7B8FAB" }}>
                    {isAdmin ? "Administrator" : "Member"}
                  </span>
                </div>
              </div>
              <div className="mobile-auth-actions">
                <Link to="/my-profile" className="btn transparent-btn" onClick={close}>
                  My Profile
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="btn btn-two" onClick={close}>
                    Admin Panel
                  </Link>
                )}
                <button type="button" className="btn transparent-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="mobile-auth-actions">
              <Link to="/login" className="btn transparent-btn" onClick={close}>
                Sign In
              </Link>
              <Link to="/register" className="btn" onClick={close}>
                Join Network
              </Link>
            </div>
          )}

          <div className="social-links">
            <ul className="clearfix list-wrap">
              <li>
                <a href="#" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
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
              <li>
                <a href={SOCIAL_LINKS.linkedin} aria-label="LinkedIn" {...externalLinkProps}>
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </li>
              <li>
                <a href="#" aria-label="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="menu-backdrop" onClick={close}></div>
    </>
  );
};
