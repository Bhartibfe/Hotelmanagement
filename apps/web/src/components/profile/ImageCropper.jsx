import React, { useCallback, useEffect, useRef, useState } from "react";
import FormDialog from "./FormDialog";
import { ErrorNotice } from "../common/ErrorNotice";

/*=============================
  ImageCropper
  -----------------------------
  Person photos are shown in circles all over this site — a 130px hero circle
  and a 38px signature circle on the expert profile, 140px on the About page,
  96px on My Profile, 48/34/28px in events and the feed. Every one of them was
  a plain `object-fit: cover`, which crops to the middle of whatever was
  uploaded, so a portrait framed off-centre lost the top of the head or the
  chin and nobody had any way to say otherwise.

  This lets them say otherwise: drag to pan, slide to zoom, and what shows
  inside the circle here is exactly what the site will show. On confirm the
  chosen area is drawn to a square canvas and that square becomes the stored
  image, so every display site keeps working untouched — a square cannot crop
  badly in a circle.

  The crop is therefore destructive. Reopening this on a saved photo lets you
  pan and zoom within that square, which covers touch-ups; recovering a wider
  framing means uploading again.
===============================*/

const STAGE_MAX = 320;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

// Distance between two active pointers, for pinch zoom.
const spread = (points) => {
  const [a, b] = points;
  return Math.hypot(a.x - b.x, a.y - b.y);
};

