import type { Request, Response, NextFunction } from 'express';
import type { ApiRouterDeps } from '../presentation/api-router-deps.js';

export function createAiSearchHandlers(deps: Pick<ApiRouterDeps, 'aiSearchService'>) {
  const { aiSearchService } = deps;

  async function postAiSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.body as { query: string };
      const prospects = await aiSearchService.searchProspects(query);
      res.status(200).json({
        'status': 'SUCCESS',
        'message': 'Prospects fetched successfully',
        'data': {
          'prospects': prospects
        }
      });
    } catch (error) {
      next(error);
    }
  }

  return { postAiSearch };
}
