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
} as const;

// Hangs the photo URL off each row's nested user, in one extra id-only query.
const withAvatars = (req: Request, rows: any[]) =>
  attachMediaUrls(req, rows, "user-avatar", {
    idOf: (r) => r.user?.id,
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
          orderBy: { displayOrder: "asc" },
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
      // Get pinned experts (always shown)
      const pinned = await prisma.industryExpert.findMany({
        where: { kind, isPinned: true },
        include: { user: { select: DIRECTORY_USER_FIELDS } },
        orderBy: { displayOrder: "asc" },
      });

      // Get starred (featured) experts excluding pinned ones
      const pinnedIds = pinned.map((p) => p.id);
      const starred = await prisma.industryExpert.findMany({
        where: { kind, isFeatured: true, id: { notIn: pinnedIds } },
        include: { user: { select: DIRECTORY_USER_FIELDS } },
      });

      // Shuffle starred experts for random display
      for (let i = starred.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [starred[i], starred[j]] = [starred[j], starred[i]];
      }

      // Pinned first, then random starred
      const experts = [...pinned, ...starred];
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
