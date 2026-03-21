import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { addCommunicationLogDto } from '../dtos/requests/communication-log/add-communication-log.dto';
import {
  addCommunicationLog,
  fetchCommunicationLogsByCustomer,
} from '../controllers/communication-log.controller';

const router = Router();

router.post(
  '/',
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_SALES),
  validateBody(addCommunicationLogDto),
  addCommunicationLog,
);

router.get(
  '/customer/:customerId',
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_SALES),
  fetchCommunicationLogsByCustomer,
);

export default router;
