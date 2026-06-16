import type { RequestHandler } from 'express';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { Exception } from '../../shared/utils/error-constructor';
import { Code } from '../../shared/utils/http_code';

const ALLOWED_PDF_MIME = 'application/pdf';
const ALLOWED_XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const ALLOWED_MIME_TYPES = new Set([ALLOWED_PDF_MIME, ALLOWED_XLSX_MIME]);
const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function createAdvertScheduleFileUploadMiddleware(): RequestHandler {
  const memoryStorage = multer.memoryStorage();
  const fileMulter = multer({
    storage: memoryStorage,
    limits: { fileSize: MAX_FILE_BYTES },
    fileFilter(_req, file, cb) {
      if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
        cb(null, true);
        return;
      }
      cb(new Error('Only PDF and .xlsx files are allowed'));
    },
  });
  const singleFile = fileMulter.single('file');

  return (req: Request, res: Response, next: NextFunction): void => {
    singleFile(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          next(
            Exception.new({
              code: Code.BAD_REQUEST_ERROR,
              overrideMessage: 'File must be 5MB or smaller',
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
