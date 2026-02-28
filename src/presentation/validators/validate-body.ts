import { NextFunction, Request, Response } from 'express';
import { ZodType, ZodError } from 'zod';
import { Exception } from '../../shared/utils/error-constructor';
import { Code } from '../../shared/utils/http_code';

const UNRECOGNIZED_KEYS_PREFIX = 'Unrecognized keys:';
const UNKNOWN_FIELDS_MESSAGE = 'Request body must not contain unknown fields';

/** Format validation error message; use custom text for strict (unrecognized keys) issues. */
function formatZodErrorMessage(error: ZodError): string {
  const parts = error.issues.map((issue) => {
    const msg = issue.message;
    if (msg.startsWith(UNRECOGNIZED_KEYS_PREFIX)) {
      const keysPart = msg.slice(UNRECOGNIZED_KEYS_PREFIX.length).trim().replace(/"/g, '');
      return keysPart ? `${UNKNOWN_FIELDS_MESSAGE}: ${keysPart}` : UNKNOWN_FIELDS_MESSAGE;
    }
    return msg;
  });
  return parts.join(', ');
}

export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMessage = formatZodErrorMessage(parseResult.error);
      return next(Exception.new<unknown>({ code: Code.BAD_REQUEST_ERROR, overrideMessage: errorMessage }));
    }

    // Store parsed/coerced data in req.body (req.body is mutable)
    req.body = parseResult.data;
    next();
  };
}
