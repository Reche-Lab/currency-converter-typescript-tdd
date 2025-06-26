import { CurrencyConversionService } from '../../services/CurrencyConversionService';
import { IExchangeRateRepository, ExchangeRate, ConversionRequest } from '../../models';

describe('CurrencyConversionService', () => {
  let service: CurrencyConversionService;
  let mockRepository: jest.Mocked<IExchangeRateRepository>;

  beforeEach(() => {
    mockRepository = {
      getExchangeRate: jest.fn(),
      getSupportedCurrencies: jest.fn(),
    };
    service = new CurrencyConversionService(mockRepository);
  });

  describe('convertCurrency', () => {
    it('should convert currency successfully', async () => {
      // Arrange
      const request: ConversionRequest = {
        from: 'USD',
        to: 'BRL',
        amount: 100,
      };

      const mockExchangeRate: ExchangeRate = {
        from: 'USD',
        to: 'BRL',
        rate: 5.25,
        timestamp: Date.now(),
      };

      mockRepository.getExchangeRate.mockResolvedValue(mockExchangeRate);

      // Act
      const result = await service.convertCurrency(request);

      // Assert
      expect(result).toEqual({
        from: 'USD',
        to: 'BRL',
        amount: 100,
        convertedAmount: 525,
        rate: 5.25,
        timestamp: mockExchangeRate.timestamp,
      });

      expect(mockRepository.getExchangeRate).toHaveBeenCalledWith('USD', 'BRL');
    });

    it('should handle decimal amounts correctly', async () => {
      // Arrange
      const request: ConversionRequest = {
        from: 'USD',
        to: 'EUR',
        amount: 123.45,
      };

      const mockExchangeRate: ExchangeRate = {
        from: 'USD',
        to: 'EUR',
        rate: 0.85,
        timestamp: Date.now(),
      };

      mockRepository.getExchangeRate.mockResolvedValue(mockExchangeRate);

      // Act
      const result = await service.convertCurrency(request);

      // Assert
      expect(result.convertedAmount).toBe(104.93); // 123.45 * 0.85 = 104.9325, rounded to 104.93
    });

    it('should throw error for invalid from currency', async () => {
      // Arrange
      const request: ConversionRequest = {
        from: '',
        to: 'BRL',
        amount: 100,
      };

      // Act & Assert
      await expect(service.convertCurrency(request)).rejects.toThrow(
        'From currency is required and must be a valid string'
      );
    });

    it('should throw error for invalid to currency', async () => {
      // Arrange
      const request: ConversionRequest = {
        from: 'USD',
        to: '',
        amount: 100,
      };

      // Act & Assert
      await expect(service.convertCurrency(request)).rejects.toThrow(
        'To currency is required and must be a valid string'
      );
    });

    it('should throw error for invalid amount', async () => {
      // Arrange
      const request: ConversionRequest = {
        from: 'USD',
        to: 'BRL',
        amount: -100,
      };

      // Act & Assert
      await expect(service.convertCurrency(request)).rejects.toThrow(
        'Amount must be a positive number'
      );
    });

    it('should throw error for invalid currency code length', async () => {
      // Arrange
      const request: ConversionRequest = {
        from: 'US',
        to: 'BRL',
        amount: 100,
      };

      // Act & Assert
      await expect(service.convertCurrency(request)).rejects.toThrow(
        'Currency codes must be exactly 3 characters long'
      );
    });

    it('should throw error for non-alphabetic currency codes', async () => {
      // Arrange
      const request: ConversionRequest = {
        from: 'US1',
        to: 'BRL',
        amount: 100,
      };

      // Act & Assert
      await expect(service.convertCurrency(request)).rejects.toThrow(
        'Currency codes must contain only letters'
      );
    });
  });

  describe('validateCurrencyCode', () => {
    it('should return true for valid currency code', async () => {
      // Arrange
      mockRepository.getSupportedCurrencies.mockResolvedValue(['USD', 'BRL', 'EUR']);

      // Act
      const result = await service.validateCurrencyCode('USD');

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for invalid currency code', async () => {
      // Arrange
      mockRepository.getSupportedCurrencies.mockResolvedValue(['USD', 'BRL', 'EUR']);

      // Act
      const result = await service.validateCurrencyCode('XYZ');

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when repository throws error', async () => {
      // Arrange
      mockRepository.getSupportedCurrencies.mockRejectedValue(new Error('API Error'));

      // Act
      const result = await service.validateCurrencyCode('USD');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getSupportedCurrencies', () => {
    it('should return supported currencies', async () => {
      // Arrange
      const mockCurrencies = ['USD', 'BRL', 'EUR', 'GBP'];
      mockRepository.getSupportedCurrencies.mockResolvedValue(mockCurrencies);

      // Act
      const result = await service.getSupportedCurrencies();

      // Assert
      expect(result).toEqual(mockCurrencies);
      expect(mockRepository.getSupportedCurrencies).toHaveBeenCalled();
    });
  });
});

