import { CustomerShowSuitabilityEntity } from '../../../domain/entities/customer-show-suitability.entity';
import { ICustomerShowSuitabilityRepository } from '../../../domain/repositories/customer-show-suitability.repository.interface';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { IShowSegmentSlotRepository } from '../../../domain/repositories/show-segment-slot.repository.interface';
import { EntityAlreadyExistsError } from '../../../domain/errors/entity-exists.error';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';

export type LinkCustomerToShowSlotInput = {
  customerId: string;
  showSegmentSlotId: string;
};

export class LinkCustomerToShowSlotUseCase {
  constructor(
    private readonly suitabilityRepo: ICustomerShowSuitabilityRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly showSegmentSlotRepo: IShowSegmentSlotRepository,
  ) {}

  async execute(payload: LinkCustomerToShowSlotInput): Promise<CustomerShowSuitabilityEntity> {
    const [customer, slot] = await Promise.all([
      this.customerRepo.findById(payload.customerId),
      this.showSegmentSlotRepo.findById(payload.showSegmentSlotId),
    ]);

    if (!customer) {
      throw new EntityNotFoundError('Customer not found', 'Customer', payload.customerId);
    }
    if (!slot) {
      throw new EntityNotFoundError('Show segment slot not found', 'ShowSegmentSlot', payload.showSegmentSlotId);
    }

    const existing = await this.suitabilityRepo.findMany({
      filters: { customerId: payload.customerId, showSegmentSlotId: payload.showSegmentSlotId },
      take: 1,
    });

    if (existing.length > 0) {
      throw new EntityAlreadyExistsError(
        'Customer is already linked to this show slot',
        'CustomerShowSuitability',
        `${payload.customerId}-${payload.showSegmentSlotId}`,
      );
    }

    const suitability = CustomerShowSuitabilityEntity.createInstance(
      payload.customerId,
      payload.showSegmentSlotId,
    );

    return this.suitabilityRepo.create(suitability);
  }
}
