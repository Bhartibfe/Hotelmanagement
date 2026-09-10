-- Extend pinning to experts, advisory members and partners.
--
-- Owners got this in 20260909_add_owner_pinning. The same two faults existed
-- everywhere else:
--
-- 1. displayOrder was `Int NOT NULL DEFAULT 0` while the directories sort on
--    `displayOrder ASC`, so anything newly added arrived holding 0 — ahead of
--    everything deliberately placed at 1, 2, 3 — and landed at the very top.
--    Null now means "never placed" and sorts last.
--
-- 2. IndustryExpert.isPinned already existed but was only ever read by
--    /experts/featured, the homepage strip. The directory listing itself
--    ignored it, so pinning an expert did nothing to the Experts or Advisory
--    page. VendorProfile had no pin column at all.
--
-- Existing 0s become NULL. Safe for the same reason as the owners migration:
-- a reorder assigns 1..n, so no row was ever deliberately placed at 0.

-- ── IndustryExpert (Experts and Advisory share this table) ────────────────
ALTER TABLE "IndustryExpert" ALTER COLUMN "displayOrder" DROP DEFAULT;
ALTER TABLE "IndustryExpert" ALTER COLUMN "displayOrder" DROP NOT NULL;
UPDATE "IndustryExpert" SET "displayOrder" = NULL WHERE "displayOrder" = 0;

CREATE INDEX "IndustryExpert_kind_isPinned_displayOrder_idx"
  ON "IndustryExpert" ("kind", "isPinned", "displayOrder");

-- ── VendorProfile (Partners) ──────────────────────────────────────────────
ALTER TABLE "VendorProfile" ADD COLUMN "isPinned" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "VendorProfile" ALTER COLUMN "displayOrder" DROP DEFAULT;
ALTER TABLE "VendorProfile" ALTER COLUMN "displayOrder" DROP NOT NULL;
UPDATE "VendorProfile" SET "displayOrder" = NULL WHERE "displayOrder" = 0;

CREATE INDEX "VendorProfile_isPinned_displayOrder_idx"
  ON "VendorProfile" ("isPinned", "displayOrder");
