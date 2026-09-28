/*
  The site's own public origin.

  Always from configuration, never from req.get("host"): a Host header is
  attacker-controlled, and anything built from it — sitemap entries, canonical
  URLs, emailed links — inherits whatever the caller sent. It is also simply
  wrong on internal traffic, where the Host is a health check or 127.0.0.1.

  The fallback is production rather than localhost on purpose. A missing env
  var must never put "http://localhost:3000" into a file Google reads or an
  email a member clicks.

  Note there are two variables that have to agree: SITE_URL here (read at
  runtime by the API) and REACT_APP_SITE_URL in the web build (inlined by CRA
  at build time). See .env.example.
*/
export const siteUrl = (): string =>
  (process.env.SITE_URL || process.env.FRONTEND_URL || "https://www.hotelsircle.com")
    .trim()
    .replace(/\/+$/, "");
