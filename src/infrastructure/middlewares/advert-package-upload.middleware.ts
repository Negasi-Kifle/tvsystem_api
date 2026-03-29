import type { RequestHandler } from 'express';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { ALLOWED_IMAGE_MIME_TYPES } from '../services/storage/storage-path.utils';
import { Exception } from '../../shared/utils/error-constructor';
import { Code } from '../../shared/utils/http_code';

export function createAdvertPackageImageUploadMiddleware(): RequestHandler {
  const memoryStorage = multer.memoryStorage();
  const advertPackageImageMulter = multer({
    storage: memoryStorage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter(_req, file, cb) {
      if (ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
        cb(null, true);
        return;
      }
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    },
  });
  const singleImage = advertPackageImageMulter.single('image');

  return (req: Request, res: Response, next: NextFunction): void => {
    singleImage(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          next(
            Exception.new({
              code: Code.BAD_REQUEST_ERROR,
              overrideMessage: 'Image must be 2MB or smaller',
            }),
          );
          return;
        }
        next(
          Exception.new({
            code: Code.BAD_REQUEST_ERROR,
            overrideMessage: err.message,
          }),
        );
        return;
      }
      if (err instanceof Error) {
        next(
          Exception.new({
            code: Code.BAD_REQUEST_ERROR,
            overrideMessage: err.message,
          }),
        );
        return;
      }
      next();
    });
  };
}
