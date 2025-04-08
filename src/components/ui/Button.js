import React from 'react';

/**
 * Button component with various styles
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  ...restProps 
}) => {
  // Base button styles
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary hover:bg-primary/90 text-white focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white focus:ring-secondary',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus:ring-primary',
    danger: 'bg-danger hover:bg-danger/90 text-white focus:ring-danger',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    link: 'bg-transparent underline-offset-4 hover:underline text-primary hover:bg-transparent p-0 h-auto focus:ring-0'
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 h-8',
    md: 'text-sm px-4 py-2 h-10',
    lg: 'text-base px-5 py-2.5 h-12',
    xl: 'text-lg px-6 py-3 h-14'
  };
  
  // Combine all styles
  const buttonStyles = `
    ${baseStyles} 
    ${variantStyles[variant] || variantStyles.primary} 
    ${sizeStyles[size] || sizeStyles.md}
    ${fullWidth ? 'w-full' : ''} 
    ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...restProps}
    >
      {isLoading ? (
        <span className="mr-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;