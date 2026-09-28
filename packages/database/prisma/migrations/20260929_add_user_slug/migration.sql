-- Public URL segment for profile pages. See schema.prisma User.slug.
--
-- Added nullable and unindexed on purpose: this runs against a live table and
-- the unique index lands in a separate later migration
-- (20260929_user_slug_unique). Splitting them means a duplicate in existing
-- data can never leave a half-applied migration behind, which would be
-- recorded as failed and block every future `prisma migrate deploy` until
-- someone runs `prisma migrate resolve` by hand on the production box.
ALTER TABLE "User" ADD COLUMN "slug" TEXT;

-- Backfill, row by row in creation order, mirroring the runtime helper in
-- apps/api/src/utils/profileSlug.ts step for step:
--   lower -> strip anything outside [a-z0-9 _-] -> collapse [\s_]+ to "-"
--   -> trim edge hyphens -> clamp to 60 -> guard empty/cuid-shaped/reserved
--   -> append -2, -3 ... until free.
--
-- Deliberately a loop rather than a ROW_NUMBER() window: numbering by window
-- can still collide when a real name slugifies to something that already looks
-- suffixed (two "John Smith" take john-smith and john-smith-2, and a third
-- user whose surname is literally "Smith-2" also bases to john-smith-2).
-- Checking each candidate against what is already committed rules that out, so
-- the unique index in the next migration is safe unconditionally.
--
-- Ordering by createdAt then id makes the result reproducible and leaves the
-- bare slug with the earliest-registered person of any given name.
DO $$
DECLARE
  r         RECORD;
  base      TEXT;
  candidate TEXT;
  n         INT;
BEGIN
  FOR r IN SELECT id, "firstName", "lastName" FROM "User" ORDER BY "createdAt", id LOOP
    base := btrim(
      regexp_replace(
        regexp_replace(
          lower(coalesce(r."firstName", '') || ' ' || coalesce(r."lastName", '')),
          '[^a-z0-9[:space:]_-]', '', 'g'
        ),
        '[[:space:]_]+', '-', 'g'
      ),
      '-'
    );

    -- JS \w is ASCII-only, so a name in a non-latin script slugifies to nothing
    -- at runtime too. 'member' keeps the page reachable and indexable.
    base := btrim(left(base, 60), '-');
    IF base = '' THEN
      base := 'member';
    END IF;

    -- No slug may look like a cuid, or nginx would proxy it to the id->slug
    -- redirect handler instead of serving the page.
    IF base ~ '^c[a-z0-9]{20,30}$' THEN
      base := 'p-' || base;
    END IF;

    -- Sibling API routes registered before /:id would shadow these.
    IF base IN ('featured', 'me', 'new', 'index', 'reorder', 'admin', 'sitemap') THEN
      base := base || '-profile';
    END IF;

    candidate := base;
    n := 1;
    WHILE EXISTS (SELECT 1 FROM "User" WHERE "slug" = candidate) LOOP
      n := n + 1;
      candidate := base || '-' || n;
    END LOOP;

    UPDATE "User" SET "slug" = candidate WHERE id = r.id;
  END LOOP;
END $$;
