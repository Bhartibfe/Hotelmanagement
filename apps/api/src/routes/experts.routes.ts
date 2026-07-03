import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";

const router = Router();

// GET /api/experts - List experts with user info (paginated)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [experts, total] = await Promise.all([
      prisma.industryExpert.findMany({
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              title: true,
              memberType: true,
              organizationName: true,
              organizationRole: true,
              city: true,
              state: true,
              linkedinUrl: true,
            },
          },
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { displayOrder: "asc" },
      }),
      prisma.industryExpert.count(),
    ]);

    return res.json({ experts, total, page: parseInt(page as string), totalPages: Math.ceil(total / parseInt(limit as string)) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch experts" });
  }
});

// GET /api/experts/featured - Featured experts for homepage
router.get("/featured", async (_req: Request, res: Response) => {
  try {
    const experts = await prisma.industryExpert.findMany({
      where: { isFeatured: true },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            title: true,
            memberType: true,
            organizationName: true,
            organizationRole: true,
            city: true,
            state: true,
            linkedinUrl: true,
          },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    return res.json(experts);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch featured experts" });
  }
});

// GET /api/experts/:id - Single expert with full user profile
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
    if (!expert) return res.status(404).json({ error: "Expert not found" });
    return res.json(expert);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch expert" });
  }
});

export default router;
