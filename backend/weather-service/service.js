const axios = require("axios");

async function getWeather(city) {
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

  try {
    console.log("City:", city);

    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: process.env.API_KEY,
        units: "metric",
      },
    });

    return response.data; 
  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
    throw err; 
  }
}

module.exports = { getWeather };