import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import WeeklyForecast from "./components/WeeklyForecast";
import { getWeather, parseWeatherCode } from "./api";

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeather = async (lat, lon, name) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeather(lat, lon);
      setWeatherData(data);
      setCityName(name);

      // Change background
      const wInfo = parseWeatherCode(data.current.weather_code);
      document.body.className = wInfo.bg;
    } catch (err) {
      setError("Не вдалося завантажити дані про погоду.");
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = (fallbackLat, fallbackLon, fallbackName) => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await loadWeather(
            position.coords.latitude,
            position.coords.longitude,
            "Ваша локація"
          );
        },
        async (err) => {
          console.warn("Похибка гео: ", err.message);
          if (fallbackLat) {
            await loadWeather(fallbackLat, fallbackLon, fallbackName);
          } else {
            setError("Не вдалося визначити координати. Використовуйте пошук.");
            setLoading(false);
          }
        }
      );
    } else {
      setError("Ваш браузер не підтримує геолокацію");
      setLoading(false);
    }
  };

  // On mount
  useEffect(() => {
    getUserLocation(50.4501, 30.5234, "Київ");
  }, []);

  return (
    <div id="app-container" className="glass-panel main-container fade-in">
      <SearchBar onSelectLocation={loadWeather} onRequestGeoLocation={() => getUserLocation()} />

      <main className="dashboard" id="dashboard-content">
        {loading && (
          <div id="status-message" className="status-message" style={{ display: "block" }}>
            Завантаження погодних даних...
          </div>
        )}

        {error && !loading && (
          <div id="status-message" className="status-message" style={{ display: "block" }}>
            {error}
          </div>
        )}

        {!loading && !error && weatherData && (
          <div className="weather-grid" id="weather-grid">
            <CurrentWeather data={weatherData} cityName={cityName} />
            <HourlyForecast hourly={weatherData.hourly} />
            <WeeklyForecast daily={weatherData.daily} />
          </div>
        )}
      </main>
    </div>
  );
}
