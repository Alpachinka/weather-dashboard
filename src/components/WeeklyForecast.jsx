import { parseWeatherCode } from "../api";

const shortDaysMap = ["Нд", "Пн", "Вв", "Ср", "Чт", "Пт", "Сб"];

export default function WeeklyForecast({ daily }) {
  if (!daily) return null;

  const cards = [];
  for (let i = 1; i < Math.min(8, daily.time.length); i++) {
    const dateObj = new Date(daily.time[i]);
    const dayStr = shortDaysMap[dateObj.getDay()];
    const wInfo = parseWeatherCode(daily.weather_code[i]);

    cards.push(
      <div key={i} className="daily-card">
        <span className="day-name">{dayStr}</span>
        <i className={wInfo.icon}></i>
        <div className="temps">
          <span className="max">{Math.round(daily.temperature_2m_max[i])}°</span>
          <span className="min">{Math.round(daily.temperature_2m_min[i])}°</span>
        </div>
      </div>
    );
  }

  return (
    <section className="weekly-forecast glass-panel">
      <h2>Прогноз на 7 днів</h2>
      <div id="weekly-container" className="weekly-container">
        {cards}
      </div>
    </section>
  );
}
