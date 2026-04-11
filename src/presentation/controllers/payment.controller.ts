import { NextFunction, Request, Response } from 'express';
import { GeneratePaymentRequestsUseCase } from '../../application/use-cases/payments/generate-payment-requests.use-case';
import { RecordPaymentReceivedUseCase } from '../../application/use-cases/payments/record-payment-received.use-case';
import { SendPaymentRequestEmailUseCase } from '../../application/use-cases/payments/send-payment-request-email.use-case';
import type { ApiRouterDeps } from '../api-router-deps';

export function createPaymentHandlers(
  deps: Pick<
    ApiRouterDeps,
    | 'paymentRepository'
    | 'advertSalesRepository'
    | 'customerRepository'
    | 'generateBusinessRefService'
    | 'emailService'
  >,
) {
  const generateUseCase = new GeneratePaymentRequestsUseCase(
    deps.paymentRepository,
    deps.advertSalesRepository,
    deps.generateBusinessRefService,
  );
  const recordUseCase = new RecordPaymentReceivedUseCase(deps.paymentRepository);
  const sendEmailUseCase = new SendPaymentRequestEmailUseCase(
    deps.paymentRepository,
    deps.advertSalesRepository,
    deps.customerRepository,
    deps.emailService,
  );

  async function generate(req: Request, res: Response, next: NextFunction) {
    try {
      const { advertSalesId, installmentCount } = req.body;
      const payments = await generateUseCase.execute({
        advertSalesId,
        installmentCount: Number(installmentCount),
      });
      res.status(201).json({
        status: 'SUCCESS',
        message: `${payments.length} payment request(s) generated`,
        data: { payments },
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

      const payments = await deps.paymentRepository.findMany({
        filters,
        skip: (page - 1) * limit,
        take: limit,
      });
      const total = await deps.paymentRepository.count(filters as any);
      res.status(200).json({
        status: 'SUCCESS',
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        data: { payments },
      });
    } catch (error) {
      next(error);
    }
  }

  async function getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const payment = await deps.paymentRepository.findById(String(id));
      if (!payment) {
        return res.status(404).json({ status: 'ERROR', message: 'Payment not found' });
      }
      res.status(200).json({ status: 'SUCCESS', data: { payment } });
    } catch (error) {
      next(error);
    }
  }

  async function sendPaymentRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await sendEmailUseCase.execute(String(id));
      res.status(200).json({ status: 'SUCCESS', message: 'Payment request email sent' });
    } catch (error) {
      next(error);
    }
  }

  async function recordPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const payment = await recordUseCase.execute(String(id), {
        bankDeposit: Number(req.body.bankDeposit),
        paymentDate: new Date(req.body.paymentDate),
        paymentMethod: req.body.paymentMethod,
        bankDepositDate: req.body.bankDepositDate ? new Date(req.body.bankDepositDate) : undefined,
        bankConfirmation: req.body.bankConfirmation,
        fsNumber: req.body.fsNumber,
      });
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Payment recorded',
        data: { payment },
      });
    } catch (error) {
      next(error);
    }
  }

  async function remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await deps.paymentRepository.deleteById(String(id));
      res.status(200).json({ status: 'SUCCESS', message: 'Payment deleted' });
    } catch (error) {
      next(error);
    }
  }

  return { generate, list, getById, sendPaymentRequest, recordPayment, remove };
}
