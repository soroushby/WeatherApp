// Skeleton loader component for loading states
const LoadingSkeleton = ({ type = 'card' }) => {
  // Base skeleton styles with shimmer animation
  const baseClass = 'bg-dark-600 animate-pulse rounded-lg';

  // Page loading skeleton
  if (type === 'page') {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
        {/* Search bar skeleton */}
        <div className={`${baseClass} h-14 w-full`} />

        {/* Current weather skeleton */}
        <div className={`${baseClass} h-64 w-full`} />

        {/* Forecast skeleton */}
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`${baseClass} h-32 w-24 flex-shrink-0`} />
          ))}
        </div>
      </div>
    );
  }

  // Current weather skeleton
  if (type === 'weather') {
    return (
      <div className="glass-card p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className={`${baseClass} h-8 w-32`} />
            <div className={`${baseClass} h-4 w-24`} />
          </div>
          <div className={`${baseClass} h-10 w-10 rounded-full`} />
        </div>

        <div className="flex items-center gap-4">
          <div className={`${baseClass} h-24 w-24 rounded-full`} />
          <div className="space-y-2">
            <div className={`${baseClass} h-16 w-28`} />
            <div className={`${baseClass} h-4 w-20`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`${baseClass} h-12 w-full`} />
          ))}
        </div>
      </div>
    );
  }

  // Hourly forecast skeleton
  if (type === 'hourly') {
    return (
      <div className="flex gap-3 overflow-hidden py-2">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`${baseClass} h-28 w-20 flex-shrink-0`}
          />
        ))}
      </div>
    );
  }

  // Daily forecast skeleton
  if (type === 'daily') {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`${baseClass} h-16 w-full`} />
        ))}
      </div>
    );
  }

  // Card skeleton (default)
  if (type === 'card') {
    return (
      <div className={`${baseClass} h-32 w-full`} />
    );
  }

  // Small card skeleton
  if (type === 'small') {
    return (
      <div className={`${baseClass} h-20 w-full`} />
    );
  }

  // Favorites list skeleton
  if (type === 'favorites') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`${baseClass} h-36 w-full`} />
        ))}
      </div>
    );
  }

  // Air quality skeleton
  if (type === 'airQuality') {
    return (
      <div className="glass-card p-4 space-y-3">
        <div className={`${baseClass} h-6 w-28`} />
        <div className="flex items-center gap-4">
          <div className={`${baseClass} h-16 w-16 rounded-full`} />
          <div className="space-y-2 flex-1">
            <div className={`${baseClass} h-4 w-20`} />
            <div className={`${baseClass} h-3 w-full`} />
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return <div className={`${baseClass} h-24 w-full`} />;
};

export default LoadingSkeleton;
