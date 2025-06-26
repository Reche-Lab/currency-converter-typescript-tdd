import { ICurrencyConversionService, IExchangeRateRepository, ConversionRequest, ConversionResponse } from '../models';

export class CurrencyConversionService implements ICurrencyConversionService {
  constructor(private readonly exchangeRateRepository: IExchangeRateRepository) {}

  async convertCurrency(request: ConversionRequest): Promise<ConversionResponse> {
    const { from, to, amount } = request;

    // Validate input
    this.validateConversionRequest(request);

    // Get exchange rate
    const exchangeRate = await this.exchangeRateRepository.getExchangeRate(from, to);
    
    // Calculate converted amount
    const convertedAmount = this.calculateConvertedAmount(amount, exchangeRate.rate);

    return {
      from: exchangeRate.from,
      to: exchangeRate.to,
      amount,
      convertedAmount,
      rate: exchangeRate.rate,
      timestamp: exchangeRate.timestamp,
    };
  }

  async validateCurrencyCode(code: string): Promise<boolean> {
    try {
      const supportedCurrencies = await this.exchangeRateRepository.getSupportedCurrencies();
      return supportedCurrencies.includes(code.toUpperCase());
    } catch (error) {
      return false;
    }
  }

  async getSupportedCurrencies(): Promise<string[]> {
    return this.exchangeRateRepository.getSupportedCurrencies();
  }

  private validateConversionRequest(request: ConversionRequest): void {
    const { from, to, amount } = request;

    if (!from || typeof from !== 'string' || from.trim().length === 0) {
      throw new Error('From currency is required and must be a valid string');
    }

    if (!to || typeof to !== 'string' || to.trim().length === 0) {
      throw new Error('To currency is required and must be a valid string');
    }

    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    if (from.length !== 3 || to.length !== 3) {
      throw new Error('Currency codes must be exactly 3 characters long');
    }

    if (!/^[A-Za-z]{3}$/.test(from) || !/^[A-Za-z]{3}$/.test(to)) {
      throw new Error('Currency codes must contain only letters');
    }
  }

  private calculateConvertedAmount(amount: number, rate: number): number {
    const result = amount * rate;
    // Round to 2 decimal places for currency precision
    return Math.round(result * 100) / 100;
  }
}

