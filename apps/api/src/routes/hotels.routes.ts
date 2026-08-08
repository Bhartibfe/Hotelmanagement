import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { authenticate, requireApproved } from "../middleware/auth";
import { slugify } from "../utils/slugify";

const router = Router();

// POST /api/hotels - Create hotel (approved members only)
router.post("/", authenticate, requireApproved, async (req: Request, res: Response) => {
  try {
    const { name, city, state, address, pincode, rooms, starRating, website, phone, email, propertyType, description } = req.body;
    const slug = slugify(name) + "-" + Date.now().toString(36);

    const hotel = await prisma.hotel.create({
      data: {
        name, slug, city, state, address, pincode, rooms, starRating,
        website, phone, email, propertyType, description,
        ownerId: req.user!.userId,
      },
    });

    return res.status(201).json(hotel);
  } catch (error) {
    console.error("Create hotel error:", error);
    return res.status(500).json({ error: "Failed to create hotel" });
  }
});

// GET /api/hotels - List/search hotels
router.get("/", async (req: Request, res: Response) => {
  try {
    const { city, state, search, page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (city) where.city = { contains: city as string, mode: "insensitive" };
    if (state) where.state = { contains: state as string, mode: "insensitive" };
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { city: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [hotels, total] = await Promise.all([
      prisma.hotel.findMany({
        where,
        include: { owner: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: "desc" },
      }),
      prisma.hotel.count({ where }),
    ]);

    return res.json({ hotels, total, page: parseInt(page as string), totalPages: Math.ceil(total / parseInt(limit as string)) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

// GET /api/hotels/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true } },
        members: {
          where: { isApproved: true },
          include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true } } },
        },
      },
    });
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    return res.json(hotel);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch hotel" });
  }
});

// PUT /api/hotels/:id
router.put("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const hotel = await prisma.hotel.findUnique({ where: { id: req.params.id } });
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    if (hotel.ownerId !== req.user!.userId && req.user!.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { name, description, city, state, country, address, pincode, rooms, starRating, website, phone, email, propertyType, logo, coverImage, photos } = req.body;
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (city !== undefined) data.city = city;
    if (state !== undefined) data.state = state;
    if (country !== undefined) data.country = country;
    if (address !== undefined) data.address = address;
    if (pincode !== undefined) data.pincode = pincode;
    if (rooms !== undefined) data.rooms = rooms;
    if (starRating !== undefined) data.starRating = starRating;
    if (website !== undefined) data.website = website;
    if (phone !== undefined) data.phone = phone;
    if (email !== undefined) data.email = email;
    if (propertyType !== undefined) data.propertyType = propertyType;
    if (logo !== undefined) data.logo = logo;
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (photos !== undefined) data.photos = photos;
    const updated = await prisma.hotel.update({ where: { id: req.params.id }, data });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update hotel" });
  }
});

// POST /api/hotels/:id/members - Add/request member
router.post("/:id/members", authenticate, async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.body;
    const hotel = await prisma.hotel.findUnique({ where: { id: req.params.id } });
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    const isOwner = hotel.ownerId === req.user!.userId;
    const member = await prisma.hotelMember.create({
      data: {
        hotelId: req.params.id,
        userId: userId || req.user!.userId,
        role,
        isApproved: isOwner,
        joinedAt: isOwner ? new Date() : undefined,
      },
    });
    return res.status(201).json(member);
  } catch (error) {
    return res.status(500).json({ error: "Failed to add member" });
  }
});

// GET /api/hotels/:id/members
router.get("/:id/members", async (req: Request, res: Response) => {
  try {
    const members = await prisma.hotelMember.findMany({
      where: { hotelId: req.params.id },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, role: true } } },
    });
    return res.json(members);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch members" });
  }
});

// PUT /api/hotels/:id/members/:memberId - Approve/update
router.put("/:id/members/:memberId", authenticate, async (req: Request, res: Response) => {
  try {
    const hotel = await prisma.hotel.findUnique({ where: { id: req.params.id } });
    if (!hotel || (hotel.ownerId !== req.user!.userId && req.user!.role !== "ADMIN")) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { role, isApproved } = req.body;
    const memberData: any = {};
    if (role !== undefined) memberData.role = role;
    if (isApproved !== undefined) {
      memberData.isApproved = isApproved;
      if (isApproved) memberData.joinedAt = new Date();
    }
    const member = await prisma.hotelMember.update({
      where: { id: req.params.memberId },
      data: memberData,
    });
    return res.json(member);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update member" });
  }
});

export default router;
