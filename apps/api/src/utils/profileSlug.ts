import { prisma } from "@hospitality/database";
import { slugify } from "./slugify";

/**
 * Profile URL slugs: firstname-lastname, with -2, -3 ... on collision.
 *
 * Unlike every other slug in this codebase (hotels, vendors, products, events)
 * these deliberately do NOT carry a `-${Date.now().toString(36)}` suffix. That
 * suffix exists only to sidestep uniqueness, and it produces exactly the kind
 * of unreadable URL this module was written to get rid of. Collisions are
 * resolved by counting instead, and the unique index on User.slug is what makes
 * that safe under concurrency.
 *
 * A slug is assigned once, when the user row is created, and is never
 * recomputed when the person is renamed.
 */

// Sibling routes that are registered before /:id and would shadow a record
// slugged the same way — e.g. GET /api/experts/featured (experts.routes.ts).
const RESERVED = new Set([
  "featured",
  "me",
  "new",
  "index",
  "reorder",
  "admin",
  "sitemap",
]);

// nginx routes /members/<cuid> to the id->slug redirect handler by shape alone.
// A slug that looked like a cuid would be proxied there and never render.
const CUID_SHAPED = /^c[a-z0-9]{20,30}$/;

const MAX_LENGTH = 60;

/** The bare, not-yet-unique slug for a name. Pure — no database access. */
export const profileSlugBase = (
  firstName?: string | null,
  lastName?: string | null
): string => {
  let base = slugify(`${firstName ?? ""} ${lastName ?? ""}`);

  // Clamp before any numeric suffix is appended, and never end on a hyphen.
  if (base.length > MAX_LENGTH) {
    base = base.slice(0, MAX_LENGTH);
  }
  base = base.replace(/^-+|-+$/g, "");

  // slugify strips [^\w\s-] and JS \w is ASCII-only, so a name written in a
  // non-latin script reduces to "". Reachable and permanent beats accurate.
  if (!base) {
    base = "member";
  }

  if (CUID_SHAPED.test(base)) {
    base = `p-${base}`;
  }

  if (RESERVED.has(base)) {
    base = `${base}-profile`;
  }

  return base;
};

/** Minimal shape of the client, so this works with both prisma and a tx client. */
type UserFinder = {
  user: { findFirst(args: any): Promise<{ id: string } | null> };
};

/**
 * First unused slug for this name. Pass the transaction client at call sites
 * that run inside `prisma.$transaction`, so the read and the insert stay in the
 * same transaction.
 */
export const nextAvailableUserSlug = async (
  db: UserFinder,
  firstName?: string | null,
  lastName?: string | null
): Promise<string> => {
  const base = profileSlugBase(firstName, lastName);

  let candidate = base;
  for (let n = 2; n <= 200; n += 1) {
    const taken = await db.user.findFirst({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!taken) return candidate;
    candidate = `${base}-${n}`;
  }

  // 200 people sharing one name is not a collision, it is a bug upstream.
  // Fail loudly rather than spin.
  throw new Error(`Could not find a free profile slug for base "${base}"`);
};

const isSlugConflict = (error: any): boolean => {
  if (error?.code !== "P2002") return false;
  const target = error?.meta?.target;
  if (Array.isArray(target)) return target.includes("slug");
  return typeof target === "string" && target.includes("slug");
};

/**
 * Create a user with a slug, outside a transaction.
 *
 * Checking then inserting cannot rule out two people with the same name
 * registering at the same moment; the unique index turns that race into a
 * P2002, and retrying picks up the now-taken slug. A P2002 on `email` is a real
 * duplicate-account error and must surface, so only slug conflicts retry.
 */
export const createUserWithSlug = async <T>(
  db: UserFinder,
  name: { firstName?: string | null; lastName?: string | null },
  create: (slug: string) => Promise<T>
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = await nextAvailableUserSlug(db, name.firstName, name.lastName);
    try {
      return await create(slug);
    } catch (error) {
      if (!isSlugConflict(error)) throw error;
      lastError = error;
    }
  }

  throw lastError;
};

/**
 * Backfill a slug for a row that predates the migration or was inserted by
 * hand. Returns null when the user does not exist or the name cannot be read.
 * Never throws on contention — losing the race just means someone else
 * assigned it first, so re-read and return theirs.
 */
export const ensureUserSlug = async (userId: string): Promise<string | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, slug: true, firstName: true, lastName: true },
  });
  if (!user) return null;
  if (user.slug) return user.slug;

  const slug = await nextAvailableUserSlug(prisma, user.firstName, user.lastName);
  try {
    await prisma.user.update({ where: { id: userId }, data: { slug } });
    return slug;
  } catch (error) {
    if (!isSlugConflict(error)) throw error;
    const fresh = await prisma.user.findUnique({
      where: { id: userId },
      select: { slug: true },
    });
    return fresh?.slug ?? null;
  }
};
