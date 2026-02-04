// OpenWeather API utility functions
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Weather condition to icon mapping
export const weatherIcons = {
  '01d': 'sun',
  '01n': 'moon',
  '02d': 'cloud-sun',
  '02n': 'cloud-moon',
  '03d': 'cloud',
  '03n': 'cloud',
  '04d': 'clouds',
  '04n': 'clouds',
  '09d': 'cloud-drizzle',
  '09n': 'cloud-drizzle',
  '10d': 'cloud-rain',
  '10n': 'cloud-rain',
  '11d': 'cloud-lightning',
  '11n': 'cloud-lightning',
  '13d': 'snowflake',
  '13n': 'snowflake',
  '50d': 'wind',
  '50n': 'wind',
};

// Get weather accent color based on condition
export const getWeatherAccent = (iconCode) => {
  if (!iconCode) return 'primary';

  const code = iconCode.slice(0, 2);
  switch (code) {
    case '01': // Clear
    case '02': // Few clouds
      return 'sunny';
    case '09': // Drizzle
    case '10': // Rain
      return 'rainy';
    case '03': // Scattered clouds
    case '04': // Broken clouds
    case '50': // Mist
      return 'cloudy';
    case '13': // Snow
      return 'snowy';
    case '11': // Thunderstorm
      return 'stormy';
    default:
      return 'primary';
  }
};

// Search cities by name (for autocomplete)
export const searchCities = async (query) => {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to search cities');
    }

    const data = await response.json();
    return data.map((city) => ({
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
      displayName: city.state
        ? `${city.name}, ${city.state}, ${city.country}`
        : `${city.name}, ${city.country}`,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
};

// Get current weather by city name
export const getCurrentWeather = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found');
      }
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    return formatCurrentWeather(data);
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

// Get current weather by coordinates
export const getCurrentWeatherByCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    return formatCurrentWeather(data);
  } catch (error) {
    console.error('Error fetching weather by coords:', error);
    throw error;
  }
};

// Get hourly forecast (next 24 hours from 5-day/3-hour forecast)
export const getHourlyForecast = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const data = await response.json();
    // Get next 8 entries (24 hours, 3-hour intervals)
    return data.list.slice(0, 8).map(formatHourlyForecast);
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    throw error;
  }
};

// Get hourly forecast by coordinates
export const getHourlyForecastByCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const data = await response.json();
    return data.list.slice(0, 8).map(formatHourlyForecast);
  } catch (error) {
    console.error('Error fetching hourly forecast by coords:', error);
    throw error;
  }
};

// Get 5-day daily forecast
export const getDailyForecast = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const data = await response.json();
    return processDailyForecast(data.list);
  } catch (error) {
    console.error('Error fetching daily forecast:', error);
    throw error;
  }
};

// Get 5-day daily forecast by coordinates
export const getDailyForecastByCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const data = await response.json();
    return processDailyForecast(data.list);
  } catch (error) {
    console.error('Error fetching daily forecast by coords:', error);
    throw error;
  }
};

// Get air quality index
export const getAirQuality = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch air quality data');
    }

    const data = await response.json();
    return formatAirQuality(data);
  } catch (error) {
    console.error('Error fetching air quality:', error);
    throw error;
  }
};

// Get weather alerts (using One Call API if available, otherwise return empty)
export const getWeatherAlerts = async (lat, lon) => {
  try {
    // Note: Weather alerts require One Call API 3.0 subscription
    // For free tier, we'll simulate checking for severe weather from forecast
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return checkForAlerts(data.list);
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
    return [];
  }
};

// Helper: Format current weather response
const formatCurrentWeather = (data) => ({
  city: data.name,
  country: data.sys.country,
  lat: data.coord.lat,
  lon: data.coord.lon,
  temp: Math.round(data.main.temp),
  feelsLike: Math.round(data.main.feels_like),
  tempMin: Math.round(data.main.temp_min),
  tempMax: Math.round(data.main.temp_max),
  humidity: data.main.humidity,
  pressure: data.main.pressure,
  windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
  windDeg: data.wind.deg,
  visibility: data.visibility / 1000, // Convert to km
  clouds: data.clouds.all,
  condition: data.weather[0].main,
  description: data.weather[0].description,
  icon: data.weather[0].icon,
  sunrise: data.sys.sunrise * 1000, // Convert to milliseconds
  sunset: data.sys.sunset * 1000,
  timezone: data.timezone,
  dt: data.dt * 1000,
});

