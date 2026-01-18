import { Money } from '../../src/domain/value-objects/money.value-object';

describe('Money', () => {
  it('adds amounts in same currency', () => {
    const a = new Money(100, 'ETB');
    const b = new Money(50, 'ETB');
    expect(a.add(b).amount).toBe(150);
  });

  it('throws on currency mismatch', () => {
    const a = new Money(100, 'ETB');
    const b = new Money(10, 'USD');
    expect(() => a.add(b)).toThrow('Currency mismatch');
  });
});
