import { CustomerEntity, CustomerContact } from '../../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { EntityAlreadyExistsError } from '../../../domain/errors/entity-exists.error';
import { CustomerStatusWithUs, CustomerHolidayStatus, CustomerStudioVisit} from '../../../domain/enums/customer-status.enum';
import { IGenerateBusinessRefService } from '../../../domain/services/generate-business-ref.service';

export type CreateCustomerInput = {
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
    private readonly generateBusinessRefService: IGenerateBusinessRefService,
  ) {}

  async execute(payload: CreateCustomerInput): Promise<CustomerEntity> {
    const businessRef = await this.generateBusinessRefService.generateBusinessRef();

    const customer = CustomerEntity.createInstance(
      businessRef,
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