// Helper: Format hourly forecast item
const formatHourlyForecast = (item) => ({
  dt: item.dt * 1000,
  temp: Math.round(item.main.temp),
  feelsLike: Math.round(item.main.feels_like),
  humidity: item.main.humidity,
  condition: item.weather[0].main,
  description: item.weather[0].description,
  icon: item.weather[0].icon,
  windSpeed: Math.round(item.wind.speed * 3.6),
  pop: Math.round((item.pop || 0) * 100), // Probability of precipitation
});

// Helper: Process 3-hour forecast into daily forecast
const processDailyForecast = (list) => {
  const dailyMap = new Map();

  list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        temps: [],
        conditions: [],
        icons: [],
        pops: [],
        humidities: [],
      });
    }

    const day = dailyMap.get(date);
    day.temps.push(item.main.temp);
    day.conditions.push(item.weather[0].main);
    day.icons.push(item.weather[0].icon);
    day.pops.push(item.pop || 0);
    day.humidities.push(item.main.humidity);
  });

  return Array.from(dailyMap.values()).slice(0, 5).map((day) => ({
    date: day.date,
    tempMax: Math.round(Math.max(...day.temps)),
    tempMin: Math.round(Math.min(...day.temps)),
    condition: getMostFrequent(day.conditions),
    icon: getMostFrequent(day.icons),
    pop: Math.round(Math.max(...day.pops) * 100),
    humidity: Math.round(day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length),
  }));
};

// Helper: Format air quality response
const formatAirQuality = (data) => {
  const aqi = data.list[0].main.aqi;
  const components = data.list[0].components;

  const aqiLabels = {
    1: { label: 'Good', color: 'good', description: 'Air quality is satisfactory' },
    2: { label: 'Fair', color: 'moderate', description: 'Air quality is acceptable' },
    3: { label: 'Moderate', color: 'moderate', description: 'May affect sensitive groups' },
    4: { label: 'Poor', color: 'unhealthy', description: 'Health effects possible for everyone' },
    5: { label: 'Very Poor', color: 'hazardous', description: 'Health alert: serious effects' },
  };

  return {
    aqi,
    ...aqiLabels[aqi],
    pm2_5: Math.round(components.pm2_5),
    pm10: Math.round(components.pm10),
    o3: Math.round(components.o3),
    no2: Math.round(components.no2),
    so2: Math.round(components.so2),
    co: Math.round(components.co),
  };
};

// Helper: Check for severe weather alerts from forecast
const checkForAlerts = (list) => {
  const alerts = [];
  const severeConditions = ['Thunderstorm', 'Snow', 'Extreme'];

  list.slice(0, 8).forEach((item) => {
    const condition = item.weather[0].main;
    if (severeConditions.includes(condition)) {
      const existingAlert = alerts.find((a) => a.event === condition);
      if (!existingAlert) {
        alerts.push({
          event: condition,
          description: item.weather[0].description,
          start: item.dt * 1000,
          end: (item.dt + 10800) * 1000, // 3 hours later
        });
      }
    }
  });

  return alerts;
};

// Helper: Get most frequent item in array
const getMostFrequent = (arr) => {
  const counts = {};
  let maxCount = 0;
  let mostFrequent = arr[0];

  arr.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1;
    if (counts[item] > maxCount) {
      maxCount = counts[item];
      mostFrequent = item;
    }
  });

  return mostFrequent;
};

// Convert Celsius to Fahrenheit
export const celsiusToFahrenheit = (celsius) => Math.round((celsius * 9) / 5 + 32);

// Convert Fahrenheit to Celsius
export const fahrenheitToCelsius = (fahrenheit) => Math.round(((fahrenheit - 32) * 5) / 9);

// Format temperature with unit
export const formatTemp = (temp, unit = 'C') => {
  if (unit === 'F') {
    return `${celsiusToFahrenheit(temp)}°F`;
  }
  return `${temp}°C`;
};

// Get wind direction from degrees
export const getWindDirection = (deg) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

// Format time from timestamp
export const formatTime = (timestamp, timezone = 0) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Format date from timestamp
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};
