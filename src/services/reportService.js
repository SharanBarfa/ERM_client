import api from './api';

// Get all reports
export const getReports = async (params = {}) => {
  try {
    const response = await api.get('/reports', { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Get report by ID
export const getReportById = async (id) => {
  try {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Create report
export const createReport = async (reportData) => {
  try {
    const response = await api.post('/reports', reportData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Update report
export const updateReport = async (id, reportData) => {
  try {
    const response = await api.put(`/reports/${id}`, reportData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Delete report
export const deleteReport = async (id) => {
  try {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Generate report
export const generateReport = async (id) => {
  try {
    const response = await api.post(`/reports/${id}/generate`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};
