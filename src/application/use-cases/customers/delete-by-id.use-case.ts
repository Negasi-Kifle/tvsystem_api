import { ICustomerRepository } from "../../../domain/repositories/customer.repository.interface";
import { EntityNotFoundError } from "../../../domain/errors";


export class DeleteByIdUseCase {
    constructor(private readonly customerRepo: ICustomerRepository) { }

    async execute(id: string): Promise<void> {
        const customer = await this.customerRepo.findById(id);
        if (!customer) {
            throw new EntityNotFoundError('Customer not found', 'Customer', id);
        }

        await this.customerRepo.deleteById(id);
    }
}