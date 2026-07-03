import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { authenticate, requireAdmin } from "../middleware/auth";
import { slugify } from "../utils/slugify";

const router = Router();

// POST /api/events - Create event (ADMIN only)
router.post("/", authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, type, description, venue, city, state, startDate, endDate, registrationUrl, maxAttendees, isFeatured, displayOrder } = req.body;
    const slug = slugify(title) + "-" + Date.now().toString(36);

    const event = await prisma.event.create({
      data: {
        title, slug, type, description, venue, city, state,
        startDate: new Date(startDate), endDate: new Date(endDate),
        registrationUrl, maxAttendees, isFeatured, displayOrder,
      },
    });
    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create event" });
  }
});

// GET /api/events/featured - Featured events
router.get("/featured", async (_req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: { isFeatured: true, isPublished: true },
      include: { _count: { select: { registrations: true } } },
      orderBy: { displayOrder: "asc" },
    });

    return res.json(events);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch featured events" });
  }
});

// GET /api/events - List events
router.get("/", async (req: Request, res: Response) => {
  try {
    const { type, upcoming, page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = { isPublished: true };
    if (type) where.type = type;
    if (upcoming === "true") where.startDate = { gte: new Date() };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: { _count: { select: { registrations: true } } },
        skip,
        take: parseInt(limit as string),
        orderBy: { startDate: "asc" },
      }),
      prisma.event.count({ where }),
    ]);

    return res.json({ events, total, page: parseInt(page as string), totalPages: Math.ceil(total / parseInt(limit as string)) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch events" });
  }
});

// GET /api/events/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { registrations: true } } },
    });
    if (!event) return res.status(404).json({ error: "Event not found" });
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch event" });
  }
});

// POST /api/events/:id/register
router.post("/:id/register", authenticate, async (req: Request, res: Response) => {
  try {
    await prisma.eventRegistration.create({
      data: { eventId: req.params.id, userId: req.user!.userId },
    });
    return res.status(201).json({ registered: true });
  } catch {
    return res.status(409).json({ error: "Already registered" });
  }
});

// DELETE /api/events/:id/register
router.delete("/:id/register", authenticate, async (req: Request, res: Response) => {
  try {
    await prisma.eventRegistration.delete({
      where: { eventId_userId: { eventId: req.params.id, userId: req.user!.userId } },
    });
    return res.json({ registered: false });
  } catch {
    return res.status(404).json({ error: "Registration not found" });
  }
});

export default router;
