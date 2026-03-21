import { CustomerEntity } from '../../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../../domain/repositories/customer.repository.interface';
import { EntityNotFoundError } from '../../../domain/errors/entity-not-found.error';

export class GetCustomerByIdUseCase {
  constructor(private readonly customerRepo: ICustomerRepository) {}

  async execute(id: string): Promise<CustomerEntity> {
    const customer = await this.customerRepo.findById(id);
    if (!customer) {
      throw new EntityNotFoundError('Customer not found', 'Customer', id);
    }
    return customer;
  }
}
