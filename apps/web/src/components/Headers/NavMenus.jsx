import React from "react";
import { Link, useLocation } from "react-router-dom";
import cn from "classnames";

export const NavMenus = () => {
  const { pathname } = useLocation();

  const navLinks = [
    { to: "/", title: "Home" },
    { to: "/about", title: "About" },
    { to: "/members", title: "Members" },
    { to: "/vendors", title: "Vendors" },
    { to: "/experts", title: "Experts" },
    { to: "/events", title: "Events" },
    { to: "/feed", title: "Feed" },
    { to: "/contact", title: "Contact" },
  ];

  return (
    <div className="navbar-wrap main-menu d-none d-lg-flex">
      <ul className="navigation">
        {navLinks.map((link) => (
          <li
            key={link.to}
            className={cn({
              active:
                link.to === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.to),
            })}
          >
            <Link to={link.to}>{link.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
