import { Wind, Info } from 'lucide-react';

// AQI color mapping
const getAqiColors = (aqi) => {
  const colors = {
    1: { // Good
      bg: 'bg-aqi-good/20',
      border: 'border-aqi-good/30',
      text: 'text-aqi-good',
      fill: 'bg-aqi-good',
    },
    2: { // Fair
      bg: 'bg-aqi-moderate/20',
      border: 'border-aqi-moderate/30',
      text: 'text-aqi-moderate',
      fill: 'bg-aqi-moderate',
    },
    3: { // Moderate
      bg: 'bg-aqi-moderate/20',
      border: 'border-aqi-moderate/30',
      text: 'text-aqi-moderate',
      fill: 'bg-aqi-moderate',
    },
    4: { // Poor
      bg: 'bg-aqi-unhealthy/20',
      border: 'border-aqi-unhealthy/30',
      text: 'text-aqi-unhealthy',
      fill: 'bg-aqi-unhealthy',
    },
    5: { // Very Poor
      bg: 'bg-aqi-hazardous/20',
      border: 'border-aqi-hazardous/30',
      text: 'text-aqi-hazardous',
      fill: 'bg-aqi-hazardous',
    },
  };

  return colors[aqi] || colors[1];
};

const AirQuality = ({ data, compact = false }) => {
  if (!data) return null;

  const colors = getAqiColors(data.aqi);

  // Compact version for cards
  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colors.bg} ${colors.border} border`}>
        <Wind className={`w-4 h-4 ${colors.text}`} />
        <span className={`text-sm font-medium ${colors.text}`}>
          AQI: {data.label}
        </span>
      </div>
    );
  }

  // Full version with details
  return (
    <div className="glass-card p-4 md:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Wind className="w-5 h-5 text-primary-400" />
          Air Quality
        </h3>
        <div className={`px-3 py-1 rounded-full ${colors.bg} ${colors.border} border`}>
          <span className={`text-sm font-medium ${colors.text}`}>
            {data.label}
          </span>
        </div>
      </div>

      {/* AQI indicator bar */}
      <div className="mb-4">
        <div className="h-2 rounded-full bg-dark-600 overflow-hidden">
          <div
            className={`h-full ${colors.fill} transition-all duration-500`}
            style={{ width: `${(data.aqi / 5) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {data.description}
        </p>
      </div>

      {/* Pollutant details */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <PollutantItem label="PM2.5" value={data.pm2_5} unit="μg/m³" />
        <PollutantItem label="PM10" value={data.pm10} unit="μg/m³" />
        <PollutantItem label="O₃" value={data.o3} unit="μg/m³" />
        <PollutantItem label="NO₂" value={data.no2} unit="μg/m³" />
        <PollutantItem label="SO₂" value={data.so2} unit="μg/m³" />
        <PollutantItem label="CO" value={data.co} unit="μg/m³" />
      </div>

      {/* Health recommendation based on AQI */}
      <div className={`mt-4 p-3 rounded-lg ${colors.bg} ${colors.border} border`}>
        <div className="flex items-start gap-2">
          <Info className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
          <p className="text-sm text-gray-300">
            {getHealthRecommendation(data.aqi)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Pollutant item component
const PollutantItem = ({ label, value, unit }) => (
  <div className="p-3 bg-dark-700/50 rounded-lg">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-white font-medium">
      {value} <span className="text-xs text-gray-500">{unit}</span>
    </p>
  </div>
);

// Health recommendations based on AQI
const getHealthRecommendation = (aqi) => {
  const recommendations = {
    1: 'Air quality is good. Enjoy outdoor activities!',
    2: 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.',
    3: 'Sensitive groups may experience health effects. Consider reducing prolonged outdoor exertion.',
    4: 'Everyone may experience health effects. Limit outdoor activities.',
    5: 'Health warning! Avoid outdoor activities and keep windows closed.',
  };

  return recommendations[aqi] || recommendations[1];
};

export default AirQuality;
