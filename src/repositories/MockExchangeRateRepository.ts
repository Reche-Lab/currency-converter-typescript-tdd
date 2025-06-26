import { IExchangeRateRepository, ExchangeRate } from '../models';

export class MockExchangeRateRepository implements IExchangeRateRepository {
  private readonly mockRates: Record<string, Record<string, number>> = {
    USD: {
      BRL: 5.25,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.0,
    },
    BRL: {
      USD: 0.19,
      EUR: 0.16,
      GBP: 0.14,
      JPY: 20.95,
    },
    EUR: {
      USD: 1.18,
      BRL: 6.18,
      GBP: 0.86,
      JPY: 129.41,
    },
  };

  private readonly supportedCurrencies = ['USD', 'BRL', 'EUR', 'GBP', 'JPY'];

  async getExchangeRate(from: string, to: string): Promise<ExchangeRate> {
    const fromUpper = from.toUpperCase();
    const toUpper = to.toUpperCase();

    if (!this.supportedCurrencies.includes(fromUpper)) {
      throw new Error(`Unsupported currency: ${fromUpper}`);
    }

    if (!this.supportedCurrencies.includes(toUpper)) {
      throw new Error(`Unsupported currency: ${toUpper}`);
    }

    if (fromUpper === toUpper) {
      return {
        from: fromUpper,
        to: toUpper,
        rate: 1.0,
        timestamp: Date.now(),
      };
    }

    const rate = this.mockRates[fromUpper]?.[toUpper];
    
    if (!rate) {
      throw new Error(`Exchange rate not found for ${fromUpper} to ${toUpper}`);
    }

    return {
      from: fromUpper,
      to: toUpper,
      rate,
      timestamp: Date.now(),
    };
  }

  async getSupportedCurrencies(): Promise<string[]> {
    return [...this.supportedCurrencies];
  }
}

