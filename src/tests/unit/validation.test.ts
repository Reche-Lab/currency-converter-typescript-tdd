import { ValidationUtils, RequestValidator } from '../../utils/validation';

describe('ValidationUtils', () => {
  describe('isValidCurrencyCode', () => {
    it('should return true for valid currency codes', () => {
      expect(ValidationUtils.isValidCurrencyCode('USD')).toBe(true);
      expect(ValidationUtils.isValidCurrencyCode('BRL')).toBe(true);
      expect(ValidationUtils.isValidCurrencyCode('EUR')).toBe(true);
      expect(ValidationUtils.isValidCurrencyCode('GBP')).toBe(true);
    });

    it('should return false for invalid currency codes', () => {
      expect(ValidationUtils.isValidCurrencyCode('')).toBe(false);
      expect(ValidationUtils.isValidCurrencyCode('US')).toBe(false);
      expect(ValidationUtils.isValidCurrencyCode('USDD')).toBe(false);
      expect(ValidationUtils.isValidCurrencyCode('US1')).toBe(false);
      expect(ValidationUtils.isValidCurrencyCode('123')).toBe(false);
      expect(ValidationUtils.isValidCurrencyCode(null as any)).toBe(false);
      expect(ValidationUtils.isValidCurrencyCode(undefined as any)).toBe(false);
    });

    it('should handle whitespace correctly', () => {
      expect(ValidationUtils.isValidCurrencyCode(' USD ')).toBe(true);
      expect(ValidationUtils.isValidCurrencyCode('  ')).toBe(false);
    });
  });

  describe('isValidAmount', () => {
    it('should return true for valid amounts', () => {
      expect(ValidationUtils.isValidAmount(100)).toBe(true);
      expect(ValidationUtils.isValidAmount(0.01)).toBe(true);
      expect(ValidationUtils.isValidAmount('100')).toBe(true);
      expect(ValidationUtils.isValidAmount('0.01')).toBe(true);
      expect(ValidationUtils.isValidAmount('123.45')).toBe(true);
    });

    it('should return false for invalid amounts', () => {
      expect(ValidationUtils.isValidAmount(0)).toBe(false);
      expect(ValidationUtils.isValidAmount(-100)).toBe(false);
      expect(ValidationUtils.isValidAmount('0')).toBe(false);
      expect(ValidationUtils.isValidAmount('-100')).toBe(false);
      expect(ValidationUtils.isValidAmount('abc')).toBe(false);
      expect(ValidationUtils.isValidAmount('')).toBe(false);
      expect(ValidationUtils.isValidAmount(null)).toBe(false);
      expect(ValidationUtils.isValidAmount(undefined)).toBe(false);
      expect(ValidationUtils.isValidAmount(NaN)).toBe(false);
    });
  });

  describe('parseAmount', () => {
    it('should parse valid numeric amounts', () => {
      expect(ValidationUtils.parseAmount(100)).toBe(100);
      expect(ValidationUtils.parseAmount(123.45)).toBe(123.45);
      expect(ValidationUtils.parseAmount('100')).toBe(100);
      expect(ValidationUtils.parseAmount('123.45')).toBe(123.45);
    });

    it('should throw error for invalid amounts', () => {
      expect(() => ValidationUtils.parseAmount('abc')).toThrow('Invalid amount format');
      expect(() => ValidationUtils.parseAmount('')).toThrow('Invalid amount format');
      expect(() => ValidationUtils.parseAmount(null)).toThrow('Amount must be a number or numeric string');
      expect(() => ValidationUtils.parseAmount(undefined)).toThrow('Amount must be a number or numeric string');
      expect(() => ValidationUtils.parseAmount({})).toThrow('Amount must be a number or numeric string');
    });
  });

  describe('sanitizeCurrencyCode', () => {
    it('should sanitize valid currency codes', () => {
      expect(ValidationUtils.sanitizeCurrencyCode('usd')).toBe('USD');
      expect(ValidationUtils.sanitizeCurrencyCode('USD')).toBe('USD');
      expect(ValidationUtils.sanitizeCurrencyCode(' usd ')).toBe('USD');
      expect(ValidationUtils.sanitizeCurrencyCode(' USD ')).toBe('USD');
    });

    it('should throw error for invalid input', () => {
      expect(() => ValidationUtils.sanitizeCurrencyCode('')).toThrow('Currency code must be a string');
      expect(() => ValidationUtils.sanitizeCurrencyCode(null as any)).toThrow('Currency code must be a string');
      expect(() => ValidationUtils.sanitizeCurrencyCode(undefined as any)).toThrow('Currency code must be a string');
    });
  });
});

describe('RequestValidator', () => {
  describe('validateConversionParams', () => {
    it('should return valid result for correct parameters', () => {
      const result = RequestValidator.validateConversionParams('USD', 'BRL', 100);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid result for missing from currency', () => {
      const result = RequestValidator.validateConversionParams(null, 'BRL', 100);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('From currency is required');
    });

    it('should return invalid result for invalid from currency', () => {
      const result = RequestValidator.validateConversionParams('US', 'BRL', 100);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('From currency must be a valid 3-letter currency code');
    });

    it('should return invalid result for missing to currency', () => {
      const result = RequestValidator.validateConversionParams('USD', null, 100);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('To currency is required');
    });

    it('should return invalid result for invalid to currency', () => {
      const result = RequestValidator.validateConversionParams('USD', 'BR', 100);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('To currency must be a valid 3-letter currency code');
    });

    it('should return invalid result for missing amount', () => {
      const result = RequestValidator.validateConversionParams('USD', 'BRL', null);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Amount is required');
    });

    it('should return invalid result for invalid amount', () => {
      const result = RequestValidator.validateConversionParams('USD', 'BRL', -100);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Amount must be a positive number');
    });

    it('should return multiple errors for multiple invalid parameters', () => {
      const result = RequestValidator.validateConversionParams('', '', -100);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain('From currency is required');
      expect(result.errors).toContain('To currency is required');
      expect(result.errors).toContain('Amount must be a positive number');
    });
  });
});

