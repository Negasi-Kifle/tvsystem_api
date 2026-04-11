import { NextFunction, Request, Response } from 'express';
import { CalculateAgentCommissionUseCase } from '../../application/use-cases/revenue-distribution/calculate-agent-commission.use-case';
import { DisburseAgentCommissionUseCase } from '../../application/use-cases/revenue-distribution/disburse-agent-commission.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createAgentCommissionHandlers(
  deps: Pick<
    ApiRouterDeps,
    | 'agentCommissionRepository'
    | 'advertSalesRepository'
  >,
) {
  const calculateUseCase = new CalculateAgentCommissionUseCase(
    deps.agentCommissionRepository,
    deps.advertSalesRepository,
  );
  const disburseUseCase = new DisburseAgentCommissionUseCase(deps.agentCommissionRepository);

  async function calculate(req: Request, res: Response, next: NextFunction) {
    try {
      const { advertSalesId } = req.body;
      const commission = await calculateUseCase.execute(advertSalesId);
      if (!commission) {
        return res.status(200).json({
          status: 'SUCCESS',
          message: 'No agent commission applicable (no sales agent or 0% commission)',
          data: { commission: null },
        });
      }
      res.status(201).json({
        status: 'SUCCESS',
        message: 'Agent commission calculated',
        data: { commission },
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
      if (req.query.agentId) filters.agentId = String(req.query.agentId);
      if (req.query.status) filters.status = String(req.query.status);

      const commissions = await deps.agentCommissionRepository.findMany({
        filters,
        skip: (page - 1) * limit,
        take: limit,
      });
      const total = await deps.agentCommissionRepository.count(filters as any);
      res.status(200).json({
        status: 'SUCCESS',
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        data: { commissions },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getById(req: Request, res: Response, next: NextFunction) {
    try {
      const commission = await deps.agentCommissionRepository.findById(String(req.params.id));
      if (!commission) {
        return res.status(404).json({ status: 'ERROR', message: 'Commission not found' });
      }
      res.status(200).json({ status: 'SUCCESS', data: { commission } });
    } catch (error) {
      next(error);
    }
  }

  async function disburse(req: Request, res: Response, next: NextFunction) {
    try {
      const commission = await disburseUseCase.execute(String(req.params.id));
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Agent commission disbursed',
        data: { commission },
      });
    } catch (error) {
      next(error);
    }
  }

  return { calculate, list, getById, disburse };
}
