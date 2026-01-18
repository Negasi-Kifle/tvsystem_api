import { Router } from 'express';
import { createShow, listShows } from '../controllers/show.controller';
import { validateBody } from '../validators/validate-body';
import { createShowDto } from '../dtos/requests/create-show.dto';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';

const router = Router();

router.get('/', authMiddleware, listShows);
router.post(
  '/',
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_SHOWS),
  validateBody(createShowDto),
  createShow
);

export default router;
