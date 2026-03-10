import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { sendErrorResponse } from '../../shared/utils/error-handler';
import { Exception } from '../../shared/utils/error-constructor';
import { Code } from '../../shared/utils/http_code';
import { UserRepository } from '../../infrastructure/prisma/repositories/user.repository';
import { GetByIdUseCase } from '../../application/use-cases/users/get-by-id.use-case';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; permissions: string[] };
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw Exception.new<unknown>({ code: Code.MISSING_AUTHORIZATION_HEADER });
  }

  const token = authHeader.substring('Bearer '.length);
  try {
    const payload = jwt.verify(token, jwtConfig.secret) as { userId: string; permissions?: string[] };

    // Check user exists
    const getByIdUseCase = new GetByIdUseCase(new UserRepository());
    const user = await getByIdUseCase.execute(payload.userId);
    
    if (!user) {
      throw Exception.new<unknown>({ code: Code.INVALID_TOKEN, data: 'User not found' });
    }

    if(!user.isActive) {
      throw Exception.new<unknown>({ code: Code.INVALID_TOKEN, data: 'User is not active' });
    }

    req.user = {
      id: payload.userId,
      permissions: payload.permissions ?? [],
    };
    next();
  } catch (error) {
    throw Exception.new<unknown>({ code: Code.INVALID_TOKEN, data: error });
  }
}
