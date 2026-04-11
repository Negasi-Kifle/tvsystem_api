import { Router } from 'express';
import multer from 'multer';
import { createSatelliteLogHandlers } from '../controllers/satellite-log.controller';
import { requirePermission } from '../../composition/http-middlewares';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import type { ApiRouterDeps } from '../api-router-deps';

const uploadMiddleware = multer({ storage: multer.memoryStorage() });

export function createSatelliteLogsRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { upload, list, getById, getEntries, matchEntries, verify, manualMatch } =
    createSatelliteLogHandlers(deps);

  router.post(
    '/upload',
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_ADVERTS),
    uploadMiddleware.single('file'),
    upload,
  );

  router.get('/', authMiddleware, requirePermission(PERMISSIONS.VIEW_ADVERTS), list);
  router.get('/:id', authMiddleware, requirePermission(PERMISSIONS.VIEW_ADVERTS), getById);
  router.get('/:id/entries', authMiddleware, requirePermission(PERMISSIONS.VIEW_ADVERTS), getEntries);
  router.post('/:id/match', authMiddleware, requirePermission(PERMISSIONS.MANAGE_ADVERTS), matchEntries);
  router.post('/:id/verify', authMiddleware, requirePermission(PERMISSIONS.MANAGE_ADVERTS), verify);

  return router;
}

export function createSatelliteLogEntriesRouter(deps: ApiRouterDeps): Router {
  const router = Router();
  const { authMiddleware } = deps;
  const { manualMatch } = createSatelliteLogHandlers(deps);

  router.patch(
    '/:id/match',
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_ADVERTS),
    manualMatch,
  );

  return router;
}
