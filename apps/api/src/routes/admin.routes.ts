import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { authenticate, requireAdmin } from "../middleware/auth";
import { slugify } from "../utils/slugify";

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// ─── MEMBERSHIP REQUESTS ───

// GET /api/admin/membership-requests - List pending membership requests (paginated)
router.get("/membership-requests", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const { status } = req.query;
    const where: any = {};
    if (status && status !== "ALL") {
      where.membershipStatus = status as string;
    } else if (!status) {
      where.membershipStatus = "PENDING";
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          salutation: true,
          firstName: true,
          lastName: true,
          memberType: true,
          membershipStatus: true,
          profileStatus: true,
          title: true,
          phone: true,
          avatar: true,
          bio: true,
          city: true,
          state: true,
          organizationName: true,
          organizationRole: true,
          achievements: true,
          industryContributions: true,
          businessOverview: true,
          yearsInIndustry: true,
          linkedinUrl: true,
          createdAt: true,
          hotels: { select: { id: true, name: true, city: true, state: true, rooms: true, starRating: true, propertyType: true, photos: true, description: true } },
          vendorProfile: { include: { products: true } },
          expertProfile: true,
        },
        skip,
        take,
        orderBy: { createdAt: "asc" },
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({
      users,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error("List membership requests error:", error);
    return res.status(500).json({ error: "Failed to fetch membership requests" });
  }
});

// PUT /api/admin/membership-requests/:id - Approve or reject a membership request
router.put("/membership-requests/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;

    if (!action || !["APPROVE", "REJECT"].includes(action)) {
      return res.status(400).json({ error: "Action must be APPROVE or REJECT" });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.membershipStatus !== "PENDING") {
      return res.status(400).json({ error: "User membership is not pending" });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        membershipStatus: action === "APPROVE" ? "APPROVED" : "REJECTED",
        approvedAt: action === "APPROVE" ? new Date() : undefined,
        approvedBy: action === "APPROVE" ? req.user!.userId : undefined,
        rejectionReason: action === "REJECT" ? reason : undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        memberType: true,
        membershipStatus: true,
        approvedAt: true,
        rejectionReason: true,
      },
    });

    // Create a notification for the user
    await prisma.notification.create({
      data: {
        userId: id,
        type: action === "APPROVE" ? "MEMBERSHIP_APPROVED" : "MEMBERSHIP_REJECTED",
        title: action === "APPROVE" ? "Membership Approved" : "Membership Rejected",
        message:
          action === "APPROVE"
            ? "Your membership has been approved. Welcome to the network!"
            : `Your membership request was rejected.${reason ? ` Reason: ${reason}` : ""}`,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Update membership request error:", error);
    return res.status(500).json({ error: "Failed to update membership request" });
  }
});

// ─── MEMBERS ───

// GET /api/admin/members - List all members (paginated, filterable)
router.get("/members", async (req: Request, res: Response) => {
  try {
    const { memberType, membershipStatus, search, page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};
    if (memberType) where.memberType = memberType;
    if (membershipStatus) where.membershipStatus = membershipStatus;
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: "insensitive" } },
        { lastName: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
        { organizationName: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
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
          city: true,
          state: true,
          organizationName: true,
          organizationRole: true,
          isActive: true,
          isFeaturedExpert: true,
          isFeaturedVendor: true,
          createdAt: true,
          lastLoginAt: true,
        },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({
      users,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error("List members error:", error);
    return res.status(500).json({ error: "Failed to fetch members" });
  }
});

// PUT /api/admin/members/:id - Update member (suspend, edit fields)
router.put("/members/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      membershipStatus,
      memberType,
      isActive,
      role,
      title,
      organizationName,
      organizationRole,
      isFeaturedExpert,
      isFeaturedVendor,
    } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const data: any = {};
    if (membershipStatus !== undefined) data.membershipStatus = membershipStatus;
    if (memberType !== undefined) data.memberType = memberType;
    if (isActive !== undefined) data.isActive = isActive;
    if (role !== undefined) data.role = role;
    if (title !== undefined) data.title = title;
    if (organizationName !== undefined) data.organizationName = organizationName;
    if (organizationRole !== undefined) data.organizationRole = organizationRole;
    if (isFeaturedExpert !== undefined) data.isFeaturedExpert = isFeaturedExpert;
    if (isFeaturedVendor !== undefined) data.isFeaturedVendor = isFeaturedVendor;

    // If suspending, set the status
    if (membershipStatus === "SUSPENDED") {
      data.isActive = false;
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        memberType: true,
        membershipStatus: true,
        title: true,
        organizationName: true,
        organizationRole: true,
        isActive: true,
        isFeaturedExpert: true,
        isFeaturedVendor: true,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Update member error:", error);
    return res.status(500).json({ error: "Failed to update member" });
  }
});

