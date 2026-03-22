import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { addCommunicationLogDto } from '../dtos/requests/communication-log/add-communication-log.dto';
import {
  addCommunicationLog,
  fetchAllCommunicationLogs,
  fetchCommunicationLogsByCustomer,
} from '../controllers/communication-log.controller';
import { fetchAllCommunicationLogsDto } from '../dtos/requests/communication-log/fetch-all-comm-logs.dto';
import { validateQuery } from '../validators/validate-query';

const router = Router();

router.route('/')
  .post(
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_SALES),
  validateBody(addCommunicationLogDto),
  addCommunicationLog,
)
.get(authMiddleware, requirePermission(PERMISSIONS.VIEW_SALES), validateQuery(fetchAllCommunicationLogsDto), fetchAllCommunicationLogs)

router.get(
  '/customer/:customerId',
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_SALES),
  fetchCommunicationLogsByCustomer,
);

export default router;
