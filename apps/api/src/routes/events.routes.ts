import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { authenticate, requireAdmin, requireApproved } from "../middleware/auth";
import { slugify } from "../utils/slugify";
import { sendEmail } from "../services/email.service";
import { eventRegistrationConfirmation, eventCreatedAdmin } from "../templates/email.templates";
import { attachMediaUrls, oversizedImageError } from "../utils/media";

const router = Router();

/*
  Selected explicitly rather than with `include`, which dragged in coverImage
  and organizerAvatar — both base64 — for every row. Those two fields alone
  made this endpoint 4.4MB and 26 seconds; they now come back as URLs into
  /api/media and load alongside the page instead of blocking it.
*/
const EVENT_LIST_FIELDS = {
  id: true, slug: true, title: true, type: true, description: true,
  venue: true, city: true, state: true, country: true,
  startDate: true, endDate: true, registrationUrl: true,
  maxAttendees: true, isFeatured: true, isPublished: true, displayOrder: true,
  organizerName: true, highlights: true, createdAt: true, updatedAt: true,
  createdById: true,
} as const;


// GET /api/events/featured - Featured events
router.get("/featured", async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: { isFeatured: true, isPublished: true },
      select: {
        ...EVENT_LIST_FIELDS,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { displayOrder: "asc" },
    });

    const withMedia: any[] = events;
    await Promise.all([
      attachMediaUrls(req, withMedia, "event-cover", {
        idOf: (e) => e.id,
        versionOf: (e) => e.updatedAt,
        set: (e, url) => { e.coverImage = url; },
      }),
      attachMediaUrls(req, withMedia, "user-avatar", {
        idOf: (e) => e.createdBy?.id,
        set: (e, url) => { if (e.createdBy) e.createdBy.avatar = url; },
      }),
    ]);

    return res.json(withMedia);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch featured events" });
  }
});

// GET /api/events/my-events - Get current user's created events
router.get("/my-events", authenticate, async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: { createdById: req.user!.userId },
      include: { _count: { select: { registrations: true } } },
      orderBy: { startDate: "desc" },
    });
    return res.json({ events });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch events" });
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
        select: {
          ...EVENT_LIST_FIELDS,
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          _count: { select: { registrations: true } },
        },
        skip,
        take: parseInt(limit as string),
        orderBy: { startDate: "asc" },
      }),
      prisma.event.count({ where }),
    ]);

    /*
      In parallel, not in sequence: each of these is one small query, but the
      database is a continent away, so three awaits in a row cost three round
      trips of latency for no reason.
    */
    const withMedia: any[] = events;
    await Promise.all([
      attachMediaUrls(req, withMedia, "event-cover", {
        idOf: (e) => e.id,
        versionOf: (e) => e.updatedAt,
        set: (e, url) => { e.coverImage = url; },
      }),
      attachMediaUrls(req, withMedia, "event-organizer", {
        idOf: (e) => e.id,
        versionOf: (e) => e.updatedAt,
        set: (e, url) => { e.organizerAvatar = url; },
      }),
      attachMediaUrls(req, withMedia, "user-avatar", {
        idOf: (e) => e.createdBy?.id,
        set: (e, url) => { if (e.createdBy) e.createdBy.avatar = url; },
      }),
    ]);

    return res.json({ events: withMedia, total, page: parseInt(page as string), totalPages: Math.ceil(total / parseInt(limit as string)) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch events" });
  }
});

// POST /api/events - Create event (approved members)
router.post("/", authenticate, requireApproved, async (req: Request, res: Response) => {
  try {
    const {
      title, type, description, venue, city, state, country,
      startDate, endDate, registrationUrl, coverImage,
      maxAttendees, isFeatured, displayOrder,
      organizerName, organizerAvatar, agenda, highlights,
    } = req.body;
    // Backstop for the client-side downscale — see utils/media.ts.
    const oversized = oversizedImageError([
      { label: "Cover image", value: coverImage },
      { label: "Organiser photo", value: organizerAvatar },
    ]);
    if (oversized) return res.status(413).json({ error: oversized });



    if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
    if (!type) return res.status(400).json({ error: "Event type is required" });
    if (!description?.trim()) return res.status(400).json({ error: "Description is required" });
    if (!city?.trim()) return res.status(400).json({ error: "City is required" });
    if (!state?.trim()) return res.status(400).json({ error: "State is required" });
    if (!startDate) return res.status(400).json({ error: "Start date is required" });
    if (!endDate) return res.status(400).json({ error: "End date is required" });

    const slug = slugify(title) + "-" + Date.now().toString(36);

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        slug,
        type,
        description,
        venue: venue || null,
        city: city.trim(),
        state: state.trim(),
        country: country || "India",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        registrationUrl: registrationUrl || null,
        coverImage: coverImage || null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        isFeatured: req.user!.role === "ADMIN" ? (isFeatured || false) : false,
        displayOrder: displayOrder || 0,
        organizerName: organizerName || null,
        organizerAvatar: organizerAvatar || null,
        agenda: agenda || null,
        highlights: highlights || [],
        createdById: req.user!.userId,
      },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        _count: { select: { registrations: true } },
      },
    });

    // Notify admins about new event
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { email: true } });
    const dateStr = event.startDate.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const creatorName = `${event.createdBy?.firstName || ""} ${event.createdBy?.lastName || ""}`;
    for (const admin of admins) {
      sendEmail(admin.email, `New Event Created: ${event.title}`, eventCreatedAdmin(event.title, creatorName, dateStr));
    }

    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create event" });
  }
});

