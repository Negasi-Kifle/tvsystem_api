// TODO: Set BASE_URL in .env for local storage (e.g. http://localhost:3000). Use STORAGE_TYPE=s3 for the stub CDN path; optional CDN_MOCK_BASE_URL.
import type { IStorageService } from '../../../domain/services/storage.service';
import { LocalStorageService } from './local-storage.service';
import { S3StorageService } from './s3-storage.service';

function createStorageService(): IStorageService {
  if (process.env.STORAGE_TYPE === 's3') {
    return new S3StorageService();
  }
  return new LocalStorageService();
}

export const storageService: IStorageService = createStorageService();
