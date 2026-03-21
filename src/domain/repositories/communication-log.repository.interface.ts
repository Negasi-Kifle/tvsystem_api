import { CommunicationLogEntity } from '../entities/communication-log.entity';
import { IBaseRepository } from './base.repository.interface';

export interface ICommunicationLogRepository extends IBaseRepository<CommunicationLogEntity> {
  findByCustomerId(customerId: string, limit?: number): Promise<CommunicationLogEntity[]>;
}
