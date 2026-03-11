import { Request, Response, NextFunction } from 'express';
import { CreatePartnerDto } from '../dtos/requests/partner/create';
import { PartnerRepository } from '../../infrastructure/prisma/repositories/partner.repository';
import { UserRepository } from '../../infrastructure/prisma/repositories/user.repository';
import { PermissionRepository } from '../../infrastructure/prisma/repositories/permission.repository';
import { CreatePartnerAndUserUseCase } from '../../application/use-cases/partners/create-partner.use-case';
import { FetchAllPartnersUseCase } from '../../application/use-cases/partners/fetch-all-partners.use-case';
import { CountPartnersUseCase } from '../../application/use-cases/partners/count-partners.use-case';
import { mapFetchAllPartnersDtoToQueryOptions } from '../mappers/partner-to-query-options.mapper';
import { FetchAllPartnersDto } from '../dtos/requests/partner/fetch-all';
import { GetPartnerByIdUseCase } from '../../application/use-cases/partners/get-partner-by-id.use-case';
import { UpdatePartnerUseCase } from '../../application/use-cases/partners/update-partner.use-case';
import { UpdatePartnerDto } from '../dtos/requests/partner/update';
import { UpdatePartnerStatusUseCase } from '../../application/use-cases/partners/update-partner-status.use-case';
import { UpdatePartnerStatusDto } from '../dtos/requests/partner/update-status';
import { DeletePartnerUseCase } from '../../application/use-cases/partners/delete-partner.use-case';


const partnerRepository = new PartnerRepository();
const userRepository = new UserRepository();
const permissionRepository = new PermissionRepository();

const createPartnerAndUserUseCase = new CreatePartnerAndUserUseCase(
    partnerRepository,
    permissionRepository,
    userRepository,
);
const fetchAllPartnersUseCase = new FetchAllPartnersUseCase(partnerRepository);
const countPartnersUseCase = new CountPartnersUseCase(partnerRepository);
const getPartnerByIdUseCase = new GetPartnerByIdUseCase(partnerRepository);
const updatePartnerUseCase = new UpdatePartnerUseCase(partnerRepository);
const updatePartnerStatusUseCase = new UpdatePartnerStatusUseCase(partnerRepository, userRepository);
const deletePartnerUseCase = new DeletePartnerUseCase(partnerRepository);

export async function createPartner(req: Request, res: Response, next: NextFunction) {
    try {
        const payload = req.body as CreatePartnerDto;


        const { partner, user } = await createPartnerAndUserUseCase.execute({
            fullName: payload.fullName,
            email: payload.email,
            passwordHash: payload.passwordHash,
            phoneNumber: payload.phoneNumber,
            sex: payload.sex,
            roles: payload.roles,
            permissionIds: payload.permissionIds,
            grantedBy: req.user?.id,
        });

        res.status(201).json({
            status: 'SUCCESS',
            message: 'Partner and user created successfully',
            data: { partner, user }
        });
    } catch (error: any) {
        next(error);
    }
}

export async function fetchAllPartners(req: Request, res: Response, next: NextFunction) {
    try {
        const dto = res.locals.query as FetchAllPartnersDto;
        const queryOptions = mapFetchAllPartnersDtoToQueryOptions(dto);

        const page = dto.page ?? 1;
        const limit = dto.limit ?? 10;

        const [partners, total] = await Promise.all([
            fetchAllPartnersUseCase.execute(queryOptions),
            countPartnersUseCase.execute(queryOptions),
        ]);

        res.status(200).json({
            status: 'SUCCESS',
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            data: { partners },
        });
    } catch (error: any) {
        next(error);
    }
}

export async function getPartner(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        const partner = await getPartnerByIdUseCase.execute(id);

        res.status(200).json({
            status: 'SUCCESS',
            data: { partner },
        });
    } catch (error: any) {
        next(error);
    }
}

export async function updatePartner(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        // const payload = req.body as UpdatePartnerDto;
        // const partner = await updatePartnerUseCase.execute(id, payload);

        // res.status(200).json({
        //     status: 'SUCCESS',
        //     message: 'Partner updated successfully',
        //     data: { partner },
        // });

        // TODO: Remove this after more fields are added to the partner entity
        res.status(400).json({
            status: 'ERROR',
            message: 'API Disabled Temporarily',
        })
    } catch (error: any) {
        next(error);
    }
}

export async function updatePartnerStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        const { isActive } = req.body as UpdatePartnerStatusDto;
        const { partner, user } = await updatePartnerStatusUseCase.execute(id, isActive);

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Partner status updated successfully',
            data: { partner, user },
        });
    } catch (error: any) {
        next(error);
    }
}

export async function deletePartner(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params as { id: string };
        await deletePartnerUseCase.execute(id);

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Partner deleted successfully',
        });
    } catch (error: any) {
        next(error);
    }
}