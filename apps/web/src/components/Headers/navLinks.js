// Single source for the primary navigation, shared by the desktop bar and the
// mobile drawer so the two can never drift apart.
export const NAV_LINKS = [
  { to: "/about", title: "About" },
  { to: "/advisory", title: "Advisory" },
  { to: "/members", title: "Owners" },
  { to: "/experts", title: "Experts" },
  { to: "/hospitality-partners", title: "Partners" },
  { to: "/events", title: "Events" },
  // Feed is hidden from the navigation for now. The /feed route itself is
  // still live, so anything already linking to it keeps working — uncomment
  // this line to put it back in the bar and the mobile drawer.
  // { to: "/feed", title: "Feed" },
  { to: "/contact", title: "Contact" },
];

export const isNavLinkActive = (to, pathname) =>
  to === "/" ? pathname === "/" : pathname.startsWith(to);
