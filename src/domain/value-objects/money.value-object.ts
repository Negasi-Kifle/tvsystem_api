export class Money {
  readonly amount: number;
  readonly currency: string;

  constructor(amount: number, currency = 'ETB') {
    this.amount = Math.round(amount * 100) / 100;
    this.currency = currency;
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  private ensureSameCurrency(other: Money) {
    if (this.currency !== other.currency) {
      throw new Error('Currency mismatch');
    }
  }
}
