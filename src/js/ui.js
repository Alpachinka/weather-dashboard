// src/js/ui.js
import { parseWeatherCode } from './api.js';

let forecastChart = null;

// DOM елементи
const el = {
    body: document.body,
    statusMsg: document.getElementById('status-message'),
    grid: document.getElementById('weather-grid'),
    cityName: document.getElementById('city-name'),
    currentDate: document.getElementById('current-date'),
    currentIcon: document.getElementById('current-icon'),
    currentTemp: document.getElementById('current-temp'),
    weatherDesc: document.getElementById('weather-description'),
    windSpeed: document.getElementById('wind-speed'),
    humidity: document.getElementById('humidity'),
    feelsLike: document.getElementById('feels-like'),
    weeklyContainer: document.getElementById('weekly-container')
};

// Українські назви днів тижня
const daysMap = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"];
const shortDaysMap = ["Нд", "Пн", "Вв", "Ср", "Чт", "Пт", "Сб"];

/**
 * Оновлення головного віджету поточної погоди
 */
export function updateCurrentUI(data, cityNameLocal) {
    const current = data.current;
    if (!current) return;

    // Встановлюємо місто та дату
    el.cityName.textContent = cityNameLocal;
    const nowLocalDate = new Date();
    el.currentDate.textContent = `${daysMap[nowLocalDate.getDay()]}, ${nowLocalDate.toLocaleDateString("uk-UA")}`;

    // Встановлюємо значення
    el.currentTemp.textContent = Math.round(current.temperature_2m);
    el.windSpeed.textContent = `${current.wind_speed_10m} км/год`;
    el.humidity.textContent = `${current.relative_humidity_2m} %`;
    el.feelsLike.textContent = `${Math.round(current.apparent_temperature)} °C`;

    // Іконка та текст погоди
    const wInfo = parseWeatherCode(current.weather_code);
    el.weatherDesc.textContent = wInfo.text;
    el.currentIcon.className = wInfo.icon;
    el.currentIcon.style.color = "white"; // або можна додати індивідуальні кольори іконкам

    // Зміна фону body для вау-ефекту
    el.body.className = wInfo.bg;
}

/**
 * Малює лінійний графік погоди на наступні 24 години
 */
export function renderHourlyChart(hourly) {
    const ctx = document.getElementById('hourly-chart').getContext('2d');
    
    // Беремо найближчі 24 години починаючи з поточної години
    const startIndex = _getCurrentHourIndex(hourly.time);
    const times = hourly.time.slice(startIndex, startIndex + 24).map(t => {
        const d = new Date(t);
        return d.toLocaleTimeString("uk-UA", { hour: '2-digit', minute: '2-digit' });
    });
    const temps = hourly.temperature_2m.slice(startIndex, startIndex + 24);

    if (forecastChart) {
        forecastChart.destroy(); // Очищаємо старий графік
    }

    // Chart.js налаштування
    Chart.defaults.color = 'rgba(255, 255, 255, 0.8)';
    forecastChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Температура (°C)',
                data: temps,
                borderColor: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 2,
                tension: 0.4, // Згладжені лінії
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { display: false, color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { callback: (val) => val + '°' }
                }
            }
        }
    });
}

/**
 * Рендеринг списку карток на 7 днів
 */
export function renderWeeklyForecast(daily) {
    el.weeklyContainer.innerHTML = '';
    
    // daily.time містить дати. Ітеруємо з 1-го індексу (ігноруємо сьогоднішній день) до 7.
    for (let i = 1; i < Math.min(8, daily.time.length); i++) {
        const dateObj = new Date(daily.time[i]);
        const dayStr = shortDaysMap[dateObj.getDay()];
        const wInfo = parseWeatherCode(daily.weather_code[i]);
        
        const card = document.createElement('div');
        card.className = 'daily-card';
        card.innerHTML = `
            <span class="day-name">${dayStr}</span>
            <i class="${wInfo.icon}"></i>
            <div class="temps">
                <span class="max">${Math.round(daily.temperature_2m_max[i])}°</span>
                <span class="min">${Math.round(daily.temperature_2m_min[i])}°</span>
            </div>
        `;
        el.weeklyContainer.appendChild(card);
    }
}

/**
 * Перемикання станів відображення
 */
export function showLoading() {
    el.statusMsg.textContent = "Завантаження погодних даних...";
    el.statusMsg.style.display = "block";
    el.grid.classList.add("hidden");
}

export function showDashboard() {
    el.statusMsg.style.display = "none";
    el.grid.classList.remove("hidden");
}

export function showError(msg) {
    el.statusMsg.textContent = msg;
    el.statusMsg.style.display = "block";
    el.grid.classList.add("hidden");
}

/**
 * Допоміжна функція
 */
function _getCurrentHourIndex(timesArray) {
    const now = new Date();
    // Times array format: "2024-03-24T12:00"
    // Знаходимо першу годину, яка дорівнює або більша за поточну
    const nowISO = now.toISOString().slice(0, 13); // до години
    const index = timesArray.findIndex(t => t.startsWith(nowISO));
    return index !== -1 ? index : 0;
}
