import { ShowSegmentSlotEntity } from '../../../domain/entities/show-segment-slot.entity';
import { EntityAlreadyExistsError, EntityNotFoundError } from '../../../domain/errors';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { IShowSegmentSlotRepository } from '../../../domain/repositories/show-segment-slot.repository.interface';
import { IShowRepository } from '../../../domain/repositories/show.repository.interface';

export type CreateShowSegmentSlotInput = {
  showId: string;
  customerId: string;
};

export class CreateShowSegmentSlotUseCase {
  constructor(
    private readonly showSegmentSlotRepo: IShowSegmentSlotRepository,
    private readonly showRepo: IShowRepository,
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(input: CreateShowSegmentSlotInput): Promise<ShowSegmentSlotEntity> {
    const [show, customer, existing] = await Promise.all([
      this.showRepo.findById(input.showId),
      this.customerRepo.findById(input.customerId),
      this.showSegmentSlotRepo.findByShowAndCustomer(input.showId, input.customerId),
    ]);

    if (!show) {
      throw new EntityNotFoundError('Show not found', 'Show', input.showId);
    }
    if (!customer) {
      throw new EntityNotFoundError('Customer not found', 'Customer', input.customerId);
    }
    if (existing) {
      throw new EntityAlreadyExistsError(
        'This customer is already assigned a segment slot for this show',
        'ShowSegmentSlot',
        `${input.showId}:${input.customerId}`,
      );
    }

    return this.showSegmentSlotRepo.create(ShowSegmentSlotEntity.createInstance(input.showId, input.customerId));
  }
}
