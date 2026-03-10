import { NextFunction, Request, Response } from 'express';
import { GenerateBroadcastSlotsUseCase } from '../../application/use-cases/broadcast-slots/generate-broadcast-slots.use-case';
import { FetchBroadcastSlotsUseCase } from '../../application/use-cases/broadcast-slots/fetch-broadcast-slots.use-case';
import { CountBroadcastSlotsUseCase } from '../../application/use-cases/broadcast-slots/count-broadcast-slots.use-case';
import { GetBroadcastSlotByIdUseCase } from '../../application/use-cases/broadcast-slots/get-broadcast-slot-by-id.use-case';
import { UpdateBroadcastSlotUseCase } from '../../application/use-cases/broadcast-slots/update-broadcast-slot.use-case';
import { DeleteBroadcastSlotUseCase } from '../../application/use-cases/broadcast-slots/delete-broadcast-slot.use-case';
import { BroadcastSlotRepository } from '../../infrastructure/prisma/repositories/broadcast-slot.repository';
import { ScheduleBlockRepository } from '../../infrastructure/prisma/repositories/schedule-block.repository';
import { SatelliteScheduleRepository } from '../../infrastructure/prisma/repositories/satellite-schedule.repository';
import { CalendarService } from '../../infrastructure/services/calendar.service';
import { GenerateBroadcastSlotsDto } from '../dtos/requests/broadcast-slot/generate-broadcast-slots.dto';
import { FetchBroadcastSlotsDto } from '../dtos/requests/broadcast-slot/fetch-broadcast-slots.dto';
import { UpdateBroadcastSlotDto } from '../dtos/requests/broadcast-slot/update-broadcast-slot.dto';
import { mapFetchBroadcastSlotsDtoToQueryOptions } from '../mappers/broadcast-slot-to-query-options.mapper';
import type { BroadcastSlotEntity } from '../../domain/entities/broadcast-slot.entity';

const slotRepo = new BroadcastSlotRepository();
const blockRepo = new ScheduleBlockRepository();
const scheduleRepo = new SatelliteScheduleRepository();
const calendarService = new CalendarService();

const generateBroadcastSlotsUseCase = new GenerateBroadcastSlotsUseCase(slotRepo, blockRepo, scheduleRepo, calendarService);
const fetchUseCase = new FetchBroadcastSlotsUseCase(slotRepo);
const countUseCase = new CountBroadcastSlotsUseCase(slotRepo);
const getByIdUseCase = new GetBroadcastSlotByIdUseCase(slotRepo);
const updateUseCase = new UpdateBroadcastSlotUseCase(slotRepo);
const deleteUseCase = new DeleteBroadcastSlotUseCase(slotRepo);

export async function generateBroadcastSlots(req: Request, res: Response, next: NextFunction) {
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

export async function listBroadcastSlots(req: Request, res: Response, next: NextFunction) {
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
      data: { slots: slots.map(formatSlotResponse) },
    });
  } catch (error) {
    next(error);
  }
}

export async function getBroadcastSlotById(req: Request, res: Response, next: NextFunction) {
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

export async function updateBroadcastSlot(req: Request, res: Response, next: NextFunction) {
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

export async function deleteBroadcastSlot(req: Request, res: Response, next: NextFunction) {
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

function formatSlotResponse(slot: BroadcastSlotEntity) {
  return {
    id: slot.id,
    scheduleBlockId: slot.scheduleBlockId,
    scheduleId: slot.scheduleId,
    showId: slot.showId,
    date: slot.date,
    dateEth: slot.dateEth,
    dayOfWeek: slot.dayOfWeek,
    broadcastType: slot.broadcastType,
    status: slot.status,
    label: slot.label,
    overrideReason: slot.overrideReason,
    startTimeMinutes: slot.startTimeMinutes,
    durationMinutes: slot.durationMinutes,
    gregorian: {
      start: slot.startTimeGregorian,
      end: slot.endTimeGregorian,
    },
    ethiopian: {
      start: slot.startTimeEthiopian.toString(),
      end: slot.endTimeEthiopian.toString(),
    },
    createdAt: slot.createdAt,
    updatedAt: slot.updatedAt,
  };
}
