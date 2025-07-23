const axios = require('axios');
const config = require('../../config');

class WeatherService {
  constructor() {
    this.apiKey = config.openWeatherApiKey;
    this.baseUrl = config.openWeatherMap.baseUrl;
    this.geoEndpoint = config.openWeatherMap.geoEndpoint;
    this.weatherEndpoint = config.openWeatherMap.weatherEndpoint;
  }

  _cleanZipCode(zipCode, countryCode) {
    let cleanZipCode = zipCode.replace('-', '');
    
    // For US ZIP codes, use only first 5 digits if longer (ZIP+4 format)
    if (countryCode === 'US' && cleanZipCode.length > 5) {
      cleanZipCode = cleanZipCode.substring(0, 5);
    }
    
    return cleanZipCode;
  }

  async getLocationData(zipCode, countryCode = 'US') {
    try {
      const cleanZipCode = this._cleanZipCode(zipCode, countryCode);
      
      const locationData = await axios.get(`${this.baseUrl}${this.geoEndpoint}`, {
        params: {
          zip: `${cleanZipCode},${countryCode}`,
          appid: this.apiKey
        }
      });

      const { lat, lon, name } = locationData.data;
      
      // Get timezone data
      const weatherData = await axios.get(`${this.baseUrl}${this.weatherEndpoint}`, {
        params: {
          lat,
          lon,
          appid: this.apiKey
        }
      });

      return {
        latitude: lat,
        longitude: lon,
        timezone: weatherData.data.timezone,
        cityName: name
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error(`Location not found for zip code ${zipCode}`);
      }
      throw new Error(`Failed to fetch location data for zip code ${zipCode}`);
    }
  }

  async getWeatherData(lat, lon) {
    try {
      const weatherData = await axios.get(`${this.baseUrl}${this.weatherEndpoint}`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      return {
        temperature: weatherData.data.main.temp,
        description: weatherData.data.weather[0].description,
        humidity: weatherData.data.main.humidity,
        windSpeed: weatherData.data.wind.speed
      };
    } catch (error) {
      throw new Error('Failed to fetch weather data');
    }
  }
}

module.exports = new WeatherService(); 