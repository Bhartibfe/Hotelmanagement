import { Request } from "express";
import { prisma } from "@hospitality/database";

/*=============================
  Media URLs
  -----------------------------
  Every image on this site is stored as a base64 data URL in a Postgres text
  column. That is survivable for a single record, but list endpoints were
  selecting those columns for every row: /events shipped 4.4MB and took 26
  seconds, /experts 2MB, and the admin membership list 5MB across 45-68
  seconds — for thirteen users. The database is in Oregon and the site is
  served to India, so every one of those bytes is a transatlantic round trip,
  and gzip cannot help because base64-of-JPEG is already incompressible.

  So list responses no longer carry the image. They carry a URL to
  /api/media/:kind/:id, which serves the same bytes as real binary — a third
  smaller than base64 to begin with — with a long cache lifetime, in parallel
  with the page rather than blocking it, and only for the images actually on
  screen.

  The field keeps its original name in the response (`avatar` is still
  `avatar`), so every `<img src={user.avatar}>` and `url(${avatar})` in the
  frontend keeps working untouched: a URL goes in exactly where a data URL
  used to.
===============================*/

export type MediaKind =
  | "user-avatar"
  | "event-cover"
  | "event-organizer"
  | "vendor-logo"
  | "vendor-cover"
  | "testimonial-author";

type Registry = {
  // The stored value for one record, or null when there is no image.
  read: (id: string) => Promise<string | null>;
  /*
    The record's updatedAt, read on its own. This is what makes a conditional
    request cheap: answering "not modified" must not drag the whole image back
    from Oregon just to hash it, which is exactly what a content-based ETag was
    doing — 21 seconds to return an empty 304.
  */
  version: (id: string) => Promise<Date | null>;
  // Which of these ids actually hold an image. Selecting only the id keeps
  // this query in the low tens of kilobytes however many rows there are.
  present: (ids: string[]) => Promise<string[]>;
};

const REGISTRY: Record<MediaKind, Registry> = {
  "user-avatar": {
    version: async (id) => (await prisma.user.findUnique({ where: { id }, select: { updatedAt: true } }))?.updatedAt ?? null,
    read: async (id) => (await prisma.user.findUnique({ where: { id }, select: { avatar: true } }))?.avatar ?? null,
    present: async (ids) =>
      (await prisma.user.findMany({ where: { id: { in: ids }, avatar: { not: null } }, select: { id: true } })).map((r) => r.id),
  },
  "event-cover": {
    version: async (id) => (await prisma.event.findUnique({ where: { id }, select: { updatedAt: true } }))?.updatedAt ?? null,
    read: async (id) => (await prisma.event.findUnique({ where: { id }, select: { coverImage: true } }))?.coverImage ?? null,
    present: async (ids) =>
      (await prisma.event.findMany({ where: { id: { in: ids }, coverImage: { not: null } }, select: { id: true } })).map((r) => r.id),
  },
  "event-organizer": {
    version: async (id) => (await prisma.event.findUnique({ where: { id }, select: { updatedAt: true } }))?.updatedAt ?? null,
    read: async (id) => (await prisma.event.findUnique({ where: { id }, select: { organizerAvatar: true } }))?.organizerAvatar ?? null,
    present: async (ids) =>
      (await prisma.event.findMany({ where: { id: { in: ids }, organizerAvatar: { not: null } }, select: { id: true } })).map((r) => r.id),
  },
  "vendor-logo": {
    version: async (id) => (await prisma.vendorProfile.findUnique({ where: { id }, select: { updatedAt: true } }))?.updatedAt ?? null,
    read: async (id) => (await prisma.vendorProfile.findUnique({ where: { id }, select: { logo: true } }))?.logo ?? null,
    present: async (ids) =>
      (await prisma.vendorProfile.findMany({ where: { id: { in: ids }, logo: { not: null } }, select: { id: true } })).map((r) => r.id),
  },
  "vendor-cover": {
    version: async (id) => (await prisma.vendorProfile.findUnique({ where: { id }, select: { updatedAt: true } }))?.updatedAt ?? null,
    read: async (id) => (await prisma.vendorProfile.findUnique({ where: { id }, select: { coverImage: true } }))?.coverImage ?? null,
    present: async (ids) =>
      (await prisma.vendorProfile.findMany({ where: { id: { in: ids }, coverImage: { not: null } }, select: { id: true } })).map((r) => r.id),
  },
  "testimonial-author": {
    version: async (id) => (await prisma.testimonial.findUnique({ where: { id }, select: { updatedAt: true } }))?.updatedAt ?? null,
    read: async (id) => (await prisma.testimonial.findUnique({ where: { id }, select: { authorAvatar: true } }))?.authorAvatar ?? null,
    present: async (ids) =>
      (await prisma.testimonial.findMany({ where: { id: { in: ids }, authorAvatar: { not: null } }, select: { id: true } })).map((r) => r.id),
  },
};

