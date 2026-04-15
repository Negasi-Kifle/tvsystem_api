import { mapFetchAllShowSegmentSlotsDtoToQueryOptions } from '../../presentation/mappers/show-segment-slot-to-query-options.mapper';

describe('mapFetchAllShowSegmentSlotsDtoToQueryOptions', () => {
  it('maps page and limit to skip and take', () => {
    const q = mapFetchAllShowSegmentSlotsDtoToQueryOptions({
      page: 2,
      limit: 15,
      showId: undefined,
      customerId: undefined,
    });
    expect(q.skip).toBe(15);
    expect(q.take).toBe(15);
    expect(q.filters).toEqual({});
  });

  it('includes optional filters when set', () => {
    const showId = '11111111-1111-4111-8111-111111111111';
    const customerId = '22222222-2222-4222-8222-222222222222';
    const q = mapFetchAllShowSegmentSlotsDtoToQueryOptions({
      page: 1,
      limit: 10,
      showId,
      customerId,
    });
    expect(q.filters).toEqual({ showId, customerId });
  });
});
