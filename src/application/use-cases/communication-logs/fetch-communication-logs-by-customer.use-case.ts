import { CommunicationLogEntity } from '../../../domain/entities/communication-log.entity';
import { ICommunicationLogRepository } from '../../../domain/repositories/communication-log.repository.interface';

export class FetchCommunicationLogsByCustomerUseCase {
  constructor(private readonly communicationLogRepo: ICommunicationLogRepository) {}

  async execute(customerId: string, limit?: number): Promise<CommunicationLogEntity[]> {
    return this.communicationLogRepo.findByCustomerId(customerId, limit);
  }
}
