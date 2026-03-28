// Pure logic component - no external dependencies, fast render
export default function WeatherSuggestions({ data, unit }) {
  if (!data?.current || !data?.daily) return null;

  const temp = data.current.temperature_2m;
  const uvIndex = data.daily?.uv_index_max?.[0];
  const precipitation = data.daily?.precipitation_sum?.[0];
  const windSpeed = data.current.wind_speed_10m;
  const weatherCode = data.current.weather_code;

  // Clothing recommendations based on temperature (always in Celsius internally)
  const getOutfit = () => {
    if (temp <= 0)   return { emoji: "🧥", label: "Важка зима", desc: "Пальто, шапка, шарф, рукавички — холод не жартує!" };
    if (temp <= 5)   return { emoji: "🧣", label: "Дуже холодно", desc: "Тепла куртка, светр і шарф обов'язкові." };
    if (temp <= 10)  return { emoji: "🧤", label: "Прохолодно", desc: "Куртка або щільна кофта. Не забудьте про шари." };
    if (temp <= 15)  return { emoji: "🧢", label: "Помірно прохолодно", desc: "Легка куртка або кардиган — саме те." };
    if (temp <= 20)  return { emoji: "👕", label: "Комфортно", desc: "Футболка та джинси або легка кофта." };
    if (temp <= 25)  return { emoji: "☀️", label: "Тепло", desc: "Легкий одяг. Можна в сорочці або футболці." };
    if (temp <= 30)  return { emoji: "🩳", label: "Спекотно", desc: "Шорти та легка відкрита сорочка — найкраще рішення." };
    return           { emoji: "🌡️", label: "Сильна спека", desc: "Максимально легкий одяг, уникайте прямого сонця." };
  };

  // Smart weather tips
  const getTips = () => {
    const tips = [];

    // Rain/storm tips
    if ([51,53,55,61,63,65,80,81,82,95,96,99].includes(weatherCode)) {
      tips.push({ emoji: "☂️", text: "Очікуються опади — візьміть парасолю або дощовик." });
    }
    if ([95,96,99].includes(weatherCode)) {
      tips.push({ emoji: "⚡", text: "Гроза! Уникайте відкритих просторів та водойм." });
    }

    // UV tips
    if (uvIndex >= 8) {
      tips.push({ emoji: "🕶️", text: `УФ-індекс ${Math.round(uvIndex)} — надзвичайно висока активність. Сонцезахисний крем SPF 50+ обов'язковий.` });
    } else if (uvIndex >= 6) {
      tips.push({ emoji: "🧴", text: `УФ-індекс ${Math.round(uvIndex)} — висока активність. Рекомендується сонцезахисний крем.` });
    } else if (uvIndex >= 3) {
      tips.push({ emoji: "😎", text: `УФ-індекс ${Math.round(uvIndex)} — помірний рівень УФ. Сонцезахисні окуляри будуть корисні.` });
    }

    // Wind tips
    if (windSpeed >= 50) {
      tips.push({ emoji: "💨", text: "Сильний вітер! Уникайте парасоль, тримайтесь міцніше на висоті." });
    } else if (windSpeed >= 30) {
      tips.push({ emoji: "🌬️", text: "Помітний вітер — легкі предмети можуть відлетіти. Одягніть вітрозахисну куртку." });
    }

    // Snow tips
    if ([71,73,75,85,86].includes(weatherCode)) {
      tips.push({ emoji: "🥾", text: "Очікується сніг — взуйте нековзке взуття, будьте обережні на дорогах." });
    }

    // Fog tips
    if ([45,48].includes(weatherCode)) {
      tips.push({ emoji: "🚗", text: "Туман знижує видимість. При водінні увімкніть протитуманні вогні." });
    }

    // Perfect weather tip
    if (tips.length === 0 && temp >= 15 && temp <= 25) {
      tips.push({ emoji: "🌿", text: "Чудова погода для прогулянки або пікніка на свіжому повітрі!" });
      tips.push({ emoji: "🚴", text: "Ідеальний день для велосипедної прогулянки або заняття спортом на вулиці." });
    }

    if (tips.length === 0) {
      tips.push({ emoji: "✅", text: "Погода в межах норми. Одягайтесь відповідно до температури і все буде добре." });
    }

    return tips;
  };

  const outfit = getOutfit();
  const tips = getTips();

  return (
    <section className="glass-panel suggestions-panel fade-in">
      <h2>Рекомендації на сьогодні</h2>
      <div className="suggestions-grid">
        {/* Outfit card */}
        <div className="suggestion-card outfit-card">
          <div className="suggestion-icon">{outfit.emoji}</div>
          <div>
            <h3 className="suggestion-title">{outfit.label}</h3>
            <p className="suggestion-desc">{outfit.desc}</p>
          </div>
        </div>

        {/* Tips */}
        {tips.map((tip, i) => (
          <div key={i} className="suggestion-card tip-card">
            <div className="suggestion-icon">{tip.emoji}</div>
            <p className="suggestion-desc">{tip.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
