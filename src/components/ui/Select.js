import React from 'react';

/**
 * Select component for forms
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const Select = ({
  name,
  id,
  label,
  options = [],
  value,
  onChange,
  onBlur,
  error,
  helpText,
  className = '',
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  ...restProps
}) => {
  // Generate ID if not provided
  const selectId = id || name;

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className={`
          w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm 
          bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${className}
        `}
        {...restProps}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(option => {
          // Handle different formats of options
          const optionValue = typeof option === 'object' ? option.value : option;
          const optionLabel = typeof option === 'object' ? option.label : option;
          
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default Select;