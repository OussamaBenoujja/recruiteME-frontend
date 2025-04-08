import React from 'react';

/**
 * Pagination component for navigating through multi-page data
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showPageNumbers = true,
  showFirstLast = true,
  ...restProps
}) => {
  // Don't render if there's only one page
  if (totalPages <= 1) return null;
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show current page and 1 page before/after when possible
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
    
    // Adjust to show at least 3 pages if available
    if (endPage - startPage < 2) {
      if (startPage === 1) {
        endPage = Math.min(3, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - 2);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <nav className={`flex items-center justify-between ${className}`} {...restProps}>
      <div className="flex-1 flex justify-between sm:hidden">
        {/* Mobile version */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md
            ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}
          `}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md
            ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}
          `}
        >
          Next
        </button>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
        {/* Desktop version */}
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* First page button */}
            {showFirstLast && (
              <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className={`
                  relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium
                  ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}
                `}
              >
                <span className="sr-only">First</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            
            {/* Previous button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`
                relative inline-flex items-center px-2 py-2 ${!showFirstLast ? 'rounded-l-md' : ''} border border-gray-300 bg-white text-sm font-medium
                ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}
              `}
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Page numbers */}
            {showPageNumbers && getPageNumbers().map(number => (
              <button
                key={number}
                onClick={() => onPageChange(number)}
                aria-current={currentPage === number ? "page" : undefined}
                className={`
                  relative inline-flex items-center px-4 py-2 border text-sm font-medium
                  ${currentPage === number 
                    ? 'z-10 bg-primary border-primary text-white' 
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}
                `}
              >
                {number}
              </button>
            ))}
            
            {/* Next button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`
                relative inline-flex items-center px-2 py-2 ${!showFirstLast ? 'rounded-r-md' : ''} border border-gray-300 bg-white text-sm font-medium
                ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}
              `}
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Last page button */}
            {showFirstLast && (
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`
                  relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium
                  ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}
                `}
              >
                <span className="sr-only">Last</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414zm6 0a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L14.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Pagination;