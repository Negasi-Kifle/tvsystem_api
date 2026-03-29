import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { addCommunicationLogDto } from '../dtos/requests/communication-log/add-communication-log.dto';
import { createCommunicationLogHandlers } from '../controllers/communication-log.controller';
import { fetchAllCommunicationLogsDto } from '../dtos/requests/communication-log/fetch-all-comm-logs.dto';
import { validateQuery } from '../validators/validate-query';
import type { ApiRouterDeps } from '../api-router-deps';

export function createCommunicationLogsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { addCommunicationLog, fetchAllCommunicationLogs, fetchCommunicationLogsByCustomer } =
    createCommunicationLogHandlers(deps);

  router
    .route('/')
    .post(
      authMiddleware,
      requirePermission(PERMISSIONS.MANAGE_SALES),
      validateBody(addCommunicationLogDto),
      addCommunicationLog,
    )
    .get(
      authMiddleware,
      requirePermission(PERMISSIONS.VIEW_SALES),
      validateQuery(fetchAllCommunicationLogsDto),
      fetchAllCommunicationLogs,
    );

  router.get(
    '/customer/:customerId',
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_SALES),
    fetchCommunicationLogsByCustomer,
  );

  return router;
}
