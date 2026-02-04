import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Clock, X, Trash2 } from 'lucide-react';
import { getSearchHistory, removeFromSearchHistory, clearSearchHistory } from '../utils/localStorage';

const SearchHistory = ({ onSelect, compact = false }) => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  // Load history on mount
  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  // Handle city selection
  const handleSelect = (city) => {
    if (onSelect) {
      onSelect(city);
    } else {
      navigate({ to: '/city/$cityName', params: { cityName: city } });
    }
  };

  // Handle remove single item
  const handleRemove = (e, city) => {
    e.stopPropagation();
    removeFromSearchHistory(city);
    setHistory(getSearchHistory());
  };

  // Handle clear all
  const handleClearAll = () => {
    clearSearchHistory();
    setHistory([]);
  };

  // No history
  if (history.length === 0) {
    if (compact) return null;

    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No search history yet</p>
      </div>
    );
  }

  // Compact inline version
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {history.map((city) => (
          <button
            key={city}
            onClick={() => handleSelect(city)}
            className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 hover:bg-dark-600
                       rounded-full text-sm text-gray-300 hover:text-white
                       transition-colors group"
          >
            <Clock className="w-3 h-3 text-gray-500 group-hover:text-gray-400" />
            {city}
          </button>
        ))}
      </div>
    );
  }

  // Full list version
  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-400" />
          Recent Searches
        </h3>
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1 px-3 py-1 text-sm text-gray-500
                     hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>

      <div className="space-y-2">
        {history.map((city) => (
          <div
            key={city}
            onClick={() => handleSelect(city)}
            className="flex items-center justify-between p-3 bg-dark-700/50
                       hover:bg-dark-600 rounded-lg cursor-pointer
                       transition-colors group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSelect(city)}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-300 group-hover:text-white">
                {city}
              </span>
            </div>
            <button
              onClick={(e) => handleRemove(e, city)}
              className="p-1 text-gray-500 hover:text-red-400 opacity-0
                         group-hover:opacity-100 transition-all"
              aria-label={`Remove ${city} from history`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
