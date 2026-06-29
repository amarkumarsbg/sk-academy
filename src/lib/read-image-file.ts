import { uploadImage } from "@/lib/api/client";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function validateImageFile(file: File, options?: { maxSizeMB?: number }) {
  const maxSizeMB = options?.maxSizeMB ?? 5;
  const maxBytes = maxSizeMB * 1024 * 1024;

  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("Please upload a JPG, PNG, WebP, or GIF image.");
  }

  if (file.size > maxBytes) {
    throw new Error(`Image must be smaller than ${maxSizeMB} MB.`);
  }
}

export function readImageAsDataUrl(
  file: File,
  options?: { maxSizeMB?: number }
): Promise<string> {
  validateImageFile(file, options);
  return uploadImage(file);
}

export function createImageObjectUrl(file: File, options?: { maxSizeMB?: number }) {
  validateImageFile(file, options);
  return URL.createObjectURL(file);
}
