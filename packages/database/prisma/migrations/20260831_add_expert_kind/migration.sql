-- Advisory board members carry exactly the same profile fields as industry
-- experts, so they live in "IndustryExpert" behind a discriminator rather than
-- in a duplicate table. Every existing row is an expert.

CREATE TYPE "ExpertKind" AS ENUM ('EXPERT', 'ADVISORY');

ALTER TABLE "IndustryExpert"
  ADD COLUMN "kind" "ExpertKind" NOT NULL DEFAULT 'EXPERT';

-- The two public directories each read one kind, ordered by displayOrder.
CREATE INDEX "IndustryExpert_kind_displayOrder_idx"
  ON "IndustryExpert" ("kind", "displayOrder");
