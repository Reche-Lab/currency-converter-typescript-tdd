import { ExchangeRate } from '../Currency';

export interface IExchangeRateRepository {
  getExchangeRate(from: string, to: string): Promise<ExchangeRate>;
  getSupportedCurrencies(): Promise<string[]>;
}

