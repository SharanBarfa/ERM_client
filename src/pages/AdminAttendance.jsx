import React, { useState, useEffect } from 'react';
import { getAttendanceRecords, getAttendanceStats } from '../services/attendanceService';

const AdminAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
    holiday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    console.log('Fetching attendance data for date:', date);
    fetchAttendanceData();
  }, [date, filterStatus, searchTerm]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const params = {
        date,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchTerm || undefined
      };

      console.log('Fetching attendance with params:', params);

      const [attendanceResponse, statsResponse] = await Promise.all([
        getAttendanceRecords(params),
        getAttendanceStats({ startDate: date, endDate: date })
      ]);

      console.log('Attendance Response:', attendanceResponse);
      console.log('Stats Response:', statsResponse);

      if (!attendanceResponse.success) {
        throw new Error(attendanceResponse.error || 'Failed to fetch attendance records');
      }

      if (!statsResponse.success) {
        throw new Error(statsResponse.error || 'Failed to fetch attendance stats');
      }

      setAttendanceRecords(attendanceResponse.data || []);
      setStats(statsResponse.data || {
        present: 0,
        absent: 0,
        late: 0,
        leave: 0,
        holiday: 0
      });
      setError(null);
    } catch (err) {
      console.error('Error in fetchAttendanceData:', err);
      setError(err.message || 'Failed to fetch attendance data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'leave':
        return 'bg-blue-100 text-blue-800';
      case 'holiday':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Today's Attendance</h1>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full py-2 px-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              className="block w-full py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search employees..."
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Present</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.present}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Absent</dt>
            <dd className="mt-1 text-3xl font-semibold text-red-600">{stats.absent}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Late</dt>
            <dd className="mt-1 text-3xl font-semibold text-yellow-600">{stats.late}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">On Leave</dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-600">{stats.leave}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Holiday</dt>
            <dd className="mt-1 text-3xl font-semibold text-purple-600">{stats.holiday}</dd>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-6">
        <div className="sm:hidden">
          <label htmlFor="attendance-status" className="sr-only">Select attendance status</label>
          <select
            id="attendance-status"
            className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="leave">On Leave</option>
            <option value="holiday">Holiday</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`${
                filterStatus === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 text-sm font-medium rounded-md`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('present')}
              className={`${
                filterStatus === 'present'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 text-sm font-medium rounded-md`}
            >
              Present
            </button>
            <button
              onClick={() => setFilterStatus('absent')}
              className={`${
                filterStatus === 'absent'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 text-sm font-medium rounded-md`}
            >
              Absent
            </button>
            <button
              onClick={() => setFilterStatus('late')}
              className={`${
                filterStatus === 'late'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 text-sm font-medium rounded-md`}
            >
              Late
            </button>
            <button
              onClick={() => setFilterStatus('leave')}
              className={`${
                filterStatus === 'leave'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 text-sm font-medium rounded-md`}
            >
              On Leave
            </button>
            <button
              onClick={() => setFilterStatus('holiday')}
              className={`${
                filterStatus === 'holiday'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 text-sm font-medium rounded-md`}
            >
              Holiday
            </button>
          </nav>
        </div>
      </div>

      {/* Attendance table */}
      <div className="flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading attendance data...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center text-red-600">
                    <p>{error}</p>
                    <button
                      onClick={fetchAttendanceData}
                      className="mt-2 px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Employee</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Check In</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Check Out</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Work Hours</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceRecords.map((record) => (
                      <tr key={record._id}>
                        <td className="py-4 pl-4 pr-3 text-sm whitespace-nowrap sm:pl-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10">
                              <img
                                className="w-10 h-10 rounded-full"
                                src={record.employee.profileImage || '/default-avatar.png'}
                                alt={`${record.employee.firstName} ${record.employee.lastName}`}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {record.employee.firstName} {record.employee.lastName}
                              </div>
                              <div className="text-gray-500">ID: {record.employee.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {record.employee.department?.name}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap">
                          <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getStatusColor(record.status)}`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {formatTime(record.checkIn)}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {formatTime(record.checkOut)}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {record.workHours || '-'}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {record.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance; 