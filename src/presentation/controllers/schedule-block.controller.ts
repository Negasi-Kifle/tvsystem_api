import { NextFunction, Request, Response } from 'express';
import { CreateScheduleBlockUseCase } from '../../application/use-cases/satellite-schedule-blocks/create-schedule-block.use-case';
import { CreateBatchScheduleBlocksUseCase } from '../../application/use-cases/satellite-schedule-blocks/create-batch-schedule-blocks.use-case';
import { FetchBlocksByScheduleUseCase } from '../../application/use-cases/satellite-schedule-blocks/fetch-blocks-by-schedule.use-case';
import { CountScheduleBlocksUseCase } from '../../application/use-cases/satellite-schedule-blocks/count-schedule-blocks.use-case';
import { GetScheduleBlockByIdUseCase } from '../../application/use-cases/satellite-schedule-blocks/get-schedule-block-by-id.use-case';
import { GetScheduleFreeBlocksUseCase } from '../../application/use-cases/satellite-schedule-blocks/get-schedule-free-blocks.use-case';
import { UpdateScheduleBlockUseCase } from '../../application/use-cases/satellite-schedule-blocks/update-schedule-block.use-case';
import { DeleteScheduleBlockUseCase } from '../../application/use-cases/satellite-schedule-blocks/delete-schedule-block.use-case';
import { CreateScheduleBlockDto } from '../dtos/requests/satellite-schedule-block/create-satellite-schedule-block.dto';
import { CreateBatchScheduleBlocksDto } from '../dtos/requests/satellite-schedule-block/create-batch-schedule-blocks.dto';
import { FetchScheduleBlocksDto } from '../dtos/requests/satellite-schedule-block/fetch-schedule-blocks.dto';
import { UpdateScheduleBlockDto } from '../dtos/requests/satellite-schedule-block/update-schedule-block.dto';
import { mapFetchScheduleBlocksDtoToQueryOptions } from '../mappers/schedule-block-to-query-options.mapper';
import { ScheduleBlockEntity } from '../../domain/entities/satellite-schedule-block.entity';
import type { ApiRouterDeps } from '../api-router-deps';

export function createScheduleBlockHandlers(
  deps: Pick<ApiRouterDeps, 'scheduleBlockRepository' | 'satelliteScheduleRepository' | 'showRepository'>,
) {
  const { scheduleBlockRepository: blockRepo, satelliteScheduleRepository: scheduleRepo, showRepository: showRepo } =
    deps;

  const createUseCase = new CreateScheduleBlockUseCase(blockRepo, scheduleRepo, showRepo);
  const createBatchUseCase = new CreateBatchScheduleBlocksUseCase(blockRepo, scheduleRepo, showRepo);
  const fetchUseCase = new FetchBlocksByScheduleUseCase(blockRepo);
  const countUseCase = new CountScheduleBlocksUseCase(blockRepo);
  const getByIdUseCase = new GetScheduleBlockByIdUseCase(blockRepo);
  const getFreeBlocksUseCase = new GetScheduleFreeBlocksUseCase(blockRepo, scheduleRepo);
  const updateUseCase = new UpdateScheduleBlockUseCase(blockRepo, scheduleRepo);
  const deleteUseCase = new DeleteScheduleBlockUseCase(blockRepo, scheduleRepo);

  function formatBlockResponse(block: ScheduleBlockEntity) {
    return {
      id: block.id,
      scheduleId: block.scheduleId,
      showId: block.showId,
      dayOfWeek: block.dayOfWeek,
      broadcastType: block.broadcastType,
      label: block.label,
      startTimeMinutes: block.startTimeMinutes,
      durationMinutes: block.durationMinutes,
      gregorian: {
        start: block.startTimeGregorian,
        end: block.endTimeGregorian,
      },
      ethiopian: {
        start: block.startTimeEthiopian.toString(),
        end: block.endTimeEthiopian.toString(),
      },
      createdAt: block.createdAt,
      updatedAt: block.updatedAt,
      show: block.show,
      schedule: block.schedule,
      broadcastSlots: block.broadcastSlots,
    };
  }

  async function createScheduleBlock(req: Request, res: Response, next: NextFunction) {
    try {
      const { scheduleId } = req.params as { scheduleId: string };
      const payload = req.body as CreateScheduleBlockDto;
      const block = await createUseCase.execute({ ...payload, scheduleId });
      res.status(201).json({
        status: 'SUCCESS',
        message: 'Schedule block created successfully',
        data: { block: formatBlockResponse(block) },
      });
    } catch (error) {
      next(error);
    }
  }

  async function createBatchScheduleBlocks(req: Request, res: Response, next: NextFunction) {
    try {
      const { scheduleId } = req.params as { scheduleId: string };
      const payload = req.body as CreateBatchScheduleBlocksDto;
      const result = await createBatchUseCase.execute(scheduleId, payload.blocks);
      res.status(201).json({
        status: 'SUCCESS',
        message: `${result.count} schedule blocks created successfully`,
        data: { count: result.count },
      });
    } catch (error) {
      next(error);
    }
  }

  async function listScheduleBlocks(req: Request, res: Response, next: NextFunction) {
    try {
      const { scheduleId } = req.params as { scheduleId: string };
      const query = res.locals.query as FetchScheduleBlocksDto;
      const queryOptions = mapFetchScheduleBlocksDtoToQueryOptions(query, scheduleId);
      const page = query.page ?? 1;
      const limit = query.limit ?? 200;

      const [blocks, total] = await Promise.all([
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
        data: { blocks: blocks.map(formatBlockResponse) },
      });
    } catch (error) {
      next(error);
    }
  }

  async function listScheduleFreeBlocks(req: Request, res: Response, next: NextFunction) {
    try {
      const { scheduleId } = req.params as { scheduleId: string };
      const { freeBlocks, schedule } = await getFreeBlocksUseCase.execute(scheduleId);

      res.status(200).json({
        status: 'SUCCESS',
        data: { schedule, freeBlocks },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getScheduleBlockById(req: Request, res: Response, next: NextFunction) {
    try {
      const { blockId } = req.params as { blockId: string };
      const block = await getByIdUseCase.execute(blockId);
      res.status(200).json({
        status: 'SUCCESS',
        data: { block: formatBlockResponse(block) },
      });
    } catch (error) {
      next(error);
    }
  }

  async function updateScheduleBlock(req: Request, res: Response, next: NextFunction) {
    try {
      const { blockId } = req.params as { blockId: string };
      const payload = req.body as UpdateScheduleBlockDto;
      const block = await updateUseCase.execute(blockId, payload);
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Schedule block updated successfully',
        data: { block: formatBlockResponse(block) },
      });
    } catch (error) {
      next(error);
    }
  }

  async function deleteScheduleBlock(req: Request, res: Response, next: NextFunction) {
    try {
      const { blockId } = req.params as { blockId: string };
      await deleteUseCase.execute(blockId);
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Schedule block deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    createScheduleBlock,
    createBatchScheduleBlocks,
    listScheduleBlocks,
    listScheduleFreeBlocks,
    getScheduleBlockById,
    updateScheduleBlock,
    deleteScheduleBlock,
  };
}
