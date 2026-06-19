import * as Minio from 'minio';
import path       from 'path';
import fs         from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Local uploads directory (fallback) ──────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ── S3 / MinIO client ────────────────────────────────────────────────────────
let s3Client = null;
let s3Ready  = false;

const BUCKET = process.env.S3_BUCKET || 'complaints';
const REGION = process.env.S3_REGION || 'us-east-1';

async function initS3() {
  try {
    const endPoint = process.env.S3_ENDPOINT || 'localhost';
    const rawPort  = process.env.S3_PORT;
    const port     = rawPort ? parseInt(rawPort, 10) : undefined;
    const useSSL   = process.env.S3_USE_SSL === 'true';

    // The MinIO JS client is fully compatible with AWS S3 and any S3 API.
    s3Client = new Minio.Client({
      endPoint,
      port,
      useSSL,
      accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
      region:    REGION,
    });

    const exists = await s3Client.bucketExists(BUCKET);
    if (!exists) {
      await s3Client.makeBucket(BUCKET, REGION);
    }

    s3Ready = true;
    console.log(`[S3 Storage] Ready — service: ${endPoint}, bucket: "${BUCKET}"`);
  } catch (err) {
    console.warn(`[S3 Storage] Unavailable (${err.message}). Falling back to local disk.`);
    s3Ready = false;
  }
}

// Initialize on startup
initS3();

/**
 * Upload a file buffer to S3/MinIO.
 * Falls back to local /uploads directory if S3 is unreachable.
 *
 * @param {Buffer}  buffer    - file content
 * @param {string}  filename  - target filename (unique)
 * @param {string}  mimetype  - MIME type
 * @returns {Promise<string>} public/S3 URL or local relative URL
 */
export async function uploadFile(buffer, filename, mimetype) {
  // ── Try S3 / MinIO ─────────────────────────────────────────────────────────
  if (s3Ready && s3Client) {
    try {
      await s3Client.putObject(BUCKET, filename, buffer, buffer.length, {
        'Content-Type': mimetype,
      });

      const endPoint = process.env.S3_ENDPOINT || 'localhost';
      const useSSL   = process.env.S3_USE_SSL === 'true';
      const protocol = useSSL ? 'https' : 'http';

      // AWS S3 standard URL format: https://<bucket>.s3.<region>.amazonaws.com/<filename>
      if (endPoint.includes('amazonaws.com')) {
        return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${filename}`;
      }

      // Default MinIO/custom S3 endpoint URL format: http://<endpoint>:<port>/<bucket>/<filename>
      const portStr = process.env.S3_PORT ? `:${process.env.S3_PORT}` : '';
      return `${protocol}://${endPoint}${portStr}/${BUCKET}/${filename}`;
    } catch (err) {
      console.warn(`[S3 Storage] Upload failed (${err.message}). Falling back to local disk.`);
    }
  }

  // ── Local fallback ─────────────────────────────────────────────────────────
  const localPath = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(localPath, buffer);
  console.log(`[Storage] Saved locally → uploads/${filename}`);

  return `/uploads/${filename}`;
}
