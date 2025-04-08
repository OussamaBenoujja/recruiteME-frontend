import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import JobService from '../../services/job.service';
import useApiRequest from '../../hooks/useApiRequest';
import Card from '../../components/ui/Card';
import ApplicationForm from '../../components/forms/ApplicationForm';
import { formatCurrency } from '../../utils/formatUtils';
import { formatDate } from '../../utils/dateUtils';

/**
 * Page component for candidates to apply for a job
 * @returns {JSX.Element} - Rendered component
 */
const JobApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [formError, setFormError] = useState('');
  
  // Initialize API request hooks
  const { execute: fetchJob, isLoading: isLoadingJob, error: jobError } = useApiRequest(JobService.getJobById);
  const { execute: applyForJob, isLoading: isSubmitting, error: submitError } = useApiRequest(JobService.applyForJob);

  // Fetch job details on component mount
  useEffect(() => {
    const getJobDetails = async () => {
      const result = await fetchJob(id);
      
      if (result.success) {
        setJob(result.data);
        
        // Check if job is closed
        const isClosed = !result.data.is_active || new Date(result.data.closing_date) < new Date();
        if (isClosed) {
          setFormError('This position is no longer accepting applications as it has closed.');
        }
      }
    };
    
    getJobDetails();
  }, [fetchJob, id]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setFormError('');
    
    const result = await applyForJob(formData);
    
    if (result.success) {
      // Redirect to applications page with success message
      navigate('/candidate/applications', { 
        state: { 
          message: 'Your application has been submitted successfully.',
          type: 'success'
        } 
      });
    } else {
      setFormError(result.error || 'There was an error submitting your application. Please try again.');
    }
  };

  if (isLoadingJob) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (jobError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Failed to load job details. The job listing may no longer exist.</p>
              <Link to="/candidate/jobs" className="text-sm font-medium text-red-700 underline">
                Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  // Check if job is closed
  const isClosed = !job.is_active || new Date(job.closing_date) < new Date();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/candidate/jobs/${id}`} className="inline-flex items-center text-primary hover:text-primary-dark">
          <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Job Details
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card title="Apply for this Position">
            {formError || isClosed ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      {formError || 'This position is no longer accepting applications as it has closed.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <ApplicationForm 
                jobListingId={id} 
                onSubmit={handleSubmit} 
                isLoading={isSubmitting} 
              />
            )}
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card title="Job Summary">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{job.title}</h3>
            <p className="text-sm text-gray-600 mb-1">{job.company}</p>
            <p className="text-sm text-gray-500 mb-4">
              {job.location} • {job.employment_type}
            </p>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Salary Range:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}
                </span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Experience:</span>
                <span className="text-sm font-medium text-gray-900">{job.experience_level}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Posted:</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(job.created_at)}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Closing:</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(job.closing_date)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Application Tips</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Tailor your resume to match the job requirements</li>
                <li>Include relevant experience and skills</li>
                <li>Proofread all documents before submission</li>
                <li>Use your cover letter to explain why you're a great fit</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;