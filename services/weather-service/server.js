require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Test route
app.get("/", (req, res) => {
  res.send("Weather Service is running");
});

// Main weather route
app.get("/api/weather/:city", async (req, res) => {
  try {
    const city = req.params.city;

    // Debug (remove later)
    console.log("City:", city);
    console.log("API KEY:", process.env.API_KEY);

    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: process.env.API_KEY,
        units: "metric"
      }
    });

    const data = response.data;
console.log(data)
    res.json({
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed
    });

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: "Failed to fetch weather by city",
      details: err.response?.data || err.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Weather service running on http://localhost:${PORT}`);
});