import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.stack || err.message);

  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({ field: e.path.join("."), message: e.message }));
    return res.status(400).json({ error: "Validation failed", errors });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal server error" });
};
