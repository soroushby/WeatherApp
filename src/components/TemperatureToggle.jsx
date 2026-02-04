const TemperatureToggle = ({ unit, onToggle }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-dark-700 rounded-lg">
      <button
        onClick={() => unit !== 'C' && onToggle('C')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                    ${unit === 'C'
                      ? 'bg-primary-500 text-white shadow-glow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-dark-600'
                    }`}
        aria-label="Celsius"
        aria-pressed={unit === 'C'}
      >
        °C
      </button>
      <button
        onClick={() => unit !== 'F' && onToggle('F')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                    ${unit === 'F'
                      ? 'bg-primary-500 text-white shadow-glow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-dark-600'
                    }`}
        aria-label="Fahrenheit"
        aria-pressed={unit === 'F'}
      >
        °F
      </button>
    </div>
  );
};

export default TemperatureToggle;
