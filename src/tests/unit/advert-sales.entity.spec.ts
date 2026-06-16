import { describe, expect, it } from '@jest/globals';
import { AdvertSalesEntity } from '../../domain/entities/advert-sales.entity';
import { AdvertSalesStatus } from '../../domain/enums/advert-sales.enum';
import { AdvertType } from '../../domain/enums/advert-type.enum';
import { ValidationError } from '../../domain/errors';

function makeSale(priceInUSD?: number | null) {
  return AdvertSalesEntity.createInstance(
    'pkg-id',
    'cust-id',
    AdvertSalesStatus.Pending,
    AdvertType.Paid,
    new Date('2026-01-01'),
    new Date('2026-01-10'),
    30,
    1,
    10000,
    0,
    10000,
    1,
    'Campaign',
    new Date('2025-12-01'),
    'REF-1',
    null,
    0,
    null,
    null,
    null,
    0,
    undefined,
    undefined,
    undefined,
    priceInUSD,
  );
}

describe('AdvertSalesEntity.createInstance', () => {
  it('accepts optional priceInUSD when provided', () => {
    const entity = makeSale(250.5);

    expect(entity.priceInUSD).toBe(250.5);
  });

  it('defaults priceInUSD to null when omitted', () => {
    const entity = makeSale();

    expect(entity.priceInUSD).toBeNull();
  });

  it('rejects negative priceInUSD', () => {
    expect(() => makeSale(-1)).toThrow(ValidationError);
  });
});
