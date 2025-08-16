interface PaginationProps {
  limit: number;
  offset: number;
  onPageChange: (newOffset: number) => void;
  totalEstimate?: number; // Optional total count estimate for showing page info
}

const Pagination = ({ limit, offset, onPageChange, totalEstimate }: PaginationProps) => {
  const currentPage = Math.floor(offset / limit) + 1;
  
  // Estimate total pages if totalEstimate is provided
  const totalPages = totalEstimate ? Math.ceil(totalEstimate / limit) : undefined;
  
  const handlePrevPage = () => {
    if (offset >= limit) {
      onPageChange(offset - limit);
      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleNextPage = () => {
    onPageChange(offset + limit);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Skip rendering if there's no data
  if (totalEstimate === 0) return null;
  
  return (
    <nav className="flex items-center justify-between py-4" aria-label="페이지네이션">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={handlePrevPage}
          disabled={offset === 0}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            offset === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          이전
        </button>
        <button
          onClick={handleNextPage}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
        >
          다음
        </button>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{offset + 1}</span>
            {" - "}
            <span className="font-medium">{Math.min(offset + limit, totalEstimate || offset + limit)}</span>
            {totalEstimate && (
              <>
                {" / 약 "}
                <span className="font-medium">{totalEstimate}</span>
              </>
            )}
            {" 결과"}
          </p>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={handlePrevPage}
              disabled={offset === 0}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                offset === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
              aria-label="이전 페이지"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            
            <div className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              {totalPages ? (
                <span>{currentPage} / {totalPages}</span>
              ) : (
                <span>페이지 {currentPage}</span>
              )}
            </div>
            
            <button
              onClick={handleNextPage}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              aria-label="다음 페이지"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </nav>
  );
}

export default Pagination
