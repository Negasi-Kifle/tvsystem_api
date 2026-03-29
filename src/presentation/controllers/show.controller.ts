import { NextFunction, Request, Response } from 'express';
import { CreateShowUseCase } from '../../application/use-cases/shows/create-show.use-case';
import { FetchAllShowsUseCase } from '../../application/use-cases/shows/fetch-all.use-case';
import { CreateShowDto } from '../dtos/requests/show/create-show.dto';
import { mapFetchAllShowsDtoToQueryOptions } from '../mappers/show-to-query-options.mapper';
import { CountShowsUseCase } from '../../application/use-cases/shows/count.use-case';
import { FetchAllShowsDto } from '../dtos/requests/show/fetch-all-shows.dto';
import { GetShowByIdUseCase } from '../../application/use-cases/shows/get-by-id.use-case';
import { UpdateShowUseCase } from '../../application/use-cases/shows/update.use-case';
import { UpdateShowDto } from '../dtos/requests/show/update-show.dto';
import { DeleteShowUseCase } from '../../application/use-cases/shows/delete.use-case';
import { CreateShowWithHostsDto } from '../dtos/requests/show/create-show-with-hosts.dto';
import { CreateShowWithHostsUseCase } from '../../application/use-cases/shows/create-show-with-hosts.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createShowHandlers(
  deps: Pick<ApiRouterDeps, 'showRepository' | 'showHostRepository' | 'userRepository'>,
) {
  const { showRepository, showHostRepository, userRepository } = deps;

  const createShowUseCase = new CreateShowUseCase(showRepository);
  const fetchAllShowsUseCase = new FetchAllShowsUseCase(showRepository);
  const countShowsUseCase = new CountShowsUseCase(showRepository);
  const getShowByIdUseCase = new GetShowByIdUseCase(showRepository);
  const updateShowUseCase = new UpdateShowUseCase(showRepository);
  const deleteShowUseCase = new DeleteShowUseCase(showRepository);
  const createShowWithHostsUseCase = new CreateShowWithHostsUseCase(
    showRepository,
    userRepository,
    showHostRepository,
  );

  async function createShow(req: Request, res: Response) {
    const payload = req.body as CreateShowDto;

    const show = await createShowUseCase.execute(payload);

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Show created successfully',
      data: { show },
    });
  }

  async function createShowWithHosts(req: Request, res: Response) {
    const payload = req.body as CreateShowWithHostsDto;

    const showWithHosts = await createShowWithHostsUseCase.execute(payload);

    res.status(201).json({
      status: 'SUCCESS',
      message: 'A new show with hosts created successfully',
      data: { show: showWithHosts.show, hosts: showWithHosts.hosts },
    });
  }

  async function listShows(req: Request, res: Response, next: NextFunction) {
    try {
      const query = res.locals.query as FetchAllShowsDto;
      const queryOptions = mapFetchAllShowsDtoToQueryOptions(query);

      const page = query.page ?? 1;
      const limit = query.limit ?? 10;

      const [shows, total] = await Promise.all([
        fetchAllShowsUseCase.execute(queryOptions),
        countShowsUseCase.execute(queryOptions),
      ]);

      res.status(200).json({
        status: 'SUCCESS',
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        data: { shows },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getShowById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const show = await getShowByIdUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        data: { show },
      });
    } catch (error) {
      next(error);
    }
  }

  async function updateShow(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const payload = req.body as UpdateShowDto;

      const show = await updateShowUseCase.execute(id, payload);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Show updated successfully',
        data: { show },
      });
    } catch (error) {
      next(error);
    }
  }

  async function deleteShow(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await deleteShowUseCase.execute(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Show deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  return {
    createShow,
    createShowWithHosts,
    listShows,
    getShowById,
    updateShow,
    deleteShow,
  };
}
