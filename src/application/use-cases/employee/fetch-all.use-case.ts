import { IEmployeeRepository } from "../../../domain/repositories/employee.repo";
import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";


export class GetAllEmployeesUseCase {
    constructor(private readonly employeeRepository: IEmployeeRepository) { }

    async execute(query: QueryOptions<EmployeeEntity>): Promise<EmployeeEntity[]> {
        return await this.employeeRepository.findMany(query);
    }
}