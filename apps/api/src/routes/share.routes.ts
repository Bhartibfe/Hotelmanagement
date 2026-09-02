import { Router, Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "@hospitality/database";
import { oversizedImageError } from "../utils/media";
import { authenticate } from "../middleware/auth";
import { slugify } from "../utils/slugify";
import { normalizeProfileFields } from "../utils/profileFields";

const router = Router();

// POST /api/share/create-token — Authenticated user generates a share link
router.post("/create-token", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.memberType !== "HOTEL_OWNER" && user.memberType !== "VENDOR") {
      return res.status(400).json({ error: "Share is only available for Hotel Owners and Vendors" });
    }

    if (user.profileStatus !== "INCOMPLETE") {
      return res.status(400).json({ error: "Profile has already been submitted" });
    }

    const { email } = req.body || {};

    // Expire any existing unused tokens for this user
    await prisma.profileShareToken.updateMany({
      where: { userId, isUsed: false },
      data: { isUsed: true },
    });

    // Create new token with 7-day expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const token = crypto.randomBytes(32).toString("hex");
    const shareToken = await prisma.profileShareToken.create({
      data: {
        token,
        userId,
        memberType: user.memberType,
        email: email || null,
        expiresAt,
      },
    });

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const shareUrl = `${baseUrl}/shared-profile/${shareToken.token}`;

    return res.json({
      token: shareToken.token,
      shareUrl,
      expiresAt: shareToken.expiresAt,
    });
  } catch (error) {
    console.error("Create share token error:", error);
    return res.status(500).json({ error: "Failed to create share link" });
  }
});

// GET /api/share/validate/:token — Public: validate a share token
router.get("/validate/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const shareToken = await prisma.profileShareToken.findUnique({
      where: { token },
      include: {
        user: {
          select: { firstName: true, lastName: true, memberType: true },
        },
      },
    });

    if (!shareToken) {
      return res.status(404).json({ error: "Invalid share link", valid: false });
    }

    if (shareToken.isUsed) {
      return res.status(400).json({ error: "This share link has already been used", valid: false });
    }

    if (new Date() > shareToken.expiresAt) {
      return res.status(400).json({ error: "This share link has expired", valid: false });
    }

    return res.json({
      valid: true,
      memberType: shareToken.memberType,
      userName: `${shareToken.user.firstName} ${shareToken.user.lastName}`,
    });
  } catch (error) {
    console.error("Validate share token error:", error);
    return res.status(500).json({ error: "Failed to validate share link" });
  }
});

// POST /api/share/submit/:token — Public: submit profile on behalf of user
router.post("/submit/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const shareToken = await prisma.profileShareToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!shareToken) {
      return res.status(404).json({ error: "Invalid share link" });
    }

    if (shareToken.isUsed) {
      return res.status(400).json({ error: "This share link has already been used" });
    }

    if (new Date() > shareToken.expiresAt) {
      return res.status(400).json({ error: "This share link has expired" });
    }

    const userId = shareToken.userId;
    const user = shareToken.user;

    if (user.profileStatus !== "INCOMPLETE") {
      return res.status(400).json({ error: "Profile has already been completed" });
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
    } = normalizeProfileFields(req.body);

    // Backstop for the client-side downscale — see utils/media.ts. The client
    // resizes before sending; this makes sure nothing multi-megabyte lands in
    // the database if that ever fails or is bypassed.
    const oversized = oversizedImageError([{ label: "Profile photo", value: avatar }]);
    if (oversized) return res.status(413).json({ error: oversized });

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

      // Mark token as used
      await tx.profileShareToken.update({
        where: { id: shareToken.id },
        data: { isUsed: true, usedAt: new Date() },
      });

      return updatedUser;
    });

    return res.json({ success: true, message: "Profile submitted successfully" });
  } catch (error) {
    console.error("Share submit error:", error);
    return res.status(500).json({ error: "Failed to submit profile" });
  }
});

export default router;
