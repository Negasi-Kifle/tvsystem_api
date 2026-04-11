import { QueryOptions } from "../../domain/interfaces/query-options.interface";
import { FetchAllEmployeesDto } from "../dtos/requests/employee/fetch-all-emps.dto";
import { EmployeeEntity } from "../../domain/entities/employee.entity";

export function mapFetchAllEmployeesDtoToQueryOptions(dto: FetchAllEmployeesDto): QueryOptions<EmployeeEntity> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    return {
        skip: (page - 1) * limit,
        take: limit,
        filters: {
            ...(dto.employeeNumber != null && { employeeNumber: dto.employeeNumber }),
            ...(dto.department != null && { department: dto.department }),
            ...(dto.isActive != null && { isActive: dto.isActive }),
            ...(dto.salesCommissionType != null && { salesCommissionType: dto.salesCommissionType }),
        },
    };
}