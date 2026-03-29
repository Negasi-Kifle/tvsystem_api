import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { createMediaMonitoringRecordDto } from '../dtos/requests/media-monitoring/create-media-monitoring-record.dto';
import { createMediaMonitoringHandlers } from '../controllers/media-monitoring.controller';
import type { ApiRouterDeps } from '../api-router-deps';

export function createMediaMonitoringRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { fetchUnlinkedMediaMonitoring, createMediaMonitoringRecord } =
    createMediaMonitoringHandlers(deps);

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

  return router;
}
