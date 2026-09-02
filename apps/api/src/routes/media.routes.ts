import { Router, Request, Response } from "express";
import { MediaKind, readMedia, readMediaVersion } from "../utils/media";

const router = Router();

const KINDS = new Set<MediaKind>([
  "user-avatar",
  "event-cover",
  "event-organizer",
  "vendor-logo",
  "vendor-cover",
  "testimonial-author",
]);

// "data:image/png;base64,iVBORw0..." -> the bytes and their type.
const decodeDataUrl = (value: string) => {
  const match = /^data:([^;,]+)(;base64)?,(.*)$/s.exec(value);
  if (!match) return null;
  const [, mime, isBase64, payload] = match;
  if (!mime.startsWith("image/")) return null;
  return {
    mime,
    buffer: Buffer.from(isBase64 ? payload : decodeURIComponent(payload), isBase64 ? "base64" : "utf8"),
  };
};

/*
  GET /api/media/:kind/:id

  Serves an image that is stored as a base64 data URL as ordinary binary. That
  alone drops a third of the bytes, and unlike the same image inlined in a JSON
  list it can be cached, fetched in parallel, and skipped entirely when it is
  off screen.
*/
router.get("/:kind/:id", async (req: Request, res: Response) => {
  const kind = req.params.kind as MediaKind;
  if (!KINDS.has(kind)) {
    return res.status(404).json({ error: `Unknown media type "${req.params.kind}".` });
  }

  try {
    /*
      The ETag is the record's updatedAt, not a hash of the bytes. A content
      hash meant every conditional request pulled the whole image across the
      Pacific just to decide it had not changed — 21 seconds to send back an
      empty 304. Reading one timestamp answers the same question in under a
      second.
    */
    const version = await readMediaVersion(kind, req.params.id);
    const etag = version ? `"${req.params.id}-${version.getTime()}"` : null;
    if (etag && req.headers["if-none-match"] === etag) {
      res.setHeader("ETag", etag);
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      return res.status(304).end();
    }

    const stored = await readMedia(kind, req.params.id);
    if (!stored) return res.status(404).json({ error: "No image is set for this record." });

    // Some records may hold an ordinary URL rather than an uploaded file.
    if (/^https?:\/\//i.test(stored)) return res.redirect(302, stored);

    const decoded = decodeDataUrl(stored);
    if (!decoded) {
      return res.status(422).json({ error: "The stored image is not in a format that can be served." });
    }

    res.setHeader("Content-Type", decoded.mime);
    if (etag) res.setHeader("ETag", etag);
    /*
      helmet defaults every response to `Cross-Origin-Resource-Policy:
      same-origin`, which is right for the JSON API but fatal here: the site is
      served from a different origin to this API, so the browser fetched each
      image successfully and then silently refused to paint it. Nothing showed
      in the grids and the network tab showed 200s, because the request really
      did succeed — the block happens after it.

      These are public profile photos, already served with CORS headers, so
      relaxing it for this route only is both correct and contained.
    */
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    /*
      A `v` query param means the caller pinned this to a specific version of
      the record, so the bytes behind this exact URL can never change and the
      browser need never ask again. Without one, revalidate daily against the
      ETag — cheap, since an unchanged image answers 304 with no body.
    */
    res.setHeader(
      "Cache-Control",
      req.query.v ? "public, max-age=31536000, immutable" : "public, max-age=86400, must-revalidate"
    );
    // Already-compressed bytes; gzipping them again only burns CPU.
    res.setHeader("Content-Length", String(decoded.buffer.length));
    return res.end(decoded.buffer);
  } catch (error) {
    console.error(`Media fetch error (${kind}/${req.params.id}):`, error);
    return res.status(500).json({ error: "That image could not be loaded. Please try again." });
  }
});

export default router;
