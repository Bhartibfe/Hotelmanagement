import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { siteUrl } from "../utils/siteUrl";
import { ensureUserSlug } from "../utils/profileSlug";

/*
  Search-engine plumbing. Mounted at the root rather than under /api, because
  both of these are addresses the outside world holds:

    GET /sitemap.xml                     — proxied straight through by nginx
    GET /_seo/legacy-profile/:kind/:id   — nginx sends every cuid-shaped
                                           profile URL here so the id can be
                                           301'd to its slug

  The sitemap is generated from the database rather than crawled. This site is
  a client-rendered SPA: the HTML a crawler downloads is an empty #root div
  with no links in it, so no external generator can discover these pages.
*/

const router = Router();

const CUID = /^c[a-z0-9]{20,30}$/;
const PROFILE_KINDS = ["members", "experts", "advisory"] as const;
type ProfileKind = (typeof PROFILE_KINDS)[number];

const isProfileKind = (value: string): value is ProfileKind =>
  (PROFILE_KINDS as readonly string[]).includes(value);

const PUBLIC_USER = { isActive: true, membershipStatus: "APPROVED" } as const;

// ─── id → slug, as a real 301 ────────────────────────────────────────────────

/*
  nginx only proxies URLs whose last segment is cuid-shaped, so a slug URL
  never reaches this handler — but it revalidates anyway. A route that relies
  on the web server in front of it for correctness is one config edit away from
  being wrong.

  A miss answers 404, which nginx turns back into the SPA, so an unknown or
  deleted id behaves exactly as it did before slugs existed.
*/
router.get("/_seo/legacy-profile/:kind/:id", async (req: Request, res: Response) => {
  try {
    const { kind, id } = req.params;
    if (!isProfileKind(kind) || !CUID.test(id)) {
      return res.status(404).end();
    }

    let userId: string | null = null;
    let slug: string | null = null;

    if (kind === "members") {
      // Mirrors the visibility filter on GET /api/users/:idOrSlug exactly: a
      // suspended member's old URL must not redirect to a page the API then
      // refuses to serve.
      const user = await prisma.user.findFirst({
        where: { id, ...PUBLIC_USER },
        select: { id: true, slug: true },
      });
      userId = user?.id ?? null;
      slug = user?.slug ?? null;
    } else {
      const expert = await prisma.industryExpert.findFirst({
        where: {
          id,
          kind: kind === "advisory" ? "ADVISORY" : "EXPERT",
          user: PUBLIC_USER,
        },
        select: { userId: true, user: { select: { slug: true } } },
      });
      userId = expert?.userId ?? null;
      slug = expert?.user?.slug ?? null;
    }

    if (!userId) return res.status(404).end();

    // Row predates the backfill, or was inserted by hand. Mint one now rather
    // than leaving that person permanently on an id URL.
    if (!slug) slug = await ensureUserSlug(userId);
    if (!slug) return res.status(404).end();

    /*
      Set explicitly: index.ts stamps no-store on every GET outside
      PUBLIC_READ_PREFIXES, and a no-store 301 makes Googlebot re-request every
      retired URL on every crawl.
    */
    res.set("Cache-Control", "public, max-age=86400");
    // Root-relative, so scheme and host follow the request automatically.
    return res.redirect(301, `/${kind}/${slug}`);
  } catch (error) {
    console.error("Legacy profile redirect error:", error);
    return res.status(404).end();
  }
});

// ─── sitemap.xml ─────────────────────────────────────────────────────────────

type SitemapEntry = {
  path: string;
  lastmod?: Date | null;
  changefreq: string;
  priority: string;
};

/*
  Public pages with no database behind them.

  Deliberately absent, and why:
    /admin/*                     admin-gated; nothing to index
    /my-profile, /complete-profile,
      /membership-pending,
      /revision-requested        per-person or funnel state
    /shared-profile/:token       the token is a secret
    /login, /feed                thin; nothing to rank on
    /vendors, /marketplace,
      /register/vendor           redirect-only. A sitemap lists the
                                 destination, never the redirect.
    /insights, /insights/:slug   unbuilt scaffolding: no model, no API, and the
                                 detail page is hardcoded theme markup. Listing
                                 it asks Google to index invented blog posts.
    /members/<cuid> and friends  301 sources
*/
const STATIC_ENTRIES: Omit<SitemapEntry, "lastmod">[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/members", changefreq: "daily", priority: "0.9" },
  { path: "/experts", changefreq: "daily", priority: "0.9" },
  { path: "/hospitality-partners", changefreq: "weekly", priority: "0.8" },
  { path: "/events", changefreq: "daily", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/advisory", changefreq: "weekly", priority: "0.7" },
  { path: "/testimonials", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "yearly", priority: "0.5" },
  { path: "/register", changefreq: "yearly", priority: "0.4" },
  { path: "/register/hotel-owner", changefreq: "yearly", priority: "0.4" },
  { path: "/register/partner", changefreq: "yearly", priority: "0.4" },
  { path: "/register/expert", changefreq: "yearly", priority: "0.4" },
];

const esc = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const latest = (...dates: (Date | null | undefined)[]): Date | null => {
  const valid = dates.filter((d): d is Date => d instanceof Date);
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => (a > b ? a : b));
};

