import { Router } from "express";
import { createPermission, deletePermission, fetchAllPermissions, getPermissionById, updatePermission } from "../controllers/permission.controller";
import { authMiddleware } from "../../infrastructure/middlewares/auth.middleware";
import { requirePermission } from "../../infrastructure/middlewares/permission.middleware";
import { PERMISSIONS } from "../../shared/constants/permissions.constants";
import { validateBody } from "../validators/validate-body";
import { createPermissionDto } from "../dtos/requests/permission/create-permission.dto";
import { fetchAllPermissionsDto } from "../dtos/requests/permission/fetch-all-permissions.dto";
import { validateQuery } from "../validators/validate-query";
import { updatePermissionDto } from "../dtos/requests/permission/update-permission.dto";

const router = Router();

router.route('/')
    .post(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PERMISSIONS), validateBody(createPermissionDto), createPermission)
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PERMISSIONS), validateQuery(fetchAllPermissionsDto), fetchAllPermissions);


router.route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PERMISSIONS), getPermissionById)
    .patch(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PERMISSIONS), validateBody(updatePermissionDto), updatePermission)
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PERMISSIONS), deletePermission);

export default router;