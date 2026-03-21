import { CustomerEntity } from '../../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';

export class CountCustomersUseCase {
  constructor(private readonly customerRepo: ICustomerRepository) {}

  async execute(filters?: Partial<CustomerEntity>): Promise<number> {
    return this.customerRepo.count(filters);
  }
}
