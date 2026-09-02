import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  statusCode: number;
  fields?: { field: string; message: string }[];
  constructor(message: string, statusCode: number, fields?: { field: string; message: string }[]) {
    super(message);
    this.statusCode = statusCode;
    this.fields = fields;
  }
}

// "organizationName" -> "Organization name", so validation text reads like
// prose in whichever client renders it.
const prettyField = (field: string) =>
  field
    .split(".")
    .pop()!
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());

/*
  Prisma's own messages are multi-line, quote the generated SQL and name
  internal model fields — useless in a toast. Translate the handful that are
  actually caused by user input into a sentence, and let the rest fall through
  to the generic 500.
*/
const PRISMA_CODES: Record<string, (meta: any) => { status: number; message: string }> = {
  P2002: (meta) => {
    const targets: string[] = Array.isArray(meta?.target) ? meta.target : meta?.target ? [meta.target] : [];
    const named = targets.map(prettyField).join(" and ");
    return {
      status: 409,
      message: named
        ? `That ${named.toLowerCase()} is already in use. Please choose a different one.`
        : "A record with these details already exists.",
    };
  },
  P2003: () => ({
    status: 400,
    message: "That request refers to a record that does not exist. Refresh the page and try again.",
  }),
  P2025: () => ({
    status: 404,
    message: "The record you are trying to change no longer exists. It may have been deleted.",
  }),
  P2000: (meta) => ({
    status: 400,
    message: meta?.column_name
      ? `The value for ${prettyField(String(meta.column_name)).toLowerCase()} is too long.`
      : "One of the values you entered is too long.",
  }),
  P2011: (meta) => ({
    status: 400,
    message: meta?.constraint
      ? `${prettyField(String(meta.constraint))} is required.`
      : "A required field was left empty.",
  }),
  P1001: () => ({ status: 503, message: "The database is unreachable. Please try again in a moment." }),
  P1008: () => ({ status: 503, message: "The database took too long to respond. Please try again." }),
};

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(`Error on ${req.method} ${req.originalUrl}:`, err?.stack || err?.message || err);

  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({ field: e.path.join("."), message: e.message }));
    // The summary repeats the field detail so a client that only reads `error`
    // still shows something a member can act on.
    const summary = errors
      .map((e) => {
        if (!e.field) return e.message;
        const label = prettyField(e.field);
        // "First name is required" already names its field; prefixing it would
        // read "First name: First name is required".
        return e.message.toLowerCase().startsWith(label.toLowerCase()) ? e.message : `${label}: ${e.message}`;
      })
      .join(" · ");
    return res.status(400).json({ error: summary || "Some of the details you entered are not valid.", errors });
  }

  // express.json() rejects a malformed body with a SyntaxError carrying `body`.
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "The request body was not valid JSON." });
  }

  if (err?.type === "entity.too.large") {
    return res.status(413).json({ error: "That upload is too large. The limit is 10MB." });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.fields ? { errors: err.fields } : {}),
    });
  }

  const prisma = err?.code && PRISMA_CODES[err.code];
  if (prisma) {
    const { status, message } = prisma(err.meta);
    return res.status(status).json({ error: message });
  }

  // Anything left is a genuine bug. Say so plainly rather than "Internal
  // server error", and include the id so a report can be tied to a log line.
  const reference = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  console.error(`Unhandled error reference ${reference}`);
  return res.status(500).json({
    error: `The server hit an unexpected problem handling this request. Please try again — if it keeps happening, quote reference ${reference}.`,
    reference,
  });
};

// Unknown /api/* paths fall through to Express's HTML 404, which a JSON client
// cannot read. Answer in the shape every other endpoint uses.
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: `No API endpoint matches ${req.method} ${req.originalUrl}.` });
};
