import React from 'react';

/**
 * Badge component for displaying status and categories
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  ...restProps 
}) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  // Combine all styles
  const badgeStyles = `
    inline-flex items-center font-medium rounded-full whitespace-nowrap
    ${variantStyles[variant] || variantStyles.default}
    ${sizeStyles[size] || sizeStyles.md}
    ${className}
  `;

  return (
    <span 
      className={badgeStyles}
      {...restProps}
    >
      {children}
    </span>
  );
};

export default Badge;