import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

if (env.cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
  });
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: { folder: string; resourceType?: "image" | "raw" }
) {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `sk-academy/${options.folder}`,
        resource_type: options.resourceType ?? "image",
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export { cloudinary };
