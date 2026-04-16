const axios = require("axios");

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

async function getWeather(city) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: process.env.API_KEY || "7db44a2c96402dfaca25eea804e80efe",
        units: "metric",
      },
    });

    return response.data;
  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
    throw err;
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat,
        lon,
        appid: process.env.API_KEY || "7db44a2c96402dfaca25eea804e80efe",
        units: "metric",
      },
    });

    return response.data;
  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { getWeather, getWeatherByCoords };
