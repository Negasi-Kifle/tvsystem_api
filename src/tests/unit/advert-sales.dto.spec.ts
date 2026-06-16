import { describe, expect, it } from '@jest/globals';
import { createAdvertSalesDto } from '../../presentation/dtos/requests/advert-sales/create.dto';
import { updateAdvertSalesDto } from '../../presentation/dtos/requests/advert-sales/update.dto';

describe('advert sales DTOs', () => {
  it('accepts optional priceInUSD on create payload', () => {
    const parsed = createAdvertSalesDto.parse({
      adPackageId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      customerId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      adStartDate: '2026-01-01',
      adEndDate: '2026-01-10',
      adLengthSeconds: 30,
      numOfSlots: 1,
      campaignName: 'Campaign',
      contractSignDate: '2025-12-01',
      priceInUSD: 150,
    });

    expect(parsed.priceInUSD).toBe(150);
  });

  it('rejects negative priceInUSD on update payload', () => {
    expect(() =>
      updateAdvertSalesDto.parse({
        priceInUSD: -5,
      }),
    ).toThrow();
  });
});
