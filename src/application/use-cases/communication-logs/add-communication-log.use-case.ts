import { CommunicationLogEntity } from '../../../domain/entities/communication-log.entity';
import { ICommunicationLogRepository } from '../../../domain/repositories/communication-log.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { IMediaPackRepository } from '../../../domain/repositories/media-pack.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';

export type AddCommunicationLogInput = {
  customerId: string;
  logDate: Date;
  salesAgentId: string;
  notes: string;
  mediaPackId?: string;
};

export class AddCommunicationLogUseCase {
  constructor(
    private readonly communicationLogRepo: ICommunicationLogRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly mediaPackRepository: IMediaPackRepository,
  ) {}

  async execute(payload: AddCommunicationLogInput): Promise<CommunicationLogEntity> {
    const customer = await this.customerRepo.findById(payload.customerId);
    if (!customer) {
      throw new EntityNotFoundError('Customer not found', 'Customer', payload.customerId);
    }

    if (payload.mediaPackId) {
      const mediaPack = await this.mediaPackRepository.findById(payload.mediaPackId);
      if (!mediaPack) {
        throw new EntityNotFoundError('Media pack not found', 'MediaPack', payload.mediaPackId);
      }
    }

    const log = CommunicationLogEntity.createInstance(
      payload.customerId,
      payload.logDate,
      payload.salesAgentId,
      payload.notes,
      payload.mediaPackId,
    );

    return this.communicationLogRepo.create(log);
  }
}
