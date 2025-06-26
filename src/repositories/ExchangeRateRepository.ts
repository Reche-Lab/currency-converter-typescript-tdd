import axios, { AxiosInstance } from 'axios';
import { IExchangeRateRepository, ExchangeRate, ExchangeRateApiResponse, ApiError } from '../models';
import { config } from '../config/config';

export class ExchangeRateRepository implements IExchangeRateRepository {
  private readonly httpClient: AxiosInstance;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = config.exchangeRateApi.key;
    this.baseUrl = config.exchangeRateApi.url;
    
    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getExchangeRate(from: string, to: string): Promise<ExchangeRate> {
    try {
      const url = `/${this.apiKey}/latest/${from.toUpperCase()}`;
      const response = await this.httpClient.get<ExchangeRateApiResponse>(url);
      
      if (response.data.result !== 'success') {
        throw new Error(`API returned error: ${response.data.result}`);
      }

      const toCurrency = to.toUpperCase();
      const rate = response.data.conversion_rates[toCurrency];
      
      if (!rate) {
        throw new Error(`Exchange rate not found for currency: ${toCurrency}`);
      }

      return {
        from: from.toUpperCase(),
        to: toCurrency,
        rate,
        timestamp: response.data.time_last_update_unix * 1000, // Convert to milliseconds
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message,
          code: error.response?.data?.code || 'NETWORK_ERROR',
          statusCode: error.response?.status || 500,
        };
        throw apiError;
      }
      throw error;
    }
  }

  async getSupportedCurrencies(): Promise<string[]> {
    try {
      const url = `/${this.apiKey}/codes`;
      const response = await this.httpClient.get(url);
      
      if (response.data.result !== 'success') {
        throw new Error(`API returned error: ${response.data.result}`);
      }

      return response.data.supported_codes.map((code: [string, string]) => code[0]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message,
          code: error.response?.data?.code || 'NETWORK_ERROR',
          statusCode: error.response?.status || 500,
        };
        throw apiError;
      }
      throw error;
    }
  }
}

