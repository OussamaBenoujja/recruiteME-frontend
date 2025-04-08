import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import JobService from '../../services/job.service';
import useApiRequest from '../../hooks/useApiRequest';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatApplicationStatus } from '../../utils/formatUtils';
import { formatDate, timeAgo } from '../../utils/dateUtils';

/**
 * Page component for candidates to view their job applications
 * @returns {JSX.Element} - Rendered component
 */
const Applications = () => {
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState(location.state?.message || '');
  const [messageType, setMessageType] = useState(location.state?.type || 'info');
  const [withdrawId, setWithdrawId] = useState(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  // Initialize API request hooks
  const { 
    execute: fetchApplications, 
    isLoading, 
    error 
  } = useApiRequest(JobService.getMyApplications);
  
  const {
    execute: withdrawApplication,
    isLoading: isWithdrawLoading,
    error: withdrawError
  } = useApiRequest(JobService.withdrawApplication);

  // Fetch applications on component mount
  useEffect(() => {
    const getApplications = async () => {
      const result = await fetchApplications();
      
      if (result.success) {
        setApplications(result.data);
      }
    };
    
    getApplications();
    
    // Clear location state after reading it
    if (location.state?.message) {
      window.history.replaceState({}, document.title);
    }
  }, [fetchApplications, location.state?.message]);

  // Handle application withdrawal
  const handleWithdraw = async (id) => {
    setWithdrawId(id);
    setIsWithdrawing(true);
  };

  // Confirm application withdrawal
  const confirmWithdraw = async () => {
    const result = await withdrawApplication(withdrawId);
    
    if (result.success) {
      // Update the local state
      setApplications(applications.filter(app => app.id !== withdrawId));
      setMessage('Your application has been withdrawn successfully.');
      setMessageType('success');
    } else {
      setMessage(withdrawError || 'Failed to withdraw application. Please try again.');
      setMessageType('error');
    }
    
    setIsWithdrawing(false);
    setWithdrawId(null);
  };

  // Cancel application withdrawal
  const cancelWithdraw = () => {
    setIsWithdrawing(false);
    setWithdrawId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md ${
          messageType === 'success' 
            ? 'bg-green-50 border-l-4 border-green-400 text-green-700' 
            : messageType === 'error'
              ? 'bg-red-50 border-l-4 border-red-400 text-red-700'
              : 'bg-blue-50 border-l-4 border-blue-400 text-blue-700'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className={`h-5 w-5 ${
                messageType === 'success' 
                  ? 'text-green-400' 
                  : messageType === 'error'
                    ? 'text-red-400'
                    : 'text-blue-400'
              }`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                {messageType === 'success' ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : messageType === 'error' ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm0 8a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                )}
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{message}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setMessage('')}
                  className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    messageType === 'success' 
                      ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' 
                      : messageType === 'error'
                        ? 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                        : 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
                  }`}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && !message && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Failed to load your applications. Please try again.</p>
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
      ) : applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't applied to any jobs yet.</p>
          <div className="mt-6">
            <Link to="/candidate/jobs">
              <Button>
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map(application => {
            const status = formatApplicationStatus(application.status);
            
            return (
              <Card key={application.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-start">
                  <div className="flex-1 md:pr-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link to={`/candidate/jobs/${application.job_listing_id}`} className="hover:text-primary">
                          {application.job_listing.title}
                        </Link>
                      </h3>
                      <Badge variant={status.color}>{status.text}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {application.job_listing.company} • {application.job_listing.location}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Applied: {formatDate(application.created_at)} ({timeAgo(application.created_at)})
                    </p>
                    
                    {application.notes && (
                      <div className="bg-gray-50 p-3 rounded-md mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Your Notes</h4>
                        <p className="text-sm text-gray-600">{application.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/candidate/jobs/${application.job_listing_id}`}>
                        <Button size="sm" variant="outline">
                          View Job
                        </Button>
                      </Link>
                      
                      {/* Only show withdraw button if not already withdrawn or rejected */}
                      {application.status !== 'withdrawn' && application.status !== 'rejected' && (
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={() => handleWithdraw(application.id)}
                        >
                          Withdraw Application
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:border-l md:border-gray-200 md:pl-4 md:w-64 flex flex-col">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Application Status</h4>
                    <div className="space-y-2">
                      <div className={`flex items-center ${application.status === 'applied' || application.status === 'reviewing' || application.status === 'interview' || application.status === 'offered' ? 'text-green-600' : 'text-gray-400'}`}>
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">Application Submitted</span>
                      </div>
                      
                      <div className={`flex items-center ${application.status === 'reviewing' || application.status === 'interview' || application.status === 'offered' ? 'text-green-600' : 'text-gray-400'}`}>
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          {application.status === 'reviewing' || application.status === 'interview' || application.status === 'offered' ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          )}
                        </svg>
                        <span className="text-sm">Under Review</span>
                      </div>
                      
                      <div className={`flex items-center ${application.status === 'interview' || application.status === 'offered' ? 'text-green-600' : 'text-gray-400'}`}>
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          {application.status === 'interview' || application.status === 'offered' ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          )}
                        </svg>
                        <span className="text-sm">Interview</span>
                      </div>
                      
                      <div className={`flex items-center ${application.status === 'offered' ? 'text-green-600' : 'text-gray-400'}`}>
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          {application.status === 'offered' ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          )}
                        </svg>
                        <span className="text-sm">Offer</span>
                      </div>
                      
                      {application.status === 'rejected' && (
                        <div className="flex items-center text-red-600">
                          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm">Not Selected</span>
                        </div>
                      )}
                      
                      {application.status === 'withdrawn' && (
                        <div className="flex items-center text-gray-600">
                          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm">Withdrawn</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Withdraw confirmation modal */}
      {isWithdrawing && (
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
                      Withdraw Application
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to withdraw this application? This action cannot be undone,
                        and you may not be able to apply for this position again.
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
                  onClick={confirmWithdraw}
                  isLoading={isWithdrawLoading}
                >
                  Withdraw
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                  onClick={cancelWithdraw}
                  disabled={isWithdrawLoading}
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

export default Applications;