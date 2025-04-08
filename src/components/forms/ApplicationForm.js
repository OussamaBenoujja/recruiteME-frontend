import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormValidation from '../../hooks/useFormValidation';
import Textarea from '../ui/Textarea';
import FileInput from '../ui/FileInput';
import Button from '../ui/Button';

/**
 * Form component for job applications
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const ApplicationForm = ({ 
  jobListingId, 
  onSubmit, 
  isLoading = false 
}) => {
  const navigate = useNavigate();
  const [fileErrors, setFileErrors] = useState({});

  // Initial form values
  const initialValues = {
    notes: '',
    cv: null,
    coverLetter: null
  };

  // Form validation
  const validateForm = (values) => {
    const errors = {};
    const fileErrors = {};
    
    if (!values.cv) {
      fileErrors.cv = 'Resume/CV is required';
    }
    
    setFileErrors(fileErrors);
    return errors;
  };

  // Form submission handler
  const handleFormSubmit = async (values) => {
    // Check for file errors before submission
    if (Object.keys(fileErrors).length > 0) {
      return;
    }
    
    // Add job listing ID to form data
    const formData = {
      ...values,
      jobListingId
    };
    
    await onSubmit(formData);
  };

  // Initialize form with useFormValidation hook
  const {
    values,
    errors,
    handleChange,
    handleFileChange,
    handleBlur,
    handleSubmit
  } = useFormValidation(initialValues, validateForm, handleFormSubmit);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FileInput
        name="cv"
        label="Resume/CV"
        onChange={handleFileChange}
        onBlur={handleBlur}
        error={fileErrors.cv}
        required
        accept=".pdf,.doc,.docx"
        helpText="Upload your resume/CV (PDF, DOC, or DOCX, max 5MB)"
      />
      
      <FileInput
        name="coverLetter"
        label="Cover Letter (Optional)"
        onChange={handleFileChange}
        onBlur={handleBlur}
        accept=".pdf,.doc,.docx"
        helpText="Upload your cover letter (PDF, DOC, or DOCX, max 5MB)"
      />
      
      <Textarea
        name="notes"
        label="Additional Notes (Optional)"
        value={values.notes}
        onChange={handleChange}
        onBlur={handleBlur}
        rows={4}
        helpText="Any additional information you'd like to share with the recruiter."
      />
      
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
          Submit Application
        </Button>
      </div>
    </form>
  );
};

export default ApplicationForm;