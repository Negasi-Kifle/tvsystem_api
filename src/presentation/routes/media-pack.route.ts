import { Router } from "express";
import { validateBody } from "../validators/validate-body";
import { validateQuery } from "../validators/validate-query";
import { authMiddleware } from "../../infrastructure/middlewares/auth.middleware";
import { requirePermission } from "../../infrastructure/middlewares/permission.middleware";
import { PERMISSIONS } from "../../shared/constants/permissions.constants";
import { createMediaPackDto } from "../dtos/requests/media-pack/create.dto";
import { updateMediaPackDto } from "../dtos/requests/media-pack/update.dto";
import { fetchAllMediaPacksDto } from "../dtos/requests/media-pack/fetch-all.dto";
import {
    createMediaPack,
    createMediaPackWithAdPackages,
    deleteMediaPack,
    fetchAllMediaPacks,
    getMediaPackById,
    updateMediaPack,
} from "../controllers/media-pack.controller";
import { createMediaPackWithAdPackagesDto } from "../dtos/requests/media-pack/create-media-pack-with-ad-packages.dto";

const router = Router();

router
    .route('/')
    .post(authMiddleware, requirePermission(PERMISSIONS.MANAGE_MEDIA_PACKS), validateBody(createMediaPackDto), createMediaPack)
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_MEDIA_PACKS), validateQuery(fetchAllMediaPacksDto), fetchAllMediaPacks);


router
    .route('/with-ad-packages')
    .post(
        authMiddleware,
        requirePermission(PERMISSIONS.MANAGE_MEDIA_PACKS),
        validateBody(createMediaPackWithAdPackagesDto),
        createMediaPackWithAdPackages,
    );


router
    .route('/:id')
    .get(authMiddleware, requirePermission(PERMISSIONS.VIEW_MEDIA_PACKS), getMediaPackById)
    .patch(authMiddleware, requirePermission(PERMISSIONS.MANAGE_MEDIA_PACKS), validateBody(updateMediaPackDto), updateMediaPack)
    .delete(authMiddleware, requirePermission(PERMISSIONS.MANAGE_MEDIA_PACKS), deleteMediaPack);

export default router;
