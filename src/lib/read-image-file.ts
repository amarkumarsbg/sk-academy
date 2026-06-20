import { uploadImage } from "@/lib/api/client";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function readImageAsDataUrl(
  file: File,
  options?: { maxSizeMB?: number }
): Promise<string> {
  const maxSizeMB = options?.maxSizeMB ?? 2;
  const maxBytes = maxSizeMB * 1024 * 1024;

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return Promise.reject(new Error("Please upload a JPG, PNG, WebP, or GIF image."));
  }

  if (file.size > maxBytes) {
    return Promise.reject(new Error(`Image must be smaller than ${maxSizeMB} MB.`));
  }

  return uploadImage(file);
}
