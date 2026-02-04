import { useState, useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { MapPin, Star, RefreshCw } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import WeatherCard from '../components/WeatherCard';
import TemperatureToggle from '../components/TemperatureToggle';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { useWeather } from '../hooks/useWeather';
import { getCurrentPosition, isGeolocationSupported } from '../utils/geolocation';
import { getFavorites, getLastCity, setLastCity, getTempUnit, setTempUnit } from '../utils/localStorage';

const HomePage = () => {
  const navigate = useNavigate();
  const [coords, setCoords] = useState(null);
  const [city, setCity] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState(getTempUnit());

  // Fetch weather using custom hook
  const {
    currentWeather,
    isLoadingCurrent,
    currentError,
    refetch,
  } = useWeather(city, coords);

  // Load favorites on mount
  useEffect(() => {
    setFavorites(getFavorites().slice(0, 3)); // Show first 3 favorites
  }, []);

  // Get user location on mount
  useEffect(() => {
    const initLocation = async () => {
      // Check for last city first
      const lastCity = getLastCity();

      if (!isGeolocationSupported()) {
        setLocationError('Geolocation not supported');
        setIsLocating(false);
        if (lastCity) {
          setCity(lastCity.name);
        }
        return;
      }

      try {
        const position = await getCurrentPosition();
        setCoords(position);
        setLocationError(null);
      } catch (err) {
        setLocationError(err.message);
        // Fall back to last city if available
        if (lastCity) {
          setCity(lastCity.name);
        }
      } finally {
        setIsLocating(false);
      }
    };

    initLocation();
  }, []);

  // Save last city when weather is loaded
  useEffect(() => {
    if (currentWeather) {
      setLastCity({
        name: currentWeather.city,
        country: currentWeather.country,
        lat: currentWeather.lat,
        lon: currentWeather.lon,
      });
    }
  }, [currentWeather]);

  // Handle search
  const handleSearch = (searchCity) => {
    navigate({ to: '/city/$cityName', params: { cityName: searchCity } });
  };

  // Handle temperature unit toggle
  const handleUnitToggle = (newUnit) => {
    setUnit(newUnit);
    setTempUnit(newUnit);
  };

  // Retry location
  const handleRetryLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const position = await getCurrentPosition();
      setCoords(position);
      setCity(null);
    } catch (err) {
      setLocationError(err.message);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-md border-b border-dark-600">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold text-white hidden sm:inline">
                WeatherNow
              </span>
            </Link>

            {/* Search bar */}
            <div className="flex-1 max-w-xl">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <TemperatureToggle unit={unit} onToggle={handleUnitToggle} />
              <Link
                to="/favorites"
                className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label="Favorites"
              >
                <Star className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Location status */}
        {isLocating && (
          <div className="flex items-center justify-center gap-3 py-8">
            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400">Getting your location...</span>
          </div>
        )}

        {/* Location error with retry */}
        {locationError && !currentWeather && !isLoadingCurrent && (
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex p-4 rounded-full bg-dark-700">
              <MapPin className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400 max-w-md mx-auto">{locationError}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleRetryLocation}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500
                           hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
            <p className="text-gray-500 text-sm">
              Or search for a city using the search bar above
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoadingCurrent && !isLocating && (
          <LoadingSkeleton type="weather" />
        )}

        {/* Error message */}
        {currentError && (
          <ErrorMessage error={currentError} onRetry={refetch} />
        )}

        {/* Current weather */}
        {currentWeather && !currentError && (
          <CurrentWeather weather={currentWeather} unit={unit} />
        )}

        {/* Quick favorites section */}
        {favorites.length > 0 && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Quick Access
              </h2>
              <Link
                to="/favorites"
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {favorites.map((fav) => (
                <QuickFavoriteCard
                  key={fav.name}
                  city={fav}
                  unit={unit}
                />
              ))}
            </div>
          </div>
        )}

        {/* Welcome message when no location and no error */}
        {!currentWeather && !isLoadingCurrent && !currentError && !locationError && !isLocating && (
          <div className="text-center py-12 space-y-4">
            <div className="inline-flex p-6 rounded-full bg-dark-700">
              <MapPin className="w-12 h-12 text-primary-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white">
              Welcome to WeatherNow
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Search for a city to get started, or enable location access for local weather.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

// Quick favorite card with weather data
const QuickFavoriteCard = ({ city, unit }) => {
  const navigate = useNavigate();
  const { currentWeather, isLoadingCurrent } = useWeather(city.name);

  return (
    <WeatherCard
      weather={currentWeather}
      unit={unit}
      isLoading={isLoadingCurrent}
      showFavorite={false}
      onClick={() => navigate({ to: '/city/$cityName', params: { cityName: city.name } })}
    />
  );
};

export default HomePage;
