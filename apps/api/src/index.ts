import path from "path";
import dotenv from "dotenv";
// Load .env BEFORE any module that reads process.env (e.g. @hospitality/database)
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { prisma } from "@hospitality/database";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import hotelRoutes from "./routes/hotels.routes";
import feedRoutes from "./routes/feed.routes";
import connectionRoutes from "./routes/connections.routes";
import marketplaceRoutes from "./routes/marketplace.routes";
// import investmentRoutes from "./routes/investments.routes";
import eventRoutes from "./routes/events.routes";
import messageRoutes from "./routes/messages.routes";
import notificationRoutes from "./routes/notifications.routes";
import adminRoutes from "./routes/admin.routes";
import testimonialRoutes from "./routes/testimonials.routes";
import expertRoutes from "./routes/experts.routes";
import advisoryRoutes from "./routes/advisory.routes";
import profileRoutes from "./routes/profile.routes";
import shareRoutes from "./routes/share.routes";
import mediaRoutes from "./routes/media.routes";

const app = express();
// Render terminates TLS in front of this, so req.protocol must follow
// X-Forwarded-Proto or every media URL would come back as http.
app.set("trust proxy", 1);
const PORT = process.env.API_PORT || 5000;

app.use(helmet());

/*
  The database lives in Oregon and this is served to users in India, so every
  kilobyte on the wire costs real latency. gzip is cheap here: the JSON these
  routes return is highly repetitive, and it applies to every response without
  any route needing to know about it.

  The threshold keeps tiny bodies uncompressed, where the header overhead would
  outweigh the saving.
*/
app.use(compression({
  threshold: 1024,
  // Images served by /api/media are already compressed formats; gzipping
  // them again costs CPU and saves nothing.
  filter: (req, res) => (req.path.startsWith("/api/media/") ? false : compression.filter(req, res)),
}));

app.use(morgan("combined"));

/*
  Reading the site is not rate limited; writing to it is.

  The old limiter was 100 requests a minute across everything, /api/media
  included. But images are no longer inlined in list responses — a directory of
  twenty-five members is twenty-five separate image requests on top of the page's
  own calls, so simply browsing two pages tripped the limit and the site started
  answering 429 to a member who had done nothing wrong.

  Caching does this job better. /api/media already answers versioned URLs as
  immutable for a year, and the public directories below carry a short shared
  max-age, so a visitor clicking around mostly never reaches the server at all.
  A limit is kept on the things that actually cost something — writes, and
  sign-in attempts — where each request is one deliberate action.
*/
const PUBLIC_READ_PREFIXES = [
  "/api/media",
  "/api/experts",
  "/api/advisory",
  "/api/marketplace",
  "/api/testimonials",
  "/api/events",
  "/api/users",
  "/api/hotels",
  "/api/public-stats",
  "/api/homepage-config",
];

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  // GET on a public directory is free. Anything that changes data still counts,
  // so this cannot be used to hammer the write endpoints.
  skip: (req) =>
    req.method === "GET" && PUBLIC_READ_PREFIXES.some((p) => req.path.startsWith(p)),
  message: { error: "Too many requests from this device. Please wait a minute and try again." },
});
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many sign-in attempts from this device. Please wait a minute and try again." },
});

app.use(globalLimiter);

