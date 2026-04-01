import { useState } from "react";
import axios from "axios";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/weather/${city}`);
      setWeather(res.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🌤 Weather App</h2>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <br />
      <br />

      <button onClick={getWeather}>Get Weather</button>

      {weather && (
        <div style={{ marginTop: "20px" }}>
          <h3>{weather.city}</h3>
          <p>🌡 Temp: {weather.temperature}°C</p>
          <p>☁️ {weather.description}</p>
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>💨 Wind: {weather.wind_speed} km/h</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
