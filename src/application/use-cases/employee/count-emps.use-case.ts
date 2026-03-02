import { IEmployeeRepository } from "../../../domain/repositories/employee.repo";
import { QueryOptions } from "../../../domain/interfaces/query-options.interface";
import { EmployeeEntity } from "../../../domain/entities/employee.entity";



export class CountEmployeesUseCase { 
    constructor(private readonly employeeRepository: IEmployeeRepository) { }

    async execute(query: QueryOptions<EmployeeEntity>): Promise<number> {
        return await this.employeeRepository.count(query.filters ?? {});
    }
}