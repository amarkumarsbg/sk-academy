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

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read the image file."));
      }
    };
    reader.onerror = () => reject(new Error("Could not read the image file."));
    reader.readAsDataURL(file);
  });
}
