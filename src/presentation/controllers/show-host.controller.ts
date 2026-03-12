import { NextFunction, Request, Response } from 'express';
import { CreateShowHostUseCase } from '../../application/use-cases/show-hosts/create-show-host.use-case';
import { FetchAllShowHostsUseCase } from '../../application/use-cases/show-hosts/fetch-all-show-hosts.use-case';
import { CountShowHostsUseCase } from '../../application/use-cases/show-hosts/count-show-hosts.use-case';
import { GetShowHostByIdUseCase } from '../../application/use-cases/show-hosts/get-show-host-by-id.use-case';
import { UpdateShowHostUseCase } from '../../application/use-cases/show-hosts/update-show-host.use-case';
import { DeleteShowHostUseCase } from '../../application/use-cases/show-hosts/delete-show-host.use-case';
import { ShowHostRepository } from '../../infrastructure/prisma/repositories/show-host.repository';
import { ShowRepository } from '../../infrastructure/prisma/repositories/show.repository';
import { UserRepository } from '../../infrastructure/prisma/repositories/user.repository';
import { CreateShowHostDto } from '../dtos/requests/show-host/create-show-host.dto';
import { FetchAllShowHostsDto } from '../dtos/requests/show-host/fetch-all-show-hosts.dto';
import { UpdateShowHostDto } from '../dtos/requests/show-host/update-show-host.dto';
import { mapFetchAllShowHostsDtoToQueryOptions } from '../mappers/show-host-to-query-options.mapper';
import { AssignManyHostsToShowDto } from '../dtos/requests/show-host/assign-many-hosts.dto';
import { AssignManyHostsToShowUseCase } from '../../application/use-cases/show-hosts/assign-many-hosts.use-case';

const repo = new ShowHostRepository();
const showRepo = new ShowRepository();
const userRepo = new UserRepository();

const createUseCase = new CreateShowHostUseCase(repo, showRepo, userRepo);
const fetchAllUseCase = new FetchAllShowHostsUseCase(repo);
const countUseCase = new CountShowHostsUseCase(repo);
const getByIdUseCase = new GetShowHostByIdUseCase(repo);
const updateUseCase = new UpdateShowHostUseCase(repo);
const deleteUseCase = new DeleteShowHostUseCase(repo);
const assignManyHostsToShowUseCase = new AssignManyHostsToShowUseCase(repo, showRepo, userRepo);

export async function createShowHost(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as CreateShowHostDto;
    const showHost = await createUseCase.execute(payload);
    res.status(201).json({
      status: 'SUCCESS',
      message: 'Show host created successfully',
      data: { showHost },
    });
  } catch (error) {
    next(error);
  }
}


export async function assignManyHostsToShow(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body as AssignManyHostsToShowDto;
    const showHosts = await assignManyHostsToShowUseCase.execute(payload);
    
    res.status(200).json({
      status: 'SUCCESS',
      message: `${payload.hosts.length} hosts assigned to show successfully`,
      data: { showHosts },
    });
  } catch (error) {
    next(error);
  }
}

export async function listShowHosts(req: Request, res: Response, next: NextFunction) {
  try {
    const query = res.locals.query as FetchAllShowHostsDto;
    const queryOptions = mapFetchAllShowHostsDtoToQueryOptions(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const [showHosts, total] = await Promise.all([
      fetchAllUseCase.execute(queryOptions),
      countUseCase.execute(queryOptions),
    ]);

    res.status(200).json({
      status: 'SUCCESS',
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: { showHosts },
    });
  } catch (error) {
    next(error);
  }
}

export async function getShowHostById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const showHost = await getByIdUseCase.execute(id);

    res.status(200).json({
      status: 'SUCCESS',
      data: { showHost },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateShowHost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const payload = req.body as UpdateShowHostDto;
    const showHost = await updateUseCase.execute(id, payload);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Show host updated successfully',
      data: { showHost },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteShowHost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    await deleteUseCase.execute(id);
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Show host deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

