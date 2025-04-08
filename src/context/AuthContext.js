import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = () => {
      const user = AuthService.getCurrentUser();
      setCurrentUser(user);
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await AuthService.login(credentials);
      setCurrentUser(data.user);
      
      // Redirect based on role
      if (data.user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else if (data.user.role === 'candidate') {
        navigate('/candidate/dashboard');
      } else if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await AuthService.register(userData);
      setCurrentUser(data.user);
      
      // Redirect based on role
      if (data.user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else if (data.user.role === 'candidate') {
        navigate('/candidate/dashboard');
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    userRole: currentUser?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;