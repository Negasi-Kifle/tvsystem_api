import { Request, Response, NextFunction } from 'express';
import { CreateAdvertUseCase } from '../../application/use-cases/adverts/create-advert.use-case';
import { UpdateAdvertUseCase } from '../../application/use-cases/adverts/update-advert.use-case';
import { GetAdvertByIdUseCase } from '../../application/use-cases/adverts/get-advert-by-id.use-case';
import { FetchAllAdvertsUseCase } from '../../application/use-cases/adverts/fetch-all-adverts.use-case';
import { CountAdvertsUseCase } from '../../application/use-cases/adverts/count-adverts.use-case';
import { DeleteAdvertUseCase } from '../../application/use-cases/adverts/delete-advert.use-case';
import { mapFetchAllAdvertsDtoToQueryOptions } from '../mappers/advert-to-query-options.mapper';
import type { CreateAdvertDto } from '../dtos/requests/advert/create-advert.dto';
import type { UpdateAdvertDto } from '../dtos/requests/advert/update-advert.dto';
import type { FetchAllAdvertsDto } from '../dtos/requests/advert/fetch-all-adverts.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createAdvertHandlers(
  deps: Pick<
    ApiRouterDeps,
    | 'advertRepository'
    | 'showRepository'
    | 'customerRepository'
    | 'broadcastSlotRepository'
  >,
) {
  const createAdvert = new CreateAdvertUseCase(
    deps.advertRepository,
    deps.showRepository,
    deps.customerRepository,
    deps.broadcastSlotRepository,
  );
  const updateAdvert = new UpdateAdvertUseCase(
    deps.advertRepository,
    deps.showRepository,
    deps.customerRepository,
    deps.broadcastSlotRepository,
  );
  const getAdvertById = new GetAdvertByIdUseCase(deps.advertRepository);
  const fetchAllAdverts = new FetchAllAdvertsUseCase(deps.advertRepository);
  const countAdverts = new CountAdvertsUseCase(deps.advertRepository);
  const deleteAdvert = new DeleteAdvertUseCase(deps.advertRepository);

  async function create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateAdvertDto;
      const advert = await createAdvert.execute({
        showId: payload.showId,
        customerId: payload.customerId,
        status: payload.status,
        slot: payload.slot
          ? { start: payload.slot.start, end: payload.slot.end }
          : undefined,
        contractDetails: payload.contractDetails,
        broadcastSlotId: payload.broadcastSlotId ?? null,
      });
      res.status(201).json({
        status: 'SUCCESS',
        message: 'Advert created successfully',
        data: { advert },
      });
    } catch (error) {
      next(error);
    }
  }

  async function update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const payload = req.body as UpdateAdvertDto;
      const patch: Parameters<UpdateAdvertUseCase['execute']>[1] = {};
      if (payload.showId !== undefined) patch.showId = payload.showId;
      if (payload.customerId !== undefined) patch.customerId = payload.customerId;
      if (payload.status !== undefined) patch.status = payload.status;
      if (payload.slot !== undefined) {
        patch.slot =
          payload.slot === null ? null : { start: payload.slot.start, end: payload.slot.end };
      }
      if (payload.contractDetails !== undefined) patch.contractDetails = payload.contractDetails;
      if (payload.broadcastSlotId !== undefined) patch.broadcastSlotId = payload.broadcastSlotId;

      const advert = await updateAdvert.execute(id, patch);
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Advert updated successfully',
        data: { advert },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const advert = await getAdvertById.execute(id);
      res.status(200).json({
        status: 'SUCCESS',
        data: { advert },
      });
    } catch (error) {
      next(error);
    }
  }

  async function list(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = res.locals.query as FetchAllAdvertsDto;
      const queryOptions = mapFetchAllAdvertsDtoToQueryOptions(dto);
      const page = dto.page ?? 1;
      const limit = dto.limit ?? 10;

      const [adverts, total] = await Promise.all([
        fetchAllAdverts.execute(queryOptions),
        countAdverts.execute(queryOptions.filters),
      ]);

      res.status(200).json({
        status: 'SUCCESS',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: { adverts },
      });
    } catch (error) {
      next(error);
    }
  }

  async function remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await deleteAdvert.execute(id);
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Advert deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    create,
    update,
    getById,
    list,
    remove,
  };
}
