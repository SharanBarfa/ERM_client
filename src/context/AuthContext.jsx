import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as authService from '../services/authService';
import { TOKEN_KEY, USER_KEY } from '../config';

// Create context
const AuthContext = createContext();

// Create provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      try {
        console.log('Initializing auth state');

        // Check if there's a token and user data in localStorage
        const token = localStorage.getItem(TOKEN_KEY);
        const userStr = localStorage.getItem(USER_KEY);

        if (token && userStr) {
          try {
            // Parse the user data
            const userData = JSON.parse(userStr);
            console.log('Found user data in localStorage:', userData.name);

            // Set the user in state
            setUser(userData);

            // Refresh the user profile in the background
            authService.getUserProfile()
              .then(response => {
                if (response.success) {
                  console.log('Refreshed user profile:', response.data);
                  setUser(response.data);
                }
              })
              .catch(error => {
                console.error('Failed to refresh user profile:', error);
              });
          } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
          }
        } else {
          console.log('No token or user data found in localStorage');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('Registering user with data:', userData);

      const response = await authService.register(userData);
      console.log('Registration response:', response);

      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }

      // Extract user data from the response
      const userDataFromResponse = response.data;

      // Ensure we set the user in state
      setUser(userDataFromResponse);

      // Make sure localStorage is updated with the token and user data
      localStorage.setItem(TOKEN_KEY, userDataFromResponse.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userDataFromResponse));

      console.log('User data after registration:', userDataFromResponse);
      toast.success('Registration successful!');

      // Add a small delay to ensure state is updated before navigation
      setTimeout(() => {
        // Redirect based on user role
        if (userDataFromResponse.role === 'admin') {
          console.log('Redirecting to admin dashboard');
          navigate('/admin/dashboard');
        } else {
          console.log('Redirecting to employee dashboard');
          navigate('/employee/dashboard');
        }
      }, 100);

      return response;
    } catch (error) {
      console.error('Registration error in context:', error);
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting login with email:', email);

      const response = await authService.login(email, password);
      console.log('Login response:', response);

      if (!response.success) {
        throw new Error(response.error || 'Login failed');
      }

      // Extract user data and token from the response
      const userData = response.data.user || response.data;
      const token = response.data.token || userData.token;

      // Ensure we set the user in state
      setUser(userData);

      // Make sure localStorage is updated with the token and user data
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      console.log('Saved token to localStorage:', token);

      console.log('User data after login:', userData);
      toast.success('Login successful!');

      // Add a small delay to ensure state is updated before navigation
      setTimeout(() => {
        // Redirect based on user role
        if (userData.role === 'admin') {
          console.log('Redirecting to admin dashboard');
          navigate('/admin/dashboard');
        } else {
          console.log('Redirecting to employee dashboard');
          navigate('/employee/dashboard');
        }
      }, 100);

      return response;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info('Logged out successfully');
    navigate('/');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.updateUserProfile(userData);
      setUser(response.data);
      toast.success('Profile updated successfully!');
      return response;
    } catch (error) {
      toast.error(error.error || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user profile
  const refreshProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getUserProfile();
      console.log('Refreshed profile:', response.data);
      setUser(response.data);
      return response;
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        refreshProfile,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
