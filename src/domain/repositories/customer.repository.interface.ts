import { CustomerEntity } from '../entities/customer.entity';
import { IBaseRepository } from './base.repository.interface';

export interface ICustomerRepository extends IBaseRepository<CustomerEntity> {
  findByBusinessRef(businessRef: string): Promise<CustomerEntity | null>;
}
