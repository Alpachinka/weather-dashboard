import { parseWeatherCode } from "../api";

const daysMap = [
  "Неділя",
  "Понеділок",
  "Вівторок",
  "Середа",
  "Четвер",
  "П'ятниця",
  "Субота",
];

export default function CurrentWeather({ data, cityName, isFavorite, onToggleFavorite }) {
  if (!data?.current) return null;

  const current = data.current;
  const nowLocalDate = new Date();
  const dateString = `${
    daysMap[nowLocalDate.getDay()]
  }, ${nowLocalDate.toLocaleDateString("uk-UA")}`;

  const wInfo = parseWeatherCode(current.weather_code);

  return (
    <section className="current-weather glass-panel">
      <div className="weather-header" style={{ position: "relative" }}>
        <h1 id="city-name" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          {cityName || "--"}
          {cityName && (
            <i
              className={isFavorite ? "fa-solid fa-star" : "fa-regular fa-star"}
              onClick={onToggleFavorite}
              style={{
                color: isFavorite ? "#fbbf24" : "rgba(255,255,255,0.7)",
                cursor: "pointer",
                fontSize: "1.8rem",
                transition: "color 0.2s"
              }}
              title="Зберегти в улюблені"
            ></i>
          )}
        </h1>
        <p id="current-date">{dateString}</p>
      </div>
      <div className="weather-main">
        <i
          id="current-icon"
          className={wInfo.icon}
          style={{ fontSize: "4rem", color: "white" }}
        ></i>
        <div className="temperature">
          <span id="current-temp">{Math.round(current.temperature_2m)}</span>°C
        </div>
      </div>
      <p id="weather-description" className="weather-desc">
        {wInfo.text}
      </p>

      <div className="weather-details">
        <div className="detail-item">
          <i className="fa-solid fa-wind"></i>
          <div>
            <p className="label">Вітер</p>
            <p id="wind-speed" className="val">
              {current.wind_speed_10m} км/год
            </p>
          </div>
        </div>
        <div className="detail-item">
          <i className="fa-solid fa-droplet"></i>
          <div>
            <p className="label">Вологість</p>
            <p id="humidity" className="val">
              {current.relative_humidity_2m} %
            </p>
          </div>
        </div>
        <div className="detail-item">
          <i className="fa-solid fa-temperature-half"></i>
          <div>
            <p className="label">Відчувається як</p>
            <p id="feels-like" className="val">
              {Math.round(current.apparent_temperature)} °C
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
