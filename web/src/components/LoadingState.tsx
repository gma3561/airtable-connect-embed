interface LoadingStateProps {
  rows?: number; // Number of skeleton rows to display
}

const LoadingState = ({ rows = 5 }: LoadingStateProps) => {
  return (
    <div className="animate-pulse">
      <div className="space-y-3">
        {/* Table header skeleton */}
        <div className="h-10 bg-gray-200 rounded"></div>
        
        {/* Table rows skeletons */}
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-14 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;