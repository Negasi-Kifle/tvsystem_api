import { Request, Response, NextFunction } from 'express';
import { AddCommunicationLogUseCase } from '../../application/use-cases/communication-logs/add-communication-log.use-case';
import { FetchCommunicationLogsByCustomerUseCase } from '../../application/use-cases/communication-logs/fetch-communication-logs-by-customer.use-case';
import { AddCommunicationLogDto } from '../dtos/requests/communication-log/add-communication-log.dto';
import { FetchAllCommunicationLogsUseCase } from '../../application/use-cases/communication-logs/fetch-all-communication-logs.use-case';
import { mapFetchAllCommunicationLogsDtoToQueryOptions } from '../mappers/comm-logs-query-options.mapper';
import { FetchAllCommunicationLogsDto } from '../dtos/requests/communication-log/fetch-all-comm-logs.dto';
import { CountAllCommunicationLogsUseCase } from '../../application/use-cases/communication-logs/count-comm-logs.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createCommunicationLogHandlers(
  deps: Pick<ApiRouterDeps, 'communicationLogRepository' | 'customerRepository' | 'mediaPackRepository'>,
) {
  const { communicationLogRepository, customerRepository, mediaPackRepository } = deps;

  const addCommunicationLogUseCase = new AddCommunicationLogUseCase(
    communicationLogRepository,
    customerRepository,
    mediaPackRepository,
  );
  const fetchCommunicationLogsByCustomerUseCase = new FetchCommunicationLogsByCustomerUseCase(
    communicationLogRepository,
  );
  const fetchAllCommunicationLogsUseCase = new FetchAllCommunicationLogsUseCase(communicationLogRepository);
  const countAllCommunicationLogsUseCase = new CountAllCommunicationLogsUseCase(communicationLogRepository);

  async function addCommunicationLog(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as AddCommunicationLogDto;
      const log = await addCommunicationLogUseCase.execute({
        customerId: payload.customerId,
        logDate: payload.logDate,
        salesAgentId: payload.salesAgentId,
        notes: payload.notes,
        mediaPackId: payload.mediaPackId,
      });

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Communication log entry added successfully',
        data: { log },
      });
    } catch (error) {
      next(error);
    }
  }

  async function fetchCommunicationLogsByCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { customerId } = req.params as { customerId: string };
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const logs = await fetchCommunicationLogsByCustomerUseCase.execute(customerId, limit);

      res.status(200).json({
        status: 'SUCCESS',
        data: { logs },
      });
    } catch (error) {
      next(error);
    }
  }

  async function fetchAllCommunicationLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = res.locals.query as FetchAllCommunicationLogsDto;
      const queryOptions = mapFetchAllCommunicationLogsDtoToQueryOptions(dto);

      const page = dto.page ?? 1;
      const limit = dto.limit ?? 10;

      const [logs, total] = await Promise.all([
        fetchAllCommunicationLogsUseCase.execute(queryOptions),
        countAllCommunicationLogsUseCase.execute(queryOptions),
      ]);

      res.status(200).json({
        status: 'SUCCESS',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: { logs },
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    addCommunicationLog,
    fetchCommunicationLogsByCustomer,
    fetchAllCommunicationLogs,
  };
}
