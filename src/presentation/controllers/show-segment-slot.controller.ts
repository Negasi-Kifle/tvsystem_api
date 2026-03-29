import { Request, Response, NextFunction } from 'express';
import { FetchShowSegmentSlotsByShowUseCase } from '../../application/use-cases/show-segment-slots/fetch-by-show.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createShowSegmentSlotHandlers(deps: Pick<ApiRouterDeps, 'showSegmentSlotRepository'>) {
  const { showSegmentSlotRepository } = deps;

  const fetchShowSegmentSlotsByShowUseCase = new FetchShowSegmentSlotsByShowUseCase(showSegmentSlotRepository);

  async function fetchShowSegmentSlotsByShow(req: Request, res: Response, next: NextFunction) {
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

  return { fetchShowSegmentSlotsByShow };
}
