import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { SalesCommissionType } from "../../../domain/enums/sales-commission-type.enum";
import { Prisma } from "../generated/client";

export type EmployeeWhereFilters = Partial<EmployeeEntity> & {
    salesCommissionType?: SalesCommissionType;
    salesCommissionAmount?: number;
};

export function buildWhereClauseForEmployee(filters: EmployeeWhereFilters): Prisma.EmployeeWhereInput {
    if (!filters) return {};

    const { salesCommissionType, salesCommissionAmount, ...rest } = filters;

    const userIs: Prisma.UserWhereInput = {};
    if (salesCommissionType !== undefined) {
        userIs.salesCommissionType = salesCommissionType;
    }
    if (salesCommissionAmount !== undefined) {
        userIs.salesCommissionAmount = salesCommissionAmount;
    }

    return {
        ...(rest.id && { id: rest.id }),
        ...(rest.employeeNumber !== undefined && { employeeNumber: rest.employeeNumber }),
        ...(rest.department !== undefined && { department: rest.department }),
        ...(rest.isActive !== undefined && { isActive: rest.isActive }),
        ...(Object.keys(userIs).length > 0 && { user: { is: userIs } }),
    };
}
