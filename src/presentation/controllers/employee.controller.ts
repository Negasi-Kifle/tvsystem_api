import { Request, Response, NextFunction } from 'express';
import { CreateEmployeeDto } from '../dtos/requests/employee/create-emp.dto';
import { CreateEmployeeAndUserUseCase } from '../../application/use-cases/employee/create-emp.use-case';
import { EmployeeRepository } from '../../infrastructure/prisma/repositories/employee.repository';
import { UserRepository } from '../../infrastructure/prisma/repositories/user.repository';
import { GetEmployeeByIdUseCase } from '../../application/use-cases/employee/get_by_id.use-case';
import { GetAllEmployeesUseCase } from '../../application/use-cases/employee/fetch-all.use-case';
import { CountEmployeesUseCase } from '../../application/use-cases/employee/count-emps.use-case';
import { FetchAllEmployeesDto } from '../dtos/requests/employee/fetch-all-emps.dto';
import { mapFetchAllEmployeesDtoToQueryOptions } from '../mappers/emps-to-query-options.mapper';
import { UpdateEmployeeDto } from '../dtos/requests/employee/update-emp.dto';
import { UpdateEmployeeUseCase } from '../../application/use-cases/employee/update-emp-info.use-case';
import { UpdateEmployeeStatusUseCase } from '../../application/use-cases/employee/update_status.use-case';
import { UpdateEmployeeStatusDto } from '../dtos/requests/employee/update-status.dto';
import { DeleteEmployeeUseCase } from '../../application/use-cases/employee/delete.use-case';
import { PermissionRepository } from '../../infrastructure/prisma/repositories/permission.repository';
import { FetchEmployeesWithoutUserUseCase } from '../../application/use-cases/employee/fetch-without-user.use-case';
import { CountEmployeesWithoutUserUseCase } from '../../application/use-cases/employee/count-without-user.use-case';

const employeeRepository = new EmployeeRepository();
const userRepository = new UserRepository();
const permissionRepository = new PermissionRepository();

const createEmployeeAndUserUseCase = new CreateEmployeeAndUserUseCase(
    employeeRepository,
    userRepository,
    permissionRepository,
);
const getEmployeeByIdUseCase = new GetEmployeeByIdUseCase(employeeRepository);
const getAllEmployeesUseCase = new GetAllEmployeesUseCase(employeeRepository);
const countEmployeesUseCase = new CountEmployeesUseCase(employeeRepository);
const updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepository);
const updateEmployeeStatusUseCase = new UpdateEmployeeStatusUseCase(employeeRepository, userRepository);
const deleteEmployeeUseCase = new DeleteEmployeeUseCase(employeeRepository, userRepository);
const fetchEmployeesWithoutUserUseCase = new FetchEmployeesWithoutUserUseCase(employeeRepository);
const countEmployeesWithoutUserUseCase = new CountEmployeesWithoutUserUseCase(employeeRepository);

export async function createEmployee(req: Request, res: Response, next: NextFunction) {
    try {
        const payload = req.body as CreateEmployeeDto;
        
        const { employee, user } = await createEmployeeAndUserUseCase.execute({
            ...payload,
            grantedBy: req.user?.id,
        });
        
        res.status(201).json({
            status: 'SUCCESS',
            message: 'Employee and user created successfully',
            data: { employee, user }
        });
    } catch (error: any) {
        next(error);
    }
}


export async function getEmployee(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        const employee = await getEmployeeByIdUseCase.execute(id);
        
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Employee fetched successfully',
            data: { employee }
        });
    } catch (error: any) {
        next(error);
    }
}


export async function getAllEmployees(req: Request, res: Response, next: NextFunction) {
    try {
        const dto = res.locals.query as FetchAllEmployeesDto;
        const queryOptions = mapFetchAllEmployeesDtoToQueryOptions(dto);
        
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 10;

        const [employees, total] = await Promise.all([
            getAllEmployeesUseCase.execute(queryOptions),
            countEmployeesUseCase.execute(queryOptions)
        ]);
        
        res.status(200).json(
            {
                status: 'SUCCESS',
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                },
                data: { employees }
            });
    } catch (error: any) {
        next(error);
    }
}   

export async function getEmployeesWithoutUserAccount(req: Request, res: Response, next: NextFunction) {
    try {
        const dto = res.locals.query as FetchAllEmployeesDto;
        const queryOptions = mapFetchAllEmployeesDtoToQueryOptions(dto);

        const page = dto.page ?? 1;
        const limit = dto.limit ?? 10;

        const [employees, total] = await Promise.all([
            fetchEmployeesWithoutUserUseCase.execute(queryOptions),
            countEmployeesWithoutUserUseCase.execute(queryOptions.filters),
        ]);

        res.status(200).json({
            status: 'SUCCESS',
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: { employees },
        });
    } catch (error: any) {
        next(error);
    }
}


export async function updateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        const payload = req.body as UpdateEmployeeDto;
        const employee = await updateEmployeeUseCase.execute(id, payload);
        
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Employee updated successfully',
            data: { employee }
        });
    } catch (error: any) {
        next(error);
    }
}


export async function updateEmployeeStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        const { isActive } = req.body as UpdateEmployeeStatusDto;
        const { employee, user } = await updateEmployeeStatusUseCase.execute(id, isActive);
        
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Employee status updated successfully',
            data: { employee, user }
        });
    } catch (error: any) {
        next(error);
    }
}


export async function deleteEmployee(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        
        await deleteEmployeeUseCase.execute(id);
        
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Employee deleted successfully',
        });
    } catch (error: any) {
        next(error);
    }
}