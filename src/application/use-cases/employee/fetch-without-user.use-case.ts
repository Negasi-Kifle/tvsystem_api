import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { IEmployeeRepository } from "../../../domain/repositories/employee.repo";

export class FetchEmployeesWithoutUserUseCase {
    constructor(private readonly employeeRepository: IEmployeeRepository) { }

    async execute(query: QueryOptions<EmployeeEntity, Partial<EmployeeEntity>>): Promise<EmployeeEntity[]> {
        return this.employeeRepository.findManyWithoutUser(query);
    }
}
