import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { Prisma } from "../generated/client";

export function buildWhereClauseForEmployee(filters: Partial<EmployeeEntity>): Prisma.EmployeeWhereInput {
    if (!filters) return {};

    return {
        ...(filters.id && { id: filters.id }),
        ...(filters.employeeNumber !== undefined && { employeeNumber: filters.employeeNumber }),
        ...(filters.department !== undefined && { department: filters.department }),
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
    };
}
