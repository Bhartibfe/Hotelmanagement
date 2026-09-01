import path from "path";
import dotenv from "dotenv";
// Load .env BEFORE any module that reads process.env (e.g. @hospitality/database)
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { prisma } from "@hospitality/database";
import { errorHandler } from "./middleware/errorHandler";
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

const app = express();
const PORT = process.env.API_PORT || 5000;

app.use(helmet());
app.use(morgan("combined"));

const globalLimiter = rateLimit({ windowMs: 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, message: { error: "Too many attempts, please try again later" } });

app.use(globalLimiter);

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

// Public homepage config (no auth needed)
app.get("/api/homepage-config", async (_req, res) => {
  try {
    const row = await prisma.homepageConfig.findUnique({ where: { id: "singleton" } });
    res.json(row?.config || {});
  } catch {
    res.status(500).json({ error: "Failed to load config" });
  }
});

// Public stats (real counts from database)
app.get("/api/public-stats", async (_req, res) => {
  try {
    const [members, hotels, vendors, events, cities] = await Promise.all([
      prisma.user.count({ where: { role: "MEMBER", membershipStatus: "APPROVED" } }),
      prisma.hotel.count(),
      prisma.vendorProfile.count(),
      prisma.event.count({ where: { isPublished: true } }),
      prisma.user.findMany({
        where: { role: "MEMBER", membershipStatus: "APPROVED", city: { not: null } },
        select: { city: true },
        distinct: ["city"],
      }),
    ]);
    res.json({ members, hotels, vendors, events, cities: cities.length });
  } catch {
    res.status(500).json({ error: "Failed to load stats" });
  }
});

// Health check
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: "error", message: "Database connection failed" });
  }
});


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
