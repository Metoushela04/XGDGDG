// Cloudinary — images publiques (thumbnails, previews, avatars)
// Les uploads sont signés côté serveur. Les images sont servies via CDN Cloudinary.
import "server-only";

import { v2 as cloudinary } from "cloudinary";

function getConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Variables Cloudinary manquantes. Vérifiez NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET dans .env.local");
  }

  return { cloudName, apiKey, apiSecret };
}

function initCloudinary() {
  const { cloudName, apiKey, apiSecret } = getConfig();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  return cloudinary;
}

/**
 * Génère les paramètres de signature pour un upload Cloudinary côté client.
 * L'admin ou le membre utilise ces paramètres pour envoyer directement
 * l'image à Cloudinary depuis le navigateur (pas de transit serveur).
 */
export function generateUploadSignature(folder: string, options: {
  maxFileSize?: number;
  transformation?: string;
} = {}) {
  const { apiKey, apiSecret } = getConfig();
  const cld = initCloudinary();

  const timestamp = Math.round(Date.now() / 1000);
  const maxFileSize = options.maxFileSize || 10_000_000; // 10 MB par défaut

  const params: Record<string, string | number> = {
    timestamp,
    folder,
    upload_preset: "ml_default",
  };

  const signature = cld.utils.api_sign_request(params, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    folder,
  };
}

/**
 * Supprime une image de Cloudinary par son public_id.
 */
export async function deleteImage(publicId: string) {
  const cld = initCloudinary();
  const result = await cld.uploader.destroy(publicId);
  return result;
}

/**
 * Génère une URL optimisée pour une image Cloudinary.
 * Utilise f_auto et q_auto pour la performance.
 */
export function getOptimizedUrl(publicId: string, options: {
  width?: number;
  height?: number;
  crop?: string;
} = {}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const transforms = ["f_auto", "q_auto"];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${publicId}`;
}
