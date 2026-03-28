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

export default function CurrentWeather({ data, cityName, isFavorite, onToggleFavorite, unit, user }) {
  if (!data?.current) return null;

  const current = data.current;
  const nowLocalDate = new Date();
  const dateString = `${
    daysMap[nowLocalDate.getDay()]
  }, ${nowLocalDate.toLocaleDateString("uk-UA")}`;

  const wInfo = parseWeatherCode(current.weather_code);

  const displayTemp = unit === "F" ? Math.round(current.temperature_2m * 9/5 + 32) : Math.round(current.temperature_2m);
  const displayFeels = unit === "F" ? Math.round(current.apparent_temperature * 9/5 + 32) : Math.round(current.apparent_temperature);

  const formatTime = (isoStr) => {
    if (!isoStr) return "--";
    const d = new Date(isoStr);
    return d.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
  };

  const sunrise = data.daily?.sunrise?.[0];
  const sunset = data.daily?.sunset?.[0];

  return (
    <section className="current-weather glass-panel">
      <div className="weather-header" style={{ position: "relative" }}>
        <h1 id="city-name" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          {cityName || "--"}
          {cityName && user && (
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
          <span id="current-temp">{displayTemp}</span>°{unit}
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
          <i className="fa-solid fa-gauge-high"></i>
          <div>
            <p className="label">Тиск повітря</p>
            <p id="pressure" className="val">
              {current.surface_pressure ? Math.round(current.surface_pressure) : "--"} гПа
            </p>
          </div>
        </div>
        <div className="detail-item">
          <i className="fa-solid fa-temperature-half"></i>
          <div>
            <p className="label">Відчувається як</p>
            <p id="feels-like" className="val">
              {displayFeels} °{unit}
            </p>
          </div>
        </div>
        <div className="detail-item">
          <i className="fa-solid fa-sun"></i>
          <div>
            <p className="label">УФ-індекс (Макс)</p>
            <p id="uv-index" className="val">
              {data.daily?.uv_index_max ? Math.round(data.daily.uv_index_max[0]) : "--"}
            </p>
          </div>
        </div>
        <div className="detail-item">
          <i className="fa-solid fa-arrow-up" style={{color: "#fbbf24"}}></i>
          <div>
            <p className="label">Схід сонця</p>
            <p className="val">{formatTime(sunrise)}</p>
          </div>
        </div>
        <div className="detail-item">
          <i className="fa-solid fa-arrow-down" style={{color: "#a78bfa"}}></i>
          <div>
            <p className="label">Захід сонця</p>
            <p className="val">{formatTime(sunset)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
