import { NextFunction, Request, Response } from 'express';
import { CreateSatelliteScheduleUseCase } from '../../application/use-cases/satellite-schedules/create-satellite-schedule.use-case';
import { FetchAllSatelliteSchedulesUseCase } from '../../application/use-cases/satellite-schedules/fetch-all-satellite-schedules.use-case';
import { CountSatelliteSchedulesUseCase } from '../../application/use-cases/satellite-schedules/count-satellite-schedules.use-case';
import { GetSatelliteScheduleByIdUseCase } from '../../application/use-cases/satellite-schedules/get-satellite-schedule-by-id.use-case';
import { UpdateSatelliteScheduleUseCase } from '../../application/use-cases/satellite-schedules/update-satellite-schedule.use-case';
import { DeleteSatelliteScheduleUseCase } from '../../application/use-cases/satellite-schedules/delete-satellite-schedule.use-case';
import { SatelliteScheduleRepository } from '../../infrastructure/prisma/repositories/satellite-schedule.repository';
import { CreateSatelliteScheduleDto } from '../dtos/requests/satellite-schedule/create-satellite-schedule.dto';
import { UpdateSatelliteScheduleDto } from '../dtos/requests/satellite-schedule/update-satellite-schedule.dto';
import { FetchAllSatelliteSchedulesDto } from '../dtos/requests/satellite-schedule/fetch-all-satellite-schedules.dto';
import { mapFetchAllSatelliteSchedulesDtoToQueryOptions } from '../mappers/satellite-schedule-to-query-options.mapper';
import { CalendarService } from '../../infrastructure/services/calendar.service';
import { GenerateBroadcastSlotsUseCase } from '../../application/use-cases/broadcast-slots/generate-broadcast-slots.use-case';
import { BroadcastSlotRepository } from '../../infrastructure/prisma/repositories/broadcast-slot.repository';
import { ScheduleBlockRepository } from '../../infrastructure/prisma/repositories/schedule-block.repository';

const repo = new SatelliteScheduleRepository();
const calendarService = new CalendarService();
const slotRepo = new BroadcastSlotRepository();
const blockRepo = new ScheduleBlockRepository();

const activationHandler = new GenerateBroadcastSlotsUseCase(slotRepo, blockRepo, repo, calendarService);

const createUseCase = new CreateSatelliteScheduleUseCase(repo, calendarService);
const fetchAllUseCase = new FetchAllSatelliteSchedulesUseCase(repo);
const countUseCase = new CountSatelliteSchedulesUseCase(repo);
const getByIdUseCase = new GetSatelliteScheduleByIdUseCase(repo);
const updateUseCase = new UpdateSatelliteScheduleUseCase(repo, calendarService, activationHandler);
const deleteUseCase = new DeleteSatelliteScheduleUseCase(repo);

export async function createSatelliteSchedule(req: Request, res: Response) {
  const payload = req.body as CreateSatelliteScheduleDto;
  const schedule = await createUseCase.execute(payload);
  res.status(201).json({
    status: 'SUCCESS',
    message: 'Satellite schedule created successfully',
    data: { schedule },
  });
}

export async function listSatelliteSchedules(req: Request, res: Response, next: NextFunction) {
  try {
    const query = res.locals.query as FetchAllSatelliteSchedulesDto;
    const queryOptions = mapFetchAllSatelliteSchedulesDtoToQueryOptions(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const [schedules, total] = await Promise.all([
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
      data: { schedules },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSatelliteScheduleById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const schedule = await getByIdUseCase.execute(id);
    res.status(200).json({
      status: 'SUCCESS',
      data: { schedule },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSatelliteSchedule(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const payload = req.body as UpdateSatelliteScheduleDto;
    const schedule = await updateUseCase.execute(id, payload);
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Satellite schedule updated successfully',
      data: { schedule },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSatelliteSchedule(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    await deleteUseCase.execute(id);
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Satellite schedule deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
