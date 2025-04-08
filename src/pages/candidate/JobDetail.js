import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import JobService from '../../services/job.service';
import useApiRequest from '../../hooks/useApiRequest';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatUtils';
import { formatDate } from '../../utils/dateUtils';

/**
 * Page component for candidates to view job details
 * @returns {JSX.Element} - Rendered component
 */
const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  
  // Initialize API request hook for fetching job details
  const { 
    execute: fetchJob, 
    isLoading, 
    error 
  } = useApiRequest(JobService.getJobById);

  // Fetch job details on component mount
  useEffect(() => {
    const getJobDetails = async () => {
      const result = await fetchJob(id);
      
      if (result.success) {
        setJob(result.data);
      }
    };
    
    getJobDetails();
  }, [fetchJob, id]);

  // Format the job description with paragraphs
  const formatDescription = (description) => {
    if (!description) return null;
    
    return description.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph}
      </p>
    ));
  };

  // Handle apply button click
  const handleApply = () => {
    navigate(`/candidate/jobs/${id}/apply`);
  };

  if (isLoading) {
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

  if (error) {
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
        <Link to="/candidate/jobs" className="inline-flex items-center text-primary hover:text-primary-dark">
          <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Jobs
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-lg text-gray-600 mb-1">{job.company}</p>
              <p className="text-sm text-gray-500">
                {job.location} • {job.employment_type} • {job.experience_level}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 md:ml-6 md:text-right flex flex-col items-start md:items-end">
              <p className="text-lg font-medium text-gray-900 mb-1">
                {formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Closing Date: {formatDate(job.closing_date)}
              </p>
              
              {/* Apply button */}
              {isClosed ? (
                <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400 cursor-not-allowed">
                  Position Closed
                </div>
              ) : (
                <Button
                  onClick={handleApply}
                  size="lg"
                >
                  Apply Now
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mt-4">
            <svg className="h-5 w-5 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Posted: {formatDate(job.created_at)}
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
          <div className="prose max-w-none text-gray-700">
            {formatDescription(job.description)}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">How to Apply</h2>
            <p className="text-gray-700 mb-4">
              Use the button below to submit your application. You'll need to upload your resume and can optionally include a cover letter.
            </p>
            
            {isClosed ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      This position is no longer accepting applications as it has closed.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleApply} size="lg">
                  Apply for this Position
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.print()}
                  size="lg"
                >
                  Print Job Details
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;