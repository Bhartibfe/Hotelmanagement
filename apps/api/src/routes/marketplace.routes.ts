import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { authenticate, requireApproved } from "../middleware/auth";
import { slugify } from "../utils/slugify";

const router = Router();

// POST /api/marketplace - Create vendor profile (approved members only)
router.post("/", authenticate, requireApproved, async (req: Request, res: Response) => {
  try {
    const { companyName, category, description, services, city, state, website, phone, email, employeeCount, yearEstablished } = req.body;
    const slug = slugify(companyName) + "-" + Date.now().toString(36);

    const profile = await prisma.vendorProfile.create({
      data: {
        companyName, slug, category, description, services: services || [],
        portfolio: [], city, state, website, phone, email, employeeCount, yearEstablished,
        userId: req.user!.userId,
      },
    });
    return res.status(201).json(profile);
  } catch (error) {
    console.error("Create vendor error:", error);
    return res.status(500).json({ error: "Failed to create vendor profile" });
  }
});

// GET /api/marketplace/featured - Featured vendors
router.get("/featured", async (_req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendorProfile.findMany({
      where: { isFeatured: true },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true } },
      },
      orderBy: { displayOrder: "asc" },
    });

    return res.json(vendors);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch featured vendors" });
  }
});

// GET /api/marketplace - List/search vendors
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, city, state, search, page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (category) where.category = category;
    if (city) where.city = { contains: city as string, mode: "insensitive" };
    if (state) where.state = { contains: state as string, mode: "insensitive" };
    if (search) {
      where.OR = [
        { companyName: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [vendors, total] = await Promise.all([
      prisma.vendorProfile.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: "desc" },
      }),
      prisma.vendorProfile.count({ where }),
    ]);

    return res.json({ vendors, total, page: parseInt(page as string), totalPages: Math.ceil(total / parseInt(limit as string)) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

// GET /api/marketplace/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const vendor = await prisma.vendorProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true } },
      },
    });
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    return res.json(vendor);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch vendor" });
  }
});

// PUT /api/marketplace/:id
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const vendor = await prisma.vendorProfile.findUnique({ where: { id: req.params.id } });
    if (!vendor || (vendor.userId !== req.user!.userId && req.user!.role !== "ADMIN")) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updated = await prisma.vendorProfile.update({
      where: { id: req.params.id },
      data: req.body,
    });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update vendor" });
  }
});

export default router;
