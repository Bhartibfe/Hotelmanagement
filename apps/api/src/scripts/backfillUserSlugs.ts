import path from "path";
import dotenv from "dotenv";
// Load .env BEFORE any module that reads process.env (e.g. @hospitality/database)
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

import { prisma } from "@hospitality/database";
import { nextAvailableUserSlug, profileSlugBase } from "../utils/profileSlug";

/*
  Repair pass for User.slug.

  The 20260929_add_user_slug migration already backfills in SQL, so on a clean
  deploy this finds nothing to do. It exists for the cases SQL cannot cover:
  rows inserted by hand after the migration, a restored dump from before it,
  and any duplicate that slipped through.

  It deliberately reuses nextAvailableUserSlug rather than reimplementing the
  rules, so the backfill and the creation paths can never drift apart.

  Idempotent. Exits non-zero if anything is still null or duplicated, so it can
  gate the unique-index migration in a deploy script.
*/

const main = async () => {
  const users = await prisma.user.findMany({
    select: { id: true, firstName: true, lastName: true, slug: true },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });

  const seen = new Map<string, string>(); // slug -> user id that holds it
  let assigned = 0;
  let reassigned = 0;

  for (const user of users) {
    const duplicate = user.slug ? seen.has(user.slug) : false;

    if (user.slug && !duplicate) {
      seen.set(user.slug, user.id);
      continue;
    }

    const slug = await nextAvailableUserSlug(prisma, user.firstName, user.lastName);
    await prisma.user.update({ where: { id: user.id }, data: { slug } });
    seen.set(slug, user.id);

    if (duplicate) {
      // A slug change is a URL change. Never let this pass quietly.
      reassigned += 1;
      console.warn(
        `[backfill] REASSIGNED ${user.id}: "${user.slug}" was already held by ` +
          `${seen.get(user.slug!)} -> "${slug}". Any link to the old URL is now dead.`
      );
    } else {
      assigned += 1;
      console.log(`[backfill] ${user.id} (${profileSlugBase(user.firstName, user.lastName)}) -> "${slug}"`);
    }
  }

  const remainingNull = await prisma.user.count({ where: { slug: null } });
  const duplicates = await prisma.user.groupBy({
    by: ["slug"],
    where: { slug: { not: null } },
    _count: { slug: true },
    having: { slug: { _count: { gt: 1 } } },
  });

  console.log(
    `\n[backfill] ${users.length} users scanned, ${assigned} assigned, ` +
      `${reassigned} reassigned, ${remainingNull} still null, ` +
      `${duplicates.length} duplicate slugs.`
  );

  if (remainingNull > 0 || duplicates.length > 0) {
    console.error("[backfill] FAILED — do not apply the unique index yet.");
    process.exitCode = 1;
    return;
  }

  console.log("[backfill] OK — safe to apply 20260929_user_slug_unique.");
};

main()
  .catch((error) => {
    console.error("[backfill] crashed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
