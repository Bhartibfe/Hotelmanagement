import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AUTH_CONFIG } from "../config/auth";
import { Role, MembershipStatus } from "@hospitality/database";

export interface AuthPayload {
  userId: string;
  email: string;
  role: Role;
  membershipStatus: MembershipStatus;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "You need to be signed in to do that. Please sign in and try again." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, AUTH_CONFIG.jwtSecret) as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Your session has expired. Please sign in again to continue." });
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "You need to be signed in to do that. Please sign in and try again." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Your account does not have permission to do that. It needs one of these roles: ${roles.join(", ")}.` });
    }
    next();
  };
};

export const requireApproved = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "You need to be signed in to do that. Please sign in and try again." });
  }
  if (req.user.role === "ADMIN") {
    return next();
  }
  if (req.user.membershipStatus !== "APPROVED") {
    return res.status(403).json({ error: "Your membership is still awaiting approval, so this is not available yet. You will be emailed once an administrator reviews it." });
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "You need to be signed in to do that. Please sign in and try again." });
  }
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "This is an administrator-only action, and your account is not an administrator." });
  }
  next();
};
