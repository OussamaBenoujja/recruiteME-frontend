import React from 'react';

/**
 * Card component for displaying content in a contained area
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const Card = ({ 
  children, 
  className = '', 
  title,
  subtitle,
  footer,
  ...restProps 
}) => {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}
      {...restProps}
    >
      {(title || subtitle) && (
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className="p-4">
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;