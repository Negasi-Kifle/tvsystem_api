import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { sendErrorResponse } from '../../shared/utils/error-handler';

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.query);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues.map(issue => issue.message).join(', ');
      return sendErrorResponse(res, 400, errorMessage, new Error(errorMessage));
    }
    // Store parsed/coerced data in res.locals (req.query is read-only)
    res.locals.query = parseResult.data;
    next();
  };
}
