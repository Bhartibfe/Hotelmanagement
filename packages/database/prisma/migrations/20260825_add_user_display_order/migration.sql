-- Manual admin-curated ordering for the Owners directory.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- Backfill: seed existing owners with their current newest-first sequence, so
-- "Manual" mode starts from the order admins already see instead of all-zeros.
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt" DESC) AS rn
  FROM "User"
  WHERE "memberType" = 'HOTEL_OWNER'
)
UPDATE "User" u
SET "displayOrder" = o.rn
FROM ordered o
WHERE u.id = o.id;

CREATE INDEX IF NOT EXISTS "User_memberType_displayOrder_idx"
  ON "User"("memberType", "displayOrder");
