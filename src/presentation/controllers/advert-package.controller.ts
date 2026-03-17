import { Request, Response, NextFunction } from 'express';
import { AdvertPackageRepository } from '../../infrastructure/prisma/repositories/advert-package.repository';
import { MediaPackRepository } from '../../infrastructure/prisma/repositories/media-pack.repository';
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

const advertPackageRepository = new AdvertPackageRepository();
const mediaPackRepository = new MediaPackRepository();
const createAdvertPackageUseCase = new CreateAdvertPackageUseCase(
  advertPackageRepository,
  mediaPackRepository,
);
const getAdvertPackageByIdUseCase = new GetAdvertPackageByIdUseCase(advertPackageRepository);
const fetchAllAdvertPackagesUseCase = new FetchAllAdvertPackagesUseCase(advertPackageRepository);
const countAdvertPackagesUseCase = new CountAdvertPackagesUseCase(advertPackageRepository);
const updateAdvertPackageUseCase = new UpdateAdvertPackageUseCase(
  advertPackageRepository,
  mediaPackRepository,
);
const deleteAdvertPackageUseCase = new DeleteAdvertPackageUseCase(advertPackageRepository);

export async function createAdvertPackage(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as CreateAdvertPackageDto;
    // TODO: Configure OTHER_TAXES_RATE in environment as a numeric percentage (e.g. "5" for 5%)
    const otherTaxesRateEnv = process.env.OTHER_TAXES_RATE ?? '0';
    const otherTaxesRate = Number(otherTaxesRateEnv) || 0;
    const otherTaxes = (payload.otherTaxes ?? 0) + otherTaxesRate;
    const allTaxes = otherTaxes + Number(process.env.VAT_RATE ?? '0');
    const finalPrice = payload.priceBeforeVAT * (1 + (allTaxes / 100));
    
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
    });

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Advert package created successfully',
      data: { advertPackage },
    });
  } catch (error: unknown) {
    next(error);
  }
}

export async function fetchAllAdvertPackages(req: Request, res: Response, next: NextFunction) {
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

export async function getAdvertPackageById(req: Request, res: Response, next: NextFunction) {
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

export async function updateAdvertPackage(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const payload = req.body as UpdateAdvertPackageDto;
    const advertPackage = await updateAdvertPackageUseCase.execute(id, {
      name: payload.name,
      nameSlug: payload.nameSlug,
      mediaPackId: payload.mediaPackId,
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
    });

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Advert package updated successfully',
      data: { advertPackage },
    });
  } catch (error: unknown) {
    next(error);
  }
}

export async function deleteAdvertPackage(req: Request, res: Response, next: NextFunction) {
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
