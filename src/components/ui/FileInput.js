import React, { useState, useRef } from 'react';

/**
 * File input component for forms
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const FileInput = ({
  name,
  id,
  label,
  onChange,
  onBlur,
  error,
  helpText,
  className = '',
  required = false,
  disabled = false,
  accept = '',
  maxSize = 5242880, // 5MB default max size
  ...restProps
}) => {
  const [fileName, setFileName] = useState('No file chosen');
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);
  
  // Generate ID if not provided
  const fileInputId = id || name;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file size
      if (file.size > maxSize) {
        setFileError(`File size exceeds the maximum allowed size (${formatFileSize(maxSize)})`);
        setFileName('No file chosen');
        // Reset file input
        e.target.value = '';
      } else {
        setFileError('');
        setFileName(file.name);
        
        // Call parent onChange
        if (onChange) {
          onChange(e);
        }
      }
    } else {
      setFileName('No file chosen');
      setFileError('');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={fileInputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex items-center">
        <input
          type="file"
          ref={fileInputRef}
          id={fileInputId}
          name={name}
          onChange={handleFileChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          accept={accept}
          className="hidden"
          {...restProps}
        />
        
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={disabled}
          className={`
            inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md 
            text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
        >
          Browse
        </button>
        
        <span className="ml-3 text-sm text-gray-500 truncate">
          {fileName}
        </span>
      </div>
      
      {(error || fileError) && (
        <p className="mt-1 text-sm text-red-600">{fileError || error}</p>
      )}
      
      {helpText && !error && !fileError && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default FileInput;