import { useState } from 'react';
import { AlertTriangle, X, ChevronDown, ChevronUp } from 'lucide-react';

const WeatherAlert = ({ alerts }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  // Filter out dismissed alerts
  const activeAlerts = alerts?.filter(
    (alert) => !dismissedAlerts.includes(alert.event)
  ) || [];

  // No alerts to show
  if (activeAlerts.length === 0) return null;

  // Dismiss an alert
  const handleDismiss = (event) => {
    setDismissedAlerts((prev) => [...prev, event]);
  };

  // Get alert severity color
  const getAlertColor = (event) => {
    const severe = ['Thunderstorm', 'Tornado', 'Hurricane'];
    const moderate = ['Snow', 'Rain', 'Wind'];

    if (severe.some((s) => event.includes(s))) {
      return {
        bg: 'bg-red-500/20',
        border: 'border-red-500/50',
        text: 'text-red-400',
        icon: 'text-red-400',
      };
    }

    if (moderate.some((m) => event.includes(m))) {
      return {
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500/50',
        text: 'text-yellow-400',
        icon: 'text-yellow-400',
      };
    }

    return {
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/50',
      text: 'text-orange-400',
      icon: 'text-orange-400',
    };
  };

  // Format time for alert
  const formatAlertTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="animate-fade-in">
      {activeAlerts.map((alert, index) => {
        const colors = getAlertColor(alert.event);

        return (
          <div
            key={`${alert.event}-${index}`}
            className={`mb-4 rounded-xl border ${colors.bg} ${colors.border}
                       overflow-hidden transition-all duration-200`}
          >
            {/* Alert header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className={`w-5 h-5 ${colors.icon}`} />
                <div>
                  <p className={`font-semibold ${colors.text}`}>
                    {alert.event}
                  </p>
                  <p className="text-sm text-gray-400">
                    Until {formatAlertTime(alert.end)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Expand/collapse button */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-dark-600 rounded-lg transition-colors"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {/* Dismiss button */}
                <button
                  onClick={() => handleDismiss(alert.event)}
                  className="p-2 hover:bg-dark-600 rounded-lg transition-colors"
                  aria-label="Dismiss alert"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Expanded description */}
            {isExpanded && alert.description && (
              <div className="px-4 pb-4 pt-0">
                <p className="text-sm text-gray-300 capitalize">
                  {alert.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WeatherAlert;
