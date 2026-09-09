-- Pinned owners, and a curated order that new owners cannot disturb.
--
-- Two separate faults are being fixed here.
--
-- 1. There was no way to pin an owner at all. Experts have had isPinned for a
--    while; owners only had a drag-and-drop position, which anyone approved
--    later could push around.
--
-- 2. displayOrder was `Int NOT NULL DEFAULT 0`, and the directory sorts on
--    `displayOrder ASC`. A newly approved owner therefore arrived holding 0 —
--    ahead of every owner the admin had deliberately placed at 1, 2, 3 — and
--    landed at the very top of the directory. Null now means "never placed"
--    and sorts last, which is what 0 was always meant to convey.

-- 1. The pin flag.
ALTER TABLE "User" ADD COLUMN "isPinned" BOOLEAN NOT NULL DEFAULT false;

-- 2. displayOrder becomes nullable so "unplaced" has a value of its own.
ALTER TABLE "User" ALTER COLUMN "displayOrder" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "displayOrder" DROP NOT NULL;

-- 3. Existing 0s are unplaced owners, not owners placed at position zero: no
--    reorder has ever written a 0, since the reorder endpoint assigns 1..n.
UPDATE "User" SET "displayOrder" = NULL WHERE "displayOrder" = 0;

-- 4. Serves the directory's ordering directly.
CREATE INDEX "User_memberType_isPinned_displayOrder_idx"
  ON "User" ("memberType", "isPinned", "displayOrder");
