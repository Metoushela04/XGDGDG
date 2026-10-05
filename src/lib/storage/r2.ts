// Cloudflare R2 Storage — fichiers ZIP sécurisés
// Toutes les clés et URLs sont côté serveur uniquement.
import "server-only";

import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME || "vendix-files";

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Variables R2 manquantes. Vérifiez R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY dans .env.local");
  }

  return { accountId, accessKeyId, secretAccessKey, bucket };
}

function createR2Client() {
  const { accountId, accessKeyId, secretAccessKey } = getR2Config();

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Génère une URL de téléversement signée vers R2 (admin upload).
 * L'admin envoie le fichier ZIP directement à R2 via cette URL (PUT).
 */
export async function getSignedUploadUrl(key: string, contentType = "application/zip", expiresIn = 600) {
  const { bucket } = getR2Config();
  const client = createR2Client();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(client, command, { expiresIn });
  return url;
}

/**
 * Génère une URL de téléchargement signée depuis R2 (60 secondes par défaut).
 * Le membre reçoit cette URL temporaire après vérification d'accès et de quota.
 */
export async function getSignedDownloadUrl(key: string, expiresIn = 60) {
  const { bucket } = getR2Config();
  const client = createR2Client();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const url = await getSignedUrl(client, command, { expiresIn });
  return url;
}

/**
 * Supprime un fichier de R2 (admin: suppression d'un produit).
 */
export async function deleteFile(key: string) {
  const { bucket } = getR2Config();
  const client = createR2Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

/**
 * Vérifie qu'un fichier existe dans R2 et retourne ses métadonnées.
 */
export async function getFileMeta(key: string) {
  const { bucket } = getR2Config();
  const client = createR2Client();

  try {
    const result = await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    return {
      exists: true,
      size: result.ContentLength ?? 0,
      contentType: result.ContentType ?? "application/octet-stream",
    };
  } catch {
    return { exists: false, size: 0, contentType: "" };
  }
}
