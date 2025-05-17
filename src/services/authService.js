import mockAPI from './mockBackend';
import axios from 'axios';
import api from './api';

// API base URL for reference
const API_URL = 'https://erm-server.onrender.com/api';

// Register user
export const register = async (userData) => {
  try {
    console.log('Registering user with data:', userData);

    // Use our configured axios instance
    const response = await api.post('/users', userData);
    const data = response.data;

    if (data.success) {
      console.log('Registration successful:', data.data);

      // Save token and user data to local storage
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error);
    throw {
      success: false,
      error: error.response?.data?.error || error.message || 'Network error'
    };
  }
};

// Login user
export const login = async (email, password) => {
  try {
    // Use our configured axios instance
    const response = await api.post('/users/login', { email, password });
    const data = response.data;

    if (data.success) {
      // Save token and user data to local storage
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error);
    throw {
      success: false,
      error: error.response?.data?.error || error.message || 'Network error'
    };
  }
};

// Logout user
export const logout = () => {
  // Remove token and user data from local storage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    const userData = JSON.parse(userStr);
    // Handle nested user structure if it exists
    return userData.user || userData;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    console.log('No token or user data found in localStorage');
    return false;
  }

  try {
    // Parse the user data to make sure it's valid
    const userData = JSON.parse(userStr);

    // Check if we have the minimum required user data
    if (!userData || !userData.role || !userData._id) {
      console.log('Invalid user data in localStorage');
      return false;
    }

    console.log('User is authenticated:', userData.name);
    return true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    // Invalid user data, logout user
    logout();
    return false;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await api.get('/users/profile', config);
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error.response?.data || error);
    throw {
      success: false,
      error: error.response?.data?.error || error.message || 'Network error'
    };
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    console.log('Updating user profile with data:', userData);

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    // Extract employee data if present
    const { employeeData, ...userUpdateData } = userData;

    // Update user profile
    const response = await api.put('/users/profile', userUpdateData, config);
    const data = response.data;

    if (data.success) {
      console.log('User profile updated successfully:', data.data);

      // Update user data in local storage
      const currentUser = getCurrentUser();
      const updatedUser = { ...currentUser, ...data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Update employee data if provided
      if (employeeData && currentUser.employee?._id) {
        console.log('Updating employee data:', employeeData);

        try {
          // Use the employee service to update employee data
          const employeeResponse = await api.put(
            `/employees/${currentUser.employee._id}`,
            employeeData,
            config
          );

          if (employeeResponse.data.success) {
            console.log('Employee data updated successfully:', employeeResponse.data.data);

            // Update the employee data in the user object
            updatedUser.employee = {
              ...updatedUser.employee,
              ...employeeResponse.data.data
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } catch (employeeError) {
          console.error('Failed to update employee data:', employeeError.response?.data || employeeError);
          // Continue with the user update even if employee update fails
        }
      }
    }

    return data;
  } catch (error) {
    console.error('Failed to update user profile:', error.response?.data || error);
    throw {
      success: false,
      error: error.response?.data?.error || error.message || 'Network error'
    };
  }
};
