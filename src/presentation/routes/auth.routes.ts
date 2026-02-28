import { Router } from 'express';
import { login, refreshToken, register } from '../controllers/auth.controller';
import { validateBody } from '../validators/validate-body';
import { loginDto } from '../dtos/requests/auth/login.dto';
import { refreshTokenDto } from '../dtos/requests/auth/refresh-token.dto';
import { registerDto } from '../dtos/requests/user/register.dto';

const router = Router();

router.post('/register', validateBody(registerDto), register);
router.post('/login', validateBody(loginDto), login);
router.post('/refresh', validateBody(refreshTokenDto), refreshToken);

export default router;
