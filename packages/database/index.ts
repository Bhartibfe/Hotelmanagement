import { PrismaClient } from "@prisma/client";

// Ensure SSL for Render-hosted PostgreSQL
const dbUrl = process.env.DATABASE_URL || "";
if (dbUrl && !dbUrl.includes("sslmode") && !dbUrl.includes("localhost")) {
  process.env.DATABASE_URL = dbUrl + (dbUrl.includes("?") ? "&" : "?") + "sslmode=require";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "@prisma/client";
export default prisma;
