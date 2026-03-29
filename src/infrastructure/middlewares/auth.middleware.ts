import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { Exception } from '../../shared/utils/error-constructor';
import { Code } from '../../shared/utils/http_code';
import { GetByIdUseCase } from '../../application/use-cases/users/get-by-id.use-case';
import { FetchAllUserPermissionsUseCase } from '../../application/use-cases/user-permissions/fetch-all.use-case';
import type { IUserRepository } from '../../domain/repositories/user.repo';
import type { IUserPermissionsRepository } from '../../domain/repositories/user-permissions.repo';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; permissions: string[] };
    }
  }
}

export type AuthMiddlewareDeps = {
  userRepository: IUserRepository;
  userPermissionsRepository: IUserPermissionsRepository;
};

export function createAuthMiddleware(deps: AuthMiddlewareDeps) {
  const getByIdUseCase = new GetByIdUseCase(deps.userRepository);
  const fetchAllUserPermissions = new FetchAllUserPermissionsUseCase(deps.userPermissionsRepository);

  return async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw Exception.new<unknown>({ code: Code.MISSING_AUTHORIZATION_HEADER });
    }

    const token = authHeader.substring('Bearer '.length);
    try {
      const payload = jwt.verify(token, jwtConfig.secret) as {
        userId: string;
        permissions?: string[];
      };

      const [user, userPermissions] = await Promise.all([
        getByIdUseCase.execute(payload.userId),
        fetchAllUserPermissions.execute({ filters: { userId: payload.userId }, take: 10000 }),
      ]);

      if (!user) {
        throw Exception.new<unknown>({ code: Code.INVALID_TOKEN, data: 'User not found' });
      }

      if (!user.isActive) {
        throw Exception.new<unknown>({ code: Code.INVALID_TOKEN, data: 'User is not active' });
      }

      req.user = {
        id: payload.userId,
        permissions: userPermissions.map((permission) => permission.permission?.nameSlug ?? ''),
      };
      next();
    } catch (error) {
      throw Exception.new<unknown>({ code: Code.INVALID_TOKEN, data: error });
    }
  };
}
