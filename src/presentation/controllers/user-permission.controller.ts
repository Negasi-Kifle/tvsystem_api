import { CreateUserPermissionDto } from "../dtos/requests/create-user-permission.dto";
import { UserPermissionsUseCases } from "../../application/use-cases/user-permissions";
import { Request, Response } from "express";
import { UserPermissionQueryOptions } from "../../infrastructure/database/prisma/repositories/user-permissions.repository";
import { FetchAllUserPermissionsDto } from "../dtos/requests/fetch-all-user-permissions.dto";

const userPermissionsUseCases = new UserPermissionsUseCases();

export async function createUserPermission(req: Request, res: Response) {
    const payload = req.body as CreateUserPermissionDto;

    const userPermission = await userPermissionsUseCases.createUserPermissionUseCase.execute({
        ...payload,
        grantedBy: req.user?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
    
    });

    res.status(201).json({
        status: 'SUCCESS',
        message: 'User permission created successfully',
        data: { userPermission }
    });
}


export async function fetchAllUserPermissions(req: Request, res: Response) {
    const query = res.locals.query as FetchAllUserPermissionsDto;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;


    const [userPermissions, total] = await Promise.all([
        userPermissionsUseCases.fetchAllUserPermissionsUseCase.execute(query),
        userPermissionsUseCases.countUserPermissionsUseCase.execute(query)
    ]);

    res.json({
        status: 'SUCCESS',
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        },
        data: { userPermissions }
    });
}