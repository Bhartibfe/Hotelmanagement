/*=============================
  downscaleImage
  -----------------------------
  Every image on this site is stored as a base64 data URL in a Postgres text
  column, and the database sits in Oregon while the site is served to India.
  A photo straight off a phone is several megabytes; base64 adds another third;
  and that whole payload then has to cross the Pacific before anything renders.

  An audit found five images accounting for 89% of all stored image bytes — a
  2.5MB avatar and three event covers of 0.8-1.8MB each. None of them are ever
  displayed above about 1200px.

  So every upload is re-encoded through a canvas first: capped on its longest
  edge, converted to JPEG, and only then stored. A 2.5MB phone photo comes out
  around 150KB with no visible difference at the sizes this site renders.

  Person photos go through ImageCropper instead, which does the same thing
  while squaring the crop.
===============================*/

// Long-edge caps. Covers are shown full-width, logos never large.
export const IMAGE_PRESETS = {
  cover: { maxEdge: 1600, quality: 0.82 },
  photo: { maxEdge: 1200, quality: 0.82 },
  logo: { maxEdge: 600, quality: 0.9 },
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("That image could not be read. It may be corrupted — try a different file."));
    img.src = src;
  });

/**
 * Takes a data URL and returns a smaller one. Returns the input untouched if
 * anything goes wrong, so a failure here can never block an upload.
 *
 * @param {string} dataUrl        the image as read by FileReader
 * @param {keyof IMAGE_PRESETS|object} preset  a named preset or {maxEdge, quality}
 */
export const downscaleImage = async (dataUrl, preset = "photo") => {
  const { maxEdge, quality } = typeof preset === "string" ? IMAGE_PRESETS[preset] || IMAGE_PRESETS.photo : preset;

  try {
    const img = await loadImage(dataUrl);
    const longest = Math.max(img.naturalWidth, img.naturalHeight);

    // Already small enough, and re-encoding would only lose quality.
    if (longest <= maxEdge && dataUrl.length < 400 * 1024) return dataUrl;

    const scale = Math.min(1, maxEdge / longest);
    const width = Math.round(img.naturalWidth * scale);
    const height = Math.round(img.naturalHeight * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    // JPEG has no alpha, so a transparent PNG would otherwise come out black.
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const out = canvas.toDataURL("image/jpeg", quality);
    // A tiny transparent PNG can encode larger as JPEG; keep whichever is smaller.
    return out.length < dataUrl.length ? out : dataUrl;
  } catch {
    // A cross-origin source taints the canvas. Storing the original is worse
    // than storing a smaller one, but far better than losing the upload.
    return dataUrl;
  }
};

// Rough decoded size of a base64 data URL, for size checks and messages.
export const dataUrlBytes = (dataUrl) =>
  typeof dataUrl === "string" && dataUrl.includes(",") ? Math.round((dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75) : 0;
