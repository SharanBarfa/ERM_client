import api from './api';
import mockAPI from './mockBackend';
import axios from 'axios';

// Get all employees
export const getEmployees = async (params = {}) => {
  try {
    const response = await api.get('/employees', { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Get employee by ID
export const getEmployeeById = async (id) => {
  try {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Create employee
export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post('/employees', employeeData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Update employee
export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Delete employee
export const deleteEmployee = async (id) => {
  try {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Get employee stats
export const getEmployeeStats = async () => {
  try {
    const response = await api.get('/employees/stats');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Get current employee information
export const getCurrentEmployee = async () => {
  try {
    console.log('Fetching current employee information');

    // First get the current user's profile
    const userResponse = await api.get('/users/profile');
    console.log('User profile response:', userResponse.data);

    // Handle different user data structures
    const userData = userResponse.data.data || userResponse.data;
    const employeeId = userData?.employee?._id;

    console.log('Extracted employee ID:', employeeId);

    if (!employeeId) {
      console.warn('No employee ID found in user data');

      // If no employee ID is found, create a basic employee record with user data
      // This helps the UI display something even if the employee record doesn't exist yet
      return {
        success: true,
        data: {
          _id: userData?._id,
          firstName: userData?.name?.split(' ')[0] || '',
          lastName: userData?.name?.split(' ').slice(1).join(' ') || '',
          email: userData?.email,
          phone: userData?.phone || '',
          // Use employee data from user profile if available
          employeeId: userData?.employee?.employeeId || 'Not assigned',
          position: userData?.employee?.position || 'Not assigned',
          department: userData?.employee?.department || { name: 'Not assigned' },
          joinDate: userData?.employee?.joinDate || new Date().toISOString(),
          isUserAccount: true // Flag to indicate this is a user account without a full employee record
        }
      };
    }

    // Get the employee details
    const response = await api.get(`/employees/${employeeId}`);
    console.log('Employee details response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching current employee:', error);

    // Try to get at least the user data to display something
    try {
      const userResponse = await api.get('/users/profile');
      const userData = userResponse.data.data || userResponse.data;

      return {
        success: true,
        data: {
          _id: userData?._id,
          firstName: userData?.name?.split(' ')[0] || '',
          lastName: userData?.name?.split(' ').slice(1).join(' ') || '',
          email: userData?.email,
          phone: userData?.phone || '',
          employeeId: userData?.employee?.employeeId || 'Not assigned',
          position: userData?.employee?.position || 'Not assigned',
          department: userData?.employee?.department || { name: 'Not assigned' },
          joinDate: userData?.employee?.joinDate || new Date().toISOString(),
          isUserAccount: true
        }
      };
    } catch (userError) {
      console.error('Error fetching user profile as fallback:', userError);
      return { success: false, error: 'Failed to fetch employee information' };
    }
  }
};

// Get employee attendance statistics
export const getEmployeeAttendanceStats = async (employeeId, period = 'month') => {
  try {
    console.log(`Fetching attendance stats for employee ${employeeId} for ${period}`);

    // Calculate date range based on period
    const now = new Date();
    let startDate, endDate;

    if (period === 'week') {
      // Last 7 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      endDate = now;
    } else if (period === 'month') {
      // Current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (period === 'year') {
      // Current year
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    }

    // Format dates for API
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    // Get attendance records for this employee in the date range
    const response = await api.get('/attendance', {
      params: {
        employee: employeeId,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      }
    });

    console.log('Attendance stats response:', response.data);

    // Calculate statistics from the attendance records
    const records = response.data.data || [];
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0,
      totalWorkDays: records.length,
      totalWorkHours: 0,
      averageWorkHours: 0
    };

    // Process records
    records.forEach(record => {
      // Count by status
      if (record.status) {
        stats[record.status] = (stats[record.status] || 0) + 1;
      }

      // Sum work hours
      if (record.workHours) {
        stats.totalWorkHours += record.workHours;
      }
    });

    // Calculate average work hours
    if (stats.present > 0) {
      stats.averageWorkHours = stats.totalWorkHours / stats.present;
      // Round to 2 decimal places
      stats.averageWorkHours = Math.round(stats.averageWorkHours * 100) / 100;
    }

    // Round total work hours to 2 decimal places
    stats.totalWorkHours = Math.round(stats.totalWorkHours * 100) / 100;

    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching employee attendance stats:', error);
    return { success: false, error: 'Failed to fetch attendance statistics' };
  }
};
