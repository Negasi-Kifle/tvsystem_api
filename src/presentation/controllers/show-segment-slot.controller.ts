import { NextFunction, Request, Response } from 'express';
import { CreateShowSegmentSlotUseCase } from '../../application/use-cases/show-segment-slots/create-show-segment-slot.use-case';
import { DeleteShowSegmentSlotUseCase } from '../../application/use-cases/show-segment-slots/delete-show-segment-slot.use-case';
import { FetchAllShowSegmentSlotsUseCase } from '../../application/use-cases/show-segment-slots/fetch-all-show-segment-slots.use-case';
import { CountShowSegmentSlotsUseCase } from '../../application/use-cases/show-segment-slots/count-show-segment-slots.use-case';
import { GetShowSegmentSlotByIdUseCase } from '../../application/use-cases/show-segment-slots/get-show-segment-slot-by-id.use-case';
import { UpdateShowSegmentSlotUseCase } from '../../application/use-cases/show-segment-slots/update-show-segment-slot.use-case';
import { CreateShowSegmentSlotDto } from '../dtos/requests/show-segment-slot/create-show-segment-slot.dto';
import { FetchAllShowSegmentSlotsDto } from '../dtos/requests/show-segment-slot/fetch-all-show-segment-slots.dto';
import { UpdateShowSegmentSlotDto } from '../dtos/requests/show-segment-slot/update-show-segment-slot.dto';
import { mapFetchAllShowSegmentSlotsDtoToQueryOptions } from '../mappers/show-segment-slot-to-query-options.mapper';
import type { ApiRouterDeps } from '../api-router-deps';

export function createShowSegmentSlotHandlers(
  deps: Pick<ApiRouterDeps, 'showSegmentSlotRepository' | 'showRepository' | 'customerRepository'>,
) {
  const { showSegmentSlotRepository, showRepository, customerRepository } = deps;

  const createUseCase = new CreateShowSegmentSlotUseCase(
    showSegmentSlotRepository,
    showRepository,
    customerRepository,
  );
  const fetchAllUseCase = new FetchAllShowSegmentSlotsUseCase(showSegmentSlotRepository);
  const countUseCase = new CountShowSegmentSlotsUseCase(showSegmentSlotRepository);
  const getByIdUseCase = new GetShowSegmentSlotByIdUseCase(showSegmentSlotRepository);
  const updateUseCase = new UpdateShowSegmentSlotUseCase(
    showSegmentSlotRepository,
    showRepository,
    customerRepository,
  );
  const deleteUseCase = new DeleteShowSegmentSlotUseCase(showSegmentSlotRepository);

  async function listShowSegmentSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const query = res.locals.query as FetchAllShowSegmentSlotsDto;
      const queryOptions = mapFetchAllShowSegmentSlotsDtoToQueryOptions(query);
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;

      const [slots, total] = await Promise.all([
        fetchAllUseCase.execute(queryOptions),
        countUseCase.execute(queryOptions),
      ]);

      res.status(200).json({
        status: 'SUCCESS',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: { slots },
      });
    } catch (error) {
      next(error);
    }
  }

  async function createShowSegmentSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateShowSegmentSlotDto;
      const slot = await createUseCase.execute(payload);

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Show segment slot created successfully',
        data: { slot },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getShowSegmentSlotById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const slot = await getByIdUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        data: { slot },
      });
    } catch (error) {
      next(error);
    }
  }

  async function updateShowSegmentSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const payload = req.body as UpdateShowSegmentSlotDto;
      const slot = await updateUseCase.execute(id, payload);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Show segment slot updated successfully',
        data: { slot },
      });
    } catch (error) {
      next(error);
    }
  }

  async function deleteShowSegmentSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await deleteUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Show segment slot deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    listShowSegmentSlots,
    createShowSegmentSlot,
    getShowSegmentSlotById,
    updateShowSegmentSlot,
    deleteShowSegmentSlot,
  };
}
