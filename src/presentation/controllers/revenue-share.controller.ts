import { NextFunction, Request, Response } from 'express';
import { CalculateRevenueSharesUseCase } from '../../application/use-cases/revenue-distribution/calculate-revenue-shares.use-case';
import { DisburseRevenueShareUseCase } from '../../application/use-cases/revenue-distribution/disburse-revenue-share.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createRevenueShareHandlers(
  deps: Pick<
    ApiRouterDeps,
    | 'revenueShareRepository'
    | 'advertSalesRepository'
    | 'advertPackageRepository'
    | 'showHostRepository'
  >,
) {
  const calculateUseCase = new CalculateRevenueSharesUseCase(
    deps.revenueShareRepository,
    deps.advertSalesRepository,
    deps.advertPackageRepository,
    deps.showHostRepository,
  );
  const disburseUseCase = new DisburseRevenueShareUseCase(deps.revenueShareRepository);

  async function calculate(req: Request, res: Response, next: NextFunction) {
    try {
      const { advertSalesId } = req.body;
      const shares = await calculateUseCase.execute(advertSalesId);
      res.status(201).json({
        status: 'SUCCESS',
        message: `${shares.length} revenue share(s) calculated`,
        data: { shares },
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
      if (req.query.partnerId) filters.partnerId = String(req.query.partnerId);
      if (req.query.status) filters.status = String(req.query.status);

      const shares = await deps.revenueShareRepository.findMany({
        filters,
        skip: (page - 1) * limit,
        take: limit,
      });
      const total = await deps.revenueShareRepository.count(filters as any);
      res.status(200).json({
        status: 'SUCCESS',
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        data: { shares },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getById(req: Request, res: Response, next: NextFunction) {
    try {
      const share = await deps.revenueShareRepository.findById(String(req.params.id));
      if (!share) {
        return res.status(404).json({ status: 'ERROR', message: 'Revenue share not found' });
      }
      res.status(200).json({ status: 'SUCCESS', data: { share } });
    } catch (error) {
      next(error);
    }
  }

  async function disburse(req: Request, res: Response, next: NextFunction) {
    try {
      const share = await disburseUseCase.execute(String(req.params.id));
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Revenue share disbursed',
        data: { share },
      });
    } catch (error) {
      next(error);
    }
  }

  return { calculate, list, getById, disburse };
}
