import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobService from '../../services/job.service';
import usePagination from '../../hooks/usePagination';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { formatCurrency } from '../../utils/formatUtils';
import { formatDate } from '../../utils/dateUtils';

/**
 * Page component for candidates to browse job listings
 * @returns {JSX.Element} - Rendered component
 */
const CandidateJobListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    employment_type: '',
    experience_level: ''
  });
  
  // Initialize pagination hook for job listings
  const {
    items: jobs,
    currentPage,
    totalPages,
    isLoading,
    error,
    goToPage,
    updateParams
  } = usePagination(JobService.getAllJobs, { 
    is_active: true, 
    sort: 'created_at',
    order: 'desc'
  });

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: searchTerm });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    setFilters({
      ...filters,
      [name]: value
    });
    
    updateParams({
      ...filters,
      [name]: value
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      location: '',
      employment_type: '',
      experience_level: ''
    });
    
    updateParams({
      search: '',
      location: '',
      employment_type: '',
      experience_level: ''
    });
  };

  // Options for filters
  const employmentTypeOptions = [
    { value: '', label: 'All Employment Types' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Temporary', label: 'Temporary' },
    { value: 'Internship', label: 'Internship' }
  ];
  
  const experienceLevelOptions = [
    { value: '', label: 'All Experience Levels' },
    { value: 'Entry-level', label: 'Entry level' },
    { value: 'Mid-level', label: 'Mid level' },
    { value: 'Senior', label: 'Senior' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Director', label: 'Director' },
    { value: 'Executive', label: 'Executive' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Your Next Job</h1>
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              name="search"
              placeholder="Search by job title, company, skills, etc."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-full"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="font-medium text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              name="location"
              placeholder="Location (e.g. Remote, New York)"
              value={filters.location}
              onChange={handleFilterChange}
            />
            
            <Select
              name="employment_type"
              options={employmentTypeOptions}
              value={filters.employment_type}
              onChange={handleFilterChange}
            />
            
            <Select
              name="experience_level"
              options={experienceLevelOptions}
              value={filters.experience_level}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </div>
        </div>
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
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or check back later.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map(job => (
            <Card key={job.id} className="hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col md:flex-row md:items-start">
                <div className="flex-1 md:pr-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    <Link to={`/candidate/jobs/${job.id}`} className="hover:text-primary">
                      {job.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="font-medium">{job.company}</span> • {job.location} • {job.employment_type}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)} • 
                    {job.experience_level} • 
                    Posted: {formatDate(job.created_at)}
                  </p>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/candidate/jobs/${job.id}`}>
                      <Button size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/candidate/jobs/${job.id}/apply`}>
                      <Button size="sm" variant="outline">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block text-right md:pl-4 md:border-l md:border-gray-200 mt-4 md:mt-0">
                  <p className="text-sm text-gray-500">
                    Closing: <span className="font-medium">{formatDate(job.closing_date)}</span>
                  </p>
                </div>
              </div>
            </Card>
          ))}
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
};

export default CandidateJobListings;