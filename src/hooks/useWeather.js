import { useQuery } from '@tanstack/react-query';
import {
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getHourlyForecast,
  getHourlyForecastByCoords,
  getDailyForecast,
  getDailyForecastByCoords,
  getAirQuality,
  getWeatherAlerts,
} from '../utils/weatherApi';

// Stale time: 5 minutes (weather data doesn't change that frequently)
const STALE_TIME = 5 * 60 * 1000;

// Cache time: 30 minutes
const CACHE_TIME = 30 * 60 * 1000;

/**
 * Custom hook for fetching weather data using TanStack Query
 * Supports both city name and coordinates
 */
export const useWeather = (city, coords = null) => {
  // Current weather query
  const currentWeatherQuery = useQuery({
    queryKey: ['currentWeather', city, coords?.lat, coords?.lon],
    queryFn: async () => {
      if (coords?.lat && coords?.lon) {
        return getCurrentWeatherByCoords(coords.lat, coords.lon);
      }
      if (city) {
        return getCurrentWeather(city);
      }
      throw new Error('City name or coordinates required');
    },
    enabled: Boolean(city || (coords?.lat && coords?.lon)),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Hourly forecast query
  const hourlyForecastQuery = useQuery({
    queryKey: ['hourlyForecast', city, coords?.lat, coords?.lon],
    queryFn: async () => {
      if (coords?.lat && coords?.lon) {
        return getHourlyForecastByCoords(coords.lat, coords.lon);
      }
      if (city) {
        return getHourlyForecast(city);
      }
      throw new Error('City name or coordinates required');
    },
    enabled: Boolean(city || (coords?.lat && coords?.lon)),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Daily forecast query
  const dailyForecastQuery = useQuery({
    queryKey: ['dailyForecast', city, coords?.lat, coords?.lon],
    queryFn: async () => {
      if (coords?.lat && coords?.lon) {
        return getDailyForecastByCoords(coords.lat, coords.lon);
      }
      if (city) {
        return getDailyForecast(city);
      }
      throw new Error('City name or coordinates required');
    },
    enabled: Boolean(city || (coords?.lat && coords?.lon)),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Air quality query - only when we have coordinates
  const airQualityQuery = useQuery({
    queryKey: ['airQuality', currentWeatherQuery.data?.lat, currentWeatherQuery.data?.lon],
    queryFn: () => getAirQuality(
      currentWeatherQuery.data.lat,
      currentWeatherQuery.data.lon
    ),
    enabled: Boolean(currentWeatherQuery.data?.lat && currentWeatherQuery.data?.lon),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Weather alerts query
  const alertsQuery = useQuery({
    queryKey: ['weatherAlerts', currentWeatherQuery.data?.lat, currentWeatherQuery.data?.lon],
    queryFn: () => getWeatherAlerts(
      currentWeatherQuery.data.lat,
      currentWeatherQuery.data.lon
    ),
    enabled: Boolean(currentWeatherQuery.data?.lat && currentWeatherQuery.data?.lon),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Combined loading state
  const isLoading = currentWeatherQuery.isLoading ||
    hourlyForecastQuery.isLoading ||
    dailyForecastQuery.isLoading;

  // Combined error (prioritize current weather error)
  const error = currentWeatherQuery.error ||
    hourlyForecastQuery.error ||
    dailyForecastQuery.error;

  // Refetch all data
  const refetch = () => {
    currentWeatherQuery.refetch();
    hourlyForecastQuery.refetch();
    dailyForecastQuery.refetch();
    if (currentWeatherQuery.data) {
      airQualityQuery.refetch();
      alertsQuery.refetch();
    }
  };

  return {
    // Current weather
    currentWeather: currentWeatherQuery.data,
    isLoadingCurrent: currentWeatherQuery.isLoading,
    currentError: currentWeatherQuery.error,

    // Hourly forecast
    hourlyForecast: hourlyForecastQuery.data,
    isLoadingHourly: hourlyForecastQuery.isLoading,
    hourlyError: hourlyForecastQuery.error,

    // Daily forecast
    dailyForecast: dailyForecastQuery.data,
    isLoadingDaily: dailyForecastQuery.isLoading,
    dailyError: dailyForecastQuery.error,

    // Air quality
    airQuality: airQualityQuery.data,
    isLoadingAirQuality: airQualityQuery.isLoading,
    airQualityError: airQualityQuery.error,

    // Weather alerts
    alerts: alertsQuery.data || [],
    isLoadingAlerts: alertsQuery.isLoading,

    // Combined states
    isLoading,
    error,
    refetch,

    // Individual query objects for advanced usage
    queries: {
      currentWeather: currentWeatherQuery,
      hourlyForecast: hourlyForecastQuery,
      dailyForecast: dailyForecastQuery,
      airQuality: airQualityQuery,
      alerts: alertsQuery,
    },
  };
};

/**
 * Hook for fetching weather for multiple cities (used in favorites)
 */
export const useMultipleWeather = (cities = []) => {
  const results = cities.map((city) => ({
    city,
    ...useQuery({
      queryKey: ['currentWeather', city.name || city],
      queryFn: () => getCurrentWeather(city.name || city),
      enabled: Boolean(city),
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      retry: 1,
      refetchOnWindowFocus: false,
    }),
  }));

  return {
    data: results.map((r) => ({
      city: r.city,
      weather: r.data,
      isLoading: r.isLoading,
      error: r.error,
    })),
    isLoading: results.some((r) => r.isLoading),
    refetchAll: () => results.forEach((r) => r.refetch?.()),
  };
};

export default useWeather;
