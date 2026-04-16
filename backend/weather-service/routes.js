const express = require("express");
const axios = require("axios");
const router = express.Router();
const { getWeather } = require("./service");

router.get("/coords", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: "lat and lon are required",
      });
    }

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat,
          lon,
          appid: process.env.API_KEY || "7db44a2c96402dfaca25eea804e80efe",
          units: "metric",
        },
      },
    );

    const data = response.data;

    res.json({
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      icon: data.weather[0].icon,
    });
  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch weather by coordinates",
      details: error.response?.data || error.message,
    });
  }
});

router.get("/:city", async (req, res) => {
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
      icon: data.weather[0].icon,
    });
  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch weather by city",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
