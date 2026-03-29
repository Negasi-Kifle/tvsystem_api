export class Money {
    readonly amount: number;
    readonly currency: string;

    constructor(amount: number, currency: string) {
        this.amount = amount;
        this.currency = currency;
    }

    private assertSameCurrency(other: Money): void {
        if (this.currency !== other.currency) {
            throw new Error('Currency mismatch');
        }
    }

    public add(other: Money): Money {
        this.assertSameCurrency(other);
        return new Money(this.amount + other.amount, this.currency);
    }

    public subtract(other: Money): Money {
        this.assertSameCurrency(other);
        return new Money(this.amount - other.amount, this.currency);
    }

    public multiply(other: Money): Money {
        this.assertSameCurrency(other);
        return new Money(this.amount * other.amount, this.currency);
    }

    public divide(other: Money): Money {
        this.assertSameCurrency(other);
        return new Money(this.amount / other.amount, this.currency);
    }


}