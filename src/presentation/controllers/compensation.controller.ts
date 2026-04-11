import { NextFunction, Request, Response } from 'express';
import { ProposeCompensationUseCase } from '../../application/use-cases/compensations/propose-compensation.use-case';
import { RespondToCompensationUseCase } from '../../application/use-cases/compensations/respond-to-compensation.use-case';
import { SendCompensationEmailUseCase } from '../../application/use-cases/compensations/send-compensation-email.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createCompensationHandlers(
  deps: Pick<
    ApiRouterDeps,
    | 'compensationRepository'
    | 'advertSalesRepository'
    | 'customerRepository'
    | 'emailService'
  >,
) {
  const proposeUseCase = new ProposeCompensationUseCase(
    deps.compensationRepository,
    deps.advertSalesRepository,
  );
  const respondUseCase = new RespondToCompensationUseCase(deps.compensationRepository);
  const sendEmailUseCase = new SendCompensationEmailUseCase(
    deps.compensationRepository,
    deps.advertSalesRepository,
    deps.customerRepository,
    deps.emailService,
  );

  async function create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const userId = (req as any).user?.id;
      const compensation = await proposeUseCase.execute({
        ...payload,
        proposedById: userId,
      });
      res.status(201).json({
        status: 'SUCCESS',
        message: 'Compensation proposed successfully',
        data: { compensation },
      });
    } catch (error) {
      next(error);
    }
  }

  async function list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const filters: Record<string, unknown> = {};
      if (req.query.advertSalesId) filters.advertSalesId = String(req.query.advertSalesId);
      if (req.query.status) filters.status = String(req.query.status);

      const compensations = await deps.compensationRepository.findMany({
        filters,
        skip: (page - 1) * limit,
        take: limit,
      });
      const total = await deps.compensationRepository.count(filters as any);
      res.status(200).json({
        status: 'SUCCESS',
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        data: { compensations },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const compensation = await deps.compensationRepository.findById(String(id));
      if (!compensation) {
        return res.status(404).json({ status: 'ERROR', message: 'Compensation not found' });
      }
      res.status(200).json({ status: 'SUCCESS', data: { compensation } });
    } catch (error) {
      next(error);
    }
  }

  async function sendEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await sendEmailUseCase.execute(String(id));
      res.status(200).json({ status: 'SUCCESS', message: 'Compensation email sent' });
    } catch (error) {
      next(error);
    }
  }

  async function respond(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { accept, customerResponse } = req.body;
      const compensation = await respondUseCase.execute(String(id), { accept, customerResponse });
      res.status(200).json({
        status: 'SUCCESS',
        message: `Compensation ${accept ? 'accepted' : 'rejected'}`,
        data: { compensation },
      });
    } catch (error) {
      next(error);
    }
  }

  async function remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await deps.compensationRepository.deleteById(String(id));
      res.status(200).json({ status: 'SUCCESS', message: 'Compensation deleted' });
    } catch (error) {
      next(error);
    }
  }

  return { create, list, getById, sendEmail, respond, remove };
}
