import { NextFunction, Request, Response } from 'express';
import { ZodType, ZodError } from 'zod';
import { Exception } from '../../shared/utils/error-constructor';
import { Code } from '../../shared/utils/http_code';

const UNKNOWN_FIELDS_MESSAGE = 'Request query must not contain unknown fields';

/** Zod issue with unrecognized_keys has a `keys` array. */
function isUnrecognizedKeysIssue(issue: { code: string; message?: string; keys?: unknown }): issue is { code: 'unrecognized_keys'; keys: string[] } {
  return issue.code === 'unrecognized_keys' && Array.isArray(issue.keys) && issue.keys.length > 0;
}

/** Format validation error message; use custom text for strict (unrecognized keys) issues. */
function formatZodErrorMessage(error: ZodError): string {
  const parts = error.issues.map((issue) => {
    if (isUnrecognizedKeysIssue(issue)) {
      return `${UNKNOWN_FIELDS_MESSAGE}: ${issue.keys.join(', ')}`;
    }
    return issue.message;
  });
  return parts.join(', ');
}

/**
 * A middleware function that validates the query against the Zod schema.
 * @param schema - The Zod schema to validate the query against.
 * @returns query - The parsed/coerced query data.
 */
export function validateQuery(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.query);
    if (!parseResult.success) {
      const errorMessage = formatZodErrorMessage(parseResult.error);
      return next(Exception.new<unknown>({ code: Code.BAD_REQUEST_ERROR, overrideMessage: errorMessage }));
    }
    // Store parsed/coerced data in res.locals (req.query is read-only)
    res.locals.query = parseResult.data;
    next();
  };
}
