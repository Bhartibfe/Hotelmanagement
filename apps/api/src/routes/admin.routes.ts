import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { authenticate, requireAdmin } from "../middleware/auth";
import { slugify } from "../utils/slugify";
import { sendEmail } from "../services/email.service";
import * as emailTemplates from "../templates/email.templates";
import { isOwnerSortMode, resolveOwnerOrderBy } from "./users.routes";
import { normalizeProfileFields } from "../utils/profileFields";

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

    // Always fetch per-status counts so the frontend tabs show accurate numbers
    const [users, total, pendingCount, approvedCount, rejectedCount, revisionCount, allCount] = await Promise.all([
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
      prisma.user.count({ where: { membershipStatus: "PENDING" } }),
      prisma.user.count({ where: { membershipStatus: "APPROVED" } }),
      prisma.user.count({ where: { membershipStatus: "REJECTED" } }),
      prisma.user.count({ where: { membershipStatus: "REVISION_REQUESTED" } }),
      prisma.user.count({ where: { membershipStatus: { in: ["PENDING", "APPROVED", "REJECTED", "REVISION_REQUESTED", "SUSPENDED"] } } }),
    ]);

    return res.json({
      users,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / take),
      statusCounts: {
        ALL: allCount,
        PENDING: pendingCount,
        APPROVED: approvedCount,
        REJECTED: rejectedCount,
        REVISION_REQUESTED: revisionCount,
      },
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

    if (user.membershipStatus === "SUSPENDED") {
      return res.status(400).json({ error: "User is suspended. Use the members page to unsuspend." });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        membershipStatus: action === "APPROVE" ? "APPROVED" : "REJECTED",
        profileStatus: action === "APPROVE" ? "APPROVED" : undefined,
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

    // Resolve any open profile revisions when approving
    if (action === "APPROVE") {
      await prisma.profileRevision.updateMany({
        where: { userId: id, status: "OPEN" },
        data: { status: "RESOLVED", resolvedAt: new Date() },
      });
    }

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

    // Fire-and-forget email (don't block the response)
    if (action === "APPROVE") {
      sendEmail(updated.email, "Membership Approved - Hotel Sircle", emailTemplates.membershipApproved(updated.firstName));
    } else {
      sendEmail(updated.email, "Membership Update - Hotel Sircle", emailTemplates.membershipRejected(updated.firstName, reason));
    }

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
    const { memberType, membershipStatus, search, sort, page = "1", limit = "20" } = req.query;
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
          displayOrder: true,
          createdAt: true,
          lastLoginAt: true,
        },
        skip,
        take,
        orderBy: await resolveOwnerOrderBy(sort),
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

// PUT /api/admin/members/reorder - Persist the manual owner order (drag & drop).
// NOTE: must stay above PUT /members/:id, or Express matches "reorder" as an id.
router.put("/members/reorder", async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.some((id) => typeof id !== "string" || !id)) {
      return res.status(400).json({ error: "orderedIds must be an array of member ids" });
    }
    if (orderedIds.length === 0) {
      return res.status(400).json({ error: "orderedIds cannot be empty" });
    }
    if (orderedIds.length > 500) {
      return res.status(400).json({ error: "Cannot reorder more than 500 members at once" });
    }
    if (new Set(orderedIds).size !== orderedIds.length) {
      return res.status(400).json({ error: "orderedIds contains duplicates" });
    }

    // Reject unknown ids up front so a bad payload cannot half-apply.
    const found = await prisma.user.count({ where: { id: { in: orderedIds } } });
    if (found !== orderedIds.length) {
      return res.status(400).json({ error: "One or more members no longer exist" });
    }

    await prisma.$transaction(
      orderedIds.map((id: string, index: number) =>
        prisma.user.update({ where: { id }, data: { displayOrder: index + 1 } })
      )
    );

    return res.json({ success: true, count: orderedIds.length });
  } catch (error) {
    console.error("Reorder members error:", error);
    return res.status(500).json({ error: "Failed to reorder members" });
  }
});

