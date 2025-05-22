import { describe, it, expect, beforeEach, jest, test } from '@jest/globals';

class Money {
  constructor(protected amount: number) {}

  getAmount(): number {
    return this.amount;
  }
  
  times(multiplier: number): Money {
    return new Money(this.amount * multiplier);
  }
  
  equals(other: Money): boolean {
    return this.amount === other.amount && this.constructor === other.constructor;
  }
}

class Dollar extends Money {
}

class Euro extends Money {
}

describe('Money', () => {
  describe('equality', () => {
    it('should return true when amounts and currencies are equal', () => {
      expect(new Dollar(5).equals(new Dollar(5))).toBe(true);
    });

    it('should return false when amounts are different', () => {
      expect(new Dollar(5).equals(new Dollar(6))).toBe(false);
    });

    it('should return false when currencies are different', () => {
      expect(new Dollar(5).equals(new Euro(5))).toBe(false);
    });
  });

  describe('multiplication', () => {
    let fiveDollars: Dollar;

    beforeEach(() => {
      fiveDollars = new Dollar(5);
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
});