import type { Area } from "react-easy-crop";

export type ImageAdjustments = {
  brightness: number;
  contrast: number;
};

export const defaultImageAdjustments: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error("Could not load image for editing.")));
    image.crossOrigin = "anonymous";
    image.src = src;
  });
}

export async function getEditedImageBlob(
  imageSrc: string,
  pixelCrop: Area,
  adjustments: ImageAdjustments,
  outputType = "image/jpeg",
  quality = 0.9
): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Image editing is not supported in this browser.");
  }

  const cropWidth = Math.max(1, Math.round(pixelCrop.width));
  const cropHeight = Math.max(1, Math.round(pixelCrop.height));

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  const brightness = 1 + adjustments.brightness / 100;
  const contrast = 1 + adjustments.contrast / 100;
  ctx.filter = `brightness(${brightness}) contrast(${contrast})`;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    cropWidth,
    cropHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to export edited image."));
          return;
        }
        resolve(blob);
      },
      outputType,
      quality
    );
  });
}

export function blobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
}

export async function resolveEditableImageSrc(src: string): Promise<string> {
  if (src.startsWith("blob:") || src.startsWith("data:")) {
    return src;
  }

  if (src.startsWith("/")) {
    return src;
  }

  const response = await fetch(src, { mode: "cors" });
  if (!response.ok) {
    throw new Error("Could not load the existing image for editing.");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