// PUT /api/admin/owners-sort - Set the default ordering mode for the Owners directory.
// Merges into the shared config singleton so homepage settings are preserved.
router.put("/owners-sort", async (req: Request, res: Response) => {
  try {
    const { mode } = req.body;
    if (!isOwnerSortMode(mode)) {
      return res.status(400).json({ error: "Invalid sort mode" });
    }

    const existing = await prisma.homepageConfig.findUnique({ where: { id: "singleton" } });
    const config = { ...((existing?.config as object) || {}), ownersSort: mode };

    await prisma.homepageConfig.upsert({
      where: { id: "singleton" },
      update: { config },
      create: { id: "singleton", config },
    });

    return res.json({ success: true, mode });
  } catch (error) {
    console.error("Set owners sort error:", error);
    return res.status(500).json({ error: "Failed to save sort mode" });
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
      displayOrder,
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
    if (displayOrder !== undefined) data.displayOrder = displayOrder;

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
        displayOrder: true,
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

// POST /api/admin/vendors - Create vendor/partner with new user account
router.post("/vendors", async (req: Request, res: Response) => {
  try {
    const {
      email, password, firstName, lastName, title, phone, city, state,
      companyName, category, description, services, logo, coverImage,
      website, companyPhone, companyEmail,
      employeeCount, yearEstablished, isFeatured,
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Email, password, first name, and last name are required" });
    }
    if (!companyName) {
      return res.status(400).json({ error: "Company name is required" });
    }
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const bcrypt = require("bcryptjs");
    const passwordHash = await bcrypt.hash(password, 12);
    const vendorSlug = slugify(companyName) + "-" + Date.now().toString(36);

    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          role: "MEMBER",
          memberType: "VENDOR",
          membershipStatus: "APPROVED",
          profileStatus: "APPROVED",
          title,
          phone,
          city,
          state,
          organizationName: companyName,
          isFeaturedVendor: isFeatured || false,
          isActive: true,
          approvedAt: new Date(),
          profileCompletedAt: new Date(),
        },
      });

      const vendor = await tx.vendorProfile.create({
        data: {
          userId: user.id,
          companyName,
          slug: vendorSlug,
          category,
          description: description || null,
          services: services ? (Array.isArray(services) ? services : services.split(",").map((s: string) => s.trim()).filter(Boolean)) : [],
          logo: logo || null,
          coverImage: coverImage || null,
          website: website || null,
          phone: companyPhone || phone || null,
          email: companyEmail || email,
          city: city || null,
          state: state || null,
          country: "India",
          employeeCount: employeeCount || null,
          yearEstablished: yearEstablished ? parseInt(yearEstablished) : null,
          isFeatured: isFeatured || false,
        },
        include: {
          user: {
            select: {
              id: true, firstName: true, lastName: true, email: true,
              avatar: true, title: true, organizationName: true, city: true,
            },
          },
        },
      });

      return vendor;
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create vendor error:", error);
    return res.status(500).json({ error: "Failed to create vendor" });
  }
});

// PUT /api/admin/vendors/:id - Update vendor profile
router.put("/vendors/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { companyName, category, description, city, state, employeeCount, yearEstablished, logo, isFeatured } = req.body;

    const vendor = await prisma.vendorProfile.findUnique({ where: { id } });
    if (!vendor) {
      return res.status(404).json({ error: "Vendor profile not found" });
    }

    const updated = await prisma.vendorProfile.update({
      where: { id },
      data: {
        ...(companyName !== undefined && { companyName }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(employeeCount !== undefined && { employeeCount }),
        ...(yearEstablished !== undefined && { yearEstablished: yearEstablished ? parseInt(yearEstablished) : null }),
        ...(logo !== undefined && { logo }),
        ...(isFeatured !== undefined && { isFeatured }),
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Update vendor error:", error);
    return res.status(500).json({ error: "Failed to update vendor" });
  }
});

// DELETE /api/admin/vendors/:id - Remove vendor profile
router.delete("/vendors/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendorProfile.findUnique({ where: { id } });
    if (!vendor) {
      return res.status(404).json({ error: "Vendor profile not found" });
    }

    // Delete products first, then vendor profile
    await prisma.product.deleteMany({ where: { vendorId: id } });
    await prisma.vendorProfile.delete({ where: { id } });

    // Reset the user's featured vendor flag
    await prisma.user.update({
      where: { id: vendor.userId },
      data: { isFeaturedVendor: false },
    });

    return res.json({ deleted: true });
  } catch (error) {
    console.error("Delete vendor error:", error);
    return res.status(500).json({ error: "Failed to delete vendor" });
  }
});

