import React from 'react';
import useFormValidation from '../../hooks/useFormValidation';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

/**
 * Form component for editing user profile
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const ProfileForm = ({ 
  initialValues = {
    name: '',
    email: '',
    phone: '',
    about: ''
  }, 
  onSubmit, 
  isLoading = false 
}) => {
  // Form validation
  const validateForm = (values) => {
    const errors = {};
    
    if (!values.name) {
      errors.name = 'Name is required';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (values.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(values.phone)) {
      errors.phone = 'Phone number is invalid';
    }
    
    return errors;
  };

  // Form submission handler
  const handleFormSubmit = async (values) => {
    await onSubmit(values);
  };

  // Initialize form with useFormValidation hook
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit
  } = useFormValidation(initialValues, validateForm, handleFormSubmit);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        name="name"
        label="Full Name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        required
      />
      
      <Input
        name="email"
        label="Email Address"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        required
        disabled // Email can't be changed (typically)
      />
      
      <Input
        name="phone"
        label="Phone Number"
        value={values.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.phone}
        helpText="Format: +1 (123) 456-7890"
      />
      
      <Textarea
        name="about"
        label="About Me"
        value={values.about}
        onChange={handleChange}
        onBlur={handleBlur}
        rows={4}
        helpText="Tell us about yourself, your skills, and experience."
      />
      
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          isLoading={isLoading}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;