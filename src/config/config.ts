import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  exchangeRateApi: {
    key: process.env.EXCHANGE_RATE_API_KEY || '',
    url: process.env.EXCHANGE_RATE_API_URL || 'https://v6.exchangerate-api.com/v6',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
};

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';
export const isTest = config.nodeEnv === 'test';

