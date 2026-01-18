import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { sendErrorResponse } from '../../shared/utils/error-handler';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      user?: { id: string; roles: string[]; permissions: string[] };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    const error = new Error('Missing authorization header');
    return sendErrorResponse(res, 401, 'Missing authorization header', error);
  }

  const token = authHeader.substring('Bearer '.length);
  try {
    const payload = jwt.verify(token, jwtConfig.secret) as {
      sub: string;
      roles: string[];
      permissions: string[];
    };
    req.user = {
      id: payload.sub,
      roles: payload.roles,
      permissions: payload.permissions
    };
    next();
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Invalid token');
    return sendErrorResponse(res, 401, 'Invalid token', err);
  }
}
