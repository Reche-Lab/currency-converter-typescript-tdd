import { Request, Response } from 'express';
import { ICurrencyConversionService, ConversionRequest, ApiError } from '../models';
import { RequestValidator, ValidationUtils } from '../utils/validation';

export class CurrencyController {
  constructor(private readonly currencyConversionService: ICurrencyConversionService) {}

  async convertCurrency(req: Request, res: Response): Promise<void> {
    try {
      const { from, to, amount } = req.query;

      // Validate request parameters
      const validation = RequestValidator.validateConversionParams(from, to, amount);
      
      if (!validation.isValid) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Invalid request parameters',
          details: validation.errors,
        });
        return;
      }

      // Sanitize and parse parameters
      const sanitizedFrom = ValidationUtils.sanitizeCurrencyCode(from as string);
      const sanitizedTo = ValidationUtils.sanitizeCurrencyCode(to as string);
      const parsedAmount = ValidationUtils.parseAmount(amount);

      // Validate currency codes against supported currencies
      const [isFromValid, isToValid] = await Promise.all([
        this.currencyConversionService.validateCurrencyCode(sanitizedFrom),
        this.currencyConversionService.validateCurrencyCode(sanitizedTo),
      ]);

      if (!isFromValid) {
        res.status(400).json({
          error: 'Invalid currency',
          message: `Unsupported currency code: ${sanitizedFrom}`,
        });
        return;
      }

      if (!isToValid) {
        res.status(400).json({
          error: 'Invalid currency',
          message: `Unsupported currency code: ${sanitizedTo}`,
        });
        return;
      }

      // Create conversion request
      const conversionRequest: ConversionRequest = {
        from: sanitizedFrom,
        to: sanitizedTo,
        amount: parsedAmount,
      };

      // Perform conversion
      const result = await this.currencyConversionService.convertCurrency(conversionRequest);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getSupportedCurrencies(req: Request, res: Response): Promise<void> {
    try {
      const currencies = await this.currencyConversionService.getSupportedCurrencies();
      
      res.status(200).json({
        success: true,
        data: {
          currencies,
          count: currencies.length,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Currency Converter API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  }

  private handleError(error: any, res: Response): void {
    console.error('Controller error:', error);

    if (this.isApiError(error)) {
      res.status(error.statusCode).json({
        error: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        error: 'Bad Request',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  }

  private isApiError(error: any): error is ApiError {
    return error && typeof error.statusCode === 'number' && typeof error.code === 'string';
  }
}

