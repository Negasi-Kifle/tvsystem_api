import { CustomerEntity, CustomerContact } from '../../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { ValidationError } from '../../../domain/errors/validation.error';
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
  mediaMonitoringId?: string;
  inPersonUpdate?: Date;
};

export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepo: ICustomerRepository,
    private readonly generateBusinessRefService: IGenerateBusinessRefService,
  ) {}

  async execute(payload: CreateCustomerInput): Promise<CustomerEntity> {
    const businessRef = await this.generateBusinessRefService.generateBusinessRef();

    // If customer is from media monitoring, Id of the media monitoring record should be provided
    if (payload.sourceFromMediaMonitoring === true && !payload.mediaMonitoringId) {
      throw new ValidationError('Media monitoring ID is required if customer is from media monitoring');
    }

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
      payload.mediaMonitoringId,
      payload.inPersonUpdate,
    );

    if (payload.sourceFromMediaMonitoring === true && payload.mediaMonitoringId) {
      return this.customerRepo.createWithBirthMonitoringLink(customer, payload.mediaMonitoringId);
    }

    return this.customerRepo.create(customer);
  }
}
