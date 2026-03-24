import { NextFunction, Request, Response } from 'express';
import { ZodType, ZodError } from 'zod';
import { Exception } from '../../shared/utils/error-constructor';
import { Code } from '../../shared/utils/http_code';
import { createAdvertPackageDto } from '../dtos/requests/advert-package/create.dto';
import { updateAdvertPackageDto } from '../dtos/requests/advert-package/update.dto';

const UNRECOGNIZED_KEYS_PREFIX = 'Unrecognized keys:';
const UNKNOWN_FIELDS_MESSAGE = 'Request body must not contain unknown fields';

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

/**
 * Multipart text fields are usually strings; some clients send an already-parsed object
 * (e.g. JSON body with a nested object, or tooling that parses the field). Buffers appear rarely.
 */
function parsePayloadData(raw: unknown): unknown {
  if (raw === undefined || raw === null) {
    throw Exception.new({
      code: Code.BAD_REQUEST_ERROR,
      overrideMessage:
        'Field "payload" is required: use multipart/form-data with a field named "payload" whose value is JSON text (same fields as the previous JSON body), or a single JSON object.',
    });
  }

  if (Buffer.isBuffer(raw)) {
    raw = raw.toString('utf8');
  }

  if (typeof raw === 'object' && !Array.isArray(raw)) {
    return raw;
  }

  if (typeof raw !== 'string') {
    throw Exception.new({
      code: Code.BAD_REQUEST_ERROR,
      overrideMessage:
        'Field "payload" must be JSON text in the multipart field, or a plain JSON object. If you use form-data, set the payload field type to Text (not File) and paste the raw JSON string.',
    });
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw Exception.new({
      code: Code.BAD_REQUEST_ERROR,
      overrideMessage: 'Field "payload" must contain valid JSON',
    });
  }
}

function validateWithSchema<T>(schema: ZodType, data: unknown): T {
  const parseResult = schema.safeParse(data);
  if (!parseResult.success) {
    throw Exception.new({
      code: Code.BAD_REQUEST_ERROR,
      overrideMessage: formatZodErrorMessage(parseResult.error),
    });
  }
  return parseResult.data as T;
}

export function validateAdvertPackageMultipartCreate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const parsed = parsePayloadData(req.body?.payload);
    const data = validateWithSchema(createAdvertPackageDto, parsed);
    if (!req.file) {
      throw Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage: 'Image file is required (field name: image)',
      });
    }
    req.body = data;
    next();
  } catch (e) {
    next(e);
  }
}

export function validateAdvertPackageMultipartUpdate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const parsed = parsePayloadData(req.body?.payload);
    const data = validateWithSchema(updateAdvertPackageDto, parsed);
    req.body = data;
    next();
  } catch (e) {
    next(e);
  }
}
