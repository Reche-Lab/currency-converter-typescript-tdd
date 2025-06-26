import { Router } from 'express';
import { CurrencyController } from '../controllers/CurrencyController';
import { ICurrencyConversionService } from '../models';

export function createCurrencyRoutes(currencyConversionService: ICurrencyConversionService): Router {
  const router = Router();
  const currencyController = new CurrencyController(currencyConversionService);

  // Health check endpoint
  router.get('/health', currencyController.healthCheck.bind(currencyController));

  // Get supported currencies
  router.get('/currencies', currencyController.getSupportedCurrencies.bind(currencyController));

  // Convert currency
  router.get('/convert', currencyController.convertCurrency.bind(currencyController));

  return router;
}

