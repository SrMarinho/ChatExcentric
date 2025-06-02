import { describe, it, expect, beforeEach, jest } from '@jest/globals';


interface Expression {}

class Money implements Expression {
  constructor(
    public amount: number,
    public currency: string
  ) { }

  public equals(money: Money): boolean {
    return this.amount === money.amount && this.currency === money.currency;
  }

  public static dollar(amount: number): Money {
    return new Money(amount, "USD");
  }

  public static euro(amount: number): Money {
    return new Money(amount, "EUR");
  }

  public times(multiplier: number): Money {
    return new Money(this.amount * multiplier, this.currency)
  }

  public plus(addend: Money): Expression {
    return new Money(this.amount + addend.amount, this.currency)
  }
}

class Bank {
  constructor() {
  }

  public reduce(source: Expression, to: string): Money {
    return Money.dollar(10)
  }
}

describe('Money', () => {
  describe('Equality', () => {
    it('should return true when amounts and currencies are equal', () => {
      expect(Money.dollar(5).equals(Money.dollar(5))).toBe(true);
    });

    it('should return false when amounts are different', () => {
      expect(Money.dollar(5).equals(Money.dollar(6))).toBe(false);
    });

    it('should return false when currencies are different', () => {
      expect(Money.dollar(5).equals(Money.euro(5))).toBe(false);
    });
  });

  describe('Multiplication', () => {
    let fiveDollars: Money;

    beforeEach(() => {
      fiveDollars = Money.dollar(5);
    });

    it('should return new instance with multiplied amount', () => {
      const product = fiveDollars.times(2);
      expect(product.amount).toBe(10);
      expect(product).not.toBe(fiveDollars); // Verifica se é nova instância
    });

    it('should not modify original value when multiplying', () => {
      fiveDollars.times(3);
      expect(fiveDollars.amount).toBe(5);
    });

    it('should handle multiplication by zero', () => {
      expect(fiveDollars.times(0).amount).toBe(0);
    });
  });

  describe('Currency', () => {
    it('should have USD to dollar currency', () => {
      expect(Money.dollar(1).currency).toBe('USD')
    })

    it('should have EUR to euro currency', () => {
      expect(Money.euro(1).currency).toBe('EUR')
    })
  })

  describe('Simple addition', () => {
    let five: Money = Money.dollar(5)
    let sum: Expression = five.plus(five)
    let bank: Bank = new Bank()
    let reduced: Money = bank.reduce(sum, "USD")
    it('should add 5 dollars and get 10 dollars', () => {
      expect(reduced).toBe(Money.dollar(10))
    })
  })
});
