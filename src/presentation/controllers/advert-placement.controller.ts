import { NextFunction, Request, Response } from 'express';
import { CreateAdvertPlacementUseCase } from '../../application/use-cases/advert-placements/create-advert-placement.use-case';
import { BatchCreateAdvertPlacementsUseCase } from '../../application/use-cases/advert-placements/batch-create-advert-placements.use-case';
import { FetchAllAdvertPlacementsUseCase } from '../../application/use-cases/advert-placements/fetch-all-advert-placements.use-case';
import { CountAdvertPlacementsUseCase } from '../../application/use-cases/advert-placements/count-advert-placements.use-case';
import { GetAdvertPlacementByIdUseCase } from '../../application/use-cases/advert-placements/get-advert-placement-by-id.use-case';
import { UpdateAdvertPlacementUseCase } from '../../application/use-cases/advert-placements/update-advert-placement.use-case';
import { DeleteAdvertPlacementUseCase } from '../../application/use-cases/advert-placements/delete-advert-placement.use-case';
import { mapFetchAllAdvertPlacementsDtoToQueryOptions } from '../mappers/advert-placement-to-query-options.mapper';
import type { CreateAdvertPlacementDto } from '../dtos/requests/advert-placement/create.dto';
import type { UpdateAdvertPlacementDto } from '../dtos/requests/advert-placement/update.dto';
import type { FetchAllAdvertPlacementsDto } from '../dtos/requests/advert-placement/fetch-all.dto';
import type { ApiRouterDeps } from '../api-router-deps';

export function createAdvertPlacementHandlers(
  deps: Pick<
    ApiRouterDeps,
    | 'advertPlacementRepository'
    | 'advertSalesRepository'
    | 'advertPackageRepository'
    | 'showRepository'
    | 'broadcastSlotRepository'
    | 'calendarService'
    | 'generateBusinessRefService'
  >,
) {
  const createPlacementUseCase = new CreateAdvertPlacementUseCase(
    deps.advertPlacementRepository,
    deps.advertSalesRepository,
    deps.showRepository,
    deps.broadcastSlotRepository,
    deps.generateBusinessRefService,
  );
  const batchCreateUseCase = new BatchCreateAdvertPlacementsUseCase(
    deps.advertPlacementRepository,
    deps.advertSalesRepository,
    deps.advertPackageRepository,
    deps.broadcastSlotRepository,
    deps.calendarService,
    deps.generateBusinessRefService,
  );
  const fetchAllUseCase = new FetchAllAdvertPlacementsUseCase(deps.advertPlacementRepository);
  const countUseCase = new CountAdvertPlacementsUseCase(deps.advertPlacementRepository);
  const getByIdUseCase = new GetAdvertPlacementByIdUseCase(deps.advertPlacementRepository);
  const updateUseCase = new UpdateAdvertPlacementUseCase(deps.advertPlacementRepository);
  const deleteUseCase = new DeleteAdvertPlacementUseCase(deps.advertPlacementRepository);

  async function create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateAdvertPlacementDto;
      const placement = await createPlacementUseCase.execute({
        advertSalesId: payload.advertSalesId,
        showId: payload.showId,
        date: payload.date,
        dateEth: payload.dateEth,
        position: payload.position,
        durationSeconds: payload.durationSeconds,
        status: payload.status,
        broadcastSlotId: payload.broadcastSlotId,
        spotIndex: payload.spotIndex,
        plannedTimeMinutes: payload.plannedTimeMinutes,
      });
      res.status(201).json({
        status: 'SUCCESS',
        message: 'Advert placement created successfully',
        data: { placement },
      });
    } catch (error) {
      next(error);
    }
  }

  async function list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = res.locals.query as FetchAllAdvertPlacementsDto;
      const queryOptions = mapFetchAllAdvertPlacementsDtoToQueryOptions(query);
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;

      const [placements, total] = await Promise.all([
        fetchAllUseCase.execute(queryOptions),
        countUseCase.execute(queryOptions.filters),
      ]);

      res.status(200).json({
        status: 'SUCCESS',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: { placements },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const placement = await getByIdUseCase.execute(id);
      res.status(200).json({
        status: 'SUCCESS',
        data: { placement },
      });
    } catch (error) {
      next(error);
    }
  }

  async function update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const payload = req.body as UpdateAdvertPlacementDto;
      const patch: Parameters<UpdateAdvertPlacementUseCase['execute']>[1] = {};
      if (payload.broadcastSlotId !== undefined) patch.broadcastSlotId = payload.broadcastSlotId;
      if (payload.position !== undefined) patch.position = payload.position;
      if (payload.spotIndex !== undefined) patch.spotIndex = payload.spotIndex;
      if (payload.broadcastCode !== undefined) patch.broadcastCode = payload.broadcastCode;
      if (payload.plannedTimeMinutes !== undefined) patch.plannedTimeMinutes = payload.plannedTimeMinutes;
      if (payload.actualAirTime !== undefined) patch.actualAirTime = payload.actualAirTime;
      if (payload.durationSeconds !== undefined) patch.durationSeconds = payload.durationSeconds;
      if (payload.status !== undefined) patch.status = payload.status;

      const placement = await updateUseCase.execute(id, patch);
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Advert placement updated successfully',
        data: { placement },
      });
    } catch (error) {
      next(error);
    }
  }

  async function remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await deleteUseCase.execute(id);
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Advert placement deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async function batchCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const { advertSalesId, position, dateFrom, dateTo } = req.body as {
        advertSalesId: string;
        position?: string;
        dateFrom?: string;
        dateTo?: string;
      };

      const placements = await batchCreateUseCase.execute({
        advertSalesId,
        position: position as any,
        dateFrom: dateFrom ? new Date(dateFrom) : undefined,
        dateTo: dateTo ? new Date(dateTo) : undefined,
      });
      
      res.status(201).json({
        status: 'SUCCESS',
        message: `${placements.length} advert placement(s) created`,
        data: { placements },
      });
    } catch (error) {
      next(error);
    }
  }

  async function statusBoard(_req: Request, res: Response, next: NextFunction) {
    try {
      const all = await fetchAllUseCase.execute({ take: 10000 });
      const summary: Record<string, number> = {};
      for (const p of all) {
        summary[p.status] = (summary[p.status] ?? 0) + 1;
      }
      res.status(200).json({
        status: 'SUCCESS',
        data: { total: all.length, byStatus: summary },
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    create,
    batchCreate,
    list,
    getById,
    update,
    remove,
    statusBoard,
  };
}