// ─── VENDORS ───

// GET /api/admin/vendors - List vendor profiles for admin
router.get("/vendors", async (req: Request, res: Response) => {
  try {
    const { category, search, page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};
    if (category) where.category = category;
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
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
              membershipStatus: true,
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.vendorProfile.count({ where }),
    ]);

    return res.json({
      vendors,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error("List vendors error:", error);
    return res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

// PUT /api/admin/vendors/:id/feature - Toggle vendor featured status
router.put("/vendors/:id/feature", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendorProfile.findUnique({ where: { id } });
    if (!vendor) {
      return res.status(404).json({ error: "Vendor profile not found" });
    }

    const updated = await prisma.vendorProfile.update({
      where: { id },
      data: { isFeatured: !vendor.isFeatured },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Toggle vendor featured error:", error);
    return res.status(500).json({ error: "Failed to update vendor" });
  }
});

// ─── INDUSTRY EXPERTS ───

// GET /api/admin/experts - List industry experts for admin
router.get("/experts", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [experts, total] = await Promise.all([
      prisma.industryExpert.findMany({
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
              title: true,
              organizationName: true,
              membershipStatus: true,
            },
          },
        },
        skip,
        take,
        orderBy: { displayOrder: "asc" },
      }),
      prisma.industryExpert.count(),
    ]);

    return res.json({
      experts,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error("List experts error:", error);
    return res.status(500).json({ error: "Failed to fetch experts" });
  }
});

// POST /api/admin/experts - Create expert profile for a user
router.post("/experts", async (req: Request, res: Response) => {
  try {
    const { userId, expertise, bio, isFeatured, displayOrder } = req.body;

    if (!userId || !expertise || !Array.isArray(expertise)) {
      return res.status(400).json({ error: "userId and expertise array are required" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existing = await prisma.industryExpert.findUnique({ where: { userId } });
    if (existing) {
      return res.status(409).json({ error: "Expert profile already exists for this user" });
    }

    const expert = await prisma.industryExpert.create({
      data: {
        userId,
        expertise,
        bio,
        isFeatured: isFeatured || false,
        displayOrder: displayOrder || 0,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            title: true,
          },
        },
      },
    });

    // Also update the user's isFeaturedExpert flag if applicable
    if (isFeatured) {
      await prisma.user.update({
        where: { id: userId },
        data: { isFeaturedExpert: true },
      });
    }

    return res.status(201).json(expert);
  } catch (error) {
    console.error("Create expert error:", error);
    return res.status(500).json({ error: "Failed to create expert profile" });
  }
});

// PUT /api/admin/experts/:id/feature - Toggle expert featured status
router.put("/experts/:id/feature", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const expert = await prisma.industryExpert.findUnique({ where: { id } });
    if (!expert) {
      return res.status(404).json({ error: "Expert profile not found" });
    }

    const newFeatured = !expert.isFeatured;

    const updated = await prisma.industryExpert.update({
      where: { id },
      data: { isFeatured: newFeatured },
    });

    // Sync the user's isFeaturedExpert flag
    await prisma.user.update({
      where: { id: expert.userId },
      data: { isFeaturedExpert: newFeatured },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Toggle expert featured error:", error);
    return res.status(500).json({ error: "Failed to update expert" });
  }
});

// DELETE /api/admin/experts/:id - Remove expert profile
router.delete("/experts/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const expert = await prisma.industryExpert.findUnique({ where: { id } });
    if (!expert) {
      return res.status(404).json({ error: "Expert profile not found" });
    }

    await prisma.industryExpert.delete({ where: { id } });

    // Reset the user's isFeaturedExpert flag
    await prisma.user.update({
      where: { id: expert.userId },
      data: { isFeaturedExpert: false },
    });

    return res.json({ deleted: true });
  } catch (error) {
    console.error("Delete expert error:", error);
    return res.status(500).json({ error: "Failed to delete expert" });
  }
});

