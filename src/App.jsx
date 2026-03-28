import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import WeeklyForecast from "./components/WeeklyForecast";
import { getWeather, parseWeatherCode } from "./api";

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C");

  // Favorites State
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("weather-favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("weather-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (locationPayload) => {
    if (!locationPayload) return;
    const isFav = favorites.find((f) => f.name === locationPayload.name);
    if (isFav) {
      setFavorites(favorites.filter((f) => f.name !== locationPayload.name));
    } else {
      setFavorites([...favorites, locationPayload]);
    }
  };

  const loadWeather = async (lat, lon, name) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeather(lat, lon);
      setWeatherData(data);
      setCurrentLocation({ lat, lon, name });

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

  const isCurrentFavorite = currentLocation
    ? favorites.some((f) => f.name === currentLocation.name)
    : false;

  return (
    <div id="app-container" className="glass-panel main-container fade-in" style={{ position: "relative" }}>
      <header className="header" style={{ width: "100%", zIndex: 100 }}>
        <SearchBar
          onSelectLocation={loadWeather}
          onRequestGeoLocation={() => getUserLocation()}
          unit={unit}
          onToggleUnit={() => setUnit(unit === "C" ? "F" : "C")}
        />

        {favorites.length > 0 && (
          <div className="favorites-container">
            {favorites.map((fav, idx) => (
              <button
                key={idx}
                className="favorite-badge"
                onClick={() => loadWeather(fav.lat, fav.lon, fav.name)}
              >
                ★ {fav.name}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="dashboard" id="dashboard-content">
        {loading && (
          <div className="loader-container glass-panel fade-in">
            <div className="spinner"></div>
            <h3 style={{ fontWeight: 500 }}>Оновлюємо погоду...</h3>
          </div>
        )}

        {error && !loading && (
          <div id="status-message" className="status-message" style={{ display: "block" }}>
            {error}
          </div>
        )}

        {!loading && !error && weatherData && currentLocation && (
          <div className="weather-grid" id="weather-grid">
            <CurrentWeather
              data={weatherData}
              cityName={currentLocation.name}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={() => toggleFavorite(currentLocation)}
              unit={unit}
            />
            <HourlyForecast hourly={weatherData.hourly} unit={unit} />
            <WeeklyForecast daily={weatherData.daily} unit={unit} />
          </div>
        )}
      </main>
    </div>
  );
}
