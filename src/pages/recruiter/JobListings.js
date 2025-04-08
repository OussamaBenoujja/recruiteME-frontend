import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobService from '../../services/job.service';
import useApiRequest from '../../hooks/useApiRequest';
import usePagination from '../../hooks/usePagination';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Pagination from '../../components/ui/Pagination';
import { formatCurrency } from '../../utils/formatUtils';
import { formatDate } from '../../utils/dateUtils';

/**
 * Page component for recruiter to manage job listings
 * @returns {JSX.Element} - Rendered component
 */
const JobListings = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Initialize API request hook for deleting jobs
  const { execute: deleteJob, isLoading: isDeleteLoading, error: deleteError } = useApiRequest(JobService.deleteJob);
  
  // Initialize pagination hook for job listings
  const {
    items: jobs,
    currentPage,
    totalPages,
    isLoading,
    error,
    goToPage,
    refresh
  } = usePagination(JobService.getAllJobs);

  // Handle job deletion
  const handleDelete = async (id) => {
    setIsDeleting(true);
    setDeleteId(id);
  };

  // Confirm job deletion
  const confirmDelete = async () => {
    const result = await deleteJob(deleteId);
    
    if (result.success) {
      refresh();
    }
    
    setIsDeleting(false);
    setDeleteId(null);
  };

  // Cancel job deletion
  const cancelDelete = () => {
    setIsDeleting(false);
    setDeleteId(null);
  };

  // Get badge color for job status
  const getStatusBadge = (job) => {
    const isActive = job.is_active;
    const today = new Date();
    const closingDate = new Date(job.closing_date);
    
    if (!isActive) {
      return { text: 'Inactive', variant: 'danger' };
    }
    
    if (closingDate < today) {
      return { text: 'Expired', variant: 'warning' };
    }
    
    return { text: 'Active', variant: 'success' };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
        <Link to="/recruiter/jobs/create">
          <Button>
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Job
          </Button>
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Failed to load job listings. Please try again.</p>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No job listings found</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first job listing to get started.</p>
          <div className="mt-6">
            <Link to="/recruiter/jobs/create">
              <Button>
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Job
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map(job => {
            const statusBadge = getStatusBadge(job);
            
            return (
              <Card key={job.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-1 md:pr-4">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900 mr-3">{job.title}</h3>
                      <Badge variant={statusBadge.variant}>{statusBadge.text}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {job.company} • {job.location} • {job.employment_type}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)} • 
                      Closing: {formatDate(job.closing_date)}
                    </p>
                    <div className="flex items-center space-x-4">
                      <Link to={`/recruiter/jobs/${job.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                      <Link to={`/recruiter/jobs/${job.id}/edit`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                      <Link to={`/recruiter/jobs/${job.id}/applications`}>
                        <Button size="sm" variant="primary">
                          View Applications
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="danger"
                        onClick={() => handleDelete(job.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {isDeleting && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Job Listing
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this job listing? This action cannot be undone,
                        and all applications for this job will also be deleted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  type="button"
                  variant="danger"
                  className="w-full sm:w-auto sm:ml-3"
                  onClick={confirmDelete}
                  isLoading={isDeleteLoading}
                >
                  Delete
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                  onClick={cancelDelete}
                  disabled={isDeleteLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListings;