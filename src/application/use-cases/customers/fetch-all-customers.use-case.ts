import { CustomerEntity } from '../../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { QueryOptions } from '../../../domain/interfaces/query-options.interface';

export class FetchAllCustomersUseCase {
  constructor(private readonly customerRepo: ICustomerRepository) {}

  async execute(query: QueryOptions<CustomerEntity>): Promise<CustomerEntity[]> {
    return this.customerRepo.findMany(query);
  }
}
