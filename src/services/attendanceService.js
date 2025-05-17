import api from './api';
import mockAPI from './mockBackend';

// Get all attendance records
export const getAttendanceRecords = async (params = {}) => {
  try {
    const response = await api.get('/attendance', { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Get attendance record by ID
export const getAttendanceById = async (id) => {
  try {
    const response = await api.get(`/attendance/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Create attendance record
export const createAttendance = async (attendanceData) => {
  try {
    const response = await api.post('/attendance', attendanceData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Update attendance record
export const updateAttendance = async (id, attendanceData) => {
  try {
    const response = await api.put(`/attendance/${id}`, attendanceData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Delete attendance record
export const deleteAttendance = async (id) => {
  try {
    const response = await api.delete(`/attendance/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Check in employee
export const checkIn = async (employeeId, location = '') => {
  try {
    console.log('Checking in employee:', employeeId);

    // If no employeeId is provided, try to get it from the user profile
    if (!employeeId) {
      try {
        const userResponse = await api.get('/users/profile');
        const userData = userResponse.data.data || userResponse.data;
        employeeId = userData?.employee?._id;

        if (!employeeId) {
          return {
            success: false,
            error: 'No employee ID found. Please complete your profile setup first.'
          };
        }
      } catch (userError) {
        console.error('Error fetching user profile for check-in:', userError);
        return {
          success: false,
          error: 'Failed to get employee information. Please try again later.'
        };
      }
    }

    const response = await api.post('/attendance/check-in', { employeeId, location });
    console.log('Check-in response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking in:', error);
    return { success: false, error: error.response?.data?.error || 'Failed to check in' };
  }
};

// Check out employee
export const checkOut = async (employeeId, location = '') => {
  try {
    console.log('Checking out employee:', employeeId);

    // If no employeeId is provided, try to get it from the user profile
    if (!employeeId) {
      try {
        const userResponse = await api.get('/users/profile');
        const userData = userResponse.data.data || userResponse.data;
        employeeId = userData?.employee?._id;

        if (!employeeId) {
          return {
            success: false,
            error: 'No employee ID found. Please complete your profile setup first.'
          };
        }
      } catch (userError) {
        console.error('Error fetching user profile for check-out:', userError);
        return {
          success: false,
          error: 'Failed to get employee information. Please try again later.'
        };
      }
    }

    const response = await api.post('/attendance/check-out', { employeeId, location });
    console.log('Check-out response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking out:', error);
    return { success: false, error: error.response?.data?.error || 'Failed to check out' };
  }
};

// Get attendance stats
export const getAttendanceStats = async (params = {}) => {
  try {
    const response = await api.get('/attendance/stats', { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Get employee attendance
export const getEmployeeAttendance = async (employeeId, params = {}) => {
  try {
    console.log('Fetching attendance for employee:', employeeId, 'with params:', params);
    const response = await api.get('/attendance', {
      params: {
        employee: employeeId,
        ...params
      }
    });
    console.log('Employee attendance response:', response.data);

    // Format the response to ensure consistent structure
    return {
      success: true,
      data: response.data.data || [],
      count: response.data.count || 0,
      total: response.data.total || 0
    };
  } catch (error) {
    console.error('Error fetching employee attendance:', error);
    return { success: false, data: [], error: 'Failed to fetch attendance records' };
  }
};

// Get current user's attendance
export const getCurrentUserAttendance = async (params = {}) => {
  try {
    const response = await api.get('/attendance', { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { success: false, error: 'Network error' };
  }
};

// Get today's attendance status for current user
export const getTodayAttendanceStatus = async () => {
  try {
    console.log('Fetching today\'s attendance status');

    // First get the current user's profile to get employee ID
    const userResponse = await api.get('/users/profile');
    console.log('User profile response for attendance:', userResponse.data);

    // Handle different user data structures
    const userData = userResponse.data.data || userResponse.data;
    const employeeId = userData?.employee?._id;

    console.log('Extracted employee ID for attendance:', employeeId);

    if (!employeeId) {
      console.warn('No employee ID found in user data for attendance');
      // Return a default attendance object with status "not available"
      return {
        _id: 'temp-' + Date.now(),
        date: new Date().toISOString(),
        status: 'not_available',
        checkInTime: null,
        checkOutTime: null,
        workHours: 0,
        isTemporary: true,
        message: 'Employee record not found. Please complete your profile setup.'
      };
    }

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    console.log('Formatted date:', formattedDate);

    const response = await api.get('/attendance', {
      params: {
        date: formattedDate,
        employee: employeeId
      }
    });
    console.log('Attendance response:', response.data);

    // Check if there's an attendance record for today
    if (response.data.count > 0) {
      return response.data.data[0];
    }

    // Return a default attendance object for today with no check-in/out
    return {
      _id: 'temp-' + Date.now(),
      date: today.toISOString(),
      employee: employeeId,
      status: 'pending',
      checkInTime: null,
      checkOutTime: null,
      workHours: 0,
      isTemporary: true
    };
  } catch (error) {
    console.error('Error fetching today\'s attendance:', error);
    // Return a default object instead of null to prevent UI issues
    return {
      _id: 'error-' + Date.now(),
      date: new Date().toISOString(),
      status: 'error',
      checkInTime: null,
      checkOutTime: null,
      workHours: 0,
      isTemporary: true,
      error: error.message || 'Failed to fetch attendance'
    };
  }
};
