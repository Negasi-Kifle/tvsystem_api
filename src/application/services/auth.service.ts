import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../infrastructure/config/jwt.config';

export interface TokenPayload { userId: string }

export class AuthService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.accessTokenTtl } as jwt.SignOptions);
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.refreshTokenTtl } as jwt.SignOptions);
  }

  verify(token: string): TokenPayload {
    return jwt.verify(token, jwtConfig.secret) as TokenPayload;
  }
}
