import { describe, expect, it } from '@jest/globals';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { ValidationError } from '../../domain/errors';

function makePayment(overrides: { status?: PaymentStatus; totalAmount?: number; balance?: number } = {}) {
  const total = overrides.totalAmount ?? 1000;
  return PaymentEntity.createInstance(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    new Date('2026-06-01'),
    overrides.status ?? PaymentStatus.Sent,
    'PR-1',
    1,
    '1 / 4',
    800,
    120,
    16,
    64,
    total,
    0,
    overrides.balance ?? total,
  );
}

describe('PaymentEntity.recordPaymentReceived', () => {
  it('sets Paid and zero balance when deposit equals total amount', () => {
    const p = makePayment({ totalAmount: 1000 });
    p.recordPaymentReceived({ bankDeposit: 1000, paymentDate: new Date('2026-03-01') });
    expect(p.bankDeposit).toBe(1000);
    expect(p.balance).toBe(0);
    expect(p.status).toBe(PaymentStatus.Paid);
  });

  it('keeps Pending with positive balance when deposit is partial', () => {
    const p = makePayment({ totalAmount: 1000 });
    p.recordPaymentReceived({ bankDeposit: 400, paymentDate: new Date('2026-03-01') });
    expect(p.balance).toBe(600);
    expect(p.status).toBe(PaymentStatus.Pending);
  });

  it('marks Paid when deposit exceeds total (overpayment)', () => {
    const p = makePayment({ totalAmount: 1000 });
    p.recordPaymentReceived({ bankDeposit: 1000.01, paymentDate: new Date('2026-03-01') });
    expect(p.balance).toBe(-0.01);
    expect(p.status).toBe(PaymentStatus.Paid);
  });

  it('rejects when installment is already Paid', () => {
    const p = makePayment({ status: PaymentStatus.Paid, totalAmount: 1000, balance: 0 });
    expect(() =>
      p.recordPaymentReceived({ bankDeposit: 100, paymentDate: new Date('2026-03-01') }),
    ).toThrow(ValidationError);
  });

  it('rejects invalid bank deposit', () => {
    const p = makePayment();
    expect(() =>
      p.recordPaymentReceived({ bankDeposit: -1, paymentDate: new Date('2026-03-01') }),
    ).toThrow(ValidationError);
    expect(() =>
      p.recordPaymentReceived({ bankDeposit: Number.NaN, paymentDate: new Date('2026-03-01') }),
    ).toThrow(ValidationError);
  });

  it('rejects invalid payment date', () => {
    const p = makePayment();
    expect(() =>
      p.recordPaymentReceived({ bankDeposit: 100, paymentDate: new Date('invalid') }),
    ).toThrow(ValidationError);
  });

  it('rejects invalid bank deposit date when provided', () => {
    const p = makePayment();
    expect(() =>
      p.recordPaymentReceived({
        bankDeposit: 100,
        paymentDate: new Date('2026-03-01'),
        bankDepositDate: new Date('invalid'),
      }),
    ).toThrow(ValidationError);
  });

  it('allows recording from Failed status (recovery)', () => {
    const p = makePayment({ status: PaymentStatus.Failed, totalAmount: 500, balance: 500 });
    p.recordPaymentReceived({ bankDeposit: 500, paymentDate: new Date('2026-03-01') });
    expect(p.status).toBe(PaymentStatus.Paid);
  });
});
