import { NextFunction, Request, Response } from 'express';
import { CountPaymentsUseCase } from '../../application/use-cases/payments/count-payments.use-case';
import { DeletePaymentUseCase } from '../../application/use-cases/payments/delete-payment.use-case';
import { FetchAllPaymentsUseCase } from '../../application/use-cases/payments/fetch-all-payments.use-case';
import { CreatePaymentRequestUseCase } from '../../application/use-cases/payments/create-payment-request.use-case';
import { GeneratePaymentRequestsUseCase } from '../../application/use-cases/payments/generate-payment-requests.use-case';
import { GetPaymentByIdUseCase } from '../../application/use-cases/payments/get-payment-by-id.use-case';
import { RecordPaymentReceivedUseCase } from '../../application/use-cases/payments/record-payment-received.use-case';
import { SendPaymentRequestEmailUseCase } from '../../application/use-cases/payments/send-payment-request-email.use-case';
import type { ApiRouterDeps } from '../api-router-deps';
import type { CreatePaymentRequestDto } from '../dtos/requests/payment/create-payment-request.dto';
import { GeneratePaymentRequestDto } from '../dtos/requests/payment/generate-payment-req.dto';
import type { FetchAllPaymentsDto } from '../dtos/requests/payment/fetch-all-payments.dto';
import { RecordPaymentDto } from '../dtos/requests/payment/record-payment.dto';
import { mapFetchAllPaymentsDtoToQueryOptions } from '../mappers/payment-to-query-options.mapper';

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
  const fetchAllPaymentsUseCase = new FetchAllPaymentsUseCase(deps.paymentRepository);
  const countPaymentsUseCase = new CountPaymentsUseCase(deps.paymentRepository);
  const getPaymentByIdUseCase = new GetPaymentByIdUseCase(deps.paymentRepository);
  const deletePaymentUseCase = new DeletePaymentUseCase(deps.paymentRepository);
  const generateUseCase = new GeneratePaymentRequestsUseCase(
    deps.paymentRepository,
    deps.advertSalesRepository,
    deps.generateBusinessRefService,
  );
  const createPaymentRequestUseCase = new CreatePaymentRequestUseCase(
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
      const dto = req.body as GeneratePaymentRequestDto;
      const payments = await generateUseCase.execute(dto);

      res.status(201).json({
        status: 'SUCCESS',
        message: `${payments.length} payment request(s) generated`,
        data: { payments },
      });
    } catch (error) {
      next(error);
    }
  }

  async function createPaymentRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as CreatePaymentRequestDto;
      const payment = await createPaymentRequestUseCase.execute({
        advertSalesId: dto.advertSalesId,
        installmentNumber: dto.installmentNumber,
      });
      res.status(201).json({
        status: 'SUCCESS',
        message: 'Payment request created',
        data: { payment },
      });
    } catch (error) {
      next(error);
    }
  }

  async function list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = res.locals.query as FetchAllPaymentsDto;
      const queryOptions = mapFetchAllPaymentsDtoToQueryOptions(query);
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;

      const [payments, total] = await Promise.all([
        fetchAllPaymentsUseCase.execute(queryOptions),
        countPaymentsUseCase.execute(queryOptions),
      ]);

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
      const { id } = req.params as { id: string };
      const payment = await getPaymentByIdUseCase.execute(id);
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
      const body = req.body as RecordPaymentDto;
      const payment = await recordUseCase.execute(String(id), {
        bankDeposit: body.bankDeposit,
        paymentDate: body.paymentDate,
        paymentMethod: body.paymentMethod,
        bankDepositDate: body.bankDepositDate,
        bankConfirmation: body.bankConfirmation,
        fsNumber: body.fsNumber,
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
      await deletePaymentUseCase.execute(String(id));
      res.status(200).json({ status: 'SUCCESS', message: 'Payment deleted' });
    } catch (error) {
      next(error);
    }
  }

  return { generate, createPaymentRequest, list, getById, sendPaymentRequest, recordPayment, remove };
}
