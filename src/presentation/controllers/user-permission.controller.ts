import { CreateUserPermissionDto } from "../dtos/requests/create-user-permission.dto";
import { Request, Response } from "express";
import { FetchAllUserPermissionsDto } from "../dtos/requests/fetch-all-user-permissions.dto";
import { CreateUserPermissionUseCase } from "../../application/use-cases/user-permissions/create.use-case";
import { UserPermissionsRepository } from "../../infrastructure/prisma/repositories/user-permissions.repository copy";
import { mapFetchAllUserPermissionsDtoToQueryOptions } from "../mappers/user-permission-to-query-options.mapper";
import { FetchAllUserPermissionsUseCase } from "../../application/use-cases/user-permissions/fetch-all.use-case";
import { CountUserPermissionsUseCase } from "../../application/use-cases/user-permissions/count.use-case";

const userPermissionRepository = new UserPermissionsRepository();
const createUserPermissionUseCase = new CreateUserPermissionUseCase(userPermissionRepository);
const fetchAllUserPermissionsUseCase = new FetchAllUserPermissionsUseCase(userPermissionRepository);
const countUserPermissionsUseCase = new CountUserPermissionsUseCase(userPermissionRepository);


export async function createUserPermission(req: Request, res: Response) {
    const payload = req.body as CreateUserPermissionDto;

    const userPermission = await createUserPermissionUseCase.execute({
        ...payload,
        grantedBy: req.user?.id!
    });

    res.status(201).json({
        status: 'SUCCESS',
        message: 'User permission created successfully',
        data: { userPermission }
    });
}


export async function fetchAllUserPermissions(req: Request, res: Response) {
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
}