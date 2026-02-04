import { useNavigate } from '@tanstack/react-router';
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Wind,
  Droplets,
} from 'lucide-react';
import { formatTemp, getWeatherAccent } from '../utils/weatherApi';
import FavoriteButton from './FavoriteButton';
import LoadingSkeleton from './LoadingSkeleton';

// Map weather icon codes to Lucide icons
const getWeatherIcon = (iconCode) => {
  if (!iconCode) return Cloud;

  const iconMap = {
    '01d': Sun,
    '01n': Moon,
    '02d': Cloud,
    '02n': Cloud,
    '03d': Cloud,
    '03n': Cloud,
    '04d': Cloud,
    '04n': Cloud,
    '09d': CloudDrizzle,
    '09n': CloudDrizzle,
    '10d': CloudRain,
    '10n': CloudRain,
    '11d': CloudLightning,
    '11n': CloudLightning,
    '13d': CloudSnow,
    '13n': CloudSnow,
    '50d': Wind,
    '50n': Wind,
  };

  return iconMap[iconCode] || Cloud;
};

// Get icon color class based on weather type
const getIconColor = (iconCode) => {
  const accent = getWeatherAccent(iconCode);
  const colors = {
    sunny: 'text-weather-sunny',
    rainy: 'text-weather-rainy',
    cloudy: 'text-weather-cloudy',
    snowy: 'text-weather-snowy',
    stormy: 'text-primary-400',
    primary: 'text-primary-400',
  };
  return colors[accent] || colors.primary;
};

const WeatherCard = ({
  weather,
  unit = 'C',
  showFavorite = true,
  isLoading = false,
  onClick,
  className = '',
}) => {
  const navigate = useNavigate();

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton type="card" />;
  }

  // No weather data
  if (!weather) return null;

  const WeatherIcon = getWeatherIcon(weather.icon);
  const iconColor = getIconColor(weather.icon);

  // Handle card click
  const handleClick = () => {
    if (onClick) {
      onClick(weather);
    } else {
      navigate({ to: '/city/$cityName', params: { cityName: weather.city } });
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`glass-card p-4 cursor-pointer transition-all duration-200
                  hover:scale-[1.02] hover:shadow-glow active:scale-[0.98]
                  animate-fade-in ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`View weather for ${weather.city}`}
    >
      <div className="flex justify-between items-start mb-3">
        {/* City name */}
        <div>
          <h3 className="text-lg font-semibold text-white">
            {weather.city}
          </h3>
          <p className="text-sm text-gray-400">
            {weather.country}
          </p>
        </div>

        {/* Favorite button (stop propagation to prevent card click) */}
        {showFavorite && (
          <div onClick={(e) => e.stopPropagation()}>
            <FavoriteButton
              city={{
                name: weather.city,
                country: weather.country,
                lat: weather.lat,
                lon: weather.lon,
              }}
              size="small"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {/* Temperature and condition */}
        <div className="flex items-center gap-3">
          <WeatherIcon className={`w-10 h-10 ${iconColor}`} />
          <div>
            <p className="text-3xl font-bold text-white">
              {formatTemp(weather.temp, unit)}
            </p>
            <p className="text-sm text-gray-400 capitalize">
              {weather.description}
            </p>
          </div>
        </div>

        {/* Additional info */}
        <div className="text-right text-sm">
          <div className="flex items-center justify-end gap-1 text-gray-400">
            <Droplets className="w-3 h-3" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center justify-end gap-1 text-gray-400 mt-1">
            <Wind className="w-3 h-3" />
            <span>{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
