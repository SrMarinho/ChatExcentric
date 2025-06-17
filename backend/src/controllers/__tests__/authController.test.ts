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
    return new Sum(this, addend)
  }
}

class Bank {
  constructor() {
  }

  public reduce(source: Expression, to: string): Money {
    return Money.dollar(10)
  }
}

class Sum {
  constructor(public augend: Money, public addend: Money) {}
}

describe('Money', () => {
  describe('equals()', () => {
    it('should consider equal when amounts and currencies match', () => {
      expect(Money.dollar(5).equals(Money.dollar(5))).toBe(true)
    })

    it('should consider different when amounts differ', () => {
      expect(Money.dollar(5).equals(Money.dollar(6))).toBe(false)
    })

    it('should consider different when currencies differ', () => {
      expect(Money.dollar(5).equals(Money.euro(5))).toBe(false)
    })
  })

  describe('times() - multiplication', () => {
    let fiveDollars: Money;

    beforeEach(() => {
      fiveDollars = Money.dollar(5)
    })

    it('should return new Money instance with multiplied amount', () => {
      const product = fiveDollars.times(2)
      expect(product.amount).toBe(10)
      expect(product).not.toBe(fiveDollars)
    })

    it('should be immutable - original value remains unchanged after multiplication', () => {
      fiveDollars.times(3)
      expect(fiveDollars.amount).toBe(5)
    })

    it('should return zero when multiplying by zero', () => {
      expect(fiveDollars.times(0).amount).toBe(0)
    })
  })

  describe('currency', () => {
    it('should correctly identify USD as dollar currency', () => {
      expect(Money.dollar(1).currency).toBe('USD')
    })

    it('should correctly identify EUR as euro currency', () => {
      expect(Money.euro(1).currency).toBe('EUR')
    })
  })
  
  describe('plus() - addition', () => {
    let five: Money

    beforeEach(() => {
      five = Money.dollar(5)
    })

    it('should reduce sum of two Money instances to correct amount', () => {
      const sum = five.plus(five)
      const bank = new Bank()
      const reduced = bank.reduce(sum, "USD")
      expect(reduced).toStrictEqual(Money.dollar(10))
    })

    it('should return Sum instance containing both addends', () => {
      const result = five.plus(five)
      const sum = result as Sum
      expect(sum.augend).toBe(five)
      expect(sum.addend).toBe(five)
    })
  })
})
