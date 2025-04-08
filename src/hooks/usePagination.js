import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for handling pagination
 * @param {Function} fetchFunction - Function to fetch data
 * @param {Object} initialParams - Initial query parameters
 * @returns {Object} - Pagination state and handlers
 */
const usePagination = (fetchFunction, initialParams = {}) => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryParams, setQueryParams] = useState(initialParams);

  const fetchData = useCallback(async (page = currentPage, params = queryParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchFunction({
        ...params,
        page
      });
      
      setItems(response.data);
      setCurrentPage(response.meta.current_page);
      setTotalPages(response.meta.last_page);
      setTotalItems(response.meta.total);
      
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      setIsLoading(false);
    }
  }, [currentPage, fetchFunction, queryParams]);

  // Fetch data whenever page or query params change
  useEffect(() => {
    fetchData();
  }, [currentPage, queryParams, fetchData]);

  // Go to a specific page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Update query parameters
  const updateParams = (newParams) => {
    setQueryParams({
      ...queryParams,
      ...newParams
    });
    // Reset to first page when changing filters
    setCurrentPage(1);
  };

  // Refresh the current page
  const refresh = () => {
    fetchData(currentPage, queryParams);
  };

  return {
    items,
    currentPage,
    totalPages,
    totalItems,
    isLoading,
    error,
    queryParams,
    goToPage,
    nextPage,
    prevPage,
    updateParams,
    refresh
  };
};

export default usePagination;