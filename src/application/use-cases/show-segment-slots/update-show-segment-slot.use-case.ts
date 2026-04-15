import { ShowSegmentSlotEntity } from '../../../domain/entities/show-segment-slot.entity';
import { EntityAlreadyExistsError, EntityNotFoundError } from '../../../domain/errors';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { IShowSegmentSlotRepository } from '../../../domain/repositories/show-segment-slot.repository.interface';
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';

export type UpdateShowSegmentSlotInput = {
  showId?: string;
  customerId?: string;
};

export class UpdateShowSegmentSlotUseCase {
  constructor(
    private readonly showSegmentSlotRepo: IShowSegmentSlotRepository,
    private readonly showRepo: IShowRepository,
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(id: string, input: UpdateShowSegmentSlotInput): Promise<ShowSegmentSlotEntity | null> {
    const existing = await this.showSegmentSlotRepo.findById(id);
    if (!existing) {
      throw new EntityNotFoundError('Show segment slot not found', 'ShowSegmentSlot', id);
    }

    const nextShowId = input.showId ?? existing.showId;
    const nextCustomerId = input.customerId ?? existing.customerId;

    if (nextShowId !== existing.showId || nextCustomerId !== existing.customerId) {
      const [show, customer, duplicate] = await Promise.all([
        this.showRepo.findById(nextShowId),
        this.customerRepo.findById(nextCustomerId),
        this.showSegmentSlotRepo.findByShowAndCustomer(nextShowId, nextCustomerId),
      ]);

      if (!show) {
        throw new EntityNotFoundError('Show not found', 'Show', nextShowId);
      }
      if (!customer) {
        throw new EntityNotFoundError('Customer not found', 'Customer', nextCustomerId);
      }
      if (duplicate && duplicate.id !== id) {
        throw new EntityAlreadyExistsError(
          'This customer is already assigned a segment slot for this show',
          'ShowSegmentSlot',
          `${nextShowId}:${nextCustomerId}`,
        );
      }
    }

    const updated = ShowSegmentSlotEntity.createInstance(
      nextShowId,
      nextCustomerId,
      existing.createdAt,
      new Date(),
      existing.id,
    );

    return this.showSegmentSlotRepo.update(updated);
  }
}