// GET /api/events/:idOrSlug - Get single event (by id or slug)
router.get("/:idOrSlug", async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params;

    const event = await prisma.event.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, memberType: true } },
        _count: { select: { registrations: true } },
      },
    });

    if (!event) return res.status(404).json({ error: "Event not found" });
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch event" });
  }
});

// GET /api/events/:id/check-registration - Check if user is registered
router.get("/:id/check-registration", authenticate, async (req: Request, res: Response) => {
  try {
    const reg = await prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId: req.params.id, userId: req.user!.userId } },
    });
    return res.json({ registered: !!reg });
  } catch (error) {
    return res.status(500).json({ error: "Failed to check registration" });
  }
});

// PUT /api/events/:id - Edit own event (or admin)
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.createdById !== req.user!.userId && req.user!.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized to edit this event" });
    }

    const {
      title, type, description, venue, city, state, country,
      startDate, endDate, registrationUrl, coverImage,
      maxAttendees, isFeatured, isPublished, displayOrder,
      organizerName, organizerAvatar, agenda, highlights,
    } = req.body;

    // Same backstop on update as on create.
    const oversized = oversizedImageError([
      { label: "Cover image", value: coverImage },
      { label: "Organiser photo", value: organizerAvatar },
    ]);
    if (oversized) return res.status(413).json({ error: oversized });

    const data: any = {};
    if (title !== undefined) { data.title = title.trim(); data.slug = slugify(title) + "-" + Date.now().toString(36); }
    if (type !== undefined) data.type = type;
    if (description !== undefined) data.description = description;
    if (venue !== undefined) data.venue = venue || null;
    if (city !== undefined) data.city = city.trim();
    if (state !== undefined) data.state = state.trim();
    if (country !== undefined) data.country = country;
    if (startDate !== undefined) data.startDate = new Date(startDate);
    if (endDate !== undefined) data.endDate = new Date(endDate);
    if (registrationUrl !== undefined) data.registrationUrl = registrationUrl || null;
    if (coverImage !== undefined) data.coverImage = coverImage || null;
    if (maxAttendees !== undefined) data.maxAttendees = maxAttendees ? parseInt(maxAttendees) : null;
    if (isFeatured !== undefined && req.user!.role === "ADMIN") data.isFeatured = isFeatured;
    if (isPublished !== undefined) data.isPublished = isPublished;
    if (displayOrder !== undefined) data.displayOrder = displayOrder;
    if (organizerName !== undefined) data.organizerName = organizerName || null;
    if (organizerAvatar !== undefined) data.organizerAvatar = organizerAvatar || null;
    if (agenda !== undefined) data.agenda = agenda || null;
    if (highlights !== undefined) data.highlights = highlights;

    const updated = await prisma.event.update({
      where: { id: req.params.id },
      data,
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        _count: { select: { registrations: true } },
      },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update event" });
  }
});

// DELETE /api/events/:id - Delete own event (or admin)
router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (event.createdById !== req.user!.userId && req.user!.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.$transaction([
      prisma.eventRegistration.deleteMany({ where: { eventId: req.params.id } }),
      prisma.event.delete({ where: { id: req.params.id } }),
    ]);

    return res.json({ deleted: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete event" });
  }
});

// POST /api/events/:id/register
router.post("/:id/register", authenticate, async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id }, include: { _count: { select: { registrations: true } } } });
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (!event.isPublished) return res.status(400).json({ error: "Event is not published" });
    if (event.maxAttendees && event._count.registrations >= event.maxAttendees) {
      return res.status(400).json({ error: "Event is at full capacity" });
    }

    await prisma.eventRegistration.create({
      data: { eventId: req.params.id, userId: req.user!.userId },
    });

    // Fire-and-forget registration confirmation email
    const registrant = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { email: true, firstName: true },
    });
    if (registrant) {
      const dateStr = event.startDate
        ? event.startDate.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
        : "TBA";
      sendEmail(
        registrant.email,
        `Registration Confirmed: ${event.title}`,
        eventRegistrationConfirmation(registrant.firstName, event.title, dateStr, event.venue || undefined)
      );
    }

    return res.status(201).json({ registered: true });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res.status(409).json({ error: "Already registered" });
    }
    return res.status(500).json({ error: "Failed to register for event" });
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
