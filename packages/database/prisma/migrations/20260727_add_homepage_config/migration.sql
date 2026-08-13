-- CreateTable
CREATE TABLE "HomepageConfig" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "config" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageConfig_pkey" PRIMARY KEY ("id")
);
