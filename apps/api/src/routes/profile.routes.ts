import { Router, Request, Response } from "express";
import { prisma } from "@hospitality/database";
import { authenticate, requireApproved } from "../middleware/auth";
import { slugify } from "../utils/slugify";

const router = Router();

// ─── POST /api/profile/complete ─── Complete profile after registration
router.post("/complete", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.profileStatus !== "INCOMPLETE" && user.profileStatus !== "REVISION_REQUESTED") {
      return res.status(400).json({ error: "Profile has already been submitted" });
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
      // Member-type-specific data
      hotels,
      vendorProfile,
      products,
      expertProfile,
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // Update user profile fields
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
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
          yearsInIndustry: yearsInIndustry ? parseInt(yearsInIndustry) : undefined,
          title,
          profileStatus: "PENDING_REVIEW",
          profileCompletedAt: new Date(),
        },
      });

      // HOTEL_OWNER: create Hotel records
      if (user.memberType === "HOTEL_OWNER" && Array.isArray(hotels) && hotels.length > 0) {
        for (const hotel of hotels) {
          const hotelSlug = slugify(hotel.name) + "-" + Date.now().toString(36);
          await tx.hotel.create({
            data: {
              name: hotel.name,
              slug: hotelSlug,
              description: hotel.description,
              city: hotel.city,
              state: hotel.state,
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

      // VENDOR: create VendorProfile + Product records
      if (user.memberType === "VENDOR" && vendorProfile) {
        const vendorSlug = slugify(vendorProfile.companyName) + "-" + Date.now().toString(36);
        const createdVendor = await tx.vendorProfile.create({
          data: {
            companyName: vendorProfile.companyName,
            slug: vendorSlug,
            description: vendorProfile.description,
            category: vendorProfile.category,
            services: vendorProfile.services || [],
            portfolio: vendorProfile.portfolio || [],
            logo: vendorProfile.logo,
            coverImage: vendorProfile.coverImage,
            city: vendorProfile.city,
            state: vendorProfile.state,
            country: vendorProfile.country || "India",
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
            userId,
          },
        });

        // Create products if provided
        if (Array.isArray(products) && products.length > 0) {
          for (const product of products) {
            const productSlug = slugify(product.name) + "-" + Date.now().toString(36);
            await tx.product.create({
              data: {
                name: product.name,
                slug: productSlug,
                category: product.category,
                description: product.description,
                priceRange: product.priceRange,
                photos: product.photos || [],
                companyName: product.companyName || vendorProfile.companyName,
                status: "PENDING_REVIEW",
                vendorId: createdVendor.id,
                userId,
              },
            });
          }
        }
      }

      // CONSULTANT / PROFESSIONAL: create IndustryExpert record
      if (
        (user.memberType === "CONSULTANT" || user.memberType === "PROFESSIONAL") &&
        expertProfile
      ) {
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

      return updatedUser;
    });

    return res.json(result);
  } catch (error) {
    console.error("Profile complete error:", error);
    return res.status(500).json({ error: "Failed to complete profile" });
  }
});

// ─── GET /api/profile/me ─── Get full profile for current user
router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        hotels: true,
        vendorProfile: {
          include: {
            products: true,
          },
        },
        expertProfile: true,
        profileRevisions: {
          where: { status: "OPEN" },
          orderBy: { createdAt: "desc" },
        },
        profileEditDrafts: {
          where: { status: "PENDING" },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Omit sensitive fields
    const { passwordHash, googleId, ...profile } = user as any;

    return res.json(profile);
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// ─── PUT /api/profile/resubmit ─── Resubmit profile after revision request
router.put("/resubmit", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.membershipStatus !== "REVISION_REQUESTED") {
      return res.status(400).json({
        error: "Profile resubmission is only allowed when revision has been requested",
      });
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
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // Resolve all open profile revisions
      await tx.profileRevision.updateMany({
        where: { userId, status: "OPEN" },
        data: {
          status: "RESOLVED",
          resolvedAt: new Date(),
        },
      });

      // Update user profile fields and reset statuses
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
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
          yearsInIndustry: yearsInIndustry ? parseInt(yearsInIndustry) : undefined,
          title,
          membershipStatus: "PENDING",
          profileStatus: "PENDING_REVIEW",
          profileCompletedAt: new Date(),
        },
      });

      // HOTEL_OWNER: delete existing hotels and recreate
      if (user.memberType === "HOTEL_OWNER" && Array.isArray(hotels) && hotels.length > 0) {
        await tx.hotel.deleteMany({ where: { ownerId: userId } });
        for (const hotel of hotels) {
          const hotelSlug = slugify(hotel.name) + "-" + Date.now().toString(36);
          await tx.hotel.create({
            data: {
              name: hotel.name,
              slug: hotelSlug,
              description: hotel.description,
              city: hotel.city,
              state: hotel.state,
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

      // VENDOR: upsert VendorProfile and recreate products
      if (user.memberType === "VENDOR" && vendorProfile) {
        // Delete existing products and vendor profile, then recreate
        const existingVendor = await tx.vendorProfile.findUnique({
          where: { userId },
        });

        if (existingVendor) {
          await tx.product.deleteMany({ where: { vendorId: existingVendor.id } });
          await tx.vendorProfile.delete({ where: { userId } });
        }

        const vendorSlug = slugify(vendorProfile.companyName) + "-" + Date.now().toString(36);
        const createdVendor = await tx.vendorProfile.create({
          data: {
            companyName: vendorProfile.companyName,
            slug: vendorSlug,
            description: vendorProfile.description,
            category: vendorProfile.category,
            services: vendorProfile.services || [],
            portfolio: vendorProfile.portfolio || [],
            logo: vendorProfile.logo,
            coverImage: vendorProfile.coverImage,
            city: vendorProfile.city,
            state: vendorProfile.state,
            country: vendorProfile.country || "India",
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
            userId,
          },
        });

        if (Array.isArray(products) && products.length > 0) {
          for (const product of products) {
            const productSlug = slugify(product.name) + "-" + Date.now().toString(36);
            await tx.product.create({
              data: {
                name: product.name,
                slug: productSlug,
                category: product.category,
                description: product.description,
                priceRange: product.priceRange,
                photos: product.photos || [],
                companyName: product.companyName || vendorProfile.companyName,
                status: "PENDING_REVIEW",
                vendorId: createdVendor.id,
                userId,
              },
            });
          }
        }
      }

      // CONSULTANT / PROFESSIONAL: upsert IndustryExpert
      if (
        (user.memberType === "CONSULTANT" || user.memberType === "PROFESSIONAL") &&
        expertProfile
      ) {
        await tx.industryExpert.deleteMany({ where: { userId } });
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

      return updatedUser;
    });

    return res.json(result);
  } catch (error) {
    console.error("Profile resubmit error:", error);
    return res.status(500).json({ error: "Failed to resubmit profile" });
  }
});

// ─── POST /api/profile/products ─── Add a new product (approved vendors only)
router.post(
  "/products",
  authenticate,
  requireApproved,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.memberType !== "VENDOR") {
        return res.status(403).json({ error: "Only vendors can add products" });
      }

      const vendorProfile = await prisma.vendorProfile.findUnique({
        where: { userId },
      });
      if (!vendorProfile) {
        return res.status(400).json({ error: "Vendor profile not found. Complete your profile first." });
      }

      const { name, category, description, priceRange, photos, companyName } = req.body;

      if (!name || !category) {
        return res.status(400).json({ error: "Product name and category are required" });
      }

      const productSlug = slugify(name) + "-" + Date.now().toString(36);

      const product = await prisma.product.create({
        data: {
          name,
          slug: productSlug,
          category,
          description,
          priceRange,
          photos: photos || [],
          companyName: companyName || vendorProfile.companyName,
          status: "PENDING_REVIEW",
          vendorId: vendorProfile.id,
          userId,
        },
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error("Create product error:", error);
      return res.status(500).json({ error: "Failed to create product" });
    }
  }
);