// ─── INDUSTRY EXPERTS & ADVISORY BOARD ───

// Experts and advisory members share the IndustryExpert table and every field
// on it; only `kind` says which directory a record belongs to. These handlers
// serve both, so the two admin screens stay in step by construction.
const expertKind = (value: unknown): "EXPERT" | "ADVISORY" =>
  value === "ADVISORY" ? "ADVISORY" : "EXPERT";

// GET /api/admin/experts?kind= - List industry experts / advisory members
router.get("/experts", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const kind = expertKind(req.query.kind);
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [experts, total] = await Promise.all([
      prisma.industryExpert.findMany({
        where: { kind },
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
              city: true,
              membershipStatus: true,
            },
          },
        },
        skip,
        take,
        orderBy: [{ isPinned: "desc" }, { isFeatured: "desc" }, { displayOrder: "asc" }],
      }),
      prisma.industryExpert.count({ where: { kind } }),
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

// POST /api/admin/experts - Create expert / advisory member with a new user account
router.post("/experts", async (req: Request, res: Response) => {
  try {
    const kind = expertKind(req.body.kind);
    const {
      email, password, firstName, lastName, title, phone, city, state,
      organizationName, organizationRole, bio,
      expertise, currentOrganization, currentRole, yearsOfExperience,
      industryInsights, publishedArticles, speakingEngagements, awards, certifications,
      isFeatured, isPinned, avatar,
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Email, password, first name, and last name are required" });
    }
    if (!expertise || !Array.isArray(expertise) || expertise.length === 0) {
      return res.status(400).json({ error: "At least one expertise/specialization is required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const bcrypt = require("bcryptjs");
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          role: "MEMBER",
          memberType: "PROFESSIONAL",
          membershipStatus: "APPROVED",
          profileStatus: "APPROVED",
          title,
          phone,
          city,
          state,
          organizationName,
          organizationRole,
          bio,
          avatar: avatar || null,
          isFeaturedExpert: isFeatured || false,
          isActive: true,
          approvedAt: new Date(),
          profileCompletedAt: new Date(),
        },
      });

      const expert = await tx.industryExpert.create({
        data: {
          userId: user.id,
          kind,
          expertise,
          bio,
          currentOrganization: currentOrganization || organizationName,
          currentRole: currentRole || title,
          yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
          industryInsights,
          publishedArticles: publishedArticles ? publishedArticles.split("\n").filter(Boolean) : [],
          speakingEngagements: speakingEngagements ? speakingEngagements.split("\n").filter(Boolean) : [],
          awards: awards ? awards.split("\n").filter(Boolean) : [],
          certifications: certifications ? certifications.split("\n").filter(Boolean) : [],
          isFeatured: isFeatured || false,
          isPinned: isPinned || false,
        },
        include: {
          user: {
            select: {
              id: true, firstName: true, lastName: true, email: true,
              avatar: true, title: true, organizationName: true, city: true,
            },
          },
        },
      });

      return expert;
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create expert error:", error);
    return res.status(500).json({ error: "Failed to create expert" });
  }
});