// ─── EVENTS ───

// GET /api/admin/events - List all events (including unpublished)
router.get("/events", async (req: Request, res: Response) => {
  try {
    const { type, page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};
    if (type) where.type = type;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: { _count: { select: { registrations: true } } },
        skip,
        take,
        orderBy: { startDate: "desc" },
      }),
      prisma.event.count({ where }),
    ]);

    return res.json({
      events,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error("List events error:", error);
    return res.status(500).json({ error: "Failed to fetch events" });
  }
});

// POST /api/admin/events - Create event
router.post("/events", async (req: Request, res: Response) => {
  try {
    const {
      title,
      type,
      description,
      venue,
      city,
      state,
      country,
      startDate,
      endDate,
      registrationUrl,
      coverImage,
      maxAttendees,
      isFeatured,
      isPublished,
      displayOrder,
    } = req.body;

    if (!title || !type || !description || !city || !state || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const slug = slugify(title) + "-" + Date.now().toString(36);

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        type,
        description,
        venue,
        city,
        state,
        country,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        registrationUrl,
        coverImage,
        maxAttendees,
        isFeatured: isFeatured || false,
        isPublished: isPublished !== false,
        displayOrder: displayOrder || 0,
      },
    });

    return res.status(201).json(event);
  } catch (error) {
    console.error("Create event error:", error);
    return res.status(500).json({ error: "Failed to create event" });
  }
});

// PUT /api/admin/events/:id - Update event
router.put("/events/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const {
      title,
      type,
      description,
      venue,
      city,
      state,
      country,
      startDate,
      endDate,
      registrationUrl,
      coverImage,
      maxAttendees,
      isFeatured,
      isPublished,
      displayOrder,
    } = req.body;

    const data: any = {};
    if (title !== undefined) {
      data.title = title;
      data.slug = slugify(title) + "-" + Date.now().toString(36);
    }
    if (type !== undefined) data.type = type;
    if (description !== undefined) data.description = description;
    if (venue !== undefined) data.venue = venue;
    if (city !== undefined) data.city = city;
    if (state !== undefined) data.state = state;
    if (country !== undefined) data.country = country;
    if (startDate !== undefined) data.startDate = new Date(startDate);
    if (endDate !== undefined) data.endDate = new Date(endDate);
    if (registrationUrl !== undefined) data.registrationUrl = registrationUrl;
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (maxAttendees !== undefined) data.maxAttendees = maxAttendees;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;
    if (isPublished !== undefined) data.isPublished = isPublished;
    if (displayOrder !== undefined) data.displayOrder = displayOrder;

    const updated = await prisma.event.update({ where: { id }, data });

    return res.json(updated);
  } catch (error) {
    console.error("Update event error:", error);
    return res.status(500).json({ error: "Failed to update event" });
  }
});

// DELETE /api/admin/events/:id - Delete event
router.delete("/events/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Delete registrations first, then the event
    await prisma.eventRegistration.deleteMany({ where: { eventId: id } });
    await prisma.event.delete({ where: { id } });

    return res.json({ deleted: true });
  } catch (error) {
    console.error("Delete event error:", error);
    return res.status(500).json({ error: "Failed to delete event" });
  }
});

// ─── TESTIMONIALS ───

