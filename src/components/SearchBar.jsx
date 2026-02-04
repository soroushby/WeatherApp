import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, X, Loader2, Clock, MapPin } from 'lucide-react';
import { searchCities } from '../utils/weatherApi';
import { getSearchHistory, addToSearchHistory, removeFromSearchHistory } from '../utils/localStorage';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // Load search history on mount
  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  // Debounced search for city suggestions
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
      } catch (err) {
        console.error('Search error:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle city selection
  const handleSelectCity = (cityName) => {
    setQuery(cityName);
    setSuggestions([]);
    setIsFocused(false);
    addToSearchHistory(cityName);
    setHistory(getSearchHistory());

    if (onSearch) {
      onSearch(cityName);
    } else {
      navigate({ to: '/city/$cityName', params: { cityName } });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSelectCity(query.trim());
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const items = suggestions.length > 0 ? suggestions : history;
    const maxIndex = items.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          const selected = suggestions.length > 0
            ? items[selectedIndex].name
            : items[selectedIndex];
          handleSelectCity(selected);
        } else if (query.trim()) {
          handleSelectCity(query.trim());
        }
        break;
      case 'Escape':
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Clear input
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Remove item from history
  const handleRemoveHistory = (e, item) => {
    e.stopPropagation();
    removeFromSearchHistory(item);
    setHistory(getSearchHistory());
  };

  // Show dropdown content
  const showDropdown = isFocused && (suggestions.length > 0 || (history.length > 0 && query.length === 0));

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          {/* Search icon */}
          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 animate-spin" />
            ) : (
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            )}
          </div>

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search city..."
            className="w-full h-10 sm:h-14 pl-9 sm:pl-12 pr-9 sm:pr-12 bg-dark-700/80 backdrop-blur-sm
                       border border-dark-500 rounded-lg sm:rounded-xl text-white text-sm sm:text-base
                       placeholder:text-gray-500 focus:outline-none
                       focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                       transition-all duration-200"
            aria-label="Search for a city"
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1
                         text-gray-400 hover:text-white active:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown for suggestions and history */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 sm:mt-2 py-1 sm:py-2 bg-dark-700
                     border border-dark-500 rounded-lg sm:rounded-xl shadow-xl z-50
                     max-h-64 sm:max-h-80 overflow-y-auto animate-fade-in"
          role="listbox"
        >
          {/* Search suggestions */}
          {suggestions.length > 0 && (
            <>
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium text-gray-500 uppercase">
                Suggestions
              </div>
              {suggestions.map((city, index) => (
                <button
                  key={`${city.name}-${city.lat}-${city.lon}`}
                  onClick={() => handleSelectCity(city.name)}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 text-left
                              transition-colors ${
                                selectedIndex === index
                                  ? 'bg-primary-500/20 text-white'
                                  : 'text-gray-300 hover:bg-dark-600 active:bg-dark-600'
                              }`}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">{city.name}</span>
                    <span className="text-gray-500 text-sm">
                      {city.state ? `, ${city.state}` : ''}, {city.country}
                    </span>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Search history (only when no query) */}
          {query.length === 0 && history.length > 0 && (
            <>
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium text-gray-500 uppercase">
                Recent Searches
              </div>
              {history.map((item, index) => (
                <div
                  key={item}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3
                              transition-colors ${
                                selectedIndex === index
                                  ? 'bg-primary-500/20'
                                  : 'hover:bg-dark-600 active:bg-dark-600'
                              }`}
                >
                  <button
                    onClick={() => handleSelectCity(item)}
                    className="flex items-center gap-2 sm:gap-3 flex-1 text-left text-gray-300 min-w-0"
                    role="option"
                    aria-selected={selectedIndex === index}
                  >
                    <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{item}</span>
                  </button>
                  <button
                    onClick={(e) => handleRemoveHistory(e, item)}
                    className="p-1.5 text-gray-500 hover:text-white active:text-white transition-colors flex-shrink-0"
                    aria-label={`Remove ${item} from history`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
