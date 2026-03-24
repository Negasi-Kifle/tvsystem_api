import path from 'node:path';

/** MIME types allowed for advert package images (multer + validation). */
export const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const SAFE_FOLDER_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Normalizes and validates a storage subfolder segment (no path traversal).
 * Returns a safe single path segment or throws.
 */
export function sanitizeStorageFolder(folder: string | undefined): string {
  const raw = (folder ?? 'misc').trim().toLowerCase();
  if (!raw || raw.includes('/') || raw.includes('\\') || raw.includes('..')) {
    throw new Error('Invalid storage folder');
  }
  if (!SAFE_FOLDER_PATTERN.test(raw)) {
    throw new Error('Invalid storage folder: use lowercase letters, numbers, and single hyphens only');
  }
  return raw;
}

/**
 * Sanitize original filename to a single basename safe for disk (no path separators).
 */
export function sanitizeOriginalFilename(originalname: string): string {
  const base = path.basename(originalname).replace(/[\0-\x1f\x7f]/g, '');
  const withoutDots = base.replace(/^\.+/, '');
  const cleaned = withoutDots.replace(/[^a-zA-Z0-9._-]/g, '_');
  const trimmed = cleaned.replace(/_+/g, '_').replace(/^_|_$/g, '');
  const limited = trimmed.slice(0, 80);
  return limited || 'file';
}
