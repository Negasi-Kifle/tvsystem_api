const VAT_RATE = 0.15;
const WITHHOLD_TAX_RATE = 0.02;
const VAT_WITHHOLD_RATE = 0.075;

export type InstallmentPaymentAmounts = {
  amountBeforeVat: number;
  vatAmount: number;
  withholdTax: number;
  vatWithhold: number;
  totalAmount: number;
};

/**
 * Pre-VAT amount for installment `i` (0-based) of `n`, splitting `finalPrice` evenly in cents.
 * The last installment absorbs any remainder so the sum matches `finalPrice`.
 */
export function amountBeforeVatForInstallment(finalPrice: number, n: number, i: number): number {
  const totalCents = Math.round(finalPrice * 100);
  const base = Math.floor(totalCents / n);
  if (i === n - 1) {
    return (totalCents - base * (n - 1)) / 100;
  }
  return base / 100;
}

export function computeDueDateForInstallment(
  adStartDate: Date,
  adEndDate: Date,
  installmentCount: number,
  indexZeroBased: number,
): Date {
  const totalDays = Math.max(
    1,
    Math.ceil((adEndDate.getTime() - adStartDate.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const daysBetweenInstallments = Math.floor(totalDays / installmentCount);
  const dueDate = new Date(adStartDate);
  dueDate.setDate(dueDate.getDate() + daysBetweenInstallments * indexZeroBased);
  return dueDate;
}

export function computePaymentAmountsForInstallment(
  finalPrice: number,
  installmentCount: number,
  indexZeroBased: number,
): InstallmentPaymentAmounts {
  const amountBeforeVat = amountBeforeVatForInstallment(finalPrice, installmentCount, indexZeroBased);
  const vatAmount = Math.round(amountBeforeVat * VAT_RATE * 100) / 100;
  const withholdTax = Math.round(amountBeforeVat * WITHHOLD_TAX_RATE * 100) / 100;
  const vatWithhold = Math.round(vatAmount * VAT_WITHHOLD_RATE * 100) / 100;
  const totalAmount = Math.round((amountBeforeVat + vatAmount) * 100) / 100;
  return { amountBeforeVat, vatAmount, withholdTax, vatWithhold, totalAmount };
}
