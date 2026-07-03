import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

// GET /api/users - List/search users (only APPROVED members visible publicly)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { memberType, city, state, search, page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = { isActive: true, membershipStatus: "APPROVED" };
    if (memberType) where.memberType = memberType;
    if (city) where.city = { contains: city as string, mode: "insensitive" };
    if (state) where.state = { contains: state as string, mode: "insensitive" };
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: "insensitive" } },
        { lastName: { contains: search as string, mode: "insensitive" } },
        { title: { contains: search as string, mode: "insensitive" } },
        { organizationName: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
          memberType: true,
          title: true,
          avatar: true,
          city: true,
          state: true,
          organizationName: true,
          organizationRole: true,
          isFeaturedExpert: true,
          isFeaturedVendor: true,
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({ users, total, page: parseInt(page as string), totalPages: Math.ceil(total / parseInt(limit as string)) });
  } catch (error) {
    console.error("List users error:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /api/users/me - Current user profile
router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        memberType: true,
        membershipStatus: true,
        title: true,
        phone: true,
        avatar: true,
        bio: true,
        city: true,
        state: true,
        country: true,
        linkedinUrl: true,
        websiteUrl: true,
        organizationName: true,
        organizationRole: true,
        achievements: true,
        industryContributions: true,
        businessOverview: true,
        isFeaturedExpert: true,
        isFeaturedVendor: true,
        approvedAt: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /api/users/me - Update profile
router.put("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const {
      firstName, lastName, title, phone, bio, city, state,
      linkedinUrl, websiteUrl, organizationName, organizationRole,
      achievements, industryContributions, businessOverview,
    } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        firstName, lastName, title, phone, bio, city, state,
        linkedinUrl, websiteUrl, organizationName, organizationRole,
        achievements, industryContributions, businessOverview,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        memberType: true,
        membershipStatus: true,
        title: true,
        phone: true,
        avatar: true,
        bio: true,
        city: true,
        state: true,
        country: true,
        linkedinUrl: true,
        websiteUrl: true,
        organizationName: true,
        organizationRole: true,
        achievements: true,
        industryContributions: true,
        businessOverview: true,
      },
    });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

// GET /api/users/:id - Public profile (only APPROVED users)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id, isActive: true, membershipStatus: "APPROVED" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        memberType: true,
        title: true,
        avatar: true,
        bio: true,
        city: true,
        state: true,
        country: true,
        linkedinUrl: true,
        websiteUrl: true,
        organizationName: true,
        organizationRole: true,
        achievements: true,
        industryContributions: true,
        businessOverview: true,
        isFeaturedExpert: true,
        isFeaturedVendor: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
