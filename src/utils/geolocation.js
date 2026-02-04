// Geolocation utility for getting user's current position

// Geolocation options
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000, // 10 seconds
  maximumAge: 300000, // 5 minutes cache
};

// Error messages for different error codes
const ERROR_MESSAGES = {
  1: 'Location access denied. Please enable location permissions or search for a city.',
  2: 'Unable to determine your location. Please try again or search for a city.',
  3: 'Location request timed out. Please try again or search for a city.',
  default: 'Unable to get your location. Please search for a city.',
};

/**
 * Check if geolocation is supported by the browser
 * @returns {boolean}
 */
export const isGeolocationSupported = () => {
  return 'geolocation' in navigator;
};

/**
 * Get user's current position
 * @returns {Promise<{lat: number, lon: number}>}
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        const message = ERROR_MESSAGES[error.code] || ERROR_MESSAGES.default;
        reject(new Error(message));
      },
      GEOLOCATION_OPTIONS
    );
  });
};

/**
 * Check if user has granted location permission
 * @returns {Promise<string>} 'granted', 'denied', or 'prompt'
 */
export const checkPermission = async () => {
  if (!navigator.permissions) {
    // Permissions API not supported, assume we need to prompt
    return 'prompt';
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch {
    return 'prompt';
  }
};

/**
 * Watch user's position for continuous updates
 * @param {Function} onSuccess - Callback with position data
 * @param {Function} onError - Callback with error
 * @returns {number} Watch ID (use to clear with clearWatch)
 */
export const watchPosition = (onSuccess, onError) => {
  if (!isGeolocationSupported()) {
    onError(new Error('Geolocation is not supported by your browser'));
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    },
    (error) => {
      const message = ERROR_MESSAGES[error.code] || ERROR_MESSAGES.default;
      onError(new Error(message));
    },
    GEOLOCATION_OPTIONS
  );
};

/**
 * Stop watching user's position
 * @param {number} watchId - Watch ID returned by watchPosition
 */
export const clearWatch = (watchId) => {
  if (watchId !== null && isGeolocationSupported()) {
    navigator.geolocation.clearWatch(watchId);
  }
};

/**
 * Get position with timeout fallback
 * Returns cached position if available, otherwise tries to get new position
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<{lat: number, lon: number}|null>}
 */
export const getPositionWithFallback = async (timeout = 5000) => {
  try {
    // Try to get position with shorter timeout first
    const position = await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout'));
      }, timeout);

      getCurrentPosition()
        .then((pos) => {
          clearTimeout(timeoutId);
          resolve(pos);
        })
        .catch((err) => {
          clearTimeout(timeoutId);
          reject(err);
        });
    });

    return position;
  } catch {
    return null;
  }
};
