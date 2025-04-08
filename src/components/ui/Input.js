import React from 'react';

/**
 * Input component for forms
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const Input = ({
  type = 'text',
  name,
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helpText,
  className = '',
  required = false,
  disabled = false,
  readOnly = false,
  ...restProps
}) => {
  // Generate ID if not provided
  const inputId = id || name;

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        required={required}
        className={`
          w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm 
          placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${readOnly ? 'bg-gray-50' : ''}
          ${className}
        `}
        {...restProps}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default Input;