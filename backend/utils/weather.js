const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const getWeather = async (lat, lng, date) => {
  try {
    // Fetch current weather;
    const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon: lng,
        units: 'metric',
        appid: OPENWEATHER_API_KEY,
      },
    });

    if (weatherResponse.data && weatherResponse.data.weather) {
      return weatherResponse.data.weather[0].description;
    }

    return 'Unknown';
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    return 'Unknown';
  }
};

module.exports = getWeather;
