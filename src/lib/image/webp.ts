/**
 * Convert any image File/Blob to WebP using the Canvas API.
 * Falls back to the original file if WebP encoding fails or the
 * source is not a raster image (e.g. SVG, GIF animations).
 */
export async function convertToWebP(
  file: File,
  opts: { quality?: number; maxWidth?: number; maxHeight?: number } = {}
): Promise<File> {
  const { quality = 0.85, maxWidth = 1920, maxHeight = 1920 } = opts;

  // Skip non-raster or already-WebP files
  if (!file.type.startsWith("image/") || file.type === "image/webp" || file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;

    // Resize while preserving aspect ratio
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality)
    );
    if (!blob) return file;

    // Replace extension with .webp
    const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], newName, { type: "image/webp", lastModified: Date.now() });
  } catch (err) {
    console.warn("[webp] conversion failed, using original", err);
    return file;
  }
}
