interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = "검색 결과가 없습니다." }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg shadow-sm border">
      <svg 
        className="w-16 h-16 text-gray-400 mb-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="1.5" 
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <p className="text-lg font-medium text-gray-900 mb-1">데이터가 없습니다</p>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;