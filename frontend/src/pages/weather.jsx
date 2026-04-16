import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onPick(lat, lng);
    },
  });

  return null;
}
export default function WeatherPage() {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [error, setError] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unit, setUnit] = useState("C"); // 'C' or 'F'

  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const API_GATEWAY_URL = "https://coe558-gateway-dqswl092.ue.gateway.dev";

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);
  const getWeatherByCoords = async (lat, lon) => {
    try {
      setLoadingWeather(true);
      setError("");

      const response = await axios.get(
        `${API_GATEWAY_URL}/weather/coords?lat=${lat}&lon=${lon}`,
      );

      setWeather(response.data);
      setCity(response.data.city || "");
      setShowDropdown(false);
    } catch (error) {
      console.error("Weather by coords error:", error);
      setError("Failed to fetch weather for your location.");
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      () => {
        setError("Unable to get your location.");
      },
    );
  };
  const toFahrenheit = (celsius) => {
    return (celsius * 9) / 5 + 32;
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  const searchCities = async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      setLoadingSuggestions(true);

      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: value,
            format: "jsonv2",
            addressdetails: 1,
            limit: 6,
          },
          headers: {
            Accept: "application/json",
          },
        },
      );

      setSuggestions(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("City search error:", error);
      setSuggestions([]);
      setShowDropdown(true);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setWeather(null);
    setError("");

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      searchCities(value);
    }, 400);
  };

  const handleSelectCity = (item) => {
    const cityName =
      item.address?.city ||
      item.address?.town ||
      item.address?.village ||
      item.address?.municipality ||
      item.name ||
      item.display_name.split(",")[0];

    setCity(cityName);
    setSuggestions([]);
    setShowDropdown(false);
  };

  const getWeather = async (selectedCity = city) => {
    if (!selectedCity.trim()) return;

    try {
      setLoadingWeather(true);

      const response = await axios.get(
        `${API_GATEWAY_URL}/weather/${encodeURIComponent(selectedCity)}`,
      );

      setWeather(response.data);
      setShowDropdown(false);
    } catch (error) {
      console.error("Weather fetch error:", error);
      setError("City not found or failed to fetch weather.");
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getWeather();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-indigo-900 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer"
        >
          🌐 Dashboard
        </h1>

        <button
          onClick={() => navigate("/")}
          className="bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition"
        >
          ⬅ Back
        </button>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold mb-2">🌤 Weather Service</h2>
        <p className="text-gray-300">
          Search for a city and view its current weather
        </p>
      </div>

      <div ref={containerRef} className="max-w-2xl mx-auto relative">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={handleInputChange}
            onFocus={() => {
              if (suggestions.length > 0 || city.trim()) setShowDropdown(true);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 outline-none placeholder:text-gray-400"
          />

          <button
            onClick={() => getWeather()}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl transition"
          >
            {loadingWeather ? "Loading..." : "Search"}
          </button>
          <button
            onClick={handleUseMyLocation}
            className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition"
          >
            Use My Location
          </button>
        </div>
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
            ⚠ {error}
          </div>
        )}
        {showDropdown && city.trim() && (
          <div className="absolute z-50 mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-h-72 overflow-y-auto">
            {loadingSuggestions ? (
              <div className="px-4 py-3 text-gray-300">Searching...</div>
            ) : suggestions.length > 0 ? (
              suggestions.map((item) => {
                const cityLabel =
                  item.address?.city ||
                  item.address?.town ||
                  item.address?.village ||
                  item.address?.municipality ||
                  item.name ||
                  item.display_name.split(",")[0];

                const countryLabel = item.address?.country || "";

                return (
                  <div
                    key={item.place_id}
                    onClick={() => handleSelectCity(item)}
                    className="px-4 py-3 hover:bg-white/10 cursor-pointer transition border-b border-white/5 last:border-b-0"
                  >
                    <div className="font-medium">{cityLabel}</div>
                    <div className="text-sm text-gray-400">
                      {countryLabel || item.display_name}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-3 text-gray-400">No results found</div>
            )}
          </div>
        )}
      </div>
      <div className="max-w-2xl mx-auto mt-6 rounded-3xl overflow-hidden border border-white/10">
        <MapContainer
          center={[21.5433, 39.1728]}
          zoom={5}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationPicker onPick={getWeatherByCoords} />
        </MapContainer>
      </div>
      {weather && (
        <div className="max-w-2xl mx-auto mt-10 bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 text-center">
          <h3 className="text-3xl font-bold mb-2">{weather.city}</h3>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="weather icon"
            className="mx-auto mb-2"
          />
          <div className="flex justify-center items-center gap-3 mb-4">
            <span
              className={
                unit === "C" ? "font-bold text-white" : "text-gray-400"
              }
            >
              °C
            </span>

            <button
              onClick={toggleUnit}
              className="w-14 h-8 bg-white/20 rounded-full p-1 flex items-center transition"
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${
                  unit === "F" ? "translate-x-6" : ""
                }`}
              />
            </button>

            <span
              className={
                unit === "F" ? "font-bold text-white" : "text-gray-400"
              }
            >
              °F
            </span>
          </div>
          <p className="text-6xl font-extrabold mb-4">
            {unit === "C"
              ? `${weather.temperature.toFixed(2)}°C`
              : `${((weather.temperature * 9) / 5 + 32).toFixed(2)}°F`}
          </p>

          <p className="text-xl mb-6 capitalize text-gray-200">
            {weather.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="text-2xl mb-2">💧</div>
              <div className="text-gray-300">Humidity</div>
              <div className="font-semibold mt-1">{weather.humidity}%</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <div className="text-2xl mb-2">🌡</div>
              <div className="font-semibold mt-1">
                {unit === "C"
                  ? `${weather.feels_like.toFixed(1)}°C`
                  : `${toFahrenheit(weather.feels_like).toFixed(1)}°F`}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <div className="text-2xl mb-2">💨</div>
              <div className="text-gray-300">Wind Speed</div>
              <div className="font-semibold mt-1">{weather.wind_speed} m/s</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
