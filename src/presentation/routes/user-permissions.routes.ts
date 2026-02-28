import { Router } from "express";
import { createUserPermission, fetchAllUserPermissions, findUserPermissionById, deleteUserPermission } from "../controllers/user-permission.controller";
import { validateBody } from "../validators/validate-body";
import { createUserPermissionDto } from "../dtos/requests/user-permission/create-user-permission.dto";
import { PERMISSIONS } from "../../shared/constants/permissions.constants";
import { requirePermission } from "../../infrastructure/middlewares/permission.middleware";
import { authMiddleware } from "../../infrastructure/middlewares/auth.middleware";
import { validateQuery } from "../validators/validate-query";
import { fetchAllUserPermissionsDto } from "../dtos/requests/user-permission/fetch-all-user-permissions.dto";

const router = Router();

router.route('/')
    .post(authMiddleware, requirePermission(PERMISSIONS.MANAGE_USER_PERMISSIONS), validateBody(createUserPermissionDto), createUserPermission)
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_USER_PERMISSIONS), validateQuery(fetchAllUserPermissionsDto), fetchAllUserPermissions);


router.route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_USER_PERMISSIONS), findUserPermissionById)
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_USER_PERMISSIONS), deleteUserPermission);


export default router;