import { NextFunction, Request, Response } from 'express';
import { GenerateBroadcastSlotsUseCase } from '../../application/use-cases/broadcast-slots/generate-broadcast-slots.use-case';
import { FetchBroadcastSlotsUseCase } from '../../application/use-cases/broadcast-slots/fetch-broadcast-slots.use-case';
import { CountBroadcastSlotsUseCase } from '../../application/use-cases/broadcast-slots/count-broadcast-slots.use-case';
import { GetBroadcastSlotByIdUseCase } from '../../application/use-cases/broadcast-slots/get-broadcast-slot-by-id.use-case';
import { UpdateBroadcastSlotUseCase } from '../../application/use-cases/broadcast-slots/update-broadcast-slot.use-case';
import { DeleteBroadcastSlotUseCase } from '../../application/use-cases/broadcast-slots/delete-broadcast-slot.use-case';
import { GenerateBroadcastSlotsDto } from '../dtos/requests/broadcast-slot/generate-broadcast-slots.dto';
import { FetchBroadcastSlotsDto } from '../dtos/requests/broadcast-slot/fetch-broadcast-slots.dto';
import { UpdateBroadcastSlotDto } from '../dtos/requests/broadcast-slot/update-broadcast-slot.dto';
import { mapFetchBroadcastSlotsDtoToQueryOptions } from '../mappers/broadcast-slot-to-query-options.mapper';
import { formatListBroadcastSlotsData, formatSlotResponse } from './broadcast-slot-response.formatter';
import type { ApiRouterDeps } from '../api-router-deps';

export function createBroadcastSlotHandlers(
  deps: Pick<
    ApiRouterDeps,
    'broadcastSlotRepository' | 'scheduleBlockRepository' | 'satelliteScheduleRepository' | 'calendarService'
  >,
) {
  const {
    broadcastSlotRepository: slotRepo,
    scheduleBlockRepository: blockRepo,
    satelliteScheduleRepository: scheduleRepo,
    calendarService,
  } = deps;

  const generateBroadcastSlotsUseCase = new GenerateBroadcastSlotsUseCase(
    slotRepo,
    blockRepo,
    scheduleRepo,
    calendarService,
  );
  const fetchUseCase = new FetchBroadcastSlotsUseCase(slotRepo);
  const countUseCase = new CountBroadcastSlotsUseCase(slotRepo);
  const getByIdUseCase = new GetBroadcastSlotByIdUseCase(slotRepo);
  const updateUseCase = new UpdateBroadcastSlotUseCase(slotRepo);
  const deleteUseCase = new DeleteBroadcastSlotUseCase(slotRepo);

  async function generateBroadcastSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { scheduleId } = req.params as { scheduleId: string };
      const payload = req.body as GenerateBroadcastSlotsDto;
      const result = await generateBroadcastSlotsUseCase.execute({
        scheduleId,
        fromDate: payload.fromDate,
        toDate: payload.toDate,
      });
      res.status(201).json({
        status: 'SUCCESS',
        message: `Generated ${result.created} broadcast slots (${result.skipped} skipped, already exist)`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async function listBroadcastSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { scheduleId } = req.params as { scheduleId: string };
      const query = res.locals.query as FetchBroadcastSlotsDto;
      const queryOptions = mapFetchBroadcastSlotsDtoToQueryOptions(query, scheduleId);
      const page = query.page ?? 1;
      const limit = query.limit ?? 200;

      const [slots, total] = await Promise.all([
        fetchUseCase.execute(queryOptions),
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
        data: formatListBroadcastSlotsData(slots),
      });
    } catch (error) {
      next(error);
    }
  }

  async function getBroadcastSlotById(req: Request, res: Response, next: NextFunction) {
    try {
      const { slotId } = req.params as { slotId: string };
      const slot = await getByIdUseCase.execute(slotId);
      res.status(200).json({
        status: 'SUCCESS',
        data: { slot: formatSlotResponse(slot) },
      });
    } catch (error) {
      next(error);
    }
  }

  async function updateBroadcastSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const { slotId } = req.params as { slotId: string };
      const payload = req.body as UpdateBroadcastSlotDto;
      const slot = await updateUseCase.execute(slotId, payload);
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Broadcast slot updated successfully',
        data: { slot: formatSlotResponse(slot) },
      });
    } catch (error) {
      next(error);
    }
  }

  async function deleteBroadcastSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const { slotId } = req.params as { slotId: string };
      await deleteUseCase.execute(slotId);
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Broadcast slot deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    generateBroadcastSlots,
    listBroadcastSlots,
    getBroadcastSlotById,
    updateBroadcastSlot,
    deleteBroadcastSlot,
  };
}
