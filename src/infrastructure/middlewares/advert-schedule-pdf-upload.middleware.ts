import type { RequestHandler } from 'express';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { Exception } from '../../shared/utils/error-constructor';
import { Code } from '../../shared/utils/http_code';

const ALLOWED_PDF_MIME = 'application/pdf';
const MAX_PDF_BYTES = 2 * 1024 * 1024;

export function createAdvertSchedulePdfUploadMiddleware(): RequestHandler {
  const memoryStorage = multer.memoryStorage();
  const pdfMulter = multer({
    storage: memoryStorage,
    limits: { fileSize: MAX_PDF_BYTES },
    fileFilter(_req, file, cb) {
      if (file.mimetype === ALLOWED_PDF_MIME) {
        cb(null, true);
        return;
      }
      cb(new Error('Only PDF files are allowed'));
    },
  });
  const singlePdf = pdfMulter.single('file');

  return (req: Request, res: Response, next: NextFunction): void => {
    singlePdf(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          next(
            Exception.new({
              code: Code.BAD_REQUEST_ERROR,
              overrideMessage: 'PDF must be 2MB or smaller',
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
