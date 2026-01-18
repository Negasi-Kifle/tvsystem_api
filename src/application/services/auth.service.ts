import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../infrastructure/config/jwt.config';

interface TokenPayload {
  sub: string;
  roles: string[];
  permissions: string[];
}

export class AuthService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.accessTokenTtl });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.refreshTokenTtl });
  }

  verify(token: string): TokenPayload {
    return jwt.verify(token, jwtConfig.secret) as TokenPayload;
  }
}
