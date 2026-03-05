import { CreateUserPermissionDto } from "../dtos/requests/user-permission/create-user-permission.dto";
import { NextFunction, Request, Response } from "express";
import { FetchAllUserPermissionsDto } from "../dtos/requests/user-permission/fetch-all-user-permissions.dto";
import { CreateManyUserPermissionsUseCase } from "../../application/use-cases/user-permissions/create-many.use-case";
import { UserPermissionsRepository } from "../../infrastructure/prisma/repositories/user-permissions.repository";
import { mapFetchAllUserPermissionsDtoToQueryOptions } from "../mappers/user-permission-to-query-options.mapper";
import { FetchAllUserPermissionsUseCase } from "../../application/use-cases/user-permissions/fetch-all.use-case";
import { CountUserPermissionsUseCase } from "../../application/use-cases/user-permissions/count.use-case";
import { FindUserPermissionByIdUseCase } from "../../application/use-cases/user-permissions/get-by-id.use-case";
import { RevokeUserPermissionUseCase } from "../../application/use-cases/user-permissions/revoke.usecase";
import { UserRepository } from "../../infrastructure/prisma/repositories/user.repository";
import { PermissionRepository } from "../../infrastructure/prisma/repositories/permission.repository";

const userPermissionRepository = new UserPermissionsRepository();
const userRepository = new UserRepository();
const permissionRepository = new PermissionRepository();
const createManyUserPermissionsUseCase = new CreateManyUserPermissionsUseCase(
    userPermissionRepository,
    userRepository,
    permissionRepository,
);
const fetchAllUserPermissionsUseCase = new FetchAllUserPermissionsUseCase(userPermissionRepository);
const countUserPermissionsUseCase = new CountUserPermissionsUseCase(userPermissionRepository);
const findUserPermissionByIdUseCase = new FindUserPermissionByIdUseCase(userPermissionRepository);
const revokeUserPermissionUseCase = new RevokeUserPermissionUseCase(userPermissionRepository);

export async function createUserPermission(req: Request, res: Response, next: NextFunction) {
    try {

        const payload = req.body as CreateUserPermissionDto;

        const userPermissions = await createManyUserPermissionsUseCase.execute({
            ...payload,
            grantedBy: req.user?.id!
        });

        res.status(201).json({
            status: 'SUCCESS',
            message: 'User permissions created successfully',
            data: { userPermissions }
        });
    } catch (error) {
        next(error)
    }
}


export async function fetchAllUserPermissions(req: Request, res: Response, next: NextFunction) {
    try{
        
        const query = res.locals.query as FetchAllUserPermissionsDto;
        const queryOptions = mapFetchAllUserPermissionsDtoToQueryOptions(query);
    
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
    
        const [userPermissions, total] = await Promise.all([
            fetchAllUserPermissionsUseCase.execute(queryOptions),
            countUserPermissionsUseCase.execute(queryOptions)
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
    } catch (error) {
        next(error)
    }
}


export async function findUserPermissionById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        const userPermission = await findUserPermissionByIdUseCase.execute(id);

        res.status(200).json({
            status: 'SUCCESS',
            data: { userPermission }
        });
    } catch (error) {
        next(error);
    }
}



export async function deleteUserPermission(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        const userPermission = await revokeUserPermissionUseCase.execute(id);

        res.status(200).json({
            status: 'SUCCESS',
            message: 'User permission revoked successfully',
            data: { userPermission }
        });
    } catch (error) {
        next(error);
    }
}