import type { StorageUploadFile } from '../../domain/services/storage.service';

export function toStorageUploadFile(file: Express.Multer.File): StorageUploadFile {
  return {
    buffer: file.buffer,
    mimetype: file.mimetype,
    originalname: file.originalname,
    size: file.size,
  };
}
