import React from "react";
import { Link, useLocation } from "react-router-dom";
import cn from "classnames";
import { NAV_LINKS, isNavLinkActive } from "./navLinks";

export const NavMenus = () => {
  const { pathname } = useLocation();

  return (
    <div className="navbar-wrap main-menu d-none d-lg-flex">
      <ul className="navigation">
        {NAV_LINKS.map((link) => (
          <li key={link.to} className={cn({ active: isNavLinkActive(link.to, pathname) })}>
            <Link to={link.to}>{link.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
