import { Router } from "express";
import { validateBody } from "../validators/validate-body";
import { authMiddleware } from "../../infrastructure/middlewares/auth.middleware";
import { requirePermission } from "../../infrastructure/middlewares/permission.middleware";
import { PERMISSIONS } from "../../shared/constants/permissions.constants";
import { validateQuery } from "../validators/validate-query";
import { createPartnerDto } from "../dtos/requests/partner/create";
import { createPartner, deletePartner, fetchAllPartners, getPartner, updatePartner, updatePartnerStatus } from "../controllers/partner.controller";
import { fetchAllPartnersDto } from "../dtos/requests/partner/fetch-all";
import { updatePartnerDto } from "../dtos/requests/partner/update";
import { updatePartnerStatusDto } from "../dtos/requests/partner/update-status";

const router = Router();

router.route('/')
    .post(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PARTNERS), validateBody(createPartnerDto), createPartner)
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PARTNERS), validateQuery(fetchAllPartnersDto), fetchAllPartners);

router.route('/:id/status')
    .patch(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PARTNERS), validateBody(updatePartnerStatusDto), updatePartnerStatus);

router.route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PARTNERS), getPartner)
    .patch(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PARTNERS), validateBody(updatePartnerDto), updatePartner)
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_PARTNERS), deletePartner);
    

export default router;