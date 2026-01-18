import { Request, Response } from 'express';
import { GeneratePaymentRequestUseCase } from '../../application/use-cases/finance/generate-payment-request.use-case';
import { CreatePaymentDto } from '../dtos/requests/create-payment.dto';

const generatePaymentUseCase = new GeneratePaymentRequestUseCase();

export async function createPaymentRequest(req: Request, res: Response) {
  const payload = req.body as CreatePaymentDto;
  const payment = await generatePaymentUseCase.execute(payload);
  res.status(201).json(payment);
}
