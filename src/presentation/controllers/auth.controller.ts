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

const userRepo = new UserRepository();
const authService = new AuthService();

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginDto;
  const user = await userRepo.findByEmail(email);
  if (!user || !user.isActive) {
    const error = new Error('Invalid credentials');
    return sendErrorResponse(res, 401, 'Invalid credentials', error);
  }
  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
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
    "status": "SUCCESS",
    "message": "Successfully logged in",
    "data": {
      "user": user,
      "accessToken": accessToken,
      "refreshToken": refreshToken,
    }
  });
}

export async function register(req: Request, res: Response) {
  const { email, password, fullName } = req.body as RegisterDto;
  
  // Check if first time account already exists
  const existing = await userRepo.findByMultipleFields({ isFirstTimeAccount: true });
  if (existing) {
    const error = new Error('First time account already exists');
    return sendErrorResponse(res, 409, 'First time account already exists', error);
  }

  // Hash password and create user with default role
  const passwordHash = await hashPassword(password);

  
  const user = await userRepo.create({
    email,
    fullName,
    passwordHash,
    roles: [UserRole.CEO],
    permissions: Object.values(PERMISSIONS), // Give all permissions to the CEO
    isActive: true,
    isFirstTimeAccount: true
  });

  // Generate tokens for the new user
  const payload = {
    sub: user.id,
    roles: user.roles,
    permissions: user.permissions
  };

  const accessToken = authService.generateAccessToken(payload);
  const refreshToken = authService.generateRefreshToken(payload);

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
    res.json({ accessToken });
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Invalid refresh token');
    sendErrorResponse(res, 401, 'Invalid refresh token', err);
  }
}
