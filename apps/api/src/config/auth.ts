export const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET || "hospitality-network-secret-dev",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "hospitality-refresh-secret-dev",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtRefreshExpiresIn: "30d",
  saltRounds: 12,
};
