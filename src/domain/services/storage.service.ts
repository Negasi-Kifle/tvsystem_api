/**
 * Neutral upload payload (maps from Express.Multer.File at the HTTP boundary).
 */
export type StorageUploadFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
};

export interface IStorageService {
  upload(file: StorageUploadFile, options?: { folder?: string }): Promise<string>;
  /** Remove a file by the public URL returned from upload (best-effort rollback on failed requests). */
  delete(fileUrl: string): Promise<void>;
}

export function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, '');
}

/**
 * Returns path relative to project cwd like `uploads/advert-packages/file.webp`, or null if URL is not under BASE_URL + /uploads/.
 */
export function extractUploadRelativePathFromPublicUrl(publicUrl: string, baseUrl: string): string | null {
  const base = normalizeBaseUrl(baseUrl);
  let remainder: string;
  if (publicUrl.startsWith(base)) {
    remainder = publicUrl.slice(base.length);
  } else {
    return null;
  }
  if (!remainder.startsWith('/')) {
    remainder = `/${remainder}`;
  }
  const match = remainder.match(/^\/uploads\/(.+)$/);
  if (!match?.[1]) {
    return null;
  }
  const relative = `uploads/${match[1]}`;
  if (relative.includes('..') || relative.includes('\0')) {
    return null;
  }
  return relative;
}
