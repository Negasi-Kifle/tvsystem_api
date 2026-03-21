import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { createMediaMonitoringRecordDto } from '../dtos/requests/media-monitoring/create-media-monitoring-record.dto';
import {
  fetchUnlinkedMediaMonitoring,
  createMediaMonitoringRecord,
} from '../controllers/media-monitoring.controller';

const router = Router();

router.get(
  '/unlinked',
  authMiddleware,
  requirePermission(PERMISSIONS.VIEW_SALES),
  fetchUnlinkedMediaMonitoring,
);

router.post(
  '/',
  authMiddleware,
  requirePermission(PERMISSIONS.MANAGE_SALES),
  validateBody(createMediaMonitoringRecordDto),
  createMediaMonitoringRecord,
);

export default router;
