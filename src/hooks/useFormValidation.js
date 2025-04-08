import { useState, useEffect } from 'react';

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validate - Validation function
 * @param {Function} onSubmit - Submit handler
 * @returns {Object} - Form state and handlers
 */
const useFormValidation = (initialValues, validate, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate whenever values change if the field has been touched
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const validationErrors = validate(values);
      const touchedErrors = {};
      
      // Only show errors for touched fields
      Object.keys(validationErrors).forEach(key => {
        if (touched[key]) {
          touchedErrors[key] = validationErrors[key];
        }
      });
      
      setErrors(touchedErrors);
    }
  }, [values, touched, validate]);

  // Handle submission
  useEffect(() => {
    if (isSubmitting) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      
      const hasErrors = Object.keys(validationErrors).length > 0;
      
      if (!hasErrors) {
        onSubmit(values);
      }
      
      setIsSubmitting(false);
    }
  }, [isSubmitting, onSubmit, validate, values]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    
    // Handle different input types
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle file input changes
  const handleFileChange = (event) => {
    const { name, files } = event.target;
    
    setValues({
      ...values,
      [name]: files[0] // Only take the first file
    });
  };

  // Handle blur event to mark field as touched
  const handleBlur = (event) => {
    const { name } = event.target;
    
    setTouched({
      ...touched,
      [name]: true
    });
  };

  // Handle form submission
  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(values).forEach(key => {
      allTouched[key] = true;
    });
    
    setTouched(allTouched);
    setIsSubmitting(true);
  };

  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  // Set a specific value
  const setValue = (name, value) => {
    setValues({
      ...values,
      [name]: value
    });
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleFileChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValue
  };
};

export default useFormValidation;