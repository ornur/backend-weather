// controllers/weatherController.js
const Weather = require('../models/weatherModel');
const weatherService = require('../services/weatherService');
const unsplashService = require('../services/unsplashService');

exports.getWeather = async (req, res) => {
  try {
    const city = req.params.city;
    const weatherData = await weatherService.getWeatherData(city);

    if (!weatherData || !weatherData.list || weatherData.list.length === 0) {
      console.error('Unexpected weather data format:', weatherData);
      return res.status(500).json({ error: 'Invalid weather data received from the API' });
    }

    // Extract data from the latest entry in the list
    const latestEntry = weatherData.list[0];

    // Extract rain data for the last 3 hours (latest entry in the list)
    const rainVolumeLast3Hours = latestEntry.rain ? latestEntry.rain['3h'] : 'N/A';

    // Convert temperature from Kelvin to Celsius
    const temperatureCelsius = latestEntry.main.temp - 273.15;
    const feels_likeCelsius = latestEntry.main.feels_like - 273.15;

    // Extract description and country_code from the correct properties
    const description = latestEntry.weather[0].description || 'N/A';
    const country_code = weatherData.city.country || 'N/A';

    // Construct the weather icon image URL
    const iconImageURL = `https://openweathermap.org/img/wn/${latestEntry.weather[0].icon}.png`;

    // Create a Weather model with the converted temperature and rain data
    const formattedWeatherData = new Weather({
      temperature: temperatureCelsius.toFixed(0),
      feels_like: feels_likeCelsius.toFixed(0),
      description: description,
      icon: iconImageURL,
      humidity: latestEntry.main.humidity || 'N/A',
      pressure: latestEntry.main.pressure || 'N/A',
      wind_speed: latestEntry.wind.speed || 'N/A',
      country_code: country_code,
      rain: rainVolumeLast3Hours,
    });

    try {
      const backgroundImage = await unsplashService.getRandomBackgroundImage(formattedWeatherData.description);
    
      // Include background image in the response
      res.json({ weather: formattedWeatherData, background: backgroundImage });
    
    } catch (backgroundError) {
      console.error('Error fetching background image:', backgroundError);
      // If there's an error fetching the background image, still send the weather data
      res.json({ weather: formattedWeatherData, background: null });
    }

  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
