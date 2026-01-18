import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { sendErrorResponse } from '../../shared/utils/error-handler';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      const error = new Error('Validation failed');
      return sendErrorResponse(res, 400, 'Validation failed', error);
    }
    req.body = parseResult.data;
    next();
  };
}
