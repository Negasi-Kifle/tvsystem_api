import { CustomerShowSuitabilityEntity } from '../entities/customer-show-suitability.entity';
import { IBaseRepository } from './base.repository.interface';

export interface ICustomerShowSuitabilityRepository extends IBaseRepository<CustomerShowSuitabilityEntity> {
  findByCustomerId(customerId: string): Promise<CustomerShowSuitabilityEntity[]>;
}
