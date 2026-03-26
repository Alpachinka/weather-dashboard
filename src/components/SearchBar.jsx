import { useState, useEffect, useRef } from "react";
import { searchCities } from "../api";

export default function SearchBar({ onSelectLocation, onRequestGeoLocation }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      const cities = await searchCities(query.trim());
      
      const uniqueCities = [];
      const seen = new Set();
      for (const city of cities) {
        const key = `${city.name}-${city.country}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueCities.push(city);
        }
      }

      setResults(uniqueCities);
      setShowResults(true);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    setQuery(city.name);
    setShowResults(false);
    onSelectLocation(city.latitude, city.longitude, city.name);
  };

  return (
    <header className="header" ref={searchRef}>
      <div className="search-box glass-panel">
        <i className="fa-solid fa-magnifying-glass search-icon"></i>
        <input
          type="text"
          id="search-input"
          placeholder="Пошук міста (наприклад, Київ)..."
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowResults(true);
          }}
        />
        <button
          id="location-btn"
          className="icon-btn"
          title="Моя локація"
          onClick={onRequestGeoLocation}
        >
          <i className="fa-solid fa-location-crosshairs"></i>
        </button>
      </div>

      <ul
        id="search-results"
        className={`search-results glass-panel ${!showResults || results.length === 0 ? "hidden" : ""}`}
      >
        {results.map((city, idx) => (
          <li key={`${city.id || idx}`} onClick={() => handleSelect(city)}>
            {city.name}{city.country ? `, ${city.country}` : ""}
          </li>
        ))}
      </ul>
    </header>
  );
}
