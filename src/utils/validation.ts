export class ValidationUtils {
  static isValidCurrencyCode(code: string): boolean {
    if (!code || typeof code !== 'string') {
      return false;
    }
    
    const trimmedCode = code.trim();
    return trimmedCode.length === 3 && /^[A-Za-z]{3}$/.test(trimmedCode);
  }

  static isValidAmount(amount: any): boolean {
    if (typeof amount === 'string') {
      const parsed = parseFloat(amount);
      return !isNaN(parsed) && parsed > 0;
    }
    
    return typeof amount === 'number' && !isNaN(amount) && amount > 0;
  }

  static parseAmount(amount: any): number {
    if (typeof amount === 'number') {
      return amount;
    }
    
    if (typeof amount === 'string') {
      const parsed = parseFloat(amount);
      if (isNaN(parsed)) {
        throw new Error('Invalid amount format');
      }
      return parsed;
    }
    
    throw new Error('Amount must be a number or numeric string');
  }

  static sanitizeCurrencyCode(code: string): string {
    if (!code || typeof code !== 'string') {
      throw new Error('Currency code must be a string');
    }
    
    return code.trim().toUpperCase();
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class RequestValidator {
  static validateConversionParams(from: any, to: any, amount: any): ValidationResult {
    const errors: string[] = [];

    // Validate from currency
    if (!from) {
      errors.push('From currency is required');
    } else if (!ValidationUtils.isValidCurrencyCode(from)) {
      errors.push('From currency must be a valid 3-letter currency code');
    }

    // Validate to currency
    if (!to) {
      errors.push('To currency is required');
    } else if (!ValidationUtils.isValidCurrencyCode(to)) {
      errors.push('To currency must be a valid 3-letter currency code');
    }

    // Validate amount
    if (amount === undefined || amount === null) {
      errors.push('Amount is required');
    } else if (!ValidationUtils.isValidAmount(amount)) {
      errors.push('Amount must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

