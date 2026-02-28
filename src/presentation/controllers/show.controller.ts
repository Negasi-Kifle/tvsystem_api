import { NextFunction, Request, Response } from 'express';
import { CreateShowUseCase } from '../../application/use-cases/shows/create-show.use-case';
import { FetchAllShowsUseCase } from '../../application/use-cases/shows/fetch-all.use-case';
import { CreateShowDto } from '../dtos/requests/show/create-show.dto';
import { ShowRepository } from '../../infrastructure/prisma/repositories/show.repository';
import { mapFetchAllShowsDtoToQueryOptions } from '../mappers/show-to-query-options.mapper';
import { CountShowsUseCase } from '../../application/use-cases/shows/count.use-case';
import { FetchAllShowsDto } from '../dtos/requests/show/fetch-all-shows.dto';
import { GetShowByIdUseCase } from '../../application/use-cases/shows/get-by-id.use-case';
import { UpdateShowUseCase } from '../../application/use-cases/shows/update.use-case';
import { UpdateShowDto } from '../dtos/requests/show/update-show.dto';
import { DeleteShowUseCase } from '../../application/use-cases/shows/delete.use-case';

const createShowUseCase = new CreateShowUseCase(new ShowRepository());
const fetchAllShowsUseCase = new FetchAllShowsUseCase(new ShowRepository());
const countShowsUseCase = new CountShowsUseCase(new ShowRepository());
const getShowByIdUseCase = new GetShowByIdUseCase(new ShowRepository());
const updateShowUseCase = new UpdateShowUseCase(new ShowRepository());
const deleteShowUseCase = new DeleteShowUseCase(new ShowRepository());

export async function createShow(req: Request, res: Response) {
  const payload = req.body as CreateShowDto;

  const show = await createShowUseCase.execute(payload);

  res.status(201).json({
    status: 'SUCCESS',
    message: 'Show created successfully',
    data: { show }
  });
}

export async function listShows(req: Request, res: Response, next: NextFunction) {
  try {
  const query = res.locals.query as FetchAllShowsDto;
  const queryOptions = mapFetchAllShowsDtoToQueryOptions(query);

  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  const [shows, total] = await Promise.all([
    fetchAllShowsUseCase.execute(queryOptions),
    countShowsUseCase.execute(queryOptions)
  ]);

  res.status(200).json({
    status: 'SUCCESS',
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data: { shows }
  });
  } catch (error) {
    next(error);
  }
}


export async function getShowById(req: Request, res: Response, next: NextFunction) {
  try {
  const { id } = req.params as { id: string };
  const show = await getShowByIdUseCase.execute(id);


  res.status(200).json({
      status: 'SUCCESS',
      data: { show }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateShow(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const payload = req.body as UpdateShowDto;

    const show = await updateShowUseCase.execute(id, payload);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Show updated successfully',
      data: { show }
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteShow(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    await deleteShowUseCase.execute(id);

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Show deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}