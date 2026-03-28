import { Request, Response, NextFunction } from 'express';
import { MediaPackRepository } from '../../infrastructure/prisma/repositories/media-pack.repository';
import { CreateMediaPackUseCase } from '../../application/use-cases/media-pack/create-media-pack.use-case';
import { GetMediaPackByIdUseCase } from '../../application/use-cases/media-pack/get-media-pack-by-id.use-case';
import { FetchAllMediaPacksUseCase } from '../../application/use-cases/media-pack/fetch-all-media-packs.use-case';
import { CountMediaPacksUseCase } from '../../application/use-cases/media-pack/count-media-packs.use-case';
import { UpdateMediaPackUseCase } from '../../application/use-cases/media-pack/update-media-pack.use-case';
import { DeleteMediaPackUseCase } from '../../application/use-cases/media-pack/delete-media-pack.use-case';
import { mapFetchAllMediaPacksDtoToQueryOptions } from '../mappers/media-pack-to-query-options.mapper';
import { CreateMediaPackDto } from '../dtos/requests/media-pack/create.dto';
import { UpdateMediaPackDto } from '../dtos/requests/media-pack/update.dto';
import { FetchAllMediaPacksDto } from '../dtos/requests/media-pack/fetch-all.dto';
import { CreateMediaPackWithAdPackagesDto } from '../dtos/requests/media-pack/create-media-pack-with-ad-packages.dto';
import { CreateMediaPackWithAdPackagesUseCase } from '../../application/use-cases/media-pack/create-with-ad-packages.use-case';
import { AdvertPackageRepository } from '../../infrastructure/prisma/repositories/advert-package.repository';
import { AdvertPackageMediaPackRepository } from '../../infrastructure/prisma/repositories/advert-package-media-pack.repository';

const mediaPackRepository = new MediaPackRepository();
const advertPackageRepository = new AdvertPackageRepository();
const advertPackageMediaPackRepository = new AdvertPackageMediaPackRepository();


const createMediaPackUseCase = new CreateMediaPackUseCase(mediaPackRepository);
const getMediaPackByIdUseCase = new GetMediaPackByIdUseCase(mediaPackRepository);
const fetchAllMediaPacksUseCase = new FetchAllMediaPacksUseCase(mediaPackRepository);
const countMediaPacksUseCase = new CountMediaPacksUseCase(mediaPackRepository);
const updateMediaPackUseCase = new UpdateMediaPackUseCase(mediaPackRepository);
const deleteMediaPackUseCase = new DeleteMediaPackUseCase(mediaPackRepository);
const createMediaPackWithAdPackagesUseCase = new CreateMediaPackWithAdPackagesUseCase(mediaPackRepository, advertPackageRepository, advertPackageMediaPackRepository);

export async function createMediaPack(req: Request, res: Response, next: NextFunction) {
    try {
        const payload = req.body as CreateMediaPackDto;
        const versionSlug = payload.versionSlug ?? payload.version.toLowerCase().replace(/ /g, '-');
        const mediaPack = await createMediaPackUseCase.execute({
            version: payload.version,
            versionSlug,
            description: payload.description,
            isActive: payload.isActive,
        });

        res.status(201).json({
            status: 'SUCCESS',
            message: 'Media pack created successfully',
            data: { mediaPack },
        });
    } catch (error: unknown) {
        next(error);
    }
}

export async function fetchAllMediaPacks(req: Request, res: Response, next: NextFunction) {
    try {
        const dto = res.locals.query as FetchAllMediaPacksDto;
        const queryOptions = mapFetchAllMediaPacksDtoToQueryOptions(dto);

        const page = dto.page ?? 1;
        const limit = dto.limit ?? 10;

        const [mediaPacks, total] = await Promise.all([
            fetchAllMediaPacksUseCase.execute(queryOptions),
            countMediaPacksUseCase.execute(queryOptions),
        ]);

        res.status(200).json({
            status: 'SUCCESS',
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: { mediaPacks },
        });
    } catch (error: unknown) {
        next(error);
    }
}

export async function getMediaPackById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        const mediaPack = await getMediaPackByIdUseCase.execute(id);

        res.status(200).json({
            status: 'SUCCESS',
            data: { mediaPack },
        });
    } catch (error: unknown) {
        next(error);
    }
}

export async function updateMediaPack(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        const payload = req.body as UpdateMediaPackDto;
        const mediaPack = await updateMediaPackUseCase.execute(id, {
            version: payload.version,
            versionSlug: payload.versionSlug,
            description: payload.description ?? undefined,
            isActive: payload.isActive,
        });

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Media pack updated successfully',
            data: { mediaPack },
        });
    } catch (error: unknown) {
        next(error);
    }
}

export async function deleteMediaPack(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        await deleteMediaPackUseCase.execute(id);

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Media pack deleted successfully',
        });
    } catch (error: unknown) {
        next(error);
    }
}


export async function createMediaPackWithAdPackages(req: Request, res: Response, next: NextFunction) {
    try {
        const payload = req.body as CreateMediaPackWithAdPackagesDto;
        const mediaPack = await createMediaPackWithAdPackagesUseCase.execute(payload);
        
        res.status(201).json({
            status: 'SUCCESS',
            message: 'Media pack with ad packages created successfully',
            data: { mediaPack },
        });
    } catch (error: unknown) {
        next(error);
    }
}