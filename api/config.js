require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API Keys
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  
  // OpenWeatherMap API
  openWeatherMap: {
    baseUrl: 'http://api.openweathermap.org',
    geoEndpoint: '/geo/1.0/zip',
    weatherEndpoint: '/data/2.5/weather'
  }
};

module.exports = config; 