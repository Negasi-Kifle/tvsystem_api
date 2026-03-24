import { v4 as uuidv4 } from 'uuid';
import type { IStorageService, StorageUploadFile } from '../../../domain/services/storage.service';
import { sanitizeOriginalFilename, sanitizeStorageFolder } from './storage-path.utils';

/**
 * Placeholder S3/R2 implementation — returns a mock public URL. Replace with real SDK later.
 */
export class S3StorageService implements IStorageService {
  async upload(file: StorageUploadFile, options?: { folder?: string }): Promise<string> {
    const folder = sanitizeStorageFolder(options?.folder);
    const safeName = sanitizeOriginalFilename(file.originalname);
    const filename = `${uuidv4()}_${safeName}`;
    const cdnBase = (process.env.CDN_MOCK_BASE_URL ?? 'https://cdn.example.com').replace(/\/+$/, '');
    const publicUrl = `${cdnBase}/${folder}/${filename}`;
    // eslint-disable-next-line no-console
    console.info(`[S3StorageService] Stub upload → ${publicUrl}`);
    return publicUrl;
  }

  /** No-op until real S3/R2 delete is implemented. */
  async delete(_fileUrl: string): Promise<void> {
    // eslint-disable-next-line no-console
    console.info(`[S3StorageService] Stub delete (no remote object): ${_fileUrl}`);
  }
}
