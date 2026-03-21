import { Request, Response, NextFunction } from 'express';
import { ShowSegmentSlotRepository } from '../../infrastructure/prisma/repositories/show-segment-slot.repository';
import { FetchShowSegmentSlotsByShowUseCase } from '../../application/use-cases/show-segment-slots/fetch-by-show.use-case';

const showSegmentSlotRepo = new ShowSegmentSlotRepository();
const fetchShowSegmentSlotsByShowUseCase = new FetchShowSegmentSlotsByShowUseCase(showSegmentSlotRepo);

export async function fetchShowSegmentSlotsByShow(req: Request, res: Response, next: NextFunction) {
  try {
    const { showId } = req.params as { showId: string };
    const slots = await fetchShowSegmentSlotsByShowUseCase.execute(showId);

    res.status(200).json({
      status: 'SUCCESS',
      data: { slots },
    });
  } catch (error) {
    next(error);
  }
}
