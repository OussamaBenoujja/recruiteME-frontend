import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import MainLayout from './components/layout/MainLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import RecruiterJobListings from './pages/recruiter/JobListings';

// Candidate pages
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateJobListings from './pages/candidate/JobListings';
import JobDetail from './pages/candidate/JobDetail';
import JobApplication from './pages/candidate/JobApplication';
import Applications from './pages/candidate/Applications';

// Protected route component
const ProtectedRoute = ({ element, requiredRole }) => {
  // Get current user and authentication status from context
  const { currentUser, isAuthenticated, isLoading, userRole } = React.useContext(AuthContext);
  
  // Show loading indicator while auth state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If role is required but user doesn't have it, redirect to their dashboard
  if (requiredRole && userRole !== requiredRole) {
    if (userRole === 'recruiter') {
      return <Navigate to="/recruiter/dashboard" />;
    } else if (userRole === 'candidate') {
      return <Navigate to="/candidate/dashboard" />;
    } else if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/login" />;
    }
  }
  
  // Render the protected component
  return (
    <MainLayout>
      {element}
    </MainLayout>
  );
};

// Public route component
const PublicRoute = ({ element }) => {
  const { isAuthenticated, userRole } = React.useContext(AuthContext);
  
  // If user is already authenticated, redirect to their dashboard
  if (isAuthenticated) {
    if (userRole === 'recruiter') {
      return <Navigate to="/recruiter/dashboard" />;
    } else if (userRole === 'candidate') {
      return <Navigate to="/candidate/dashboard" />;
    } else if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    }
  }
  
  // Render the public component
  return element;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute element={<Login />} />} />
            <Route path="/register" element={<PublicRoute element={<Register />} />} />
            
            {/* Recruiter Routes */}
            <Route 
              path="/recruiter/dashboard" 
              element={<ProtectedRoute element={<RecruiterDashboard />} requiredRole="recruiter" />} 
            />
            <Route 
              path="/recruiter/jobs" 
              element={<ProtectedRoute element={<RecruiterJobListings />} requiredRole="recruiter" />} 
            />
            
            {/* Candidate Routes */}
            <Route 
              path="/candidate/dashboard" 
              element={<ProtectedRoute element={<CandidateDashboard />} requiredRole="candidate" />} 
            />
            <Route 
              path="/candidate/jobs" 
              element={<ProtectedRoute element={<CandidateJobListings />} requiredRole="candidate" />} 
            />
            <Route 
              path="/candidate/jobs/:id" 
              element={<ProtectedRoute element={<JobDetail />} requiredRole="candidate" />} 
            />
            <Route 
              path="/candidate/jobs/:id/apply" 
              element={<ProtectedRoute element={<JobApplication />} requiredRole="candidate" />} 
            />
            <Route 
              path="/candidate/applications" 
              element={<ProtectedRoute element={<Applications />} requiredRole="candidate" />} 
            />
            
            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;