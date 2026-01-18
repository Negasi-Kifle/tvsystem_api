import { Request, Response } from 'express';
import { CreateAdvertUseCase } from '../../application/use-cases/adverts/create-advert.use-case';
import { CreateAdvertDto } from '../dtos/requests/create-advert.dto';

const createAdvertUseCase = new CreateAdvertUseCase();

export async function createAdvert(req: Request, res: Response) {
  const payload = req.body as CreateAdvertDto;
  const advert = await createAdvertUseCase.execute({
    ...payload,
    slot: payload.slot ? { start: new Date(payload.slot.start), end: new Date(payload.slot.end) } : undefined
  });
  res.status(201).json(advert);
}
