// src/js/api.js

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const GEO_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

/**
 * Отримує координати та дані міста за його назвою (автодоповнення)
 * @param {string} query 
 */
export async function searchCities(query) {
    if (!query || query.length < 2) return [];

    try {
        const response = await fetch(`${GEO_API_URL}?name=${encodeURIComponent(query)}&count=5&language=uk&format=json`);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Помилка пошуку міста:", error);
        return [];
    }
}

/**
 * Отримує погоду за координатами
 * Включає поточну погоду, погодинний та щоденний прогноз
 * @param {number} lat 
 * @param {number} lon 
 */
export async function getWeather(lat, lon) {
    try {
        // Запитуємо всі необхідні дані одним викликом
        const url = `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&past_days=0`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("Помилка завантаження даних погоди");
        
        return await response.json();
    } catch (error) {
        console.error("Помилка API погоди:", error);
        throw error;
    }
}

/**
 * Розшифровує код погоди (WMO Weather interpretation codes) 
 * у зрозумілі тексти та іконки (відповідно до Font Awesome).
 * Можна розширювати для більшої деталізації.
 */
export function parseWeatherCode(code) {
    const codes = {
        0: { text: "Ясно", icon: "fa-solid fa-sun", bg: "weather-clear" },
        1: { text: "Переважно ясно", icon: "fa-solid fa-cloud-sun", bg: "weather-clear" },
        2: { text: "Мінлива хмарність", icon: "fa-solid fa-cloud-sun", bg: "weather-clouds" },
        3: { text: "Хмарно", icon: "fa-solid fa-cloud", bg: "weather-clouds" },
        45: { text: "Туман", icon: "fa-solid fa-smog", bg: "weather-clouds" },
        48: { text: "Імла", icon: "fa-solid fa-smog", bg: "weather-clouds" },
        51: { text: "Слабкий мряка", icon: "fa-solid fa-cloud-rain", bg: "weather-rain" },
        53: { text: "Мряка", icon: "fa-solid fa-cloud-rain", bg: "weather-rain" },
        55: { text: "Сильна мряка", icon: "fa-solid fa-cloud-showers-heavy", bg: "weather-rain" },
        61: { text: "Слабкий дощ", icon: "fa-solid fa-cloud-rain", bg: "weather-rain" },
        63: { text: "Помірний дощ", icon: "fa-solid fa-cloud-showers-heavy", bg: "weather-rain" },
        65: { text: "Сильний дощ", icon: "fa-solid fa-cloud-showers-heavy", bg: "weather-rain" },
        71: { text: "Слабкий сніг", icon: "fa-regular fa-snowflake", bg: "weather-snow" },
        73: { text: "Помірний сніг", icon: "fa-regular fa-snowflake", bg: "weather-snow" },
        75: { text: "Сильний сніг", icon: "fa-solid fa-snowflake", bg: "weather-snow" },
        80: { text: "Слабкі зливи", icon: "fa-solid fa-cloud-rain", bg: "weather-rain" },
        81: { text: "Помірні зливи", icon: "fa-solid fa-cloud-showers-heavy", bg: "weather-rain" },
        82: { text: "Сильні зливи", icon: "fa-solid fa-cloud-showers-heavy", bg: "weather-rain" },
        95: { text: "Гроза", icon: "fa-solid fa-cloud-bolt", bg: "weather-rain" },
        96: { text: "Гроза з градом", icon: "fa-solid fa-cloud-bolt", bg: "weather-rain" },
        99: { text: "Сильна гроза з градом", icon: "fa-solid fa-cloud-bolt", bg: "weather-rain" },
    };

    return codes[code] || { text: "Невідомо", icon: "fa-solid fa-circle-question", bg: "weather-default" };
}
