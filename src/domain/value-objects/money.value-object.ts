export class Money {
    readonly amount: number;
    readonly currency: string;

    constructor(amount: number, currency: string) {
        this.amount = amount;
        this.currency = currency;
    }

    public add(other: Money): Money {
        return new Money(this.amount + other.amount, this.currency);
    }

    public subtract(other: Money): Money {
        return new Money(this.amount - other.amount, this.currency);
    }

    public multiply(other: Money): Money {
        return new Money(this.amount * other.amount, this.currency);
    }

    public divide(other: Money): Money {
        return new Money(this.amount / other.amount, this.currency);
    }


}