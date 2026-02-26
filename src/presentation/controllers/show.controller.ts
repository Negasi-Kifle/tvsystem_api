import { Request, Response } from 'express';
import { CreateShowUseCase } from '../../application/use-cases/shows/create-show.use-case';
import { FetchAllShowsUseCase } from '../../application/use-cases/shows/fetch-all.use-case';
import { CreateShowDto } from '../dtos/requests/create-show.dto';
import { ShowRepository } from '../../infrastructure/prisma/repositories/show.repository';

const createShowUseCase = new CreateShowUseCase(new ShowRepository());
const fetchAllShowsUseCase = new FetchAllShowsUseCase(new ShowRepository());

export async function createShow(req: Request, res: Response) {
  const payload = req.body as CreateShowDto;

  const show = await createShowUseCase.execute(payload);

  res.status(201).json(show);
}

export async function listShows(req: Request, res: Response) {
  const query = res.locals.query;
  const shows = await fetchAllShowsUseCase.execute(query);
  res.json(shows);
}
