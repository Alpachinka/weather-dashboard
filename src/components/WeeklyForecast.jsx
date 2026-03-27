import { useState } from "react";
import { parseWeatherCode } from "../api";

const shortDaysMap = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export default function WeeklyForecast({ daily, unit }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!daily) return null;

  const cards = [];
  for (let i = 1; i < Math.min(8, daily.time.length); i++) {
    const dateObj = new Date(daily.time[i]);
    const dayStr = shortDaysMap[dateObj.getDay()];
    // format date as DD.MM
    const dateStr = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
    const wInfo = parseWeatherCode(daily.weather_code[i]);
    
    const isExpanded = expandedIndex === i;

    cards.push(
      <div 
        key={i} 
        className={`daily-card ${isExpanded ? 'expanded' : ''}`} 
        onClick={() => setExpandedIndex(isExpanded ? null : i)}
        style={{ cursor: "pointer", minWidth: isExpanded ? "160px" : "90px" }}
        title="Натисніть для деталей"
      >
        <div style={{ display: 'flex', gap: '5px', alignItems: 'baseline' }}>
          <span className="day-name">{dayStr}</span>
          <span style={{ fontSize: '0.85rem', color: "rgba(255,255,255,0.7)" }}>{dateStr}</span>
        </div>
        
        <i className={wInfo.icon} style={{ fontSize: isExpanded ? "2.5rem" : "2rem", transition: "0.2s" }}></i>
        
        <div className="temps">
          <span className="max">{Math.round(unit === 'F' ? daily.temperature_2m_max[i] * 9/5 + 32 : daily.temperature_2m_max[i])}°</span>
          <span className="min">{Math.round(unit === 'F' ? daily.temperature_2m_min[i] * 9/5 + 32 : daily.temperature_2m_min[i])}°</span>
        </div>

        {isExpanded && (
          <div className="daily-details fade-in" style={{ marginTop: "12px", fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", textAlign: "center", display: "flex", flexDirection: "column", gap: "6px" }}>
            <p style={{ fontWeight: "600", color: "#fff", marginBottom: "4px" }}>{wInfo.text}</p>
            {daily.wind_speed_10m_max !== undefined && (
              <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                <i className="fa-solid fa-wind" style={{fontSize:"0.9rem"}}></i> 
                {Math.round(daily.wind_speed_10m_max[i])} км/год
              </p>
            )}
            {daily.precipitation_sum !== undefined && (
              <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                <i className="fa-solid fa-droplet" style={{fontSize:"0.9rem"}}></i> 
                {daily.precipitation_sum[i]} мм
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="weekly-forecast glass-panel">
      <h2>Прогноз на 7 днів</h2>
      <div id="weekly-container" className="weekly-container" style={{ alignItems: "flex-start" }}>
        {cards}
      </div>
    </section>
  );
}
