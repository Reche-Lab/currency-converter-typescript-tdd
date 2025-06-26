import { ConversionRequest, ConversionResponse } from '../Currency';

export interface ICurrencyConversionService {
  convertCurrency(request: ConversionRequest): Promise<ConversionResponse>;
  validateCurrencyCode(code: string): Promise<boolean>;
  getSupportedCurrencies(): Promise<string[]>;
}

