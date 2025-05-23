import { describe, it, expect, beforeEach, jest, test } from '@jest/globals';

abstract class Money {
  constructor(protected amount: number) {}

  getAmount(): number {
    return this.amount;
  }
  
  abstract times(multiplier: number): Money;
  
  equals(other: Money): boolean {
    return this.amount === other.amount && this.constructor === other.constructor;
  }

  public static dollar(amount: number): Money {
    return new Dollar(amount);
  }

  public static euro(amount: number): Money {
    return new Euro(amount);
  }

  public abstract currency(): string;
}

class Dollar extends Money {
  constructor(amount: number) {
    super(amount);
  }

  times(multiplier: number): Money {
    return Money.dollar(this.amount * multiplier);
  }

  currency(): string {
    return 'USD';
  }
}

class Euro extends Money {
  constructor(amount: number) {
    super(amount);
  }

  times(multiplier: number): Money {
    return Money.euro(this.amount * multiplier);
  }

  public currency(): string {
    return 'EUR';
  }
}

describe('Money', () => {
  describe('equality', () => {
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

  describe('multiplication', () => {
    let fiveDollars: Dollar;

    beforeEach(() => {
      fiveDollars = Money.dollar(5);
    });

    it('should return new instance with multiplied amount', () => {
      const product = fiveDollars.times(2);
      expect(product.getAmount()).toBe(10);
      expect(product).not.toBe(fiveDollars); // Verifica se é nova instância
    });

    it('should not modify original value when multiplying', () => {
      fiveDollars.times(3);
      expect(fiveDollars.getAmount()).toBe(5);
    });

    it('should handle multiplication by zero', () => {
      expect(fiveDollars.times(0).getAmount()).toBe(0);
    });
  });

  describe('Currency', () => {
    it('should have USD to dollar currency', () => {
      expect('USD').toBe(Money.dollar(1).currency())
    })

    it('should have EUR to euro currency', () => {
      expect('EUR').toBe(Money.euro(1).currency())
    })
  })
});