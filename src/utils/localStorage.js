// localStorage keys
const FAVORITES_KEY = 'weathernow_favorites';
const SEARCH_HISTORY_KEY = 'weathernow_search_history';
const TEMP_UNIT_KEY = 'weathernow_temp_unit';
const LAST_CITY_KEY = 'weathernow_last_city';

// Maximum number of favorites
const MAX_FAVORITES = 10;

// Maximum search history items
const MAX_SEARCH_HISTORY = 5;

/**
 * Safely parse JSON from localStorage
 */
const safeJSONParse = (str, fallback = null) => {
  try {
    return JSON.parse(str) || fallback;
  } catch {
    return fallback;
  }
};

/**
 * Get all favorite cities
 * @returns {Array} Array of favorite city objects
 */
export const getFavorites = () => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return safeJSONParse(favorites, []);
};

/**
 * Check if a city is in favorites
 * @param {string} cityName - City name to check
 * @returns {boolean}
 */
export const isFavorite = (cityName) => {
  const favorites = getFavorites();
  return favorites.some(
    (fav) => fav.name.toLowerCase() === cityName.toLowerCase()
  );
};

/**
 * Save a city to favorites
 * @param {Object} city - City object { name, country, lat, lon }
 * @returns {boolean} True if saved, false if limit reached
 */
export const saveFavorite = (city) => {
  const favorites = getFavorites();

  // Check if already in favorites
  if (isFavorite(city.name)) {
    return true;
  }

  // Check if limit reached
  if (favorites.length >= MAX_FAVORITES) {
    return false;
  }

  // Add to favorites with timestamp
  const newFavorite = {
    name: city.name,
    country: city.country || '',
    lat: city.lat,
    lon: city.lon,
    addedAt: Date.now(),
  };

  favorites.push(newFavorite);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return true;
};

/**
 * Remove a city from favorites
 * @param {string} cityName - City name to remove
 */
export const removeFavorite = (cityName) => {
  const favorites = getFavorites();
  const filtered = favorites.filter(
    (fav) => fav.name.toLowerCase() !== cityName.toLowerCase()
  );
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
};

/**
 * Toggle favorite status of a city
 * @param {Object} city - City object
 * @returns {Object} { isFavorite: boolean, success: boolean }
 */
export const toggleFavorite = (city) => {
  if (isFavorite(city.name)) {
    removeFavorite(city.name);
    return { isFavorite: false, success: true };
  }

  const success = saveFavorite(city);
  return { isFavorite: success, success };
};

/**
 * Get search history
 * @returns {Array} Array of recent search strings
 */
export const getSearchHistory = () => {
  const history = localStorage.getItem(SEARCH_HISTORY_KEY);
  return safeJSONParse(history, []);
};

/**
 * Add a city to search history
 * @param {string} cityName - City name to add
 */
export const addToSearchHistory = (cityName) => {
  if (!cityName || typeof cityName !== 'string') return;

  const history = getSearchHistory();

  // Remove if already exists (to move to front)
  const filtered = history.filter(
    (item) => item.toLowerCase() !== cityName.toLowerCase()
  );

  // Add to front of array
  filtered.unshift(cityName);

  // Keep only last MAX_SEARCH_HISTORY items
  const trimmed = filtered.slice(0, MAX_SEARCH_HISTORY);

  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(trimmed));
};

/**
 * Clear search history
 */
export const clearSearchHistory = () => {
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify([]));
};

/**
 * Remove single item from search history
 * @param {string} cityName - City name to remove
 */
export const removeFromSearchHistory = (cityName) => {
  const history = getSearchHistory();
  const filtered = history.filter(
    (item) => item.toLowerCase() !== cityName.toLowerCase()
  );
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered));
};

/**
 * Get temperature unit preference
 * @returns {string} 'C' or 'F'
 */
export const getTempUnit = () => {
  return localStorage.getItem(TEMP_UNIT_KEY) || 'C';
};

/**
 * Set temperature unit preference
 * @param {string} unit - 'C' or 'F'
 */
export const setTempUnit = (unit) => {
  if (unit === 'C' || unit === 'F') {
    localStorage.setItem(TEMP_UNIT_KEY, unit);
  }
};

/**
 * Toggle temperature unit
 * @returns {string} New unit
 */
export const toggleTempUnit = () => {
  const current = getTempUnit();
  const newUnit = current === 'C' ? 'F' : 'C';
  setTempUnit(newUnit);
  return newUnit;
};

/**
 * Get last searched/viewed city
 * @returns {Object|null} City object or null
 */
export const getLastCity = () => {
  const city = localStorage.getItem(LAST_CITY_KEY);
  return safeJSONParse(city, null);
};

/**
 * Save last searched/viewed city
 * @param {Object} city - City object { name, country, lat, lon }
 */
export const setLastCity = (city) => {
  if (city && city.name) {
    localStorage.setItem(LAST_CITY_KEY, JSON.stringify({
      name: city.name,
      country: city.country || '',
      lat: city.lat,
      lon: city.lon,
    }));
  }
};

/**
 * Clear all WeatherNow data from localStorage
 */
export const clearAllData = () => {
  localStorage.removeItem(FAVORITES_KEY);
  localStorage.removeItem(SEARCH_HISTORY_KEY);
  localStorage.removeItem(TEMP_UNIT_KEY);
  localStorage.removeItem(LAST_CITY_KEY);
};
