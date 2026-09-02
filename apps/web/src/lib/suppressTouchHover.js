/*=============================
  suppressTouchHover
  -----------------------------
  Almost every card on this site drives its hover look from React state set by
  onMouseEnter / onMouseLeave. On a phone that is a trap: tapping a card emits
  a compatibility `mouseover` before the click, React turns that into
  onMouseEnter, and the card latches into its hover state — lifted, glowing,
  gold-bordered — with no pointer ever leaving to switch it back off. Scroll
  the list and half the cards are stuck looking pressed.

  Rather than gate seventy call sites individually, swallow the mouse events at
  the document during the capture phase, before React's root listener sees
  them. Only on devices that report no hover capability at all, so a mouse — or
  a touchscreen laptop being used with one — is untouched.

  Click, focus and touch events are deliberately left alone: those are the ones
  that actually navigate.
===============================*/

const HOVER_EVENTS = ["mouseover", "mouseout", "mouseenter", "mouseleave", "mousemove"];

export const suppressTouchHover = () => {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};

  const query = window.matchMedia("(hover: none)");
  let attached = false;

  // Capture phase + stopPropagation, not preventDefault: preventing the
  // default on `mouseover` would also cancel the click that follows it.
  const swallow = (event) => {
    if (event.isTrusted) event.stopPropagation();
  };

  const attach = () => {
    if (attached) return;
    HOVER_EVENTS.forEach((name) => document.addEventListener(name, swallow, true));
    attached = true;
  };

  const detach = () => {
    if (!attached) return;
    HOVER_EVENTS.forEach((name) => document.removeEventListener(name, swallow, true));
    attached = false;
  };

  const sync = () => (query.matches ? attach() : detach());
  sync();

  // Plugging in a mouse, or rotating a hybrid device, flips this at runtime.
  if (query.addEventListener) query.addEventListener("change", sync);
  else query.addListener(sync);

  return () => {
    detach();
    if (query.removeEventListener) query.removeEventListener("change", sync);
    else query.removeListener(sync);
  };
};
