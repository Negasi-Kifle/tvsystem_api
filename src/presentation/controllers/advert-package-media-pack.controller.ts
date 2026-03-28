import { NextFunction, Request, Response } from 'express';
import { CreateAdvertPackageMediaPackUseCase } from '../../application/use-cases/advert-package-media-pack/create-ad-package-media-pack.use-case';
import { FetchAllAdvertPackageMediaPacksUseCase } from '../../application/use-cases/advert-package-media-pack/fetch-all.use-case';
import { CountAdvertPackageMediaPacksUseCase } from '../../application/use-cases/advert-package-media-pack/count-advert-package-media-packs.use-case';
import { FindAdvertPackageMediaPackByIdUseCase } from '../../application/use-cases/advert-package-media-pack/find-advert-package-media-pack-by-id.use-case';
import { UpdateAdvertPackageMediaPackUseCase } from '../../application/use-cases/advert-package-media-pack/update-advert-package-media-pack.use-case';
import { DeleteAdvertPackageMediaPackUseCase } from '../../application/use-cases/advert-package-media-pack/delete-advert-package-media-pack.use-case';
import { AdvertPackageRepository } from '../../infrastructure/prisma/repositories/advert-package.repository';
import { AdvertPackageMediaPackRepository } from '../../infrastructure/prisma/repositories/advert-package-media-pack.repository';
import { MediaPackRepository } from '../../infrastructure/prisma/repositories/media-pack.repository';
import { mapFetchAllAdvertPackageMediaPacksDtoToQueryOptions } from '../mappers/advert-package-media-pack-to-query-options.mapper';
import { CreateAdvertPackageMediaPackDto } from '../dtos/requests/advert-package-media-pack/create.dto';
import { FetchAllAdvertPackageMediaPacksDto } from '../dtos/requests/advert-package-media-pack/fetch-all.dto';
import { UpdateAdvertPackageMediaPackDto } from '../dtos/requests/advert-package-media-pack/update.dto';

const advertPackageMediaPackRepository = new AdvertPackageMediaPackRepository();
const advertPackageRepository = new AdvertPackageRepository();
const mediaPackRepository = new MediaPackRepository();


const createAdvertPackageMediaPackUseCase = new CreateAdvertPackageMediaPackUseCase(
  advertPackageMediaPackRepository,
  advertPackageRepository,
  mediaPackRepository,
);
const fetchAllAdvertPackageMediaPacksUseCase = new FetchAllAdvertPackageMediaPacksUseCase(
  advertPackageMediaPackRepository,
);
const countAdvertPackageMediaPacksUseCase = new CountAdvertPackageMediaPacksUseCase(
  advertPackageMediaPackRepository,
);
const findAdvertPackageMediaPackByIdUseCase = new FindAdvertPackageMediaPackByIdUseCase(
  advertPackageMediaPackRepository,
);
const updateAdvertPackageMediaPackUseCase = new UpdateAdvertPackageMediaPackUseCase(
  advertPackageMediaPackRepository,
  advertPackageRepository,
  mediaPackRepository,
);
const deleteAdvertPackageMediaPackUseCase = new DeleteAdvertPackageMediaPackUseCase(
  advertPackageMediaPackRepository,
);

export async function createAdvertPackageMediaPack(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as CreateAdvertPackageMediaPackDto;
    const links = await createAdvertPackageMediaPackUseCase.execute({
      advertPackageIds: payload.advertPackageIds,
      mediaPackId: payload.mediaPackId,
    });

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Advert package media pack links created successfully',
      data: { advertPackageMediaPacks: links },
    });
  } catch (error) {
    next(error);
  }
}

export async function fetchAllAdvertPackageMediaPacks(req: Request, res: Response, next: NextFunction) {
  try {
    const query = res.locals.query as FetchAllAdvertPackageMediaPacksDto;
    const queryOptions = mapFetchAllAdvertPackageMediaPacksDtoToQueryOptions(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const [advertPackageMediaPacks, total] = await Promise.all([
      fetchAllAdvertPackageMediaPacksUseCase.execute(queryOptions),
      countAdvertPackageMediaPacksUseCase.execute(queryOptions),
    ]);

    res.status(200).json({
      status: 'SUCCESS',
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: { advertPackageMediaPacks },
    });
  } catch (error) {
    next(error);
  }
}

export async function findAdvertPackageMediaPackById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const advertPackageMediaPack = await findAdvertPackageMediaPackByIdUseCase.execute(id);
    
    res.status(200).json({
      status: 'SUCCESS',
      data: { advertPackageMediaPack },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAdvertPackageMediaPack(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const payload = req.body as UpdateAdvertPackageMediaPackDto;
    const advertPackageMediaPack = await updateAdvertPackageMediaPackUseCase.execute(id, payload);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Advert package media pack link updated successfully',
      data: { advertPackageMediaPack },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAdvertPackageMediaPack(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    await deleteAdvertPackageMediaPackUseCase.execute(id);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Advert package media pack link removed successfully',
    });
  } catch (error) {
    next(error);
  }
}
