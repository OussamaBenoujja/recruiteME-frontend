import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import useFormValidation from '../../hooks/useFormValidation';

/**
 * Registration page component
 * @returns {JSX.Element} - Rendered component
 */
const Register = () => {
  const { register } = useAuth();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initial form values
  const initialValues = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: ''
  };

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
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!values.password_confirmation) {
      errors.password_confirmation = 'Password confirmation is required';
    } else if (values.password !== values.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }
    
    if (!values.role) {
      errors.role = 'Please select a role';
    }
    
    return errors;
  };

  // Form submission handler
  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    setServerError('');
    
    try {
      const result = await register(values);
      
      if (!result.success) {
        setServerError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setServerError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize form with useFormValidation hook
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit
  } = useFormValidation(initialValues, validateForm, handleFormSubmit);

  // Options for role select
  const roleOptions = [
    { value: 'candidate', label: 'Job Seeker (Candidate)' },
    { value: 'recruiter', label: 'Recruiter / Employer' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {serverError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{serverError}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              name="name"
              label="Full Name"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              required
            />
            
            <Input
              name="email"
              label="Email address"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              required
            />
            
            <Input
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              required
              helpText="Password must be at least 8 characters long"
            />
            
            <Input
              name="password_confirmation"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              value={values.password_confirmation}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password_confirmation}
              required
            />
            
            <Select
              name="role"
              label="Account Type"
              value={values.role}
              options={roleOptions}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.role}
              required
              helpText="Select the type of account you want to create"
            />

            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                size="lg"
              >
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;