import api from './api';

// Get recent activities
export const getRecentActivities = async (params = {}) => {
  try {
    const response = await api.get('/activities', { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Get user activities
export const getUserActivities = async (userId, params = {}) => {
  try {
    const response = await api.get(`/activities/user/${userId}`, { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Create new activity
export const createActivity = async (activityData) => {
  try {
    const response = await api.post('/activities', activityData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
}; 