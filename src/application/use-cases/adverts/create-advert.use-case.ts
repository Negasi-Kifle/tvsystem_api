import { AdvertEntity, AdvertSlotWindow } from '../../../domain/entities/advert.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { AdvertStatus } from '../../../domain/enums/advert-status.enum';
import { IAdvertRepository } from '../../../domain/repositories/advert.repository.interface';
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { IBroadcastSlotRepository } from '../../../domain/repositories/broadcast-slot.repository.interface';

export type CreateAdvertInput = {
  showId: string;
  customerId: string;
  status?: AdvertStatus;
  slot?: AdvertSlotWindow | null;
  contractDetails?: string | null;
  broadcastSlotId?: string | null;
};

export class CreateAdvertUseCase {
  constructor(
    private readonly advertRepo: IAdvertRepository,
    private readonly showRepo: IShowRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly broadcastSlotRepo: IBroadcastSlotRepository,
  ) {}

  async execute(input: CreateAdvertInput): Promise<AdvertEntity> {
    const show = await this.showRepo.findById(input.showId);
    if (!show) {
      throw new EntityNotFoundError('Show not found', 'Show', input.showId);
    }
    const customer = await this.customerRepo.findById(input.customerId);
    if (!customer) {
      throw new EntityNotFoundError('Customer not found', 'Customer', input.customerId);
    }
    if (input.broadcastSlotId) {
      const slot = await this.broadcastSlotRepo.findById(input.broadcastSlotId);
      if (!slot) {
        throw new EntityNotFoundError(
          'Broadcast slot not found',
          'BroadcastSlot',
          input.broadcastSlotId,
        );
      }
    }

    const entity = AdvertEntity.createInstance(
      input.showId,
      input.customerId,
      input.status ?? AdvertStatus.Draft,
      input.slot ?? null,
      input.contractDetails ?? null,
      input.broadcastSlotId ?? null,
    );

    return this.advertRepo.create(entity);
  }
}