// GET /api/admin/testimonials - List all testimonials
router.get("/testimonials", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
        },
        skip,
        take,
        orderBy: { displayOrder: "asc" },
      }),
      prisma.testimonial.count(),
    ]);

    return res.json({
      testimonials,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error("List testimonials error:", error);
    return res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

// POST /api/admin/testimonials - Create testimonial
router.post("/testimonials", async (req: Request, res: Response) => {
  try {
    const {
      content,
      authorName,
      authorTitle,
      authorCompany,
      authorAvatar,
      userId,
      isFeatured,
      isPublished,
      displayOrder,
    } = req.body;

    if (!content || !authorName) {
      return res.status(400).json({ error: "Content and authorName are required" });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        content,
        authorName,
        authorTitle,
        authorCompany,
        authorAvatar,
        userId,
        isFeatured: isFeatured || false,
        isPublished: isPublished || false,
        displayOrder: displayOrder || 0,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return res.status(201).json(testimonial);
  } catch (error) {
    console.error("Create testimonial error:", error);
    return res.status(500).json({ error: "Failed to create testimonial" });
  }
});

// PUT /api/admin/testimonials/:id - Update testimonial
router.put("/testimonials/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    const {
      content,
      authorName,
      authorTitle,
      authorCompany,
      authorAvatar,
      userId,
      isFeatured,
      isPublished,
      displayOrder,
    } = req.body;

    const data: any = {};
    if (content !== undefined) data.content = content;
    if (authorName !== undefined) data.authorName = authorName;
    if (authorTitle !== undefined) data.authorTitle = authorTitle;
    if (authorCompany !== undefined) data.authorCompany = authorCompany;
    if (authorAvatar !== undefined) data.authorAvatar = authorAvatar;
    if (userId !== undefined) data.userId = userId;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;
    if (isPublished !== undefined) data.isPublished = isPublished;
    if (displayOrder !== undefined) data.displayOrder = displayOrder;

    const updated = await prisma.testimonial.update({ where: { id }, data });

    return res.json(updated);
  } catch (error) {
    console.error("Update testimonial error:", error);
    return res.status(500).json({ error: "Failed to update testimonial" });
  }
});

// DELETE /api/admin/testimonials/:id - Delete testimonial
router.delete("/testimonials/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    await prisma.testimonial.delete({ where: { id } });

    return res.json({ deleted: true });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    return res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

// ─── FEED MODERATION ───

// GET /api/admin/feed - List all posts for moderation
router.get("/feed", async (req: Request, res: Response) => {
  try {
    const { type, hidden, page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};
    if (type) where.type = type;
    if (hidden === "true") where.isHidden = true;
    if (hidden === "false") where.isHidden = false;

    const [posts, total] = await Promise.all([
      prisma.feedPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
              title: true,
              memberType: true,
            },
          },
          hotel: { select: { id: true, name: true, logo: true } },
          _count: { select: { likes: true, comments: true } },
        },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.feedPost.count({ where }),
    ]);

    return res.json({
      posts,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error("List feed error:", error);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// PUT /api/admin/feed/:id - Moderate post (pin, hide, delete)
router.put("/feed/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, isPinned, isHidden } = req.body;

    const post = await prisma.feedPost.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Handle delete action
    if (action === "delete") {
      await prisma.comment.deleteMany({ where: { postId: id } });
      await prisma.like.deleteMany({ where: { postId: id } });
      await prisma.savedPost.deleteMany({ where: { postId: id } });
      await prisma.feedPost.delete({ where: { id } });
      return res.json({ deleted: true });
    }

    // Handle pin/hide toggle
    const data: any = {};
    if (isPinned !== undefined) data.isPinned = isPinned;
    if (isHidden !== undefined) data.isHidden = isHidden;

    const updated = await prisma.feedPost.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Moderate post error:", error);
    return res.status(500).json({ error: "Failed to moderate post" });
  }
});

// ─── DASHBOARD STATS ───

// GET /api/admin/stats - Dashboard statistics
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const [
      totalMembers,
      pendingRequests,
      approvedMembers,
      suspendedMembers,
      totalVendors,
      totalExperts,
      totalEvents,
      upcomingEvents,
      totalPosts,
      totalTestimonials,
      membersByType,
      recentMembers,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "MEMBER" } }),
      prisma.user.count({ where: { membershipStatus: "PENDING" } }),
      prisma.user.count({ where: { membershipStatus: "APPROVED" } }),
      prisma.user.count({ where: { membershipStatus: "SUSPENDED" } }),
      prisma.vendorProfile.count(),
      prisma.industryExpert.count(),
      prisma.event.count(),
      prisma.event.count({ where: { startDate: { gte: new Date() } } }),
      prisma.feedPost.count(),
      prisma.testimonial.count(),
      prisma.user.groupBy({
        by: ["memberType"],
        _count: { id: true },
        where: { role: "MEMBER" },
      }),
      prisma.user.findMany({
        where: { role: "MEMBER" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          memberType: true,
          membershipStatus: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return res.json({
      totalMembers,
      pendingRequests,
      approvedMembers,
      suspendedMembers,
      totalVendors,
      totalExperts,
      totalEvents,
      upcomingEvents,
      totalPosts,
      totalTestimonials,
      membersByType,
      recentMembers,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ─── PROFILE REVIEW ───

// GET /api/admin/profile-review/:userId - Fetch full profile for admin review
router.get("/profile-review/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        hotels: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            city: true,
            state: true,
            country: true,
            address: true,
            pincode: true,
            rooms: true,
            starRating: true,
            website: true,
            logo: true,
            coverImage: true,
            photos: true,
            phone: true,
            email: true,
            propertyType: true,
            isVerified: true,
            createdAt: true,
          },
        },
        vendorProfile: {
          include: {
            products: true,
          },
        },
        expertProfile: true,
        profileRevisions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only include hotels with photos for HOTEL_OWNER
    const response: any = { ...user };
    if (user.memberType !== "HOTEL_OWNER") {
      response.hotels = [];
    }
    if (user.memberType !== "VENDOR") {
      response.vendorProfile = null;
    }

    return res.json(response);
  } catch (error) {
    console.error("Profile review fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch profile for review" });
  }
});

