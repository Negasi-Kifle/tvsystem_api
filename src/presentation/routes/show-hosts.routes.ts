import { Router } from 'express';
import {
  createShowHost,
  deleteShowHost,
  getShowHostById,
  listShowHosts,
  updateShowHost,
} from '../controllers/show-host.controller';
import { authMiddleware } from '../../infrastructure/middlewares/auth.middleware';
import { requirePermission } from '../../infrastructure/middlewares/permission.middleware';
import { PERMISSIONS } from '../../shared/constants/permissions.constants';
import { validateBody } from '../validators/validate-body';
import { validateQuery } from '../validators/validate-query';
import { createShowHostDto } from '../dtos/requests/show-host/create-show-host.dto';
import { updateShowHostDto } from '../dtos/requests/show-host/update-show-host.dto';
import { fetchAllShowHostsDto } from '../dtos/requests/show-host/fetch-all-show-hosts.dto';

const router = Router();

router
  .route('/')
  .get(
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_SHOWS),
    validateQuery(fetchAllShowHostsDto),
    listShowHosts,
  )
  .post(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SHOWS),
    validateBody(createShowHostDto),
    createShowHost,
  );

router
  .route('/:id')
  .get(
    authMiddleware,
    requirePermission(PERMISSIONS.VIEW_SHOWS),
    getShowHostById,
  )
  .patch(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SHOWS),
    validateBody(updateShowHostDto),
    updateShowHost,
  )
  .delete(
    authMiddleware,
    requirePermission(PERMISSIONS.MANAGE_SHOWS),
    deleteShowHost,
  );

export default router;