// PUT /api/admin/experts/:id - Toggle expert featured status (star)
router.put("/experts/:id", async (req: Request, res: Response) => {
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

// PUT /api/admin/experts/:id/pin - Toggle expert pinned status
router.put("/experts/:id/pin", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const expert = await prisma.industryExpert.findUnique({ where: { id } });
    if (!expert) {
      return res.status(404).json({ error: "Expert profile not found" });
    }

    const updated = await prisma.industryExpert.update({
      where: { id },
      data: { isPinned: !expert.isPinned },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Toggle expert pinned error:", error);
    return res.status(500).json({ error: "Failed to update expert" });
  }
});

// PUT /api/admin/experts/:id/edit - Update expert profile
router.put("/experts/:id/edit", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      firstName, lastName, title, phone, city, state, avatar,
      organizationName, organizationRole, bio,
      expertise, currentOrganization, currentRole, yearsOfExperience,
      industryInsights, publishedArticles, speakingEngagements, awards, certifications,
      isFeatured, isPinned,
    } = req.body;

    const expert = await prisma.industryExpert.findUnique({ where: { id }, include: { user: true } });
    if (!expert) {
      return res.status(404).json({ error: "Expert not found" });
    }

    await prisma.$transaction(async (tx: any) => {
      // Update user fields
      await tx.user.update({
        where: { id: expert.userId },
        data: {
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(title !== undefined && { title }),
          ...(phone !== undefined && { phone }),
          ...(city !== undefined && { city }),
          ...(state !== undefined && { state }),
          ...(avatar !== undefined && { avatar }),
          ...(organizationName !== undefined && { organizationName }),
          ...(organizationRole !== undefined && { organizationRole }),
          ...(bio !== undefined && { bio }),
          ...(isFeatured !== undefined && { isFeaturedExpert: isFeatured }),
        },
      });

      // Update expert profile
      await tx.industryExpert.update({
        where: { id },
        data: {
          ...(expertise !== undefined && { expertise }),
          ...(bio !== undefined && { bio }),
          ...(currentOrganization !== undefined && { currentOrganization }),
          ...(currentRole !== undefined && { currentRole }),
          ...(yearsOfExperience !== undefined && { yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : null }),
          ...(industryInsights !== undefined && { industryInsights }),
          ...(publishedArticles !== undefined && { publishedArticles: Array.isArray(publishedArticles) ? publishedArticles : publishedArticles ? publishedArticles.split("\n").filter(Boolean) : undefined }),
          ...(speakingEngagements !== undefined && { speakingEngagements: Array.isArray(speakingEngagements) ? speakingEngagements : speakingEngagements ? speakingEngagements.split("\n").filter(Boolean) : undefined }),
          ...(awards !== undefined && { awards: Array.isArray(awards) ? awards : awards ? awards.split("\n").filter(Boolean) : undefined }),
          ...(certifications !== undefined && { certifications: Array.isArray(certifications) ? certifications : certifications ? certifications.split("\n").filter(Boolean) : undefined }),
          ...(isFeatured !== undefined && { isFeatured }),
          ...(isPinned !== undefined && { isPinned }),
        },
      });
    });

    const updated = await prisma.industryExpert.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true, firstName: true, lastName: true, email: true,
            avatar: true, title: true, organizationName: true, city: true,
          },
        },
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Update expert error:", error);
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

// GET /api/admin/events/:id/registrations - List registered users for an event
router.get("/events/:id/registrations", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true, title: true },
    });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: id },
      include: {
        user: {
          select: {
            id: true, firstName: true, lastName: true, email: true,
            memberType: true, avatar: true, organizationName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ event, registrations });
  } catch (error) {
    console.error("List event registrations error:", error);
    return res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

// POST /api/admin/events/:id/notify-registrant - Send email to registrant(s)
router.post("/events/:id/notify-registrant", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: "Subject and message are required" });
    }

    const event = await prisma.event.findUnique({
      where: { id },
      select: { title: true },
    });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // If userId is provided, send to one user. Otherwise, send to all registrants.
    let recipients: { email: string; firstName: string }[] = [];

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, firstName: true },
      });
      if (user) recipients = [user];
    } else {
      const registrations = await prisma.eventRegistration.findMany({
        where: { eventId: id },
        include: { user: { select: { email: true, firstName: true } } },
      });
      recipients = registrations.map((r) => r.user);
    }

    const { adminEventMessage } = await import("../templates/email.templates");
    let sentCount = 0;
    for (const recipient of recipients) {
      sendEmail(
        recipient.email,
        subject,
        adminEventMessage(recipient.firstName, event.title, message)
      );
      sentCount++;
    }

    return res.json({ sent: sentCount, total: recipients.length });
  } catch (error) {
    console.error("Notify registrant error:", error);
    return res.status(500).json({ error: "Failed to send notification" });
  }
});

