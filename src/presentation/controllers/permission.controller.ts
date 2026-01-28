import { CreatePermissionDto } from "../dtos/requests/create-permission.dto";
import { Request, Response } from "express";
import { PermissionsUseCases } from "../../application/use-cases/permissions";
import { sendErrorResponse } from "../../shared/utils/error-handler";
import { FetchAllPermissionsDto } from "../dtos/requests/fetch-all-permissions.dto";
import { UpdatePermissionDto } from "../dtos/requests/update-permission.dto";

const permissionsUseCases = new PermissionsUseCases();

export async function createPermission(req: Request, res: Response) {
    const payload = req.body as CreatePermissionDto;

    const completePayload = {
        ...payload,
        nameSlug: payload.name.toLowerCase().replace(/ /g, '_'),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const permission = await permissionsUseCases.createPermissionUseCase.execute(completePayload);

    res.status(201).json({
        status: 'SUCCESS',
        message: 'Permission created successfully',
        data: { permission }
    });
}


export async function getPermissionById(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const permission = await permissionsUseCases.getPermissionByIdUseCase.execute(id);

    if (!permission) {
        const error = new Error('Permission not found');
        return sendErrorResponse(res, 404, 'Permission not found', error);
    }


    res.json({
        status: 'SUCCESS',
        data: { permission }
    });
}


export async function fetchAllPermissions(req: Request, res: Response) {
    const query = res.locals.query as FetchAllPermissionsDto;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const [permissions, total] = await Promise.all([
        permissionsUseCases.fetchAllPermissionsUseCase.execute(query),
        permissionsUseCases.countPermissionsUseCase.execute(query)
    ]);

    res.json({
        status: 'SUCCESS',
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        },
        data: { permissions }
    });
}


export async function updatePermission(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const payload = req.body as UpdatePermissionDto;

    const permission = await permissionsUseCases.updatePermissionUseCase.execute(id, payload);

    if (!permission) {
        const error = new Error('Permission not found');
        return sendErrorResponse(res, 404, 'Permission not found', error);
    }

    res.json({
        status: 'SUCCESS',
        message: 'Permission updated successfully',
        data: { permission }
    });
}

export async function deletePermission(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const permission = await permissionsUseCases.deletePermissionUseCase.execute(id);

    if (!permission) {
        const error = new Error('Permission not found');
        return sendErrorResponse(res, 404, 'Permission not found', error);
    }

    res.json({
        status: 'SUCCESS',
        message: 'Permission deleted successfully'
    });
}