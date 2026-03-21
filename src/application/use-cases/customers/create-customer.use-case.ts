import { CustomerEntity, CustomerContact } from '../../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { EntityAlreadyExistsError } from '../../../domain/errors/entity-exists.error';
import { CustomerStatusWithUs, CustomerHolidayStatus, CustomerStudioVisit} from '../../../domain/enums/customer-status.enum';

export type CreateCustomerInput = {
  businessRef: string;
  name: string;
  contacts?: CustomerContact[];
  industry?: string;
  categoryId?: string;
  subCategoryId?: string;
  location?: string;
  salesAgentId?: string;
  nextReviewDate?: Date;
  status?: CustomerStatusWithUs;
  holidayStatus?: CustomerHolidayStatus;
  studioVisit?: CustomerStudioVisit;
  otherMediaCampaign?: string;
  sourceFromMediaMonitoring?: boolean;
  inPersonUpdate?: Date;
};

export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepo: ICustomerRepository,
  ) {}

  async execute(payload: CreateCustomerInput): Promise<CustomerEntity> {
    const existing = await this.customerRepo.findByBusinessRef(payload.businessRef);
    if (existing) {
      throw new EntityAlreadyExistsError(
        `Customer with business ref ${payload.businessRef} already exists`,
        'Customer',
        payload.businessRef,
      );
    }

    const customer = CustomerEntity.createInstance(
      payload.businessRef,
      payload.name,
      payload.contacts ?? [],
      payload.industry,
      payload.categoryId,
      payload.subCategoryId,
      payload.location,
      payload.salesAgentId,
      payload.nextReviewDate,
      payload.status,
      payload.holidayStatus,
      payload.studioVisit,
      payload.otherMediaCampaign,
      payload.sourceFromMediaMonitoring ?? false,
      payload.inPersonUpdate,
    );

    const created = await this.customerRepo.create(customer);

    return created;
  }
}
