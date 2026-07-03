import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";

const router = Router();

// GET /api/testimonials - List published testimonials (paginated)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where = { isPublished: true };

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, organizationName: true } },
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { displayOrder: "asc" },
      }),
      prisma.testimonial.count({ where }),
    ]);

    return res.json({ testimonials, total, page: parseInt(page as string), totalPages: Math.ceil(total / parseInt(limit as string)) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

// GET /api/testimonials/featured - Featured testimonials for homepage
router.get("/featured", async (_req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isFeatured: true, isPublished: true },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, organizationName: true } },
      },
      orderBy: { displayOrder: "asc" },
    });

    return res.json(testimonials);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch featured testimonials" });
  }
});

// GET /api/testimonials/:id - Single testimonial
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: req.params.id, isPublished: true },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, organizationName: true } },
      },
    });
    if (!testimonial) return res.status(404).json({ error: "Testimonial not found" });
    return res.json(testimonial);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch testimonial" });
  }
});

export default router;
