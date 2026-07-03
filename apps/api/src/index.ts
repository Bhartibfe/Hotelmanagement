import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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
import profileRoutes from "./routes/profile.routes";

import path from "path";
// Load .env from project root — works whether CWD is root or apps/api
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();
const PORT = process.env.API_PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

// Routes
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
app.use("/api/profile", profileRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

export default app;
