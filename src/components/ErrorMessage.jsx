import { AlertCircle, RefreshCw, MapPin, Search } from 'lucide-react';

// Error message component with different error types
const ErrorMessage = ({ error, onRetry, type = 'general' }) => {
  // Determine error details based on type and error message
  const getErrorDetails = () => {
    const errorMsg = error?.message || error || 'An error occurred';

    // City not found error
    if (errorMsg.includes('not found') || errorMsg.includes('404')) {
      return {
        icon: Search,
        title: 'City Not Found',
        message: "We couldn't find that city. Please check the spelling and try again.",
        color: 'text-weather-sunny',
      };
    }

    // Location denied error
    if (errorMsg.includes('denied') || errorMsg.includes('permission')) {
      return {
        icon: MapPin,
        title: 'Location Access Denied',
        message: 'Please enable location access or search for a city manually.',
        color: 'text-weather-rainy',
      };
    }

    // Network error
    if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
      return {
        icon: AlertCircle,
        title: 'Connection Error',
        message: 'Please check your internet connection and try again.',
        color: 'text-weather-cloudy',
      };
    }

    // Rate limit error
    if (errorMsg.includes('rate') || errorMsg.includes('429') || errorMsg.includes('limit')) {
      return {
        icon: AlertCircle,
        title: 'Too Many Requests',
        message: 'Please wait a moment before trying again.',
        color: 'text-weather-sunny',
      };
    }

    // Default error
    return {
      icon: AlertCircle,
      title: 'Something Went Wrong',
      message: errorMsg,
      color: 'text-red-400',
    };
  };

  const { icon: Icon, title, message, color } = getErrorDetails();

  // Compact error style
  if (type === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg border border-red-500/20">
        <Icon className={`w-5 h-5 ${color}`} />
        <p className="text-sm text-gray-300 flex-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="p-1 hover:bg-dark-600 rounded transition-colors"
            aria-label="Retry"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    );
  }

  // Inline error style
  if (type === 'inline') {
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{message}</span>
      </div>
    );
  }

  // Full error card (default)
  return (
    <div className="glass-card p-8 text-center max-w-md mx-auto animate-fade-in">
      <div className={`inline-flex p-4 rounded-full bg-dark-700 mb-4 ${color}`}>
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>

      <p className="text-gray-400 mb-6">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500
                     hover:bg-primary-600 text-white rounded-lg transition-all
                     hover:shadow-glow active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
