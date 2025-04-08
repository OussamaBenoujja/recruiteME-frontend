import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobService from '../../services/job.service';
import useApiRequest from '../../hooks/useApiRequest';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatApplicationStatus } from '../../utils/formatUtils';
import { formatDate } from '../../utils/dateUtils';

/**
 * Dashboard page for candidates
 * @returns {JSX.Element} - Rendered component
 */
const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    active: 0,
    interviews: 0,
    offers: 0
  });
  
  // Initialize API request hooks
  const { 
    execute: fetchApplications, 
    isLoading: isLoadingApplications, 
    error: applicationsError 
  } = useApiRequest(JobService.getMyApplications);
  
  const { 
    execute: fetchJobs, 
    isLoading: isLoadingJobs, 
    error: jobsError 
  } = useApiRequest(JobService.getAllJobs);

  // Fetch data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      // Fetch user's applications
      const applicationsResult = await fetchApplications();
      
      if (applicationsResult.success) {
        setApplications(applicationsResult.data.slice(0, 3)); // Get only the first 3
        
        // Calculate application stats
        const stats = {
          total: applicationsResult.data.length,
          active: applicationsResult.data.filter(app => 
            ['applied', 'reviewing', 'interview'].includes(app.status)
          ).length,
          interviews: applicationsResult.data.filter(app => 
            app.status === 'interview'
          ).length,
          offers: applicationsResult.data.filter(app => 
            app.status === 'offered'
          ).length
        };
        
        setApplicationStats(stats);
      }
      
      // Fetch recommended jobs
      const jobsResult = await fetchJobs({ 
        is_active: true,
        per_page: 3,
        sort: 'created_at',
        order: 'desc'
      });
      
      if (jobsResult.success) {
        setRecommendedJobs(jobsResult.data);
      }
    };
    
    loadDashboardData();
  }, [fetchApplications, fetchJobs]);

  // Generate stats cards
  const StatCard = ({ title, value, icon, color }) => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className={`rounded-full p-3 ${color}`}>
            {icon}
          </div>
          <div className="ml-5">
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Candidate Dashboard</h1>
        <Link to="/candidate/jobs">
          <Button>
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Find Jobs
          </Button>
        </Link>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Applications" 
          value={applicationStats.total}
          icon={
            <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          color="bg-blue-100"
        />
        
        <StatCard 
          title="Active Applications" 
          value={applicationStats.active}
          icon={
            <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="bg-green-100"
        />
        
        <StatCard 
          title="Interviews" 
          value={applicationStats.interviews}
          icon={
            <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="bg-purple-100"
        />
        
        <StatCard 
          title="Offers" 
          value={applicationStats.offers}
          icon={
            <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          }
          color="bg-yellow-100"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card 
          title="Recent Applications" 
          subtitle="Status of your latest job applications" 
          footer={
            <Link to="/candidate/applications" className="text-primary hover:text-primary-dark font-medium text-sm">
              View All Applications →
            </Link>
          }
        >
          {isLoadingApplications ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : applicationsError ? (
            <div className="text-sm text-red-600">
              Failed to load your applications. Please refresh the page.
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-6">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
              <p className="mt-1 text-sm text-gray-500">Start applying for jobs to track your progress.</p>
              <div className="mt-6">
                <Link to="/candidate/jobs">
                  <Button size="sm">Browse Jobs</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {applications.map(application => {
                const status = formatApplicationStatus(application.status);
                
                return (
                  <div key={application.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          <Link to={`/candidate/jobs/${application.job_listing_id}`} className="hover:text-primary">
                            {application.job_listing.title}
                          </Link>
                        </h4>
                        <p className="text-xs text-gray-500 mb-1">
                          {application.job_listing.company} • {application.job_listing.location}
                        </p>
                        <p className="text-xs text-gray-500">
                          Applied: {formatDate(application.created_at)}
                        </p>
                      </div>
                      <Badge variant={status.color} size="sm">{status.text}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
        
        {/* Recommended Jobs */}
        <Card 
          title="Recommended Jobs" 
          subtitle="New opportunities that match your profile" 
          footer={
            <Link to="/candidate/jobs" className="text-primary hover:text-primary-dark font-medium text-sm">
              View All Jobs →
            </Link>
          }
        >
          {isLoadingJobs ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : jobsError ? (
            <div className="text-sm text-red-600">
              Failed to load recommended jobs. Please refresh the page.
            </div>
          ) : recommendedJobs.length === 0 ? (
            <div className="text-center py-6">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs available</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recommendedJobs.map(job => (
                <div key={job.id} className="py-4 first:pt-0 last:pb-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    <Link to={`/candidate/jobs/${job.id}`} className="hover:text-primary">
                      {job.title}
                    </Link>
                  </h4>
                  <p className="text-xs text-gray-500 mb-1">
                    {job.company} • {job.location} • {job.employment_type}
                  </p>
                  <p className="text-xs text-gray-500">
                    Posted: {formatDate(job.created_at)}
                  </p>
                  <div className="mt-2">
                    <Link to={`/candidate/jobs/${job.id}/apply`}>
                      <Button size="sm" variant="outline">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      
      {/* Job Search Tips */}
      <div className="mt-6">
        <Card title="Job Search Tips" subtitle="Improve your chances of landing your dream job">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="rounded-full p-3 bg-blue-100 text-blue-600 inline-flex mb-3">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Perfect Your Resume</h3>
              <p className="text-sm text-gray-600">
                Tailor your resume for each job application. Highlight relevant skills and experience that match the job requirements.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="rounded-full p-3 bg-green-100 text-green-600 inline-flex mb-3">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Prepare for Interviews</h3>
              <p className="text-sm text-gray-600">
                Research the company, practice common interview questions, and prepare examples of your achievements.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="rounded-full p-3 bg-purple-100 text-purple-600 inline-flex mb-3">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Network Effectively</h3>
              <p className="text-sm text-gray-600">
                Build and maintain professional relationships. Many job opportunities come through personal connections.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CandidateDashboard;