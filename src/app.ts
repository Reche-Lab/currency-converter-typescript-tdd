import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import { createCurrencyRoutes } from './routes/currencyRoutes';
import { CurrencyConversionService } from './services/CurrencyConversionService';
import { ExchangeRateRepository } from './repositories/ExchangeRateRepository';
import { MockExchangeRateRepository } from './repositories/MockExchangeRateRepository';

export function createApp(useMockRepository = false): Application {
  const app: Application = express();

  // Security middleware
  app.use(helmet());

  // CORS middleware
  app.use(cors({
    origin: config.cors.origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Dependency injection
  const exchangeRateRepository = useMockRepository 
    ? new MockExchangeRateRepository()
    : new ExchangeRateRepository();
  
  const currencyConversionService = new CurrencyConversionService(exchangeRateRepository);

  // Routes
  app.use('/api', createCurrencyRoutes(currencyConversionService));

  // Root endpoint
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'Currency Converter API',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        currencies: '/api/currencies',
        convert: '/api/convert?from=USD&to=BRL&amount=100',
      },
    });
  });

  // 404 handler
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.originalUrl} not found`,
    });
  });

  // Global error handler
  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Global error handler:', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      ...(config.nodeEnv === 'development' && { stack: error.stack }),
    });
  });

  return app;
}

