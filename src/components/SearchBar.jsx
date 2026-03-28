import { useState, useEffect, useRef } from "react";
import { searchCities } from "../api";
import { signInWithGoogle, signOutUser } from "../firebase";

export default function SearchBar({ onSelectLocation, onRequestGeoLocation, unit, onToggleUnit, user }) {
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

      const qLow = query.trim().toLowerCase();
      const exactMatches = uniqueCities.filter(c => c.name.toLowerCase() === qLow);
      const partialMatches = uniqueCities.filter(c => c.name.toLowerCase() !== qLow);

      setResults([...exactMatches, ...partialMatches]);
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
        <button
          className="icon-btn"
          title="Перемкнути °C / °F"
          onClick={onToggleUnit}
          style={{ marginLeft: "10px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", minWidth: "35px" }}
        >
          °{unit}
        </button>

        {/* Auth button */}
        {user ? (
          <button
            className="icon-btn user-btn"
            onClick={signOutUser}
            title={`Вийти (${user.displayName})`}
            style={{ marginLeft: "8px", display: "flex", alignItems: "center", gap: "6px", padding: "0 4px" }}
          >
            <img
              src={user.photoURL}
              alt="avatar"
              style={{ width: "28px", height: "28px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.5)" }}
            />
          </button>
        ) : (
          <button
            className="icon-btn google-signin-small"
            onClick={signInWithGoogle}
            title="Увійти через Google"
            style={{ marginLeft: "8px", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", whiteSpace: "nowrap", padding: "4px 10px", borderRadius: "20px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Увійти
          </button>
        )}
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
