import { CustomerEntity, CustomerContact } from '../../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { ValidationError } from '../../../domain/errors/validation.error';
import { CustomerStatusWithUs, CustomerHolidayStatus, CustomerStudioVisit} from '../../../domain/enums/customer-status.enum';
import { IGenerateBusinessRefService } from '../../../domain/services/generate-business-ref.service';
import { ICategoryRepository } from '../../../domain/repositories/category.repository.interface';
import { ISubCategoryRepository } from '../../../domain/repositories/sub-category.repository.interface';
import { buildWhereClauseForSubCategory } from '../../../infrastructure/prisma/where_clauses/sub-category';
import type { SubCategoryEntity } from '../../../domain/entities/sub-category.entity';
export type CreateCustomerInput = {
  name: string;
  contacts?: CustomerContact[];
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
    private readonly categoryRepo: ICategoryRepository,
    private readonly subCategoryRepo: ISubCategoryRepository,
  ) {}

  async execute(payload: CreateCustomerInput): Promise<CustomerEntity> {
    const businessRef = await this.generateBusinessRefService.generateBusinessRef();

    // If customer is from media monitoring, Id of the media monitoring record should be provided
    if (payload.sourceFromMediaMonitoring === true && !payload.mediaMonitoringId) {
      throw new ValidationError('Media monitoring ID is required if customer is from media monitoring');
    }

    // Check category and sub category are valid
    if (payload.categoryId) {
      const category = await this.categoryRepo.findById(payload.categoryId);
      if (!category) {
        throw new ValidationError('Category not found');
      }
    }

    if (payload.subCategoryId) {
      const subCategory = await this.subCategoryRepo.findById(payload.subCategoryId);
      if (!subCategory || subCategory.categoryId !== payload.categoryId) {
        throw new ValidationError('Sub category not found or does not belong to the given category');
      }
    }

    const customer = CustomerEntity.createInstance(
      businessRef,
      payload.name,
      payload.contacts ?? [],
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
