import { useState, useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { ArrowLeft, Star, Trash2, Plus } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import TemperatureToggle from '../components/TemperatureToggle';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useWeather } from '../hooks/useWeather';
import { getFavorites, removeFavorite, getTempUnit, setTempUnit } from '../utils/localStorage';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState(getTempUnit());

  // Load favorites on mount
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  // Handle search navigation
  const handleSearch = (searchCity) => {
    navigate({ to: '/city/$cityName', params: { cityName: searchCity } });
  };

  // Handle remove favorite
  const handleRemove = (cityName) => {
    removeFavorite(cityName);
    setFavorites(getFavorites());
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

            {/* Title */}
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Favorites
            </h1>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Actions */}
            <TemperatureToggle unit={unit} onToggle={handleUnitToggle} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search bar for adding new favorites */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Favorites count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400">
            {favorites.length} of 10 favorites
          </p>
          {favorites.length < 10 && (
            <p className="text-sm text-gray-500">
              Search and add cities to favorites
            </p>
          )}
        </div>

        {/* Empty state */}
        {favorites.length === 0 && (
          <div className="text-center py-12 space-y-4 animate-fade-in">
            <div className="inline-flex p-6 rounded-full bg-dark-700">
              <Star className="w-12 h-12 text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              No favorites yet
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Search for cities and tap the star icon to add them to your favorites for quick access.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500
                         hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add your first favorite
            </Link>
          </div>
        )}

        {/* Favorites grid */}
        {favorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((fav) => (
              <FavoriteItem
                key={fav.name}
                city={fav}
                unit={unit}
                onRemove={() => handleRemove(fav.name)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Favorite item with weather data and remove button
const FavoriteItem = ({ city, unit, onRemove }) => {
  const navigate = useNavigate();
  const { currentWeather, isLoadingCurrent, currentError } = useWeather(city.name);

  // Error state
  if (currentError) {
    return (
      <div className="glass-card p-4 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{city.name}</h3>
            <p className="text-sm text-gray-400">{city.country}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-2 text-gray-500 hover:text-red-400 hover:bg-dark-600
                       rounded-lg transition-colors"
            aria-label={`Remove ${city.name} from favorites`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Unable to load weather</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <WeatherCard
        weather={currentWeather}
        unit={unit}
        isLoading={isLoadingCurrent}
        showFavorite={false}
        onClick={() => navigate({ to: '/city/$cityName', params: { cityName: city.name } })}
      />

      {/* Remove button overlay */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 p-2 bg-dark-800/80 text-gray-400
                   hover:text-red-400 hover:bg-dark-700 rounded-lg
                   opacity-0 group-hover:opacity-100 transition-all duration-200"
        aria-label={`Remove ${city.name} from favorites`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default FavoritesPage;
