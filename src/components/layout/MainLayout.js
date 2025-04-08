import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBadge from '../ui/NotificationBadge';

/**
 * Main layout component with navigation and sidebar
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const MainLayout = ({ children }) => {
  const { currentUser, userRole, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get navigation items based on user role
  const getNavigationItems = () => {
    if (userRole === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: 'chart-bar' },
        { name: 'Users', href: '/admin/users', icon: 'users' },
        { name: 'Statistics', href: '/admin/stats', icon: 'chart-pie' },
      ];
    } else if (userRole === 'recruiter') {
      return [
        { name: 'Dashboard', href: '/recruiter/dashboard', icon: 'chart-bar' },
        { name: 'Job Listings', href: '/recruiter/jobs', icon: 'briefcase' },
        { name: 'Applications', href: '/recruiter/applications', icon: 'document-text' },
      ];
    } else if (userRole === 'candidate') {
      return [
        { name: 'Dashboard', href: '/candidate/dashboard', icon: 'chart-bar' },
        { name: 'Browse Jobs', href: '/candidate/jobs', icon: 'search' },
        { name: 'My Applications', href: '/candidate/applications', icon: 'document-text' },
      ];
    }
    
    return [];
  };

  // Check if a navigation item is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Render icon based on name
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'chart-bar':
        return (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'chart-pie':
        return (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        );
      case 'briefcase':
        return (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'document-text':
        return (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'search':
        return (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        );
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 flex md:hidden"
          onClick={toggleSidebar}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        md:flex md:flex-shrink-0 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed inset-y-0 md:relative z-50 md:z-auto
      `}>
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          {/* Sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">RecruiteME</span>
            </Link>
            <button 
              onClick={toggleSidebar}
              className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Sidebar content */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {getNavigationItems().map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive(item.href) ? 'bg-gray-100 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <div className={`mr-3 ${isActive(item.href) ? 'text-primary' : 'text-gray-400'}`}>
                    {renderIcon(item.icon)}
                  </div>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User info */}
          {currentUser && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
                    {currentUser.name.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 truncate">{currentUser.name}</p>
                  <p className="text-xs font-medium text-gray-500 truncate capitalize">{currentUser.role}</p>
                </div>
              </div>
              <div className="mt-3">
                <Link
                  to="/profile"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 block mb-2"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-900"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top header */}
        <div className="bg-white border-b border-gray-200 h-16 flex">
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <button
                onClick={toggleSidebar}
                className="md:hidden px-4 text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Notification badge */}
              <NotificationBadge />
              
              {/* Profile dropdown */}
              <div className="relative">
                <div>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
                      {currentUser?.name.charAt(0)}
                    </div>
                  </button>
                </div>
                
                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile Settings
                      </Link>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;