export const readMedia = (kind: MediaKind, id: string) => REGISTRY[kind].read(id);
export const readMediaVersion = (kind: MediaKind, id: string) => REGISTRY[kind].version(id);

/*
  Absolute, because the frontend runs on a different origin to the API and
  drops these straight into `src`. Built from the request so it is correct in
  development and behind Render's proxy without any configuration.
*/
export const mediaUrl = (req: Request, kind: MediaKind, id: string, version?: Date | null) => {
  const base = `${req.protocol}://${req.get("host")}/api/media/${kind}/${id}`;
  // `v` changes when the record is updated, so a replaced photo is picked up
  // immediately despite the long cache lifetime.
  return version ? `${base}?v=${version.getTime()}` : base;
};

/*
  Swaps an image field for its URL across a list of rows, in one extra query
  per kind. Rows without an image get null, which is what the UI already keys
  on to show initials instead.

  `idOf` exists because the id that owns the image is not always the row's own:
  an event's organiser avatar hangs off the event, but the author avatar on a
  feed post hangs off the nested user.
*/
export const attachMediaUrls = async <T>(
  req: Request,
  rows: T[],
  kind: MediaKind,
  opts: {
    idOf: (row: T) => string | null | undefined;
    versionOf?: (row: T) => Date | null | undefined;
    set: (row: T, url: string | null) => void;
  }
): Promise<T[]> => {
  const ids = [...new Set(rows.map(opts.idOf).filter((id): id is string => Boolean(id)))];
  if (ids.length === 0) return rows;

  const present = new Set(await REGISTRY[kind].present(ids));
  for (const row of rows) {
    const id = opts.idOf(row);
    opts.set(row, id && present.has(id) ? mediaUrl(req, kind, id, opts.versionOf?.(row)) : null);
  }
  return rows;
};

/*=============================
  Write-side size guard
  -----------------------------
  The client downscales every upload before sending it (see
  lib/downscaleImage.js and ImageCropper.jsx on the web side), but that is the
  client's promise, not a guarantee. This is the backstop: five images that
  slipped through at 0.8-2.5MB each accounted for 89% of every image byte in
  the database and made whole endpoints time out, so nothing that size gets
  stored again by accident.
===============================*/

// Roughly the decoded byte count of a base64 data URL, without decoding it.
export const dataUrlBytes = (value: unknown): number => {
  if (typeof value !== "string" || !value.startsWith("data:")) return 0;
  const comma = value.indexOf(",");
  return comma === -1 ? 0 : Math.round((value.length - comma - 1) * 0.75);
};

export const MAX_STORED_IMAGE_BYTES = 900 * 1024;

/**
 * Returns an error message when any of the given image values is too large,
 * or null when they are all fine. `label` names the field for the message.
 */
export const oversizedImageError = (entries: { label: string; value: unknown }[]): string | null => {
  const tooBig = entries
    .map((e) => ({ ...e, bytes: dataUrlBytes(e.value) }))
    .filter((e) => e.bytes > MAX_STORED_IMAGE_BYTES);
  if (tooBig.length === 0) return null;

  const mb = (n: number) => `${(n / (1024 * 1024)).toFixed(1)}MB`;
  const named = tooBig.map((e) => `${e.label} (${mb(e.bytes)})`).join(", ");
  return `${named} ${tooBig.length === 1 ? "is" : "are"} too large. Images are limited to ${mb(
    MAX_STORED_IMAGE_BYTES
  )} once processed — re-select the file so it can be resized, or use a smaller one.`;
};
