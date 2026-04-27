import type { Request, Response, NextFunction } from 'express';
import { consumeStream } from 'ai';
import type { ApiRouterDeps } from '../api-router-deps.js';

export function createInsightHandlers(deps: Pick<ApiRouterDeps, 'insightService'>) {
  const { insightService } = deps;

  async function queryInsight(req: Request, res: Response, next: NextFunction) {
    try {
      const { question } = req.body as { question: string };
      const result = insightService.query(question);
      result.pipeUIMessageStreamToResponse(res, {
        consumeSseStream: consumeStream,
      });
    } catch (error) {
      next(error);
    }
  }

  return { queryInsight };
}
