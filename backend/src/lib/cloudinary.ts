import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

let configured = false;

export function configureCloudinary() {
  if (configured) return;
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) {
    return;
  }
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  configured = true;
}

export function isCloudinaryConfigured() {
  configureCloudinary();
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    resource_type?: "image" | "video" | "raw" | "auto";
    public_id?: string;
  } = {},
): Promise<{
  public_id: string;
  secure_url: string;
  resource_type: string;
  format?: string;
  bytes?: number;
  duration?: number;
}> {
  configureCloudinary();
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured.");
  }

  const folder = options.folder ?? "afterglow/memories";
  const resource_type = options.resource_type ?? "auto";

  const result = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type,
          use_filename: true,
          unique_filename: true,
        },
        (err, res) => {
          if (err || !res) reject(err ?? new Error("Upload failed"));
          else resolve(res);
        },
      );
      stream.end(buffer);
    },
  );

  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    resource_type: result.resource_type,
    format: result.format,
    bytes: result.bytes,
    duration: result.duration,
  };
}

export async function deleteCloudinaryAsset(
  publicId: string,
  resourceType: "image" | "video" | "raw",
) {
  configureCloudinary();
  if (!isCloudinaryConfigured()) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
