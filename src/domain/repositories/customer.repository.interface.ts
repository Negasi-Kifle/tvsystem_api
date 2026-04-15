import { CustomerEntity } from '../entities/customer.entity';
import { IBaseRepository } from './base.repository.interface';

export interface ICustomerRepository extends IBaseRepository<CustomerEntity> {
  findByBusinessRef(businessRef: string): Promise<CustomerEntity | null>;
  /** Creates customer and links birth monitoring row (customerId) in one transaction. */
  createWithBirthMonitoringLink(
    data: Omit<CustomerEntity, 'id'>,
    birthMonitoringRecordId: string,
  ): Promise<CustomerEntity>;
}
