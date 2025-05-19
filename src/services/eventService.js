import axios from 'axios';

// Get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Create event
export const createEvent = async (eventData) => {
  try {
    const token = getToken();
    
    const response = await axios.post('/api/events', eventData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
};

// Get all events
export const getEvents = async (params = {}) => {
  try {
    const token = getToken();
    
    const response = await axios.get('/api/events', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
};

// Get upcoming events
export const getUpcomingEvents = async (limit = 5) => {
  try {
    const token = getToken();
    
    const response = await axios.get('/api/events/upcoming', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { limit }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
};

// Get event by ID
export const getEventById = async (id) => {
  try {
    const token = getToken();
    
    const response = await axios.get(`/api/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
};

// Update event
export const updateEvent = async (id, eventData) => {
  try {
    const token = getToken();
    
    const response = await axios.put(`/api/events/${id}`, eventData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
};

// Delete event
export const deleteEvent = async (id) => {
  try {
    const token = getToken();
    
    const response = await axios.delete(`/api/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
};