const ImageCropper = ({ src, onConfirm, onCancel, size = 800, title = "Adjust photo" }) => {
  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  // Offset of the image centre from the stage centre, in stage pixels.
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [stage, setStage] = useState(STAGE_MAX);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Live pointer positions keyed by pointerId: one entry is a drag, two a pinch.
  const pointers = useRef(new Map());
  const gesture = useRef(null);

  // The stage is square and must fit a phone as well as a desktop dialog.
  useEffect(() => {
    const fit = () => setStage(Math.max(200, Math.min(STAGE_MAX, window.innerWidth - 96)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    if (!src) return undefined;
    let cancelled = false;

    const img = new Image();
    // Only matters for a photo served from another origin; a tainted canvas is
    // caught on export below rather than throwing here.
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      setImage(img);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setError(null);
    };
    img.onerror = () =>
      !cancelled &&
      setError(new Error("That image could not be opened. It may be corrupted — try a different file."));
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  /*  How much bigger than the stage the image is drawn at zoom 1: the shorter
      side exactly covers the stage, matching `object-fit: cover` so the
      starting view is what the site shows today. */
  const baseScale = image ? Math.max(stage / image.naturalWidth, stage / image.naturalHeight) : 1;
  const drawnWidth = image ? image.naturalWidth * baseScale * zoom : 0;
  const drawnHeight = image ? image.naturalHeight * baseScale * zoom : 0;

  /*  Pan is bounded so the image always covers the stage. Dragging further
      would open a gap inside the circle, which is never a crop anyone wants. */
  const clamp = useCallback(
    (next, atZoom = zoom) => {
      if (!image) return { x: 0, y: 0 };
      const w = image.naturalWidth * baseScale * atZoom;
      const h = image.naturalHeight * baseScale * atZoom;
      const limitX = Math.max(0, (w - stage) / 2);
      const limitY = Math.max(0, (h - stage) / 2);
      return {
        x: Math.min(limitX, Math.max(-limitX, next.x)),
        y: Math.min(limitY, Math.max(-limitY, next.y)),
      };
    },
    [image, baseScale, zoom, stage]
  );

  const applyZoom = useCallback(
    (next) => {
      const bounded = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
      setZoom(bounded);
      // Re-clamp against the new size, or zooming out would leave the image
      // parked off-centre with a gap showing.
      setOffset((prev) => clamp(prev, bounded));
    },
    [clamp]
  );

  // --- Pointer handling. One path for mouse and touch. -----------------------

  const handlePointerDown = (e) => {
    if (!image) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const points = [...pointers.current.values()];
    gesture.current =
      points.length === 2
        ? { kind: "pinch", spread: spread(points), zoom }
        : { kind: "pan", x: e.clientX, y: e.clientY, offset };
  };

  const handlePointerMove = (e) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const points = [...pointers.current.values()];

    if (gesture.current.kind === "pinch" && points.length === 2) {
      const ratio = spread(points) / (gesture.current.spread || 1);
      applyZoom(gesture.current.zoom * ratio);
      return;
    }

    if (gesture.current.kind === "pan") {
      setOffset(
        clamp({
          x: gesture.current.offset.x + (e.clientX - gesture.current.x),
          y: gesture.current.offset.y + (e.clientY - gesture.current.y),
        })
      );
    }
  };

  const handlePointerUp = (e) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    pointers.current.delete(e.pointerId);

    const points = [...pointers.current.values()];
    // Lifting one finger out of a pinch should continue as a drag, not jump.
    gesture.current =
      points.length === 1
        ? { kind: "pan", x: points[0].x, y: points[0].y, offset }
        : null;
  };

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // --- Export ----------------------------------------------------------------

  const handleConfirm = () => {
    if (!image) return;
    setSaving(true);
    setError(null);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      // JPEG has no alpha, so a transparent PNG would come out on black.
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);

      // The stage is a scale model of the output: everything scales by the
      // ratio between them, so what was framed is what gets written.
      const ratio = size / stage;
      ctx.drawImage(
        image,
        ((stage - drawnWidth) / 2 + offset.x) * ratio,
        ((stage - drawnHeight) / 2 + offset.y) * ratio,
        drawnWidth * ratio,
        drawnHeight * ratio
      );

      onConfirm(canvas.toDataURL("image/jpeg", 0.85));
    } catch (err) {
      // Practically only reachable for a cross-origin image, which taints the
      // canvas and makes toDataURL throw a SecurityError.
      setError(
        new Error(
          "This image could not be processed because it is hosted on another site. Download it and upload the file instead."
        )
      );
      setSaving(false);
    }
  };

  return (
    <FormDialog title={title} onClose={onCancel} maxWidth={460}>
      {error && (
        <div style={{ marginBottom: "16px" }}>
          <ErrorNotice error={error} compact />
        </div>
      )}

      <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 16px", lineHeight: 1.6 }}>
        Drag the photo to choose what sits inside the circle, and zoom in if you need to. The circle
        is exactly what the site will show.
      </p>

      {/* Stage */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: "relative",
          width: `${stage}px`,
          height: `${stage}px`,
          margin: "0 auto",
          overflow: "hidden",
          background: "#0A1628",
          borderRadius: "8px",
          cursor: image ? "grab" : "default",
          // Stops the browser panning the page instead of the photo.
          touchAction: "none",
          userSelect: "none",
        }}
      >
        {image && (
          <img
            src={src}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              left: `${(stage - drawnWidth) / 2 + offset.x}px`,
              top: `${(stage - drawnHeight) / 2 + offset.y}px`,
              width: `${drawnWidth}px`,
              height: `${drawnHeight}px`,
              maxWidth: "none",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Circular mask: a huge shadow dims everything outside the circle
            without needing a second element or an SVG clip path. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            boxShadow: "0 0 0 9999px rgba(10, 22, 40, 0.62)",
            border: "2px solid #C6A962",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Zoom */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0 4px" }}>
        <i className="fas fa-image" style={{ fontSize: "11px", color: "#94A3B8" }} aria-hidden="true"></i>
        <input
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step="0.01"
          value={zoom}
          disabled={!image}
          aria-label="Zoom"
          onChange={(e) => applyZoom(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: "#C6A962", minWidth: 0 }}
        />
        <i className="fas fa-image" style={{ fontSize: "17px", color: "#94A3B8" }} aria-hidden="true"></i>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={handleReset}
          disabled={!image}
          style={{
            background: "none",
            border: "1px solid #E2DDD5",
            color: "#64748B",
            cursor: image ? "pointer" : "not-allowed",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            minHeight: "44px",
            padding: "10px 18px",
            textTransform: "uppercase",
          }}
        >
          <i className="fas fa-rotate-left" style={{ marginRight: "6px" }} aria-hidden="true"></i>
          Reset
        </button>

        <div style={{ display: "flex", gap: "10px", flex: "1 1 auto", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "none",
              border: "1px solid #E2DDD5",
              color: "#64748B",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              minHeight: "44px",
              padding: "10px 20px",
              textTransform: "uppercase",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!image || saving}
            style={{
              background: "#C6A962",
              border: "none",
              color: "#0A1628",
              cursor: !image || saving ? "wait" : "pointer",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              minHeight: "44px",
              opacity: !image || saving ? 0.7 : 1,
              padding: "10px 24px",
              textTransform: "uppercase",
            }}
          >
            <i className="fas fa-check" style={{ marginRight: "6px" }} aria-hidden="true"></i>
            {saving ? "Saving..." : "Use this photo"}
          </button>
        </div>
      </div>
    </FormDialog>
  );
};

export default ImageCropper;
