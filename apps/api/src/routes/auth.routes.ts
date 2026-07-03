import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "@hospitality/database";
import { AUTH_CONFIG } from "../config/auth";
import { generateTokens, verifyRefreshToken } from "../utils/jwt";
import { authenticate } from "../middleware/auth";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      salutation,
      memberType,
      title,
      phone,
      city,
      state,
      organizationName,
      organizationRole,
      businessOverview,
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, AUTH_CONFIG.saltRounds);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        salutation,
        role: "MEMBER",
        membershipStatus: "PENDING",
        memberType,
        title,
        phone,
        city,
        state,
        organizationName,
        organizationRole,
        businessOverview,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        salutation: true,
        role: true,
        membershipStatus: true,
        profileStatus: true,
        memberType: true,
        title: true,
        avatar: true,
        organizationName: true,
        createdAt: true,
      },
    });

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      membershipStatus: user.membershipStatus,
    });

    return res.status(201).json({ user, ...tokens });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "Account is deactivated" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      membershipStatus: user.membershipStatus,
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        salutation: user.salutation,
        role: user.role,
        membershipStatus: user.membershipStatus,
        profileStatus: user.profileStatus,
        memberType: user.memberType,
        title: user.title,
        avatar: user.avatar,
        organizationName: user.organizationName,
      },
      ...tokens,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
});

// POST /api/auth/refresh
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      membershipStatus: user.membershipStatus,
    });

    return res.json(tokens);
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        salutation: true,
        role: true,
        memberType: true,
        membershipStatus: true,
        profileStatus: true,
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
        isActive: true,
        approvedAt: true,
        rejectionReason: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
});

export default router;
