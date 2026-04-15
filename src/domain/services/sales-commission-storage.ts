import { ValidationError } from '../errors/validation.error';
import { SalesCommissionType } from '../enums/sales-commission-type.enum';

/**
 * Converts the user's configured commission (percentage or fixed amount) into the
 * percentage value stored on advert sales rows (0–100).
 */
export function computeStoredAgentCommissionPercentage(
  type: SalesCommissionType | undefined,
  amount: number | undefined,
  finalPrice: number,
): number {
  const rawAmount = amount ?? 0;

  if (type === undefined) {
    return 0;
  }

  if (type === SalesCommissionType.Percentage) {
    return rawAmount;
  }

  if (type === SalesCommissionType.Fixed) {
    if (finalPrice <= 0) {
      throw new ValidationError('Final price must be positive to compute fixed sales commission');
    }
    const pct = (rawAmount / finalPrice) * 100;
    if (pct > 100) {
      throw new ValidationError('Fixed commission exceeds 100% of the final price');
    }
    return pct;
  }

  return 0;
}
