import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { attachMediaUrls } from "../utils/media";

type ExpertKind = "EXPERT" | "ADVISORY";

// Industry experts and advisory board members are the same record, split only
// by `kind`, so one builder serves both public directories. Advisory members
// are created from the admin panel alone — there is no write route here.
/*
  The directory user fields, minus `avatar`. Every card in these two
  directories shows a photo, and selecting the base64 for all of them made the
  experts list 2MB. The photo now arrives as a /api/media URL, which the
  browser fetches in parallel and caches.
*/
const DIRECTORY_USER_FIELDS = {
  id: true,
  firstName: true,
  lastName: true,
  title: true,
  memberType: true,
  organizationName: true,
  organizationRole: true,
  city: true,
  state: true,
  linkedinUrl: true,
  // Not displayed. It is the cache-busting version for the photo URL below —
  // without it the directory keeps showing a replaced photo for a day.
  updatedAt: true,
} as const;

// Hangs the photo URL off each row's nested user, in one extra id-only query.
// versionOf appends ?v=<updatedAt> so replacing a photo produces a new URL:
// /api/media serves versioned URLs as immutable for a year, and unversioned
// ones as cacheable for a day, so omitting it left the old photo on the board.
const withAvatars = (req: Request, rows: any[]) =>
  attachMediaUrls(req, rows, "user-avatar", {
    idOf: (r) => r.user?.id,
    versionOf: (r) => r.user?.updatedAt,
    set: (r, url) => { if (r.user) r.user.avatar = url; },
  });

export const createExpertDirectoryRouter = (kind: ExpertKind) => {
  const router = Router();
  const label = kind === "ADVISORY" ? "Advisory member" : "Expert";

  // GET / - List the directory with user info (paginated)
  router.get("/", async (req: Request, res: Response) => {
    try {
      const { page = "1", limit = "20" } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const [experts, total] = await Promise.all([
        prisma.industryExpert.findMany({
          where: { kind },
          include: { user: { select: DIRECTORY_USER_FIELDS } },
          skip,
          take: parseInt(limit as string),
          /*
            Pinned first, then the curated order. This listing used to sort on
            displayOrder alone, which is why pinning an expert changed the
            homepage strip but did nothing to the directory itself.

            nulls: "last" keeps anything never placed by hand at the end,
            where a non-nullable 0 previously sorted it to the very top.
          */
          orderBy: [
            { isPinned: "desc" },
            { displayOrder: { sort: "asc", nulls: "last" } },
            { createdAt: "desc" },
          ],
        }),
        prisma.industryExpert.count({ where: { kind } }),
      ]);

      await withAvatars(req, experts);

      return res.json({ experts, total, page: parseInt(page as string), totalPages: Math.ceil(total / parseInt(limit as string)) });
    } catch (error) {
      return res.status(500).json({ error: `Failed to fetch ${label.toLowerCase()}s` });
    }
  });

  // GET /featured - Featured entries for homepage (pinned first, then random starred)
  router.get("/featured", async (req: Request, res: Response) => {
    try {
      /*
        The star decides who is eligible for the homepage; the admin's sequence
        decides the order. So if the starred entries sit at positions 3 and 6 in
        the directory, the homepage shows them in that order too, and dragging
        them in the admin moves them here as well.

        This was two queries — pinned, then starred shuffled with Fisher-Yates —
        so the strip came back in a different order on every request and ignored
        the curated position entirely. One ordered query replaces both, using the
        same ordering as the directory listing above.

        Pinned entries appear whether or not they are starred: pinning is the
        stronger statement of the two, and that was the previous behaviour.
      */
      const experts = await prisma.industryExpert.findMany({
        where: { kind, OR: [{ isPinned: true }, { isFeatured: true }] },
        include: { user: { select: DIRECTORY_USER_FIELDS } },
        orderBy: [
          { isPinned: "desc" },
          { displayOrder: { sort: "asc", nulls: "last" } },
          { createdAt: "desc" },
        ],
      });

      await withAvatars(req, experts);

      return res.json(experts);
    } catch (error) {
      return res.status(500).json({ error: `Failed to fetch featured ${label.toLowerCase()}s` });
    }
  });

  // GET /:id - Single entry with full user profile
  router.get("/:id", async (req: Request, res: Response) => {
    try {
      const expert = await prisma.industryExpert.findUnique({
        where: { id: req.params.id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              title: true,
              bio: true,
              memberType: true,
              organizationName: true,
              organizationRole: true,
              achievements: true,
              industryContributions: true,
              businessOverview: true,
              city: true,
              state: true,
              country: true,
              linkedinUrl: true,
              websiteUrl: true,
              createdAt: true,
            },
          },
        },
      });
      // A record of the other kind is a miss here, not a cross-directory hit.
      if (!expert || expert.kind !== kind) return res.status(404).json({ error: `${label} not found` });
      return res.json(expert);
    } catch (error) {
      return res.status(500).json({ error: `Failed to fetch ${label.toLowerCase()}` });
    }
  });

  return router;
};

export default createExpertDirectoryRouter("EXPERT");
