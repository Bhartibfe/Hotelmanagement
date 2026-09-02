import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password must be at most 72 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  memberType: z.enum(["HOTEL_OWNER", "VENDOR", "CONSULTANT", "PROFESSIONAL", "OTHER"]).optional(),
  title: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  organizationName: z.string().optional(),
  organizationRole: z.string().optional(),
  businessOverview: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const hotelUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  pincode: z.string().optional(),
  rooms: z.number().int().min(0).optional(),
  starRating: z.number().int().min(1).max(5).optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  propertyType: z.string().optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  photos: z.array(z.string()).optional(),
}).strict();

export const vendorUpdateSchema = z.object({
  companyName: z.string().optional(),
  category: z.enum(["TECHNOLOGY", "ARCHITECTURE", "INTERIOR_DESIGN", "HVAC", "PROCUREMENT", "SECURITY", "MARKETING", "RECRUITMENT", "CONSULTING", "LEGAL", "FINANCE"]).optional(),
  description: z.string().optional(),
  services: z.array(z.string()).optional(),
  portfolio: z.array(z.string()).optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  employeeCount: z.string().optional(),
  yearEstablished: z.number().int().optional(),
  previousClients: z.array(z.string()).optional(),
  caseStudies: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  msmeRegistration: z.string().optional(),
  tradeLicense: z.string().optional(),
  isoCertification: z.string().optional(),
  dunsNumber: z.string().optional(),
  annualTurnover: z.string().optional(),
  hotelClientsServed: z.number().int().optional(),
  serviceRegions: z.array(z.string()).optional(),
  insuranceDetails: z.string().optional(),
}).strict();

export const connectionSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
  type: z.enum(["FOLLOW", "CONNECTION", "BUSINESS_REQUEST"]),
  message: z.string().optional(),
});

export const eventCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["CONFERENCE", "SUMMIT", "NETWORKING", "WEBINAR"]),
  description: z.string().min(1, "Description is required"),
  venue: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().optional(),
  startDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid start date"),
  endDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid end date"),
  registrationUrl: z.string().url().optional().or(z.literal("")),
  coverImage: z.string().optional(),
  maxAttendees: z.number().int().min(1).optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

/*
  Both middlewares hand the ZodError to the shared error handler rather than
  answering themselves. That handler turns the field list into one readable
  sentence — "Email: Invalid email format · Password must be at least 8
  characters" — instead of the bare "Validation failed" that clients which only
  read `error` used to show, while still sending the per-field `errors` array.
*/
export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return next(result.error);
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) return next(result.error);
    (req as any).validatedQuery = result.data;
    next();
  };
}
