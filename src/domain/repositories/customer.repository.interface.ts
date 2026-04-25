import { CustomerEntity } from '../entities/customer.entity';
import { IBaseRepository } from './base.repository.interface';
import { CustomerStatusWithUs } from '../enums/customer-status.enum';

export interface ICustomerRepository extends IBaseRepository<CustomerEntity> {
  findByBusinessRef(businessRef: string): Promise<CustomerEntity | null>;
  /** Creates customer and links birth monitoring row (customerId) in one transaction. */
  createWithBirthMonitoringLink(
    data: Omit<CustomerEntity, 'id'>,
    birthMonitoringRecordId: string,
  ): Promise<CustomerEntity>;
  /** Count of customers whose status is one of the provided values. */
  countByStatuses(statuses: CustomerStatusWithUs[]): Promise<number>;
  /** Count of customers created within [from, to] whose status is one of the provided values. */
  countByStatusesCreatedInRange(
    statuses: CustomerStatusWithUs[],
    from: Date,
    to: Date,
  ): Promise<number>;
}
