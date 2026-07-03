import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { AUTH_CONFIG } from "../config/auth";
import { AuthPayload } from "../middleware/auth";

export const generateTokens = (payload: AuthPayload) => {
  const tokenPayload = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    membershipStatus: payload.membershipStatus,
  };

  const accessToken = jwt.sign(
    tokenPayload,
    AUTH_CONFIG.jwtSecret as Secret,
    { expiresIn: AUTH_CONFIG.jwtExpiresIn } as SignOptions
  );

  const refreshToken = jwt.sign(
    tokenPayload,
    AUTH_CONFIG.jwtRefreshSecret as Secret,
    { expiresIn: AUTH_CONFIG.jwtRefreshExpiresIn } as SignOptions
  );

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string): AuthPayload => {
  return jwt.verify(token, AUTH_CONFIG.jwtRefreshSecret as Secret) as AuthPayload;
};
