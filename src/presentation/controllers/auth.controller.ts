import { Request, Response } from 'express';
import { UserRepository } from '../../infrastructure/prisma/repositories/user.repository';
import { comparePassword } from '../../shared/utils/password';
import { AuthService, TokenPayload } from '../../application/services/auth.service';
import { LoginDto } from '../dtos/requests/login.dto';
import { RefreshTokenDto } from '../dtos/requests/refresh-token.dto';
import { RegisterDto } from '../dtos/requests/user/register.dto';
import { sendErrorResponse } from '../../shared/utils/error-handler';
import { CreateUserUseCase } from '../../application/use-cases/users/create-user.use-case';
import { GetByEmailOrPhoneUseCase } from '../../application/use-cases/users/get-by-email-or-phone.use-case';

const authService = new AuthService();
const createUserUseCase = new CreateUserUseCase(new UserRepository());
const getByEmailOrPhoneUseCase = new GetByEmailOrPhoneUseCase(new UserRepository());

export async function login(req: Request, res: Response) {
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

  const payload: TokenPayload = { userId: user.id! };

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
  try {
    const payload = req.body as RegisterDto;

    // Check if first time account already exists
    // const existing = await usersUseCases.fetchAllUsersUseCase.execute({ isFirstTimeAccount: true, isActive: true, page: 1, limit: 10 });
    // if (existing.length > 0) {
    //   const error = new Error('First time account already exists');
    //   return sendErrorResponse(res, 409, 'First time account already exists', error);
    // }

    // Hash password and create user with default role
    // const passwordHash = await hashPassword(payload.password);

    // const userPayload = {
    //   ...payload,
    //   passwordHash,
    //   isActive: true,
    //   isFirstTimeAccount: true,
    //   roles: [UserRole.CEO],
    //   permissions: Object.values(PERMISSIONS),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // };

    payload.isFirstTimeAccount = true;
    const user = await createUserUseCase.execute(payload);

    // Generate tokens for the new user (id is set by the repository after create)
    const tokenPayload: TokenPayload = { userId: user.id! };

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
  } catch (error) {

  }

}

export async function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body as RefreshTokenDto;
  try {
    const payload = authService.verify(refreshToken);
    const accessToken = authService.generateAccessToken({
      userId: payload.userId
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
