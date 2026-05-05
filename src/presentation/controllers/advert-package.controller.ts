import { Request, Response, NextFunction } from 'express';
import { toStorageUploadFile } from '../mappers/multer-to-storage-upload.mapper';
import { CreateAdvertPackageUseCase } from '../../application/use-cases/advert-package/create-advert-package.use-case';
import { GetAdvertPackageByIdUseCase } from '../../application/use-cases/advert-package/get-advert-package-by-id.use-case';
import { FetchAllAdvertPackagesUseCase } from '../../application/use-cases/advert-package/fetch-all-advert-packages.use-case';
import { CountAdvertPackagesUseCase } from '../../application/use-cases/advert-package/count-advert-packages.use-case';
import { UpdateAdvertPackageUseCase } from '../../application/use-cases/advert-package/update-advert-package.use-case';
import { DeleteAdvertPackageUseCase } from '../../application/use-cases/advert-package/delete-advert-package.use-case';
import { mapFetchAllAdvertPackagesDtoToQueryOptions } from '../mappers/advert-package-to-query-options.mapper';
import { CreateAdvertPackageDto } from '../dtos/requests/advert-package/create.dto';
import { UpdateAdvertPackageDto } from '../dtos/requests/advert-package/update.dto';
import { FetchAllAdvertPackagesDto } from '../dtos/requests/advert-package/fetch-all.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export type AdvertPackageHandlerDeps = Pick<
  ApiRouterDeps,
  'storageService' | 'advertPackageRepository' | 'mediaPackRepository'
>;

export function createAdvertPackageHandlers(deps: AdvertPackageHandlerDeps) {
  const { storageService, advertPackageRepository, mediaPackRepository } = deps;

  const createAdvertPackageUseCase = new CreateAdvertPackageUseCase(
    advertPackageRepository,
    mediaPackRepository,
  );
  const getAdvertPackageByIdUseCase = new GetAdvertPackageByIdUseCase(advertPackageRepository);
  const fetchAllAdvertPackagesUseCase = new FetchAllAdvertPackagesUseCase(advertPackageRepository);
  const countAdvertPackagesUseCase = new CountAdvertPackagesUseCase(advertPackageRepository);
  const updateAdvertPackageUseCase = new UpdateAdvertPackageUseCase(advertPackageRepository);
  const deleteAdvertPackageUseCase = new DeleteAdvertPackageUseCase(advertPackageRepository);

  async function removeOrphanUpload(fileUrl: string): Promise<void> {
    try {
      await storageService.delete(fileUrl);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[AdvertPackage] Failed to delete orphaned upload:', fileUrl, err);
    }
  }

  async function createAdvertPackage(req: Request, res: Response, next: NextFunction) {
    let stagedImageUrl: string | undefined;
    let persistSucceeded = false;
    try {
      const payload = req.body as CreateAdvertPackageDto;
      // TODO: Configure OTHER_TAXES_RATE in environment as a numeric percentage (e.g. "5" for 5%)
      const otherTaxesRateEnv = process.env.OTHER_TAXES_RATE ?? '0';
      const otherTaxesRate = Number(otherTaxesRateEnv) || 0;
      const otherTaxes = (payload.otherTaxes ?? 0) + otherTaxesRate;
      const allTaxes = otherTaxes + Number(process.env.VAT_RATE ?? '0');
      const finalPrice = payload.priceBeforeVAT * (1 + allTaxes / 100);

      stagedImageUrl = await storageService.upload(toStorageUploadFile(req.file!), {
        folder: 'advert-packages',
      });

      const advertPackage = await createAdvertPackageUseCase.execute({
        name: payload.name,
        nameSlug: payload.nameSlug,
        mediaPackId: payload.mediaPackId,
        showIds: payload.showIds,
        advertisementsCount: payload.advertisementsCount,
        announcementsCount: payload.announcementsCount,
        popUpsCount: payload.popUpsCount,
        bonusesCount: payload.bonusesCount,
        priceBeforeVAT: payload.priceBeforeVAT,
        otherTaxes,
        finalPrice,
        isActive: payload.isActive,
        advertisementsRerunCount: payload.advertisementsRerunCount,
        announcementsRerunCount: payload.announcementsRerunCount,
        popUpsRerunCount: payload.popUpsRerunCount,
        bonusesRerunCount: payload.bonusesRerunCount,
        description: payload.description,
        imageUrl: stagedImageUrl,
      });

      persistSucceeded = true;

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Advert package created successfully',
        data: { advertPackage },
      });
    } catch (error: unknown) {
      if (stagedImageUrl && !persistSucceeded) {
        await removeOrphanUpload(stagedImageUrl);
      }
      next(error);
    }
  }

  async function fetchAllAdvertPackages(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = res.locals.query as FetchAllAdvertPackagesDto;
      const queryOptions = mapFetchAllAdvertPackagesDtoToQueryOptions(dto);

      const page = dto.page ?? 1;
      const limit = dto.limit ?? 10;

      const [advertPackages, total] = await Promise.all([
        fetchAllAdvertPackagesUseCase.execute(queryOptions),
        countAdvertPackagesUseCase.execute(queryOptions),
      ]);

      res.status(200).json({
        status: 'SUCCESS',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: { advertPackages },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async function getAdvertPackageById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const advertPackage = await getAdvertPackageByIdUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        data: { advertPackage },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async function updateAdvertPackage(req: Request, res: Response, next: NextFunction) {
    let stagedNewImageUrl: string | undefined;
    let persistSucceeded = false;
    try {
      const { id } = req.params as { id: string };
      const payload = req.body as UpdateAdvertPackageDto;

      let imageUrl: string | undefined;
      if (req.file) {
        stagedNewImageUrl = await storageService.upload(toStorageUploadFile(req.file), {
          folder: 'advert-packages',
        });
        imageUrl = stagedNewImageUrl;
      }

      const advertPackage = await updateAdvertPackageUseCase.execute(id, {
        name: payload.name,
        nameSlug: payload.nameSlug,
        showIds: payload.showIds,
        advertisementsCount: payload.advertisementsCount,
        announcementsCount: payload.announcementsCount,
        popUpsCount: payload.popUpsCount,
        bonusesCount: payload.bonusesCount,
        priceBeforeVAT: payload.priceBeforeVAT,
        otherTaxes: payload.otherTaxes,
        isActive: payload.isActive,
        advertisementsRerunCount: payload.advertisementsRerunCount,
        announcementsRerunCount: payload.announcementsRerunCount,
        popUpsRerunCount: payload.popUpsRerunCount,
        bonusesRerunCount: payload.bonusesRerunCount,
        description: payload.description ?? undefined,
        imageUrl,
      });

      persistSucceeded = true;

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Advert package updated successfully',
        data: { advertPackage },
      });
    } catch (error: unknown) {
      if (stagedNewImageUrl && !persistSucceeded) {
        await removeOrphanUpload(stagedNewImageUrl);
      }
      next(error);
    }
  }

  async function deleteAdvertPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await deleteAdvertPackageUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Advert package deleted successfully',
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  return {
    createAdvertPackage,
    fetchAllAdvertPackages,
    getAdvertPackageById,
    updateAdvertPackage,
    deleteAdvertPackage,
  };
}
