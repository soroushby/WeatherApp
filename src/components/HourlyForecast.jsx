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

// Format hour from timestamp
const formatHour = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  });
};

const HourlyForecast = ({ forecast, unit = 'C' }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="glass-card p-4 md:p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-4">
        24-Hour Forecast
      </h3>

      {/* Scrollable horizontal container */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-dark-500 scrollbar-track-transparent pb-2">
        <div className="flex gap-3 min-w-max">
          {forecast.map((hour, index) => {
            const WeatherIcon = getWeatherIcon(hour.icon);
            const iconColor = getIconColor(hour.icon);
            const isNow = index === 0;

            return (
              <div
                key={hour.dt}
                className={`flex flex-col items-center p-3 rounded-xl min-w-[80px]
                           transition-all duration-200 hover:bg-dark-600
                           ${isNow ? 'bg-primary-500/20 border border-primary-500/30' : 'bg-dark-700/50'}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Time */}
                <span className={`text-xs font-medium mb-2 ${isNow ? 'text-primary-400' : 'text-gray-400'}`}>
                  {isNow ? 'Now' : formatHour(hour.dt)}
                </span>

                {/* Weather icon */}
                <div className="my-2">
                  <WeatherIcon className={`w-7 h-7 ${iconColor}`} />
                </div>

                {/* Temperature */}
                <span className="text-white font-semibold">
                  {formatTemp(hour.temp, unit)}
                </span>

                {/* Precipitation chance (if any) */}
                {hour.pop > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <Droplets className="w-3 h-3 text-weather-rainy" />
                    <span className="text-xs text-weather-rainy">
                      {hour.pop}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