// PUT /api/admin/profile-review/:userId - Approve or reject a user profile
router.put("/profile-review/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { action, reason } = req.body;

    if (!action || !["APPROVE", "REJECT"].includes(action)) {
      return res.status(400).json({ error: "Action must be APPROVE or REJECT" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        vendorProfile: {
          include: { products: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (action === "APPROVE") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          membershipStatus: "APPROVED",
          profileStatus: "APPROVED",
          approvedAt: new Date(),
          approvedBy: req.user!.userId,
        },
      });

      // For VENDOR: also approve all PENDING_REVIEW products
      if (user.memberType === "VENDOR" && user.vendorProfile) {
        await prisma.product.updateMany({
          where: {
            vendorId: user.vendorProfile.id,
            status: "PENDING_REVIEW",
          },
          data: { status: "APPROVED" },
        });
      }

      await prisma.notification.create({
        data: {
          userId,
          type: "MEMBERSHIP_APPROVED",
          title: "Profile Approved",
          message: "Your profile has been reviewed and approved. Welcome to the network!",
        },
      });
    } else {
      // REJECT
      if (!reason) {
        return res.status(400).json({ error: "Reason is required when rejecting a profile" });
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          membershipStatus: "REJECTED",
          rejectionReason: reason,
        },
      });

      await prisma.notification.create({
        data: {
          userId,
          type: "MEMBERSHIP_REJECTED",
          title: "Profile Rejected",
          message: `Your profile has been rejected. Reason: ${reason}`,
        },
      });
    }

    const updated = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        memberType: true,
        membershipStatus: true,
        profileStatus: true,
        approvedAt: true,
        rejectionReason: true,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Profile review update error:", error);
    return res.status(500).json({ error: "Failed to update profile review" });
  }
});

// POST /api/admin/profile-review/:userId/revision - Request profile revision
router.post("/profile-review/:userId/revision", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { flaggedFields, adminNote } = req.body;

    if (!flaggedFields || !Array.isArray(flaggedFields) || flaggedFields.length === 0) {
      return res.status(400).json({ error: "flaggedFields array is required and must not be empty" });
    }
    if (!adminNote) {
      return res.status(400).json({ error: "adminNote is required" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const revision = await prisma.profileRevision.create({
      data: {
        userId,
        adminId: req.user!.userId,
        flaggedFields,
        adminNote,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        membershipStatus: "REVISION_REQUESTED",
        profileStatus: "REVISION_REQUESTED",
      },
    });

    await prisma.notification.create({
      data: {
        userId,
        type: "REVISION_REQUESTED",
        title: "Profile Revision Requested",
        message: `An admin has requested changes to your profile. Please review the flagged fields: ${flaggedFields.join(", ")}.`,
      },
    });

    return res.status(201).json(revision);
  } catch (error) {
    console.error("Profile revision request error:", error);
    return res.status(500).json({ error: "Failed to create profile revision request" });
  }
});

// ─── PRODUCT APPROVALS ───

// GET /api/admin/product-approvals - List all products pending review
router.get("/product-approvals", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where = { status: "PENDING_REVIEW" as const };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          vendor: {
            select: {
              id: true,
              companyName: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: "asc" },
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      products,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error("List product approvals error:", error);
    return res.status(500).json({ error: "Failed to fetch product approvals" });
  }
});

