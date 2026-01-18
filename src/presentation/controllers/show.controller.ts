import { Request, Response } from 'express';
import { CreateShowUseCase } from '../../application/use-cases/shows/create-show.use-case';
import { ListShowsUseCase } from '../../application/use-cases/shows/list-shows.use-case';
import { CreateShowDto } from '../dtos/requests/create-show.dto';

const createShowUseCase = new CreateShowUseCase();
const listShowsUseCase = new ListShowsUseCase();

export async function createShow(req: Request, res: Response) {
  const payload = req.body as CreateShowDto;
  const show = await createShowUseCase.execute(payload);
  res.status(201).json(show);
}

export async function listShows(req: Request, res: Response) {
  const shows = await listShowsUseCase.execute();
  res.json(shows);
}
