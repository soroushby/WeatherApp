import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { ArrowLeft, Star, RefreshCw } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import DailyForecast from '../components/DailyForecast';
import WeatherAlert from '../components/WeatherAlert';
import TemperatureToggle from '../components/TemperatureToggle';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { useWeather } from '../hooks/useWeather';
import { addToSearchHistory, getTempUnit, setTempUnit, setLastCity } from '../utils/localStorage';

// Lazy load heavy components
const HourlyForecast = lazy(() => import('../components/HourlyForecast'));
const AirQuality = lazy(() => import('../components/AirQuality'));

const CityPage = () => {
  const { cityName } = useParams({ from: '/city/$cityName' });
  const navigate = useNavigate();
  const [unit, setUnit] = useState(getTempUnit());

  // Decode city name from URL
  const decodedCity = decodeURIComponent(cityName);

  // Fetch all weather data
  const {
    currentWeather,
    hourlyForecast,
    dailyForecast,
    airQuality,
    alerts,
    isLoading,
    isLoadingCurrent,
    isLoadingHourly,
    isLoadingDaily,
    isLoadingAirQuality,
    error,
    refetch,
  } = useWeather(decodedCity);

  // Add to search history on successful load
  useEffect(() => {
    if (currentWeather) {
      addToSearchHistory(currentWeather.city);
      setLastCity({
        name: currentWeather.city,
        country: currentWeather.country,
        lat: currentWeather.lat,
        lon: currentWeather.lon,
      });
    }
  }, [currentWeather]);

  // Handle search navigation
  const handleSearch = (searchCity) => {
    navigate({ to: '/city/$cityName', params: { cityName: searchCity } });
  };

  // Handle temperature unit toggle
  const handleUnitToggle = (newUnit) => {
    setUnit(newUnit);
    setTempUnit(newUnit);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-md border-b border-dark-600">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Back button */}
            <button
              onClick={() => navigate({ to: '/' })}
              className="p-2 text-gray-400 hover:text-white hover:bg-dark-700
                         rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Search bar */}
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} initialValue={decodedCity} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <TemperatureToggle unit={unit} onToggle={handleUnitToggle} />
              <button
                onClick={refetch}
                className="p-2 text-gray-400 hover:text-white hover:bg-dark-700
                           rounded-lg transition-colors"
                aria-label="Refresh weather"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
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
        {/* Error message */}
        {error && (
          <ErrorMessage error={error} onRetry={refetch} />
        )}

        {/* Weather alerts */}
        {alerts && alerts.length > 0 && (
          <WeatherAlert alerts={alerts} />
        )}

        {/* Current weather */}
        {isLoadingCurrent ? (
          <LoadingSkeleton type="weather" />
        ) : currentWeather && !error ? (
          <CurrentWeather weather={currentWeather} unit={unit} />
        ) : null}

        {/* Hourly forecast - lazy loaded */}
        <Suspense fallback={<LoadingSkeleton type="hourly" />}>
          {isLoadingHourly ? (
            <LoadingSkeleton type="hourly" />
          ) : hourlyForecast && !error ? (
            <HourlyForecast forecast={hourlyForecast} unit={unit} />
          ) : null}
        </Suspense>

        {/* Daily forecast */}
        {isLoadingDaily ? (
          <LoadingSkeleton type="daily" />
        ) : dailyForecast && !error ? (
          <DailyForecast forecast={dailyForecast} unit={unit} />
        ) : null}

        {/* Air quality - lazy loaded */}
        <Suspense fallback={<LoadingSkeleton type="airQuality" />}>
          {isLoadingAirQuality ? (
            <LoadingSkeleton type="airQuality" />
          ) : airQuality && !error ? (
            <AirQuality data={airQuality} />
          ) : null}
        </Suspense>
      </main>
    </div>
  );
};

export default CityPage;