const collectEntries = async (): Promise<SitemapEntry[]> => {
  const [owners, experts, advisory, events] = await Promise.all([
    /*
      Owners only. MembersPage requests memberType=HOTEL_OWNER, so a non-owner's
      /members/<slug> page is linked from nowhere on the site — no reason to
      advertise an orphan. It also stops a consultant being listed under both
      /members/<slug> and /experts/<slug>, which one slug serving three paths
      otherwise makes easy to do by accident.
    */
    prisma.user.findMany({
      where: { ...PUBLIC_USER, memberType: "HOTEL_OWNER", slug: { not: null } },
      select: { slug: true, updatedAt: true },
    }),
    /*
      One slug serves /members, /experts and /advisory, and a hotel owner may
      also hold an expert record — four of six do in the seed data. Listing
      both would submit the same person, under the same slug and the same
      name, as two competing pages.

      Owners are excluded here rather than above because /members is the
      primary directory for them; their /experts page stays live and linked
      from the Experts listing, and its canonical tag points back at /members
      (see components/profile/ExpertProfileView.jsx). Everyone appears in this
      file exactly once.
    */
    prisma.industryExpert.findMany({
      where: {
        kind: "EXPERT",
        user: { ...PUBLIC_USER, slug: { not: null }, memberType: { not: "HOTEL_OWNER" } },
      },
      select: { updatedAt: true, user: { select: { slug: true, updatedAt: true } } },
    }),
    prisma.industryExpert.findMany({
      where: {
        kind: "ADVISORY",
        user: { ...PUBLIC_USER, slug: { not: null }, memberType: { not: "HOTEL_OWNER" } },
      },
      select: { updatedAt: true, user: { select: { slug: true, updatedAt: true } } },
    }),
    prisma.event.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const dynamic: SitemapEntry[] = [];

  for (const owner of owners) {
    dynamic.push({
      path: `/members/${owner.slug}`,
      lastmod: owner.updatedAt,
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  // These pages render fields from both records, so either one changing is a
  // real change to what a crawler would see.
  const directories = [
    { rows: experts, base: "experts" },
    { rows: advisory, base: "advisory" },
  ];
  for (const { rows, base } of directories) {
    for (const row of rows) {
      if (!row.user?.slug) continue;
      dynamic.push({
        path: `/${base}/${row.user.slug}`,
        lastmod: latest(row.updatedAt, row.user.updatedAt),
        changefreq: "monthly",
        priority: "0.7",
      });
    }
  }

  for (const event of events) {
    dynamic.push({
      path: `/events/${event.slug}`,
      lastmod: event.updatedAt,
      changefreq: "weekly",
      priority: "0.6",
    });
  }

  /*
    Static pages inherit the newest lastmod of everything below them rather
    than "now". A lastmod that moves on every fetch is noise, and Google learns
    to ignore the field entirely.
  */
  const newest = latest(...dynamic.map((e) => e.lastmod));
  const statics: SitemapEntry[] = STATIC_ENTRIES.map((entry) => ({ ...entry, lastmod: newest }));

  return [...statics, ...dynamic];
};

const buildXml = (entries: SitemapEntry[]): string => {
  const origin = esc(siteUrl());
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastmod
        ? `\n    <lastmod>${entry.lastmod.toISOString()}</lastmod>`
        : "";
      return (
        "  <url>\n" +
        `    <loc>${origin}${esc(entry.path)}</loc>${lastmod}\n` +
        `    <changefreq>${entry.changefreq}</changefreq>\n` +
        `    <priority>${entry.priority}</priority>\n` +
        "  </url>"
      );
    })
    .join("\n");

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${urls}\n` +
    "</urlset>\n"
  );
};

/*
  Four small queries is cheap, but a crawler walking the file repeatedly has no
  reason to re-run them. Rebuild at most every 15 minutes and answer
  If-Modified-Since from the cached copy.
*/
const CACHE_TTL_MS = 15 * 60 * 1000;
let cached: { xml: string; lastModified: Date; builtAt: number } | null = null;

const getSitemap = async () => {
  if (cached && Date.now() - cached.builtAt < CACHE_TTL_MS) return cached;

  const entries = await collectEntries();
  cached = {
    xml: buildXml(entries),
    lastModified: latest(...entries.map((e) => e.lastmod)) ?? new Date(),
    builtAt: Date.now(),
  };
  return cached;
};

router.get("/sitemap.xml", async (req: Request, res: Response) => {
  try {
    const { xml, lastModified } = await getSitemap();

    res.set("Content-Type", "application/xml; charset=utf-8");
    // Explicit, for the same reason as the 301 above: index.ts would otherwise
    // stamp no-store on this.
    res.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.set("Last-Modified", lastModified.toUTCString());
    // The sitemap is a crawl instruction, not a page. Keep it out of results.
    res.set("X-Robots-Tag", "noindex");

    const since = req.get("If-Modified-Since");
    if (since) {
      const sinceMs = Date.parse(since);
      // HTTP dates carry second resolution; compare at that granularity.
      const lastModifiedSeconds = Math.floor(lastModified.getTime() / 1000) * 1000;
      if (!Number.isNaN(sinceMs) && lastModifiedSeconds <= sinceMs) {
        return res.status(304).end();
      }
    }

    return res.send(xml);
  } catch (error) {
    console.error("Sitemap error:", error);
    // 503 rather than an empty 200: "come back later" beats telling Google the
    // site has no pages at all.
    return res.status(503).end();
  }
});

export default router;
