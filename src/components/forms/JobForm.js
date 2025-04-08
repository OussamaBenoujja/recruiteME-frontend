import React from 'react';
import { useNavigate } from 'react-router-dom';
import useFormValidation from '../../hooks/useFormValidation';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { formatDateForInput } from '../../utils/dateUtils';

/**
 * Form component for creating and editing job listings
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const JobForm = ({ 
  initialValues = {
    title: '',
    description: '',
    location: '',
    company: '',
    employment_type: '',
    experience_level: '',
    salary_min: '',
    salary_max: '',
    closing_date: '',
    is_active: true
  }, 
  onSubmit, 
  isEdit = false, 
  isLoading = false 
}) => {
  const navigate = useNavigate();

  // Form validation
  const validateForm = (values) => {
    const errors = {};
    
    if (!values.title) {
      errors.title = 'Job title is required';
    }
    
    if (!values.description) {
      errors.description = 'Job description is required';
    }
    
    if (!values.location) {
      errors.location = 'Location is required';
    }
    
    if (!values.company) {
      errors.company = 'Company name is required';
    }
    
    if (!values.employment_type) {
      errors.employment_type = 'Employment type is required';
    }
    
    if (!values.experience_level) {
      errors.experience_level = 'Experience level is required';
    }
    
    if (!values.salary_min) {
      errors.salary_min = 'Minimum salary is required';
    } else if (isNaN(values.salary_min) || parseInt(values.salary_min) < 0) {
      errors.salary_min = 'Minimum salary must be a positive number';
    }
    
    if (!values.salary_max) {
      errors.salary_max = 'Maximum salary is required';
    } else if (isNaN(values.salary_max) || parseInt(values.salary_max) < 0) {
      errors.salary_max = 'Maximum salary must be a positive number';
    }
    
    if (values.salary_min && values.salary_max && 
        parseInt(values.salary_min) > parseInt(values.salary_max)) {
      errors.salary_max = 'Maximum salary must be greater than minimum salary';
    }
    
    if (!values.closing_date) {
      errors.closing_date = 'Closing date is required';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const closingDate = new Date(values.closing_date);
      
      if (closingDate < today) {
        errors.closing_date = 'Closing date cannot be in the past';
      }
    }
    
    return errors;
  };

  // Form submission handler
  const handleFormSubmit = async (values) => {
    // Convert string values to appropriate types
    const formattedValues = {
      ...values,
      salary_min: parseInt(values.salary_min),
      salary_max: parseInt(values.salary_max),
      is_active: Boolean(values.is_active)
    };
    
    await onSubmit(formattedValues);
  };

  // Initialize form with useFormValidation hook
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue
  } = useFormValidation(initialValues, validateForm, handleFormSubmit);

  // Options for select fields
  const employmentTypeOptions = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Temporary', label: 'Temporary' },
    { value: 'Internship', label: 'Internship' }
  ];
  
  const experienceLevelOptions = [
    { value: 'Entry-level', label: 'Entry level' },
    { value: 'Mid-level', label: 'Mid level' },
    { value: 'Senior', label: 'Senior' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Director', label: 'Director' },
    { value: 'Executive', label: 'Executive' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          name="title"
          label="Job Title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.title}
          required
        />
        
        <Input
          name="company"
          label="Company"
          value={values.company}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.company}
          required
        />
      </div>
      
      <Textarea
        name="description"
        label="Job Description"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        rows={6}
        required
        helpText="Provide a detailed description of the job responsibilities, requirements, and benefits."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          name="location"
          label="Location"
          value={values.location}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.location}
          required
          helpText="E.g., Remote, New York, Berlin, etc."
        />
        
        <Select
          name="employment_type"
          label="Employment Type"
          value={values.employment_type}
          options={employmentTypeOptions}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.employment_type}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          name="experience_level"
          label="Experience Level"
          value={values.experience_level}
          options={experienceLevelOptions}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.experience_level}
          required
        />
        
        <Input
          name="closing_date"
          label="Closing Date"
          type="date"
          value={values.closing_date}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.closing_date}
          required
          min={formatDateForInput(new Date())}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          name="salary_min"
          label="Minimum Salary"
          type="number"
          value={values.salary_min}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.salary_min}
          required
          min="0"
        />
        
        <Input
          name="salary_max"
          label="Maximum Salary"
          type="number"
          value={values.salary_max}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.salary_max}
          required
          min="0"
        />
      </div>
      
      {isEdit && (
        <div className="flex items-center">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={values.is_active}
            onChange={(e) => setValue('is_active', e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
            Active Job Listing (visible to candidates)
          </label>
        </div>
      )}
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          isLoading={isLoading}
        >
          {isEdit ? 'Update Job Listing' : 'Create Job Listing'}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;