// POST /api/admin/events - Create event
router.post("/events", async (req: Request, res: Response) => {
  try {
    const {
      title, type, description, venue, city, state, country,
      startDate, endDate, registrationUrl, coverImage,
      maxAttendees, isFeatured, isPublished, displayOrder,
      organizerName, organizerAvatar, agenda, highlights,
    } = req.body;

    if (!title || !type || !description || !city || !state || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const slug = slugify(title) + "-" + Date.now().toString(36);

    const event = await prisma.event.create({
      data: {
        title, slug, type, description, venue, city, state, country,
        startDate: new Date(startDate), endDate: new Date(endDate),
        registrationUrl, coverImage, maxAttendees,
        isFeatured: isFeatured || false,
        isPublished: isPublished !== false,
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
      title, type, description, venue, city, state, country,
      startDate, endDate, registrationUrl, coverImage,
      maxAttendees, isFeatured, isPublished, displayOrder,
      organizerName, organizerAvatar, agenda, highlights,
    } = req.body;

    const data: any = {};
    if (title !== undefined) { data.title = title; data.slug = slugify(title) + "-" + Date.now().toString(36); }
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
    if (organizerName !== undefined) data.organizerName = organizerName || null;
    if (organizerAvatar !== undefined) data.organizerAvatar = organizerAvatar || null;
    if (agenda !== undefined) data.agenda = agenda || null;
    if (highlights !== undefined) data.highlights = highlights;

    const updated = await prisma.event.update({
      where: { id },
      data,
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        _count: { select: { registrations: true } },
      },
    });

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

    // Delete registrations first, then the event (in a transaction)
    await prisma.$transaction([
      prisma.eventRegistration.deleteMany({ where: { eventId: id } }),
      prisma.event.delete({ where: { id } }),
    ]);

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

// POST /api/admin/feed - Admin creates a post
router.post("/feed", async (req: Request, res: Response) => {
  try {
    const { title, brief, content, type, mediaUrls, youtubeUrl, thumbnailUrl, isPublic } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
    if (!brief?.trim()) return res.status(400).json({ error: "Brief is required" });
    if (!content?.trim()) return res.status(400).json({ error: "Content is required" });

    const post = await prisma.feedPost.create({
      data: {
        title: title.trim(),
        brief: brief.trim(),
        content,
        type: type || "GENERAL",
        mediaUrls: mediaUrls || [],
        youtubeUrl: youtubeUrl || null,
        thumbnailUrl: thumbnailUrl || null,
        isPublic: isPublic !== false,
        authorId: req.user!.userId,
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true, title: true, role: true, memberType: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error("Admin create post error:", error);
    return res.status(500).json({ error: "Failed to create post" });
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
      await prisma.$transaction([
        prisma.comment.deleteMany({ where: { postId: id } }),
        prisma.like.deleteMany({ where: { postId: id } }),
        prisma.savedPost.deleteMany({ where: { postId: id } }),
        prisma.feedPost.delete({ where: { id } }),
      ]);
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
      totalAdvisory,
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
      prisma.industryExpert.count({ where: { kind: "EXPERT" } }),
      prisma.industryExpert.count({ where: { kind: "ADVISORY" } }),
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
      totalAdvisory,
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

    // Strip sensitive data
    const { passwordHash, googleId, ...safeUser } = user as any;
    const response: any = { ...safeUser };
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
            status: "PENDING_REVIEW" as const,
          },
          data: { status: "APPROVED" as const },
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

      // Fire-and-forget email
      sendEmail(user.email, "Profile Approved - Hotel Sircle", emailTemplates.profileApproved(user.firstName));
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

      // Fire-and-forget email
      sendEmail(user.email, "Profile Review Update - Hotel Sircle", emailTemplates.profileRejected(user.firstName, reason));
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

    // Fire-and-forget email
    sendEmail(user.email, "Profile Revision Requested - Hotel Sircle", emailTemplates.revisionRequested(user.firstName, flaggedFields, adminNote));

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
      include: { user: { select: { id: true, email: true, firstName: true } } },
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

    // Fire-and-forget email
    if (action === "APPROVE") {
      sendEmail(product.user.email, "Product Approved - Hotel Sircle", emailTemplates.productApproved(product.user.firstName, product.name));
    } else {
      sendEmail(product.user.email, "Product Review Update - Hotel Sircle", emailTemplates.productRejected(product.user.firstName, product.name, note));
    }

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

    const where = { status: "PENDING" as const };

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
      include: { user: { select: { id: true, email: true, firstName: true } } },
    });

    if (!draft) {
      return res.status(404).json({ error: "Profile edit draft not found" });
    }

    if (draft.status !== "PENDING") {
      return res.status(400).json({ error: "Draft is not in PENDING status" });
    }

    if (action === "APPROVE") {
      // Apply draftData fields to the user model. Drafts are captured straight
      // from the profile forms, so they carry the form's field names too.
      const draftData = normalizeProfileFields(draft.draftData as Record<string, any>);

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
          status: "APPROVED" as const,
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

      // Fire-and-forget email
      sendEmail(draft.user.email, "Profile Edit Approved - Hotel Sircle", emailTemplates.profileEditApproved(draft.user.firstName));
    } else {
      // REJECT
      await prisma.profileEditDraft.update({
        where: { id: draftId },
        data: {
          status: "REJECTED" as const,
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

      // Fire-and-forget email
      sendEmail(draft.user.email, "Profile Edit Update - Hotel Sircle", emailTemplates.profileEditRejected(draft.user.firstName, note));
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

// PUT /api/admin/profile/:userId/edit - Admin directly edits/fills user profile
router.put("/profile/:userId/edit", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { hotels: true, vendorProfile: { include: { products: true } }, expertProfile: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const {
      bio,
      phone,
      avatar,
      linkedinUrl,
      city,
      state,
      organizationName,
      organizationRole,
      achievements,
      industryContributions,
      businessOverview,
      yearsInIndustry,
      title,
      hotels,
      vendorProfile,
      products,
      expertProfile,
    } = normalizeProfileFields(req.body);

    const result = await prisma.$transaction(async (tx) => {
      // Update user fields
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          ...(bio !== undefined && { bio }),
          ...(phone !== undefined && { phone }),
          ...(avatar !== undefined && { avatar }),
          ...(linkedinUrl !== undefined && { linkedinUrl }),
          ...(city !== undefined && { city }),
          ...(state !== undefined && { state }),
          ...(organizationName !== undefined && { organizationName }),
          ...(organizationRole !== undefined && { organizationRole }),
          ...(achievements !== undefined && { achievements }),
          ...(industryContributions !== undefined && { industryContributions }),
          ...(businessOverview !== undefined && { businessOverview }),
          ...(yearsInIndustry !== undefined && { yearsInIndustry: parseInt(yearsInIndustry) || null }),
          ...(title !== undefined && { title }),
        },
      });

      // HOTEL_OWNER: upsert hotels
      if (user.memberType === "HOTEL_OWNER" && Array.isArray(hotels)) {
        // Delete existing hotels and recreate
        await tx.hotel.deleteMany({ where: { ownerId: userId } });
        for (const hotel of hotels) {
          const slug = hotel.name
            ? hotel.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36)
            : "hotel-" + Date.now().toString(36);
          await tx.hotel.create({
            data: {
              name: hotel.name || "",
              slug,
              description: hotel.description,
              city: hotel.city || "",
              state: hotel.state || "",
              country: hotel.country || "India",
              address: hotel.address,
              pincode: hotel.pincode,
              rooms: hotel.rooms ? parseInt(hotel.rooms) : undefined,
              starRating: hotel.starRating ? parseInt(hotel.starRating) : undefined,
              website: hotel.website,
              phone: hotel.phone,
              email: hotel.email,
              propertyType: hotel.propertyType,
              photos: hotel.photos || [],
              logo: hotel.logo,
              coverImage: hotel.coverImage,
              ownerId: userId,
            },
          });
        }
      }

      // VENDOR: upsert vendor profile
      if (user.memberType === "VENDOR" && vendorProfile) {
        if (user.vendorProfile) {
          await tx.vendorProfile.update({
            where: { userId },
            data: {
              companyName: vendorProfile.companyName || user.vendorProfile.companyName,
              description: vendorProfile.description,
              category: vendorProfile.category || user.vendorProfile.category,
              services: vendorProfile.services || user.vendorProfile.services,
              portfolio: vendorProfile.portfolio || user.vendorProfile.portfolio,
              logo: vendorProfile.logo,
              coverImage: vendorProfile.coverImage,
              city: vendorProfile.city || user.vendorProfile.city,
              state: vendorProfile.state || user.vendorProfile.state,
              website: vendorProfile.website,
              phone: vendorProfile.phone,
              email: vendorProfile.email,
              employeeCount: vendorProfile.employeeCount,
              yearEstablished: vendorProfile.yearEstablished
                ? parseInt(vendorProfile.yearEstablished)
                : undefined,
              previousClients: vendorProfile.previousClients || [],
              caseStudies: vendorProfile.caseStudies || [],
              certifications: vendorProfile.certifications || [],
              gstNumber: vendorProfile.gstNumber,
              panNumber: vendorProfile.panNumber,
              msmeRegistration: vendorProfile.msmeRegistration,
              tradeLicense: vendorProfile.tradeLicense,
              isoCertification: vendorProfile.isoCertification,
              dunsNumber: vendorProfile.dunsNumber,
              annualTurnover: vendorProfile.annualTurnover,
              hotelClientsServed: vendorProfile.hotelClientsServed
                ? parseInt(vendorProfile.hotelClientsServed)
                : undefined,
              serviceRegions: vendorProfile.serviceRegions || [],
              insuranceDetails: vendorProfile.insuranceDetails,
            },
          });
        } else {
          const vendorSlug = (vendorProfile.companyName || "vendor")
            .toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
          await tx.vendorProfile.create({
            data: {
              companyName: vendorProfile.companyName || "",
              slug: vendorSlug,
              description: vendorProfile.description,
              category: vendorProfile.category || "TECHNOLOGY",
              services: vendorProfile.services || [],
              portfolio: vendorProfile.portfolio || [],
              city: vendorProfile.city || "",
              state: vendorProfile.state || "",
              website: vendorProfile.website,
              phone: vendorProfile.phone,
              email: vendorProfile.email,
              employeeCount: vendorProfile.employeeCount,
              yearEstablished: vendorProfile.yearEstablished
                ? parseInt(vendorProfile.yearEstablished)
                : undefined,
              previousClients: vendorProfile.previousClients || [],
              caseStudies: vendorProfile.caseStudies || [],
              certifications: vendorProfile.certifications || [],
              gstNumber: vendorProfile.gstNumber,
              panNumber: vendorProfile.panNumber,
              userId,
            },
          });
        }
      }

      // EXPERT: upsert expert profile
      if (
        (user.memberType === "CONSULTANT" || user.memberType === "PROFESSIONAL") &&
        expertProfile
      ) {
        if (user.expertProfile) {
          await tx.industryExpert.update({
            where: { userId },
            data: {
              expertise: expertProfile.expertise || user.expertProfile.expertise,
              bio: expertProfile.bio,
              currentOrganization: expertProfile.currentOrganization,
              currentRole: expertProfile.currentRole,
              yearsOfExperience: expertProfile.yearsOfExperience
                ? parseInt(expertProfile.yearsOfExperience)
                : undefined,
              industryInsights: expertProfile.industryInsights,
              publishedArticles: expertProfile.publishedArticles || [],
              speakingEngagements: expertProfile.speakingEngagements || [],
              awards: expertProfile.awards || [],
              certifications: expertProfile.certifications || [],
            },
          });
        } else {
          await tx.industryExpert.create({
            data: {
              expertise: expertProfile.expertise || [],
              bio: expertProfile.bio,
              currentOrganization: expertProfile.currentOrganization,
              currentRole: expertProfile.currentRole,
              yearsOfExperience: expertProfile.yearsOfExperience
                ? parseInt(expertProfile.yearsOfExperience)
                : undefined,
              industryInsights: expertProfile.industryInsights,
              publishedArticles: expertProfile.publishedArticles || [],
              speakingEngagements: expertProfile.speakingEngagements || [],
              awards: expertProfile.awards || [],
              certifications: expertProfile.certifications || [],
              userId,
            },
          });
        }
      }

      return updatedUser;
    });

    return res.json({ success: true, user: result });
  } catch (error) {
    console.error("Admin profile edit error:", error);
    return res.status(500).json({ error: "Failed to edit profile" });
  }
});

// GET /api/admin/homepage-config — Get homepage config
router.get("/homepage-config", async (_req: Request, res: Response) => {
  try {
    const row = await prisma.homepageConfig.findUnique({ where: { id: "singleton" } });
    return res.json(row?.config || {});
  } catch (error) {
    console.error("Get homepage config error:", error);
    return res.status(500).json({ error: "Failed to get homepage config" });
  }
});

// PUT /api/admin/homepage-config — Save homepage config
router.put("/homepage-config", async (req: Request, res: Response) => {
  try {
    const config = req.body;
    const row = await prisma.homepageConfig.upsert({
      where: { id: "singleton" },
      update: { config },
      create: { id: "singleton", config },
    });
    return res.json({ success: true, config: row.config });
  } catch (error) {
    console.error("Save homepage config error:", error);
    return res.status(500).json({ error: "Failed to save homepage config" });
  }
});

export default router;
