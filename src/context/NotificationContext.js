import React, { createContext, useState, useContext, useEffect } from 'react';
import NotificationService from '../services/notification.service';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Set up interval to check for new notifications
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await NotificationService.getNotifications();
      setNotifications(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await NotificationService.getUnreadCount();
      setUnreadCount(response.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read_at: new Date().toISOString() } 
            : notification
        )
      );
      
      // Refresh unread count
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    isLoading,
    refreshNotifications: fetchNotifications,
    refreshUnreadCount: fetchUnreadCount,
    markAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;