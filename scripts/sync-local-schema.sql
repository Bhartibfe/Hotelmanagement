-- Bring a local hotel_network_db up to date with packages/database/prisma/schema.prisma.
--
-- Why this exists rather than `prisma db push`: push plans
--   ALTER TABLE "VendorProfile" DROP COLUMN "category", ADD COLUMN "category" TEXT
-- which silently discards every stored category. The real migration widens the
-- column in place instead, so the values survive. Everything else below is
-- additive.
--
-- Safe to run more than once: every step is guarded.
--
--   psql -h localhost -U postgres -d hotel_network_db -f scripts/sync-local-schema.sql

BEGIN;

-- ── 1. ExpertKind ──────────────────────────────────────────────────────────
-- From migrations/20260831_add_expert_kind. Advisory members and experts share
-- one table behind this discriminator; every pre-existing row is an EXPERT,
-- which the column default already gives us.
DO $$ BEGIN
  CREATE TYPE "ExpertKind" AS ENUM ('EXPERT', 'ADVISORY');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "IndustryExpert"
  ADD COLUMN IF NOT EXISTS "kind" "ExpertKind" NOT NULL DEFAULT 'EXPERT';

CREATE INDEX IF NOT EXISTS "IndustryExpert_kind_displayOrder_idx"
  ON "IndustryExpert" ("kind", "displayOrder");

-- ── 2. Partner categories: enum -> text ────────────────────────────────────
-- From migrations/20260826_vendor_category_to_text. The USING clause is the
-- whole point: it keeps every existing value instead of dropping the column.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'VendorProfile' AND column_name = 'category'
      AND udt_name = 'MarketplaceCategory'
  ) THEN
    ALTER TABLE "VendorProfile" ALTER COLUMN "category" TYPE TEXT USING "category"::TEXT;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Product' AND column_name = 'category'
      AND udt_name = 'MarketplaceCategory'
  ) THEN
    ALTER TABLE "Product" ALTER COLUMN "category" TYPE TEXT USING "category"::TEXT;
  END IF;
END $$;

-- Rewrite SCREAMING_CASE members to the labels the UI already showed, so stored
-- values match the admin-managed list. ELSE leaves anything else untouched, and
-- makes re-running a no-op.
UPDATE "VendorProfile" SET "category" = CASE "category"
  WHEN 'TECHNOLOGY'      THEN 'Technology'
  WHEN 'ARCHITECTURE'    THEN 'Architecture'
  WHEN 'INTERIOR_DESIGN' THEN 'Interior Design'
  WHEN 'HVAC'            THEN 'HVAC'
  WHEN 'PROCUREMENT'     THEN 'Procurement'
  WHEN 'SECURITY'        THEN 'Security'
  WHEN 'MARKETING'       THEN 'Marketing'
  WHEN 'RECRUITMENT'     THEN 'Recruitment'
  WHEN 'CONSULTING'      THEN 'Consulting'
  WHEN 'LEGAL'           THEN 'Legal'
  WHEN 'FINANCE'         THEN 'Finance'
  ELSE "category"
END;

UPDATE "Product" SET "category" = CASE "category"
  WHEN 'TECHNOLOGY'      THEN 'Technology'
  WHEN 'ARCHITECTURE'    THEN 'Architecture'
  WHEN 'INTERIOR_DESIGN' THEN 'Interior Design'
  WHEN 'HVAC'            THEN 'HVAC'
  WHEN 'PROCUREMENT'     THEN 'Procurement'
  WHEN 'SECURITY'        THEN 'Security'
  WHEN 'MARKETING'       THEN 'Marketing'
  WHEN 'RECRUITMENT'     THEN 'Recruitment'
  WHEN 'CONSULTING'      THEN 'Consulting'
  WHEN 'LEGAL'           THEN 'Legal'
  WHEN 'FINANCE'         THEN 'Finance'
  ELSE "category"
END;

DROP TYPE IF EXISTS "MarketplaceCategory";

CREATE INDEX IF NOT EXISTS "VendorProfile_category_idx" ON "VendorProfile" ("category");
CREATE INDEX IF NOT EXISTS "Product_category_idx"       ON "Product" ("category");

-- ── 3. Event and FeedPost columns ──────────────────────────────────────────
-- These have no migration file — they were pushed straight to the hosted
-- database, so a local database built from the migrations folder never got
-- them. All nullable or array, so adding them cannot fail on existing rows.
ALTER TABLE "Event"
  ADD COLUMN IF NOT EXISTS "agenda"          TEXT,
  ADD COLUMN IF NOT EXISTS "createdById"     TEXT,
  ADD COLUMN IF NOT EXISTS "highlights"      TEXT[],
  ADD COLUMN IF NOT EXISTS "organizerAvatar" TEXT,
  ADD COLUMN IF NOT EXISTS "organizerName"   TEXT;

ALTER TABLE "FeedPost"
  ADD COLUMN IF NOT EXISTS "brief"        TEXT,
  ADD COLUMN IF NOT EXISTS "thumbnailUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "title"        TEXT,
  ADD COLUMN IF NOT EXISTS "youtubeUrl"   TEXT;

CREATE INDEX IF NOT EXISTS "Event_createdById_idx" ON "Event" ("createdById");

DO $$ BEGIN
  ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

COMMIT;
