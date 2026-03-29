import { AdvertEntity, AdvertSlotWindow } from '../../../domain/entities/advert.entity';
import { EntityNotFoundError } from '../../../domain/errors';
import { AdvertStatus } from '../../../domain/enums/advert-status.enum';
import { IAdvertRepository } from '../../../domain/repositories/advert.repository.interface';
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { IBroadcastSlotRepository } from '../../../domain/repositories/broadcast-slot.repository.interface';

export type UpdateAdvertInput = {
  showId?: string;
  customerId?: string;
  status?: AdvertStatus;
  slot?: AdvertSlotWindow | null;
  contractDetails?: string | null;
  broadcastSlotId?: string | null;
};

export class UpdateAdvertUseCase {
  constructor(
    private readonly advertRepo: IAdvertRepository,
    private readonly showRepo: IShowRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly broadcastSlotRepo: IBroadcastSlotRepository,
  ) {}

  async execute(id: string, patch: UpdateAdvertInput): Promise<AdvertEntity | null> {
    const existing = await this.advertRepo.findById(id);
    if (!existing || !existing.id) {
      throw new EntityNotFoundError('Advert not found', 'Advert', id);
    }

    const showId = patch.showId ?? existing.showId;
    const customerId = patch.customerId ?? existing.customerId;

    if (patch.showId !== undefined) {
      const show = await this.showRepo.findById(showId);
      if (!show) {
        throw new EntityNotFoundError('Show not found', 'Show', showId);
      }
    }
    if (patch.customerId !== undefined) {
      const customer = await this.customerRepo.findById(customerId);
      if (!customer) {
        throw new EntityNotFoundError('Customer not found', 'Customer', customerId);
      }
    }

    const broadcastSlotId =
      patch.broadcastSlotId !== undefined ? patch.broadcastSlotId : existing.broadcastSlotId ?? null;
    if (broadcastSlotId) {
      const bslot = await this.broadcastSlotRepo.findById(broadcastSlotId);
      if (!bslot) {
        throw new EntityNotFoundError('Broadcast slot not found', 'BroadcastSlot', broadcastSlotId);
      }
    }

    const updated = new AdvertEntity(
      showId,
      customerId,
      patch.status ?? existing.status,
      patch.slot !== undefined ? patch.slot : existing.slot,
      patch.contractDetails !== undefined ? patch.contractDetails : existing.contractDetails,
      patch.broadcastSlotId !== undefined ? patch.broadcastSlotId : existing.broadcastSlotId,
      existing.createdAt,
      existing.updatedAt,
      existing.id,
    );

    return this.advertRepo.update(updated);
  }
}
