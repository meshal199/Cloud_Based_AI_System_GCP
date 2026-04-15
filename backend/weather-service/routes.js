const express = require('express');
const router = express.Router();
const { getWeather } = require('./service');

router.get('/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const data = await getWeather(city);

    res.json({
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
    });
  } catch (error) {
    console.error('FULL ERROR:');
    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: 'Failed to fetch weather by city',
      details: error.response?.data || error.message,
    });
  }
});
module.exports = router;
