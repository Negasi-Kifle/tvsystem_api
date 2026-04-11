import { Request, Response, NextFunction } from 'express';
import { CreatePartnerDto } from '../dtos/requests/partner/create';
import { CreatePartnerAndUserUseCase } from '../../application/use-cases/partners/create-partner.use-case';
import { FetchAllPartnersUseCase } from '../../application/use-cases/partners/fetch-all-partners.use-case';
import { CountPartnersUseCase } from '../../application/use-cases/partners/count-partners.use-case';
import { mapFetchAllPartnersDtoToQueryOptions } from '../mappers/partner-to-query-options.mapper';
import { FetchAllPartnersDto } from '../dtos/requests/partner/fetch-all';
import { GetPartnerByIdUseCase } from '../../application/use-cases/partners/get-partner-by-id.use-case';
import { UpdatePartnerStatusUseCase } from '../../application/use-cases/partners/update-partner-status.use-case';
import { UpdatePartnerStatusDto } from '../dtos/requests/partner/update-status';
import { DeletePartnerUseCase } from '../../application/use-cases/partners/delete-partner.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createPartnerHandlers(
  deps: Pick<ApiRouterDeps, 'partnerRepository' | 'userRepository' | 'permissionRepository'>,
) {
  const { partnerRepository, userRepository, permissionRepository } = deps;

  const createPartnerAndUserUseCase = new CreatePartnerAndUserUseCase(
    partnerRepository,
    permissionRepository,
    userRepository,
  );
  const fetchAllPartnersUseCase = new FetchAllPartnersUseCase(partnerRepository);
  const countPartnersUseCase = new CountPartnersUseCase(partnerRepository);
  const getPartnerByIdUseCase = new GetPartnerByIdUseCase(partnerRepository);
  const updatePartnerStatusUseCase = new UpdatePartnerStatusUseCase(partnerRepository, userRepository);
  const deletePartnerUseCase = new DeletePartnerUseCase(partnerRepository);

  async function createPartner(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreatePartnerDto;

      const { partner, user } = await createPartnerAndUserUseCase.execute({
        ...payload,
        grantedBy: req.user?.id,
      });

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Partner and user created successfully',
        data: { partner, user },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async function fetchAllPartners(req: Request, res: Response, next: NextFunction) {
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
    } catch (error: unknown) {
      next(error);
    }
  }

  async function getPartner(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const partner = await getPartnerByIdUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        data: { partner },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async function updatePartner(_req: Request, res: Response, next: NextFunction) {
    try {
      res.status(400).json({
        status: 'ERROR',
        message: 'API Disabled Temporarily',
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async function updatePartnerStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const { isActive } = req.body as UpdatePartnerStatusDto;
      const { partner, user } = await updatePartnerStatusUseCase.execute(id, isActive);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Partner status updated successfully',
        data: { partner, user },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async function deletePartner(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await deletePartnerUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Partner deleted successfully',
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  return {
    createPartner,
    fetchAllPartners,
    getPartner,
    updatePartner,
    updatePartnerStatus,
    deletePartner,
  };
}
