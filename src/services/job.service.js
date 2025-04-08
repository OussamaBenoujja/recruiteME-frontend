import api from './api';

const JobService = {
  // Get all job listings
  getAllJobs: async (params = {}) => {
    const response = await api.get('/job-listings', { params });
    return response.data;
  },
  
  // Get a single job listing
  getJobById: async (id) => {
    const response = await api.get(`/job-listings/${id}`);
    return response.data;
  },
  
  // Create a new job listing (recruiter)
  createJob: async (jobData) => {
    const response = await api.post('/job-listings', jobData);
    return response.data;
  },
  
  // Update a job listing (recruiter)
  updateJob: async (id, jobData) => {
    const response = await api.put(`/job-listings/${id}`, jobData);
    return response.data;
  },
  
  // Delete a job listing (recruiter)
  deleteJob: async (id) => {
    const response = await api.delete(`/job-listings/${id}`);
    return response.data;
  },
  
  // Apply for a job (candidate)
  applyForJob: async (applicationData) => {
    const formData = new FormData();
    
    // Append regular data
    formData.append('job_listing_id', applicationData.jobListingId);
    if (applicationData.notes) {
      formData.append('notes', applicationData.notes);
    }
    
    // Append files
    if (applicationData.cv) {
      formData.append('cv', applicationData.cv);
    }
    
    if (applicationData.coverLetter) {
      formData.append('cover_letter', applicationData.coverLetter);
    }
    
    const response = await api.post('/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },
  
  // Get applications (for recruiter)
  getApplications: async (params = {}) => {
    const response = await api.get('/applications', { params });
    return response.data;
  },
  
  // Get my applications (for candidate)
  getMyApplications: async () => {
    const response = await api.get('/applications/my');
    return response.data;
  },
  
  // Update application status (for recruiter)
  updateApplicationStatus: async (id, status) => {
    const response = await api.put(`/applications/${id}/status`, { status });
    return response.data;
  },
  
  // Withdraw application (for candidate)
  withdrawApplication: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  }
};

export default JobService;