/*
  Short-lived shared caching for the public directories — the other half of
  dropping the rate limit. A member clicking between Owners, Experts and
  Partners re-requests the same list constantly; this lets the browser answer
  most of that itself.

  Guarded two ways. Only GET, so nothing that changes data is ever cached. And
  only when the request carries no Authorization header: an authenticated
  response can contain things meant for one member, and `public` would let a
  shared cache hand it to somebody else. Those get no-store instead.

  Kept deliberately short. These lists change whenever an admin approves a
  member, and a minute of staleness is the most that is worth trading for it.
  Images are the opposite case and are cached for a year, because their URL
  carries a version and changes the moment the photo does — see utils/media.ts.
*/
const PUBLIC_LIST_MAX_AGE = 60;
app.use((req, res, next) => {
  const isPublicRead =
    req.method === "GET" &&
    !req.headers.authorization &&
    PUBLIC_READ_PREFIXES.some((p) => req.path.startsWith(p)) &&
    // /api/media sets its own far-future headers; do not override them.
    !req.path.startsWith("/api/media");

  if (isPublicRead) {
    res.setHeader(
      "Cache-Control",
      `public, max-age=${PUBLIC_LIST_MAX_AGE}, stale-while-revalidate=${PUBLIC_LIST_MAX_AGE * 2}`
    );
    // The same URL answers differently once signed in, so caches must key on it.
    res.setHeader("Vary", "Authorization, Accept-Encoding");
  } else if (req.method === "GET") {
    res.setHeader("Cache-Control", "no-store");
  }
  next();
});

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
const origins = corsOrigin.split(",").map((o) => o.trim());
app.use(cors({ origin: origins.length === 1 ? origins[0] : origins, credentials: true }));
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/marketplace", marketplaceRoutes);
// app.use("/api/investments", investmentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/experts", expertRoutes);
app.use("/api/advisory", advisoryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/share", shareRoutes);
// Images referenced by URL from list responses rather than inlined into them.
app.use("/api/media", mediaRoutes);

// Public homepage config (no auth needed)
app.get("/api/homepage-config", async (_req, res) => {
  try {
    const row = await prisma.homepageConfig.findUnique({ where: { id: "singleton" } });
    res.json(row?.config || {});
  } catch (error) {
    console.error("Homepage config error:", error);
    res.status(500).json({ error: "We could not load the homepage settings. Please refresh in a moment." });
  }
});

/*
  Public stats (real counts from database)

  These are the numbers on the home page and the About page, so they have to
  agree with what a visitor finds when they click through to a directory. That
  is the whole reason for the filters below — `hotels` and `vendors` were bare
  table counts, which included rows belonging to members who were still pending,
  or had been rejected, suspended or deactivated. "Verified Partners" counted
  every vendor profile ever created; VendorProfile has no verification column of
  its own, so an approved and active member behind the profile is what the word
  has to mean. Please do not simplify these back to `.count()`.

  `members` deliberately spans every memberType — owners, vendors, consultants,
  professionals. It is a whole-network figure, not the Owners directory, so it
  is expected to be larger than the list at /members.
*/
const APPROVED_ACTIVE = { isActive: true, membershipStatus: "APPROVED" } as const;

app.get("/api/public-stats", async (_req, res) => {
  try {
    const [members, hotels, vendors, events, cities] = await Promise.all([
      prisma.user.count({ where: { role: "MEMBER", ...APPROVED_ACTIVE } }),
      prisma.hotel.count({ where: { owner: APPROVED_ACTIVE } }),
      prisma.vendorProfile.count({ where: { user: APPROVED_ACTIVE } }),
      prisma.event.count({ where: { isPublished: true } }),
      // Left as it was on purpose: this one still counts deactivated members,
      // and still treats "" and case variants as cities. Out of scope here.
      prisma.user.findMany({
        where: { role: "MEMBER", membershipStatus: "APPROVED", city: { not: null } },
        select: { city: true },
        distinct: ["city"],
      }),
    ]);
    res.json({ members, hotels, vendors, events, cities: cities.length });
  } catch (error) {
    console.error("Public stats error:", error);
    res.status(500).json({ error: "We could not load the network statistics. Please refresh in a moment." });
  }
});

// Health check
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: "error", error: "The API is running but cannot reach the database." });
  }
});


// Unknown API routes answer in JSON, never Express's HTML page.
app.use("/api", notFoundHandler);

// Error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

const shutdown = async () => {
  console.log("Shutting down gracefully...");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export default app;
