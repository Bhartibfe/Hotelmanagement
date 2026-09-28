import React from "react";
import { Helmet } from "react-helmet-async";

/*
  Per-page title, description, canonical URL and social tags.

  Before this existed every route on the site served the single <title> and
  <meta description> baked into public/index.html, so Google saw forty-odd
  pages that all claimed to be the homepage and every member profile competed
  with every other one under the same name.

  Render it as a sibling ABOVE <Layout>, not through Layout itself. Pages pass
  Layout a `title` prop that Layout never reads, and those values ("Member
  Profile", "Blog Details") are page-type labels rather than page titles —
  wiring them in would ship the same title for every member on the site, and it
  would look like it was working. Layout also renders on the loading and error
  branches, and admin pages use AdminLayout, so routing SEO through it would
  leave them no way to opt out.
*/

const SITE_NAME = "Hotel Sircle";
const DEFAULT_DESCRIPTION =
  "A closed, owners-only network for hotel promoters, founders & chairmen. Stronger Together. Better Results.";
const DESCRIPTION_LIMIT = 155;

/*
  CRA inlines REACT_APP_* at build time, so this must be set in the server's
  .env BEFORE `npm run build`. It falls back to the browser's own origin, which
  is correct in production — which is exactly why a missing value is invisible.
  It has to agree with SITE_URL on the API (see apps/api/src/utils/siteUrl.ts).
*/
const origin = () =>
  process.env.REACT_APP_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "https://www.hotelsircle.com");

const absolute = (value) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `${origin().replace(/\/+$/, "")}${value.startsWith("/") ? "" : "/"}${value}`;
};

// Search results cut off around 160 characters. Trim at a word so the snippet
// does not end mid-word before Google's own ellipsis.
const clamp = (text, limit = DESCRIPTION_LIMIT) => {
  if (!text) return "";
  const flat = String(text).replace(/\s+/g, " ").trim();
  if (flat.length <= limit) return flat;
  const cut = flat.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
};

export const Seo = ({
  title,
  description,
  canonical,
  image,
  type = "website",
  noindex = false,
  appendSiteName = true,
  jsonLd,
}) => {
  const fullTitle = title
    ? appendSiteName
      ? `${title} | ${SITE_NAME}`
      : title
    : SITE_NAME;
  const desc = clamp(description) || DEFAULT_DESCRIPTION;
  const url = absolute(canonical);
  const img = absolute(image);
  const structured = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {url && <link rel="canonical" href={url} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {img && <meta property="og:image" content={img} />}

      <meta name="twitter:card" content={img ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {img && <meta name="twitter:image" content={img} />}

      {structured.map((entry, index) => (
        <script type="application/ld+json" key={index}>
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
