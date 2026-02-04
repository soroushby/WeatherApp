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
  Eye,
  Thermometer,
  Sunrise,
  Sunset,
  Gauge,
} from 'lucide-react';
import { getWeatherAccent, formatTemp, formatTime, getWindDirection } from '../utils/weatherApi';
import FavoriteButton from './FavoriteButton';

// Map weather icon codes to Lucide icons
const getWeatherIcon = (iconCode) => {
  if (!iconCode) return Sun;

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

// Get accent color classes based on weather condition
const getAccentClasses = (accent) => {
  const classes = {
    sunny: {
      icon: 'text-weather-sunny',
      glow: 'shadow-glow-sunny',
      bg: 'bg-weather-sunny/10',
      border: 'border-weather-sunny/30',
    },
    rainy: {
      icon: 'text-weather-rainy',
      glow: 'shadow-glow-rainy',
      bg: 'bg-weather-rainy/10',
      border: 'border-weather-rainy/30',
    },
    cloudy: {
      icon: 'text-weather-cloudy',
      glow: '',
      bg: 'bg-weather-cloudy/10',
      border: 'border-weather-cloudy/30',
    },
    snowy: {
      icon: 'text-weather-snowy',
      glow: 'shadow-glow-snowy',
      bg: 'bg-weather-snowy/10',
      border: 'border-weather-snowy/30',
    },
    stormy: {
      icon: 'text-primary-400',
      glow: 'shadow-glow',
      bg: 'bg-primary-500/10',
      border: 'border-primary-500/30',
    },
    primary: {
      icon: 'text-primary-400',
      glow: 'shadow-glow',
      bg: 'bg-primary-500/10',
      border: 'border-primary-500/30',
    },
  };

  return classes[accent] || classes.primary;
};

const CurrentWeather = ({ weather, unit = 'C', showFavorite = true }) => {
  if (!weather) return null;

  const WeatherIcon = getWeatherIcon(weather.icon);
  const accent = getWeatherAccent(weather.icon);
  const colors = getAccentClasses(accent);

  // Format sunrise and sunset times
  const sunriseTime = formatTime(weather.sunrise);
  const sunsetTime = formatTime(weather.sunset);

  return (
    <div className={`glass-card p-4 sm:p-6 md:p-8 animate-fade-in-up ${colors.glow}`}>
      {/* Header with city name and favorite button */}
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">
            {weather.city}
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            {weather.country}
          </p>
        </div>
        {showFavorite && (
          <FavoriteButton
            city={{
              name: weather.city,
              country: weather.country,
              lat: weather.lat,
              lon: weather.lon,
            }}
          />
        )}
      </div>

      {/* Main temperature and icon */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          {/* Weather icon with animation */}
          <div className={`p-3 sm:p-4 md:p-6 rounded-full ${colors.bg} ${colors.border} border animate-weather-float`}>
            <WeatherIcon className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 ${colors.icon}`} />
          </div>

          {/* Temperature */}
          <div>
            <div className="text-4xl sm:text-5xl md:text-7xl font-bold text-white">
              {formatTemp(weather.temp, unit)}
            </div>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base capitalize">
              {weather.description}
            </p>
          </div>
        </div>

        {/* Feels like temperature */}
        <div className="hidden sm:block text-right">
          <p className="text-gray-500 text-sm">Feels like</p>
          <p className="text-2xl md:text-3xl font-semibold text-white">
            {formatTemp(weather.feelsLike, unit)}
          </p>
        </div>
      </div>

      {/* Feels like on mobile */}
      <div className="sm:hidden mb-4 p-3 bg-dark-700/50 rounded-lg flex items-center justify-between">
        <span className="text-gray-400 text-sm">Feels like</span>
        <span className="text-white font-semibold text-lg">{formatTemp(weather.feelsLike, unit)}</span>
      </div>

      {/* Weather details grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Humidity */}
        <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
          <Droplets className="w-5 h-5 text-weather-rainy" />
          <div>
            <p className="text-xs text-gray-500">Humidity</p>
            <p className="text-white font-medium">{weather.humidity}%</p>
          </div>
        </div>

        {/* Wind */}
        <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
          <Wind className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Wind</p>
            <p className="text-white font-medium">
              {weather.windSpeed} km/h {getWindDirection(weather.windDeg)}
            </p>
          </div>
        </div>

        {/* Visibility */}
        <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
          <Eye className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Visibility</p>
            <p className="text-white font-medium">{weather.visibility} km</p>
          </div>
        </div>

        {/* Pressure */}
        <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg">
          <Gauge className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Pressure</p>
            <p className="text-white font-medium">{weather.pressure} hPa</p>
          </div>
        </div>
      </div>

      {/* Sunrise and Sunset */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-dark-500">
        {/* Mobile: Stack vertically, Desktop: Horizontal */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:justify-between sm:items-center">
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <Sunrise className="w-5 h-5 text-weather-sunny mb-1 sm:mb-0" />
            <div>
              <p className="text-xs text-gray-500">Sunrise</p>
              <p className="text-white font-medium text-sm sm:text-base">{sunriseTime}</p>
            </div>
          </div>

          {/* High/Low temperatures */}
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center">
            <Thermometer className="w-5 h-5 text-primary-400 mb-1 sm:mb-0" />
            <div>
              <p className="text-xs text-gray-500">High / Low</p>
              <p className="text-white font-medium text-sm sm:text-base">
                {formatTemp(weather.tempMax, unit)} / {formatTemp(weather.tempMin, unit)}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-right">
            <Sunset className="w-5 h-5 text-weather-sunny mb-1 sm:mb-0" />
            <div>
              <p className="text-xs text-gray-500">Sunset</p>
              <p className="text-white font-medium text-sm sm:text-base">{sunsetTime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
