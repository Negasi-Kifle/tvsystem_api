import { Router } from 'express';
import { createAuthHandlers } from '../controllers/auth.controller';
import { validateBody } from '../validators/validate-body';
import { loginDto } from '../dtos/requests/auth/login.dto';
import { refreshTokenDto } from '../dtos/requests/auth/refresh-token.dto';
import { registerDto } from '../dtos/requests/user/register.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createAuthRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { login, register, refreshToken } = createAuthHandlers(deps);

  router.post('/register', validateBody(registerDto), register);
  router.post('/login', validateBody(loginDto), login);
  router.post('/refresh', validateBody(refreshTokenDto), refreshToken);

  return router;
}
