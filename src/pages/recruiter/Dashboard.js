import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../../services/user.service';
import JobService from '../../services/job.service';
import useApiRequest from '../../hooks/useApiRequest';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatApplicationStatus } from '../../utils/formatUtils';

/**
 * Dashboard page for recruiters
 * @returns {JSX.Element} - Rendered component
 */
const RecruiterDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  
  // Initialize API request hooks
  const { 
    execute: fetchStats, 
    isLoading: isLoadingStats, 
    error: statsError 
  } = useApiRequest(UserService.getRecruiterStats);
  
  const { 
    execute: fetchApplications, 
    isLoading: isLoadingApplications, 
    error: applicationsError 
  } = useApiRequest(JobService.getApplications);

  // Fetch data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      // Fetch recruiter stats
      const statsResult = await fetchStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }
      
      // Fetch recent applications
      const applicationsResult = await fetchApplications({ 
        page: 1, 
        per_page: 5,
        sort: 'created_at',
        order: 'desc'
      });
      
      if (applicationsResult.success) {
        setRecentApplications(applicationsResult.data);
      }
    };
    
    loadDashboardData();
  }, [fetchStats, fetchApplications]);

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
        <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
        <Link to="/recruiter/jobs/create">
          <Button>
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Post New Job
          </Button>
        </Link>
      </div>
      
      {/* Stats Grid */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="flex items-center">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="ml-5 w-full">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : statsError ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Failed to load dashboard statistics. Please refresh the page.</p>
            </div>
          </div>
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Active Job Listings" 
            value={stats.active_jobs || 0}
            icon={
              <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            color="bg-blue-100"
          />
          
          <StatCard 
            title="Total Applications" 
            value={stats.total_applications || 0}
            icon={
              <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            color="bg-green-100"
          />
          
          <StatCard 
            title="New Applications" 
            value={stats.new_applications || 0}
            icon={
              <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="bg-yellow-100"
          />
          
          <StatCard 
            title="Jobs Closing Soon" 
            value={stats.closing_soon_jobs || 0}
            icon={
              <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="bg-red-100"
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card 
          title="Recent Applications" 
          subtitle="Latest job applications received" 
          footer={
            <Link to="/recruiter/applications" className="text-primary hover:text-primary-dark font-medium text-sm">
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
              Failed to load recent applications. Please refresh the page.
            </div>
          ) : recentApplications.length === 0 ? (
            <div className="text-center py-6">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
              <p className="mt-1 text-sm text-gray-500">Wait for candidates to apply to your job listings.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentApplications.map(application => {
                const status = formatApplicationStatus(application.status);
                
                return (
                  <div key={application.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          <Link to={`/recruiter/applications/${application.id}`} className="hover:text-primary">
                            {application.user.name}
                          </Link>
                        </h4>
                        <p className="text-xs text-gray-500">
                          Applied for: {application.job_listing.title}
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
        
        {/* Quick Actions */}
        <Card title="Quick Actions" subtitle="Tools to manage your recruiting process">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/recruiter/jobs/create" 
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="rounded-full p-2 bg-primary/10 text-primary mr-4">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Post New Job</h3>
                  <p className="text-xs text-gray-500">Create a new job listing</p>
                </div>
              </Link>
              
              <Link 
                to="/recruiter/applications" 
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="rounded-full p-2 bg-green-100 text-green-600 mr-4">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Review Applications</h3>
                  <p className="text-xs text-gray-500">Manage candidate applications</p>
                </div>
              </Link>
              
              <Link 
                to="/recruiter/jobs" 
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="rounded-full p-2 bg-blue-100 text-blue-600 mr-4">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Manage Jobs</h3>
                  <p className="text-xs text-gray-500">Edit or update job listings</p>
                </div>
              </Link>
              
              <Link 
                to="/profile" 
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="rounded-full p-2 bg-purple-100 text-purple-600 mr-4">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Profile Settings</h3>
                  <p className="text-xs text-gray-500">Update your company profile</p>
                </div>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterDashboard;