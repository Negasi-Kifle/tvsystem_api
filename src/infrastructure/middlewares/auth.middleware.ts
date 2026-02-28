import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { sendErrorResponse } from '../../shared/utils/error-handler';
import { Exception } from '../../shared/utils/error-constructor';
import { Code } from '../../shared/utils/http_code';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; permissions: string[] };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw Exception.new<unknown>({ code: Code.MISSING_AUTHORIZATION_HEADER });
  }

  const token = authHeader.substring('Bearer '.length);
  try {
    const payload = jwt.verify(token, jwtConfig.secret) as { userId: string; permissions?: string[] };

    req.user = {
      id: payload.userId,
      permissions: payload.permissions ?? [],
    };
    next();
  } catch (error) {
    throw Exception.new<unknown>({ code: Code.INVALID_TOKEN, data: error });
  }
}
