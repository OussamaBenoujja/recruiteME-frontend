import api from './api';

const UserService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  
  // Delete user (admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
  
  // Get recruiter stats
  getRecruiterStats: async () => {
    const response = await api.get('/stats/recruiter');
    return response.data;
  },
  
  // Get global stats (admin only)
  getGlobalStats: async () => {
    const response = await api.get('/stats/global');
    return response.data;
  }
};

export default UserService;