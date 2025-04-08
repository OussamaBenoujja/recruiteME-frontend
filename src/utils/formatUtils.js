/**
 * Format currency with proper symbol and decimal places
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format job status with proper capitalization and styling
 * @param {string} status - The job status
 * @returns {object} - The formatted status with text and color
 */
export const formatJobStatus = (status) => {
  if (!status) return { text: 'Unknown', color: 'gray' };
  
  switch (status.toLowerCase()) {
    case 'active':
      return { text: 'Active', color: 'green' };
    case 'closed':
      return { text: 'Closed', color: 'red' };
    case 'draft':
      return { text: 'Draft', color: 'gray' };
    default:
      return { text: status.charAt(0).toUpperCase() + status.slice(1), color: 'gray' };
  }
};

/**
 * Format application status with proper capitalization and styling
 * @param {string} status - The application status
 * @returns {object} - The formatted status with text and color
 */
export const formatApplicationStatus = (status) => {
  if (!status) return { text: 'Unknown', color: 'gray' };
  
  switch (status.toLowerCase()) {
    case 'applied':
      return { text: 'Applied', color: 'blue' };
    case 'reviewing':
      return { text: 'Reviewing', color: 'yellow' };
    case 'interview':
      return { text: 'Interview', color: 'purple' };
    case 'offered':
      return { text: 'Offered', color: 'green' };
    case 'rejected':
      return { text: 'Rejected', color: 'red' };
    case 'withdrawn':
      return { text: 'Withdrawn', color: 'gray' };
    default:
      return { text: status.charAt(0).toUpperCase() + status.slice(1), color: 'gray' };
  }
};

/**
 * Truncate text to a specific length
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  
  return text.length > length
    ? text.substring(0, length) + '...'
    : text;
};