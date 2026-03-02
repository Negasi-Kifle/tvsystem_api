import { Employee, User } from "@prisma/client";
import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { UserEntity } from "../../../domain/entities/user.entity";
import { modelToEntity as userModelToEntity } from "./user";

export function modelToEntity(employee: Employee & { user?: User | null }): EmployeeEntity {
    const entity: EmployeeEntity = EmployeeEntity.createInstance(
        employee.employeeNumber ?? undefined,
        employee.department ?? undefined,
        employee.isActive,
        employee.createdAt,
        employee.updatedAt,
        employee.id,
    );

    if (employee.user) {
        entity.user = userModelToEntity(employee.user as User);
    }

    return entity;
}

export function entityToModel(employee: EmployeeEntity): Employee {
    return {
        id: employee.id ?? '',
        employeeNumber: employee.employeeNumber ?? null,
        department: employee.department ?? null,
        isActive: employee.isActive,
        createdAt: employee.createdAt ?? new Date(),
        updatedAt: employee.updatedAt ?? new Date(),
    };
}
