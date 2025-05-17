import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getTodayAttendanceStatus,
  checkIn,
  checkOut,
  getEmployeeAttendance
} from '../../services/attendanceService';
import { getCurrentEmployee, getEmployeeAttendanceStats } from '../../services/employeeService';

const EmployeeAttendance = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
    totalWorkDays: 0,
    totalWorkHours: 0,
    averageWorkHours: 0
  });
  const [period, setPeriod] = useState('month');
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  // Fetch employee information
  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      try {
        setLoading(true);
        console.log('Fetching employee information');
        const response = await getCurrentEmployee();
        console.log('Employee information response:', response);
        if (response.success) {
          setEmployee(response.data);
        } else {
          console.warn('Failed to fetch employee information:', response.error);
        }
      } catch (err) {
        console.error('Error fetching employee information:', err);
        setError('Failed to load employee information');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeInfo();
  }, []);

  // Fetch today's attendance status
  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      try {
        setLoading(true);
        console.log('Fetching attendance status');
        const status = await getTodayAttendanceStatus();
        console.log('Attendance status:', status);
        setTodayAttendance(status);
      } catch (err) {
        console.error('Error fetching attendance status:', err);
        setError('Failed to load attendance status');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceStatus();
  }, []);

  // Fetch attendance history and stats
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!employee?._id) return;

      try {
        setLoading(true);

        // Fetch attendance statistics
        console.log('Fetching attendance statistics');
        const statsResponse = await getEmployeeAttendanceStats(employee._id, period);
        console.log('Attendance statistics response:', statsResponse);
        if (statsResponse.success) {
          setAttendanceStats(statsResponse.data);
        }

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

        // Fetch attendance history
        console.log('Fetching attendance history');
        const historyResponse = await getEmployeeAttendance(employee._id, {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          sort: '-date'
        });
        console.log('Attendance history response:', historyResponse);

        if (historyResponse.success) {
          // Format the attendance records for display
          const formattedHistory = historyResponse.data.map(record => ({
            date: new Date(record.date).toLocaleDateString(),
            checkIn: record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
            checkOut: record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
            status: record.status.charAt(0).toUpperCase() + record.status.slice(1),
            workHours: record.workHours ? record.workHours.toFixed(2) : '-'
          }));

          setAttendanceHistory(formattedHistory);
        }
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError('Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [employee, period]);

  // Handle check-in
  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      setError(null);

      // Get employee ID from user object
      const employeeId = employee?._id;

      console.log('User object for check-in:', user);
      console.log('Employee ID for check-in:', employeeId);

      if (!employeeId) {
        setError('Employee ID not found');
        return;
      }

      console.log('Calling check-in with employee ID:', employeeId);
      const response = await checkIn(employeeId);
      console.log('Check-in response:', response);

      if (response.success) {
        setTodayAttendance(response.data);

        // Refresh attendance stats
        const statsResponse = await getEmployeeAttendanceStats(employeeId, period);
        if (statsResponse.success) {
          setAttendanceStats(statsResponse.data);
        }
      } else {
        setError(response.error || 'Failed to check in');
      }
    } catch (err) {
      console.error('Error checking in:', err);
      setError(err.error || 'Failed to check in');
    } finally {
      setCheckingIn(false);
    }
  };

  // Handle check-out
  const handleCheckOut = async () => {
    try {
      setCheckingOut(true);
      setError(null);

      // Get employee ID from user object
      const employeeId = employee?._id;

      console.log('User object for check-out:', user);
      console.log('Employee ID for check-out:', employeeId);

      if (!employeeId) {
        setError('Employee ID not found');
        return;
      }

      console.log('Calling check-out with employee ID:', employeeId);
      const response = await checkOut(employeeId);
      console.log('Check-out response:', response);

      if (response.success) {
        setTodayAttendance(response.data);

        // Refresh attendance stats
        const statsResponse = await getEmployeeAttendanceStats(employeeId, period);
        if (statsResponse.success) {
          setAttendanceStats(statsResponse.data);
        }

        // Refresh attendance history
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const historyResponse = await getEmployeeAttendance(employeeId, {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          sort: '-date'
        });

        if (historyResponse.success) {
          const formattedHistory = historyResponse.data.map(record => ({
            date: new Date(record.date).toLocaleDateString(),
            checkIn: record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
            checkOut: record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
            status: record.status.charAt(0).toUpperCase() + record.status.slice(1),
            workHours: record.workHours ? record.workHours.toFixed(2) : '-'
          }));

          setAttendanceHistory(formattedHistory);
        }
      } else {
        setError(response.error || 'Failed to check out');
      }
    } catch (err) {
      console.error('Error checking out:', err);
      setError(err.error || 'Failed to check out');
    } finally {
      setCheckingOut(false);
    }
  };

  const getStatusText = (record) => {
    if (!record.checkIn && !record.checkOut) {
      return 'Absent';
    }
    
    if (record.status === 'late') {
      return 'Late (After 12 AM)';
    }
    
    if (record.status === 'present') {
      return 'Present';
    }
    
    return record.status.charAt(0).toUpperCase() + record.status.slice(1);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'success';
      case 'late':
        return 'warning';
      case 'absent':
        return 'danger';
      case 'leave':
        return 'info';
      case 'holiday':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="py-6">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Attendance</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track your attendance and view history
        </p>

        {/* Error message */}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </span>
          </div>
        )}
      </div>

      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        {/* Employee Information Card */}
        {employee && (
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Employee Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal and job details</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.firstName} {employee.lastName}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.employeeId}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Department</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.department?.name || 'Not assigned'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Position</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.position || 'Not assigned'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Check-in/Check-out card */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Today's Attendance</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {loading ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading attendance data...</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-4 sm:mb-0">
                  {todayAttendance?.checkIn ? (
                    <div>
                      <p className="text-sm text-gray-500">Checked in at</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(todayAttendance.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {todayAttendance.checkOut && (
                        <>
                          <p className="mt-2 text-sm text-gray-500">Checked out at</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(todayAttendance.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {todayAttendance.workHours && (
                            <p className="mt-2 text-sm text-gray-900">
                              Total hours: <span className="font-semibold">{todayAttendance.workHours.toFixed(2)}</span>
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">You haven't checked in yet today.</p>
                  )}
                </div>
                <div>
                  {!todayAttendance?.checkIn ? (
                    <button
                      type="button"
                      onClick={handleCheckIn}
                      disabled={checkingIn || !employee}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {checkingIn ? 'Checking In...' : 'Check In'}
                    </button>
                  ) : !todayAttendance?.checkOut ? (
                    <button
                      type="button"
                      onClick={handleCheckOut}
                      disabled={checkingOut || !employee}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {checkingOut ? 'Checking Out...' : 'Check Out'}
                    </button>
                  ) : (
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Completed for today
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Period selector */}
        <div className="mt-8 flex justify-end">
          <div className="inline-flex shadow-sm rounded-md">
            <button
              type="button"
              onClick={() => setPeriod('week')}
              className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                period === 'week' ? 'text-indigo-700 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setPeriod('month')}
              className={`relative inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium ${
                period === 'month' ? 'text-indigo-700 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setPeriod('year')}
              className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                period === 'year' ? 'text-indigo-700 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Attendance summary */}
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Present Days</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{attendanceStats.present}</dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Absent Days</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{attendanceStats.absent}</dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Late Days</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{attendanceStats.late}</dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Work Hours</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{attendanceStats.totalWorkHours.toFixed(1)}</dd>
            </div>
          </div>
        </div>

        {/* Attendance history */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Attendance History</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {period === 'week' ? 'Last 7 days' :
                 period === 'month' ? 'Current month' :
                 'Current year'}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200">
            {loading ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Loading attendance history...</p>
              </div>
            ) : attendanceHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check In
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check Out
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Work Hours
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceHistory.map((record, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.checkIn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.checkOut}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge bg-${getStatusColor(record.status)}`}>
                            {getStatusText(record)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.workHours}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No attendance records found for this period.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
