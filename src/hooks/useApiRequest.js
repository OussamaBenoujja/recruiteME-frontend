import { useState, useCallback } from 'react';

/**
 * Custom hook for handling API requests
 * @param {Function} apiFunction - The API function to call
 * @returns {Object} - API request state and handlers
 */
const useApiRequest = (apiFunction) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await apiFunction(...params);
      setData(result);
      setIsLoading(false);
      
      return { success: true, data: result };
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setIsLoading(false);
      
      return { 
        success: false, 
        error: err.response?.data?.message || 'An error occurred' 
      };
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    reset
  };
};

export default useApiRequest;