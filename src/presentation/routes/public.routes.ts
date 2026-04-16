import { Router } from 'express';
import { validateBody } from '../validators/validate-body';
import { respondCompensationByTokenDto } from '../dtos/requests/compensation/respond-by-token.dto';
import { RespondToCompensationByTokenUseCase } from '../../application/use-cases/compensations/respond-to-compensation-by-token.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createPublicRouter(deps: Pick<ApiRouterDeps, 'compensationRepository'>): Router {
  const router = Router();
  const respondByToken = new RespondToCompensationByTokenUseCase(deps.compensationRepository);

  router.post('/compensations/respond', validateBody(respondCompensationByTokenDto), async (req, res, next) => {
    try {
      const { token, accept, customerResponse } = req.body as {
        token: string;
        accept: boolean;
        customerResponse?: string;
      };
      const compensation = await respondByToken.execute({
        plainToken: token,
        accept,
        customerResponse,
      });
      res.status(200).json({
        status: 'SUCCESS',
        message: accept ? 'Compensation accepted' : 'Compensation rejected',
        data: { compensation },
      });
    } catch (error: unknown) {
      next(error);
    }
  });

  return router;
}
