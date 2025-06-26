import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../app';

describe('Currency Routes Integration Tests', () => {
  let app: Application;

  beforeAll(() => {
    // Use mock repository for integration tests
    app = createApp(true);
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Currency Converter API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /api/health', () => {
    it('should return health check information', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Currency Converter API is running');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version', '1.0.0');
    });
  });

  describe('GET /api/currencies', () => {
    it('should return supported currencies', async () => {
      const response = await request(app)
        .get('/api/currencies')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('currencies');
      expect(response.body.data).toHaveProperty('count');
      expect(Array.isArray(response.body.data.currencies)).toBe(true);
      expect(response.body.data.currencies.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/convert', () => {
    it('should convert currency successfully', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({
          from: 'USD',
          to: 'BRL',
          amount: 100,
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      
      const data = response.body.data;
      expect(data).toHaveProperty('from', 'USD');
      expect(data).toHaveProperty('to', 'BRL');
      expect(data).toHaveProperty('amount', 100);
      expect(data).toHaveProperty('convertedAmount');
      expect(data).toHaveProperty('rate');
      expect(data).toHaveProperty('timestamp');
      
      expect(typeof data.convertedAmount).toBe('number');
      expect(typeof data.rate).toBe('number');
      expect(typeof data.timestamp).toBe('number');
    });

    it('should handle decimal amounts', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({
          from: 'USD',
          to: 'EUR',
          amount: 123.45,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe(123.45);
    });

    it('should handle string amounts', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({
          from: 'USD',
          to: 'BRL',
          amount: '100',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe(100);
    });

    it('should handle case insensitive currency codes', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({
          from: 'usd',
          to: 'brl',
          amount: 100,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.from).toBe('USD');
      expect(response.body.data.to).toBe('BRL');
    });

    it('should return 400 for missing from parameter', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({
          to: 'BRL',
          amount: 100,
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details).toContain('From currency is required');
    });

    it('should return 400 for missing to parameter', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({
          from: 'USD',
          amount: 100,
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toContain('To currency is required');
    });

    it('should return 400 for missing amount parameter', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({
          from: 'USD',
          to: 'BRL',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toContain('Amount is required');
    });

    it('should return 400 for invalid currency code format', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({
          from: 'US',
          to: 'BRL',
          amount: 100,
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toContain('From currency must be a valid 3-letter currency code');
    });

    it('should return 400 for invalid amount', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({
          from: 'USD',
          to: 'BRL',
          amount: -100,
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toContain('Amount must be a positive number');
    });

    it('should return 400 for non-numeric amount', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({
          from: 'USD',
          to: 'BRL',
          amount: 'abc',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toContain('Amount must be a positive number');
    });

    it('should return 400 for unsupported currency', async () => {
      const response = await request(app)
        .get('/api/convert')
        .query({
          from: 'XYZ',
          to: 'BRL',
          amount: 100,
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid currency');
      expect(response.body).toHaveProperty('message', 'Unsupported currency code: XYZ');
    });
  });

  describe('GET /api/nonexistent', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body.message).toContain('Route /api/nonexistent not found');
    });
  });
});

