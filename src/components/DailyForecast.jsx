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
    '01n': Sun,
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

// Check if today
const isToday = (dateStr) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  return dateStr === today;
};

const DailyForecast = ({ forecast, unit = 'C' }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="glass-card p-3 sm:p-4 md:p-6 animate-fade-in">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
        5-Day Forecast
      </h3>

      <div className="space-y-1.5 sm:space-y-2">
        {forecast.map((day, index) => {
          const WeatherIcon = getWeatherIcon(day.icon);
          const iconColor = getIconColor(day.icon);
          const today = isToday(day.date);

          return (
            <div
              key={day.date}
              className={`flex items-center justify-between p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl
                         transition-all duration-200 active:bg-dark-600 hover:bg-dark-600
                         ${today ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-dark-700/50'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Day name */}
              <div className="flex-1 min-w-0">
                <span className={`text-sm sm:text-base font-medium ${today ? 'text-primary-400' : 'text-white'}`}>
                  {today ? 'Today' : day.date.split(',')[0]}
                </span>
                <span className="hidden sm:inline text-gray-500 text-sm ml-2">
                  {day.date.split(',').slice(1).join(',')}
                </span>
              </div>

              {/* Precipitation chance */}
              <div className="flex items-center gap-1 w-12 sm:w-16 justify-center">
                {day.pop > 0 && (
                  <>
                    <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-weather-rainy" />
                    <span className="text-xs sm:text-sm text-weather-rainy">
                      {day.pop}%
                    </span>
                  </>
                )}
              </div>

              {/* Weather icon and condition */}
              <div className="flex items-center gap-2 w-8 sm:w-24 md:w-32 justify-center">
                <WeatherIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
                <span className="hidden md:inline text-gray-400 text-sm capitalize truncate">
                  {day.condition}
                </span>
              </div>

              {/* Temperature range */}
              <div className="flex items-center gap-1 sm:gap-2 w-20 sm:w-28 justify-end">
                <span className="text-white font-semibold text-sm sm:text-base">
                  {formatTemp(day.tempMax, unit)}
                </span>
                <span className="text-gray-500 text-sm">/</span>
                <span className="text-gray-400 text-sm sm:text-base">
                  {formatTemp(day.tempMin, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;