// PUT /api/admin/product-approvals/:productId - Approve or reject a product
router.put("/product-approvals/:productId", async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { action, note } = req.body;

    if (!action || !["APPROVE", "REJECT"].includes(action)) {
      return res.status(400).json({ error: "Action must be APPROVE or REJECT" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { user: { select: { id: true } } },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        status: action === "APPROVE" ? "APPROVED" : "REJECTED",
        rejectionNote: action === "REJECT" ? note : undefined,
      },
    });

    await prisma.notification.create({
      data: {
        userId: product.userId,
        type: action === "APPROVE" ? "PRODUCT_APPROVED" : "PRODUCT_REJECTED",
        title: action === "APPROVE" ? "Product Approved" : "Product Rejected",
        message:
          action === "APPROVE"
            ? `Your product "${product.name}" has been approved and is now live.`
            : `Your product "${product.name}" has been rejected.${note ? ` Note: ${note}` : ""}`,
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Product approval update error:", error);
    return res.status(500).json({ error: "Failed to update product approval" });
  }
});

// ─── PROFILE EDIT DRAFTS ───

// GET /api/admin/profile-edits - List all pending profile edit drafts
router.get("/profile-edits", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where = { status: "PENDING" };

    const [drafts, total] = await Promise.all([
      prisma.profileEditDraft.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
              memberType: true,
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: "asc" },
      }),
      prisma.profileEditDraft.count({ where }),
    ]);

    return res.json({
      drafts,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error("List profile edits error:", error);
    return res.status(500).json({ error: "Failed to fetch profile edit drafts" });
  }
});

// PUT /api/admin/profile-edits/:draftId - Approve or reject a profile edit draft
router.put("/profile-edits/:draftId", async (req: Request, res: Response) => {
  try {
    const { draftId } = req.params;
    const { action, note } = req.body;

    if (!action || !["APPROVE", "REJECT"].includes(action)) {
      return res.status(400).json({ error: "Action must be APPROVE or REJECT" });
    }

    const draft = await prisma.profileEditDraft.findUnique({
      where: { id: draftId },
      include: { user: { select: { id: true } } },
    });

    if (!draft) {
      return res.status(404).json({ error: "Profile edit draft not found" });
    }

    if (draft.status !== "PENDING") {
      return res.status(400).json({ error: "Draft is not in PENDING status" });
    }

    if (action === "APPROVE") {
      // Apply draftData fields to the user model
      const draftData = draft.draftData as Record<string, any>;

      // Only allow safe user fields to be updated from draft
      const allowedFields = [
        "firstName", "lastName", "title", "phone", "avatar", "bio",
        "city", "state", "country", "linkedinUrl", "websiteUrl",
        "organizationName", "organizationRole", "achievements",
        "industryContributions", "businessOverview", "yearsInIndustry",
      ];

      const userUpdateData: Record<string, any> = {};
      for (const field of allowedFields) {
        if (draftData[field] !== undefined) {
          userUpdateData[field] = draftData[field];
        }
      }

      userUpdateData.profileStatus = "APPROVED";

      await prisma.user.update({
        where: { id: draft.userId },
        data: userUpdateData,
      });

      await prisma.profileEditDraft.update({
        where: { id: draftId },
        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
        },
      });

      await prisma.notification.create({
        data: {
          userId: draft.userId,
          type: "PROFILE_EDIT_APPROVED",
          title: "Profile Edit Approved",
          message: "Your profile changes have been reviewed and approved.",
        },
      });
    } else {
      // REJECT
      await prisma.profileEditDraft.update({
        where: { id: draftId },
        data: {
          status: "REJECTED",
          adminNote: note || null,
          reviewedAt: new Date(),
        },
      });

      await prisma.user.update({
        where: { id: draft.userId },
        data: {
          profileStatus: "APPROVED",
        },
      });

      await prisma.notification.create({
        data: {
          userId: draft.userId,
          type: "SYSTEM",
          title: "Profile Edit Rejected",
          message: `Your profile edit request was rejected.${note ? ` Note: ${note}` : ""} Your current profile remains unchanged.`,
        },
      });
    }

    const updatedDraft = await prisma.profileEditDraft.findUnique({
      where: { id: draftId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileStatus: true,
          },
        },
      },
    });

    return res.json(updatedDraft);
  } catch (error) {
    console.error("Profile edit review error:", error);
    return res.status(500).json({ error: "Failed to review profile edit draft" });
  }
});

export default router;
