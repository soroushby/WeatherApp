import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { isFavorite, toggleFavorite, getFavorites } from '../utils/localStorage';

const FavoriteButton = ({ city, size = 'default', onToggle }) => {
  const [favorite, setFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check favorite status on mount and when city changes
  useEffect(() => {
    if (city?.name) {
      setFavorite(isFavorite(city.name));
    }
  }, [city?.name]);

  // Handle toggle
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!city?.name) return;

    // Check if we can add more favorites (max 10)
    const favorites = getFavorites();
    if (!favorite && favorites.length >= 10) {
      alert('Maximum 10 favorites allowed. Please remove one first.');
      return;
    }

    // Toggle favorite status
    const result = toggleFavorite(city);
    setFavorite(result.isFavorite);

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Callback
    if (onToggle) {
      onToggle(result.isFavorite);
    }
  };

  // Size classes
  const sizeClasses = {
    small: 'p-1.5',
    default: 'p-2',
    large: 'p-3',
  };

  const iconSizes = {
    small: 'w-4 h-4',
    default: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses[size]} rounded-full transition-all duration-200
                  hover:bg-dark-600 active:scale-90
                  ${isAnimating ? 'scale-125' : 'scale-100'}
                  ${favorite ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star
        className={`${iconSizes[size]} transition-all duration-200
                    ${favorite ? 'fill-yellow-400' : 'fill-transparent'}`}
      />
    </button>
  );
};

export default FavoriteButton;
