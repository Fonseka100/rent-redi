// Mock axios before importing
jest.mock('axios');

// Mock config before importing
jest.mock('../../api/config', () => ({
  openWeatherApiKey: 'test-api-key',
  openWeatherMap: {
    baseUrl: 'http://api.openweathermap.org',
    geoEndpoint: '/geo/1.0/zip',
    weatherEndpoint: '/data/2.5/weather'
  }
}));

const axios = require('axios');
const weatherService = require('../../api/src/services/weatherService');

describe('Weather Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(weatherService.apiKey).toBe('test-api-key');
      expect(weatherService.baseUrl).toBe('http://api.openweathermap.org');
      expect(weatherService.geoEndpoint).toBe('/geo/1.0/zip');
      expect(weatherService.weatherEndpoint).toBe('/data/2.5/weather');
    });
  });

  describe('_cleanZipCode', () => {
    it('should remove hyphens from zip code', () => {
      const result = weatherService._cleanZipCode('12345-6789', 'US');
      expect(result).toBe('12345');
    });

    it('should truncate US ZIP codes longer than 5 digits', () => {
      const result = weatherService._cleanZipCode('12345-6789', 'US');
      expect(result).toBe('12345');
      
      // Should truncate to first 5 digits for US
      const truncated = weatherService._cleanZipCode('123456789', 'US');
      expect(truncated).toBe('12345');
    });

    it('should not truncate non-US ZIP codes', () => {
      const result = weatherService._cleanZipCode('123456789', 'CA');
      expect(result).toBe('123456789');
    });

    it('should handle zip codes without hyphens', () => {
      const result = weatherService._cleanZipCode('12345', 'US');
      expect(result).toBe('12345');
    });

    it('should handle empty zip code', () => {
      const result = weatherService._cleanZipCode('', 'US');
      expect(result).toBe('');
    });
  });

  describe('getLocationData', () => {
    it('should handle general API errors', async () => {
      const error = new Error('Network error');
      axios.get.mockRejectedValue(error);

      await expect(weatherService.getLocationData('10001', 'US'))
        .rejects
        .toThrow('Failed to fetch location data for zip code 10001');
    });

    it('should handle 404 errors for invalid zip code', async () => {
      const error = {
        response: {
          status: 404
        }
      };

      axios.get.mockRejectedValue(error);

      await expect(weatherService.getLocationData('99999', 'US'))
        .rejects
        .toThrow('Failed to fetch location data for zip code 99999');
    });
  });

  describe('getWeatherData', () => {
    it('should handle API errors', async () => {
      const error = new Error('Weather API error');
      axios.get.mockRejectedValue(error);

      await expect(weatherService.getWeatherData(40.7128, -74.0060))
        .rejects
        .toThrow('Failed to fetch weather data');
    });

    it('should handle network timeout errors', async () => {
      const error = new Error('Request timeout');
      axios.get.mockRejectedValue(error);

      await expect(weatherService.getWeatherData(40.7128, -74.0060))
        .rejects
        .toThrow('Failed to fetch weather data');
    });
  });
});