// ─── GET /api/profile/products ─── List products for current vendor
router.get("/products", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!vendorProfile) {
      return res.json([]);
    }

    const products = await prisma.product.findMany({
      where: { vendorId: vendorProfile.id },
      orderBy: { createdAt: "desc" },
    });

    return res.json(products);
  } catch (error) {
    console.error("List products error:", error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ─── PUT /api/profile/products/:id ─── Update own product (only if pending review)
router.put("/products/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.userId !== userId) {
      return res.status(403).json({ error: "You can only update your own products" });
    }

    if (product.status !== "PENDING_REVIEW") {
      return res.status(400).json({
        error: "Only products with PENDING_REVIEW status can be updated",
      });
    }

    const { name, category, description, priceRange, photos, companyName } = req.body;

    const data: any = {};
    if (name !== undefined) {
      data.name = name;
      data.slug = slugify(name) + "-" + Date.now().toString(36);
    }
    if (category !== undefined) data.category = category;
    if (description !== undefined) data.description = description;
    if (priceRange !== undefined) data.priceRange = priceRange;
    if (photos !== undefined) data.photos = photos;
    if (companyName !== undefined) data.companyName = companyName;

    const updated = await prisma.product.update({
      where: { id },
      data,
    });

    return res.json(updated);
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({ error: "Failed to update product" });
  }
});

// ─── POST /api/profile/edit-draft ─── Create an edit draft (approved users only)
router.post(
  "/edit-draft",
  authenticate,
  requireApproved,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.userId;
      const { draftData } = req.body;

      if (!draftData) {
        return res.status(400).json({ error: "draftData is required" });
      }

      // Check if there is already a pending edit draft
      const existingDraft = await prisma.profileEditDraft.findFirst({
        where: { userId, status: "PENDING" },
      });
      if (existingDraft) {
        return res.status(400).json({
          error: "You already have a pending edit draft. Wait for it to be reviewed.",
        });
      }

      const [draft] = await prisma.$transaction([
        prisma.profileEditDraft.create({
          data: {
            draftData,
            status: "PENDING",
            userId,
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { profileStatus: "EDIT_PENDING" },
        }),
      ]);

      return res.status(201).json(draft);
    } catch (error) {
      console.error("Create edit draft error:", error);
      return res.status(500).json({ error: "Failed to create edit draft" });
    }
  }
);

// ─── GET /api/profile/edit-draft ─── Get pending edit draft for current user
router.get("/edit-draft", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const draft = await prisma.profileEditDraft.findFirst({
      where: { userId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    if (!draft) {
      return res.status(404).json({ error: "No pending edit draft found" });
    }

    return res.json(draft);
  } catch (error) {
    console.error("Get edit draft error:", error);
    return res.status(500).json({ error: "Failed to fetch edit draft" });
  }
});

export default router;
