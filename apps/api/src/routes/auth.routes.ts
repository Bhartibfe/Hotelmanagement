import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "@hospitality/database";
import { AUTH_CONFIG } from "../config/auth";
import { generateTokens, verifyRefreshToken } from "../utils/jwt";
import { authenticate } from "../middleware/auth";
import { validate, registerSchema, loginSchema } from "../utils/validation";
import { sendEmail } from "../services/email.service";
import { welcomeEmail } from "../templates/email.templates";

const router = Router();

// POST /api/auth/register
router.post("/register", validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      memberType,
      title,
      phone,
      city,
      state,
      organizationName,
      organizationRole,
      businessOverview,
    } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "An account already exists for this email address. Try signing in instead, or use a different email." });
    }

    const passwordHash = await bcrypt.hash(password, AUTH_CONFIG.saltRounds);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
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

    // Fire-and-forget welcome email
    sendEmail(user.email, "Welcome to Hotel Sircle", welcomeEmail(user.firstName));

    return res.status(201).json({ user, ...tokens });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "We could not create your account because of a server problem. Please try again in a moment." });
  }
});

// POST /api/auth/login
router.post("/login", validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    // Deliberately identical wording for "no such account" and "wrong
    // password": naming which one was wrong lets anyone probe the site for
    // registered addresses.
    const REJECTED = "That email and password do not match an account. Check both and try again.";

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: REJECTED });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: REJECTED });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: "This account has been deactivated. Contact an administrator to have it restored." });
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
    return res.status(500).json({ error: "We could not sign you in because of a server problem. Please try again in a moment." });
  }
});

// POST /api/auth/refresh
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "No session token was sent. Please sign in again." });
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Your session is no longer valid. Please sign in again." });
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      membershipStatus: user.membershipStatus,
    });

    return res.json(tokens);
  } catch {
    return res.status(401).json({ error: "Your session has expired. Please sign in again." });
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
    return res.status(500).json({ error: "We could not load your profile because of a server problem. Please refresh the page." });
  }
});

// POST /api/auth/logout
router.post("/logout", (_req: Request, res: Response) => {
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
