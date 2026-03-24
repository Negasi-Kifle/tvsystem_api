import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import type { IStorageService, StorageUploadFile } from '../../../domain/services/storage.service';
import {
  extractUploadRelativePathFromPublicUrl,
  normalizeBaseUrl,
} from '../../../domain/services/storage.service';
import { sanitizeOriginalFilename, sanitizeStorageFolder } from './storage-path.utils';

function requireBaseUrl(): string {
  const base = process.env.BASE_URL?.trim();
  if (!base) {
    throw new Error('BASE_URL environment variable is required for local file storage');
  }
  return normalizeBaseUrl(base);
}

export class LocalStorageService implements IStorageService {
  private readonly uploadsRoot: string;

  constructor(uploadsRoot: string = path.resolve(process.cwd(), 'uploads')) {
    this.uploadsRoot = uploadsRoot;
  }

  async upload(file: StorageUploadFile, options?: { folder?: string }): Promise<string> {
    const folder = sanitizeStorageFolder(options?.folder);
    const safeName = sanitizeOriginalFilename(file.originalname);
    const filename = `${uuidv4()}_${safeName}`;
    const dir = path.join(this.uploadsRoot, folder);
    await fs.mkdir(dir, { recursive: true });
    const absolutePath = path.join(dir, filename);
    await fs.writeFile(absolutePath, file.buffer);

    const baseUrl = requireBaseUrl();
    const publicUrl = `${baseUrl}/uploads/${folder}/${filename}`;
    // eslint-disable-next-line no-console
    console.info(`[LocalStorageService] Uploaded file to ${publicUrl}`);
    return publicUrl;
  }

  async delete(fileUrl: string): Promise<void> {
    const baseUrl = requireBaseUrl();
    const relative = extractUploadRelativePathFromPublicUrl(fileUrl, baseUrl);
    if (!relative) {
      throw new Error('Cannot delete file: URL is not a local uploads URL for this server');
    }
    const absolute = path.resolve(process.cwd(), relative);
    const rootResolved = path.resolve(this.uploadsRoot);
    const relativeToRoot = path.relative(rootResolved, absolute);
    if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
      throw new Error('Cannot delete file: resolved path escapes uploads root');
    }
    await fs.unlink(absolute).catch(() => undefined);
  }
}
