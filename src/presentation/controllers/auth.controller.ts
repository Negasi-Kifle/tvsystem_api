import { NextFunction, Request, Response } from 'express';
import { comparePassword } from '../../shared/utils/password';
import { AuthService, TokenPayload } from '../../application/services/auth.service';
import { LoginDto } from '../dtos/requests/auth/login.dto';
import { RefreshTokenDto } from '../dtos/requests/auth/refresh-token.dto';
import { RegisterDto } from '../dtos/requests/user/register.dto';
import { sendErrorResponse } from '../../shared/utils/error-handler';
import { CreateUserUseCase } from '../../application/use-cases/users/create-user.use-case';
import { GetByEmailOrPhoneUseCase } from '../../application/use-cases/users/get-by-email-or-phone.use-case';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { CreateUserPermissionUseCase } from '../../application/use-cases/user-permissions/create.use-case';
import { FindPermissionsBySlugsUseCase } from '../../application/use-cases/permissions/find-by-slugs';
import { FindSlugsByUserIdUseCase } from '../../application/use-cases/user-permissions/find-slugs-by-user-id.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

const authService = new AuthService();

export function createAuthHandlers(
  deps: Pick<
    ApiRouterDeps,
    | 'userRepository'
    | 'partnerRepository'
    | 'employeeRepository'
    | 'userPermissionsRepository'
    | 'permissionRepository'
  >,
) {
  const {
    userRepository,
    partnerRepository,
    employeeRepository,
    permissionRepository,
    userPermissionsRepository,
  } = deps;

  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    partnerRepository,
    employeeRepository,
    permissionRepository,
  );
  const getByEmailOrPhoneUseCase = new GetByEmailOrPhoneUseCase(userRepository);
  const createUserPermissionUseCase = new CreateUserPermissionUseCase(userPermissionsRepository);
  const findPermissionsBySlugsUseCase = new FindPermissionsBySlugsUseCase(permissionRepository);
  const findSlugsByUserIdUseCase = new FindSlugsByUserIdUseCase(userPermissionsRepository);

  async function login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as LoginDto;
      const user = await getByEmailOrPhoneUseCase.execute(email);

      if (!user || !user.isActive) {
        const error = new Error('Invalid credentials');
        return sendErrorResponse(res, 401, 'Invalid credentials', error);
      }

      const validPswd = await comparePassword(password, user.passwordHash);
      if (!validPswd) {
        const error = new Error('Invalid credentials');
        return sendErrorResponse(res, 401, 'Invalid credentials', error);
      }

      const permissionSlugs = await findSlugsByUserIdUseCase.execute(user.id!);
      const tokenPayload: TokenPayload = { userId: user.id!, permissions: permissionSlugs };

      const accessToken = authService.generateAccessToken(tokenPayload);
      const refreshToken = authService.generateRefreshToken({ userId: user.id! });

      res.json({
        status: 'SUCCESS',
        message: 'Successfully logged in',
        data: {
          user: user,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async function register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as RegisterDto;

      payload.isFirstTimeAccount = true;
      const user = await createUserUseCase.execute(payload);

      const permissions = await findPermissionsBySlugsUseCase.execute(Object.values(PERMISSIONS));
      for (const permission of permissions) {
        await createUserPermissionUseCase.execute({
          userId: user.id!,
          permissionId: permission.id!,
          grantedBy: user.id!,
        });
      }

      const permissionSlugs = await findSlugsByUserIdUseCase.execute(user.id!);
      const tokenPayload: TokenPayload = { userId: user.id!, permissions: permissionSlugs };

      const accessToken = authService.generateAccessToken(tokenPayload);
      const refreshToken = authService.generateRefreshToken({ userId: user.id! });

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Successfully registered',
        data: {
          user: user,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async function refreshToken(req: Request, res: Response, next: NextFunction) {
    const { refreshToken: bodyRefresh } = req.body as RefreshTokenDto;
    try {
      const payload = authService.verify(bodyRefresh);
      const userId = payload.userId;

      const permissions = await findSlugsByUserIdUseCase.execute(userId);
      const accessToken = authService.generateAccessToken({
        userId,
        permissions,
      });

      res.json({
        status: 'SUCCESS',
        message: 'Successfully refreshed token',
        data: {
          accessToken: accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  return { login, register, refreshToken };
}
