// src/js/app.js
import { searchCities, getWeather } from './api.js';
import * as ui from './ui.js';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const locationBtn = document.getElementById('location-btn');

let debounceTimeout;

// Завантаження локації користувача при старті
window.addEventListener('DOMContentLoaded', () => {
    // Встановлюємо Київ за замовчуванням або беремо локацію користувача, якщо він дасть дозвіл
    getUserLocation(50.4501, 30.5234, "Київ"); 
});

/**
 * Отримує геолокацію користувача, або рендерить дефолтне місце
 */
locationBtn.addEventListener('click', () => {
    getUserLocation();
});

function getUserLocation(fallbackLat, fallbackLon, fallbackName) {
    if (navigator.geolocation) {
        ui.showLoading();
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                await loadWeatherForCoordinates(
                    position.coords.latitude, 
                    position.coords.longitude, 
                    "Ваша локація"
                );
            },
            async (error) => {
                console.warn("Похибка гео: ", error.message);
                if (fallbackLat) { // Якщо відхилили, грузимо Київ
                    await loadWeatherForCoordinates(fallbackLat, fallbackLon, fallbackName);
                } else {
                    ui.showError("Не вдалося визначити координати. Використовуйте пошук.");
                }
            }
        );
    } else {
        ui.showError("Ваш браузер не підтримує геолокацію");
    }
}

/**
 * Основна функція для завантаження всього за координатами
 */
async function loadWeatherForCoordinates(lat, lon, cityNameLocal) {
    ui.showLoading();
    try {
        const data = await getWeather(lat, lon);
        
        // Рендеримо компоненти по черзі
        ui.updateCurrentUI(data, cityNameLocal);
        ui.renderHourlyChart(data.hourly);
        ui.renderWeeklyForecast(data.daily);

        ui.showDashboard();
    } catch (error) {
        ui.showError("Не вдалося завантажити дані про погоду.");
    }
}

/**
 * Логіка автодоповнення
 */
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    // Ховаємо список якщо порожньо
    if (!query) {
        searchResults.classList.add('hidden');
        return;
    }

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
        const cities = await searchCities(query);
        renderSearchResults(cities);
    }, 500); // Debounce на 500мс
});

function renderSearchResults(cities) {
    searchResults.innerHTML = '';
    
    if (cities.length === 0) {
        searchResults.classList.add('hidden');
        return;
    }

    // Створюємо елементи списку
    cities.forEach(city => {
        const li = document.createElement('li');
        const country = city.country ? `, ${city.country}` : '';
        li.textContent = `${city.name}${country}`;
        
        // При кліку завантажуємо погоду для цього міста
        li.addEventListener('click', () => {
            searchInput.value = city.name;
            searchResults.classList.add('hidden');
            loadWeatherForCoordinates(city.latitude, city.longitude, city.name);
        });
        
        searchResults.appendChild(li);
    });

    searchResults.classList.remove('hidden');
}

/**
 * Ховаємо результати при кліку в іншому місці
 */
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.add('hidden');
    }
});
