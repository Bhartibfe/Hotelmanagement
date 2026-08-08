const jwtSecret = process.env.JWT_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

if (process.env.NODE_ENV === "production" && (!jwtSecret || !jwtRefreshSecret)) {
  console.error("FATAL: JWT_SECRET and JWT_REFRESH_SECRET must be set in production");
  process.exit(1);
}

export const AUTH_CONFIG = {
  jwtSecret: jwtSecret || "hospitality-network-secret-dev",
  jwtRefreshSecret: jwtRefreshSecret || "hospitality-refresh-secret-dev",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: "30d",
  saltRounds: 12,
};
