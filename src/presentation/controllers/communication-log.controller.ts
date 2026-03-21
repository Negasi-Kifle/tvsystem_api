import { Request, Response, NextFunction } from 'express';
import { CommunicationLogRepository } from '../../infrastructure/prisma/repositories/communication-log.repository';
import { CustomerRepository } from '../../infrastructure/prisma/repositories/customer.repository';
import { MediaPackRepository } from '../../infrastructure/prisma/repositories/media-pack.repository';
import { AddCommunicationLogUseCase } from '../../application/use-cases/communication-logs/add-communication-log.use-case';
import { FetchCommunicationLogsByCustomerUseCase } from '../../application/use-cases/communication-logs/fetch-communication-logs-by-customer.use-case';
import { AddCommunicationLogDto } from '../dtos/requests/communication-log/add-communication-log.dto';

const communicationLogRepo = new CommunicationLogRepository();
const customerRepo = new CustomerRepository();
const mediaPackRepo = new MediaPackRepository();

const addCommunicationLogUseCase = new AddCommunicationLogUseCase(
  communicationLogRepo,
  customerRepo,
  mediaPackRepo,
);
const fetchCommunicationLogsByCustomerUseCase = new FetchCommunicationLogsByCustomerUseCase(communicationLogRepo);

export async function addCommunicationLog(req: Request, res: Response, next: NextFunction) {
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

export async function fetchCommunicationLogsByCustomer(req: Request, res: Response, next: NextFunction) {
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
