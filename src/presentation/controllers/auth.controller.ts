import { Request, Response } from 'express';
import { UserRepository } from '../../infrastructure/database/prisma/repositories/user.repository';
import { comparePassword, hashPassword } from '../../shared/utils/password';
import { AuthService } from '../../application/services/auth.service';
import { LoginDto } from '../dtos/requests/login.dto';
import { RefreshTokenDto } from '../dtos/requests/refresh-token.dto';
import { RegisterDto } from '../dtos/requests/register.dto';
import { UserRole } from '../../domain/enums/user-role.enum';
import { sendErrorResponse } from '../../shared/utils/error-handler';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { SexTypes } from '../../domain/enums/sex-types.enum';
import { UsersUseCases } from '../../application/use-cases/users';

const authService = new AuthService();
const usersUseCases = new UsersUseCases();


export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginDto;
  const user = await usersUseCases.getByEmailOrPhoneUseCase.execute(email);

  if (!user || !user.isActive) {
    const error = new Error('Invalid credentials');
    return sendErrorResponse(res, 401, 'Invalid credentials', error);
  }


  const validPswd = await comparePassword(password, user.passwordHash);
  if (!validPswd) {
    const error = new Error('Invalid credentials');
    return sendErrorResponse(res, 401, 'Invalid credentials', error);
  }

  const payload = {
    sub: user.id,
    roles: user.roles,
    permissions: user.permissions
  };

  const accessToken = authService.generateAccessToken(payload);
  const refreshToken = authService.generateRefreshToken(payload);

  res.json({
    status: 'SUCCESS',
    message: 'Successfully logged in',
    data: {
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  });
}

export async function register(req: Request, res: Response) {
  const payload = req.body as RegisterDto;

  // Check if first time account already exists
  const existing = await usersUseCases.fetchAllUsersUseCase.execute({ isFirstTimeAccount: true, isActive: true, page: 1, limit: 10 });
  if (existing.length > 0) {
    const error = new Error('First time account already exists');
    return sendErrorResponse(res, 409, 'First time account already exists', error);
  }

  // Hash password and create user with default role
  const passwordHash = await hashPassword(payload.password);
  
  const userPayload = {
    ...payload,
    passwordHash,
    isActive: true,
    isFirstTimeAccount: true,
    roles: [UserRole.CEO],
    permissions: Object.values(PERMISSIONS),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const user = await usersUseCases.createUserUseCase.execute(userPayload);

  // Generate tokens for the new user
  const tokenPayload = {
    sub: user.id,
    roles: user.roles,
    permissions: user.permissions
  };

  const accessToken = authService.generateAccessToken(tokenPayload);
  const refreshToken = authService.generateRefreshToken(tokenPayload);

  res.status(201).json({
    "status": "SUCCESS",
    "message": "Successfully registered",
    "data": {
      "user": user,
      "accessToken": accessToken,
      "refreshToken": refreshToken
    }
  });
}

export async function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body as RefreshTokenDto;
  try {
    const payload = authService.verify(refreshToken);
    const accessToken = authService.generateAccessToken({
      sub: payload.sub,
      roles: payload.roles,
      permissions: payload.permissions
    });

    res.json({
      status: 'SUCCESS',
      message: 'Successfully refreshed token',
      data: {
        accessToken: accessToken
      }
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Invalid refresh token');
    sendErrorResponse(res, 401, 'Invalid refresh token', err);
  }
}
