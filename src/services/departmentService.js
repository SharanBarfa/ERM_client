import api from './api';
import mockAPI from './mockBackend';
import axios from 'axios';

// Get all departments
export const getDepartments = async () => {
  try {
    const response = await api.get('/departments');
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error fetching departments:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch departments'
    };
  }
};

// Get department by ID
export const getDepartmentById = async (id) => {
  try {
    console.log(`Fetching department with ID: ${id}`);

    // Use real API
    const response = await api.get(`/departments/${id}`);
    console.log('Department response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching department:', error);
    return { success: false, data: null, error: 'Failed to fetch department' };
  }
};

// Create department (admin only)
export const createDepartment = async (departmentData) => {
  try {
    const response = await api.post('/departments', departmentData);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error creating department:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create department'
    };
  }
};

// Update department (admin only)
export const updateDepartment = async (id, departmentData) => {
  try {
    const response = await api.put(`/departments/${id}`, departmentData);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error updating department:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to update department'
    };
  }
};

// Delete department (admin only)
export const deleteDepartment = async (id) => {
  try {
    const response = await api.delete(`/departments/${id}`);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error deleting department:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to delete department'
    };
  }
};

// Get department stats
export const getDepartmentStats = async () => {
  try {
    const response = await api.get('/departments/stats');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};
