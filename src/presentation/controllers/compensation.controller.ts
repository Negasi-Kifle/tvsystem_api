import { Request, Response } from 'express';
import { ProcessCompensationUseCase } from '../../application/use-cases/adverts/process-compensation.use-case';
import { CompensationDto } from '../dtos/requests/compensation.dto';

const processCompensationUseCase = new ProcessCompensationUseCase();

export async function proposeCompensation(req: Request, res: Response) {
  const payload = req.body as CompensationDto;
  const comp = await processCompensationUseCase.execute(payload);
  res.status(201).json(comp);
}
