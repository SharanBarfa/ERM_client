import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Search, Filter, Download, ChevronDown } from 'lucide-react';
import { getAttendanceRecords, getAttendanceStats } from '../../services/attendanceService';

const AdminAttendance = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
    totalEmployees: 0,
    averageWorkHours: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('Fetching attendance data for date:', selectedDate);
    fetchAttendanceData();
  }, [selectedDate, filterDepartment, searchQuery, filterStatus]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        date: selectedDate,
        department: filterDepartment !== 'all' ? filterDepartment : undefined,
        search: searchQuery || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      };

      console.log('Fetching attendance with params:', params);

      const [attendanceResponse, statsResponse] = await Promise.all([
        getAttendanceRecords(params),
        getAttendanceStats({ startDate: selectedDate, endDate: selectedDate })
      ]);

      if (!attendanceResponse.success) {
        throw new Error(attendanceResponse.error || 'Failed to fetch attendance records');
      }

      if (!statsResponse.success) {
        throw new Error(statsResponse.error || 'Failed to fetch attendance stats');
      }

      const filteredData = attendanceResponse.data || [];
      const totalCount = filteredData.length;
      const presentCount = filteredData.filter(record => record.status === 'present').length;
      const absentCount = filteredData.filter(record => record.status === 'absent').length;
      const lateCount = filteredData.filter(record => record.status === 'late').length;
      const leaveCount = filteredData.filter(record => record.status === 'leave').length;

      setAttendanceData(filteredData);
      setAttendanceSummary({
        total: totalCount,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        leave: leaveCount,
        averageWorkHours: calculateAverageWorkHours(filteredData)
      });
    } catch (err) {
      console.error('Error in fetchAttendanceData:', err);
      setError(err.message || 'Failed to fetch attendance data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageWorkHours = (records) => {
    if (!records || records.length === 0) return 0;
    const totalHours = records.reduce((sum, record) => sum + (record.workHours || 0), 0);
    return Math.round((totalHours / records.length) * 100) / 100;
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

  const getStatusText = (record) => {
    if (!record.checkIn && !record.checkOut) {
      return 'Absent';
    }
    
    if (record.status === 'late') {
      return 'Late';
    }
    
    if (record.status === 'present') {
      return 'Present';
    }
    
    return record.status.charAt(0).toUpperCase() + record.status.slice(1);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchAttendanceData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Attendance Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor and manage employee attendance records
        </p>
      </div>
      
      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        {/* Attendance summary */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Present</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {attendanceSummary.present} / {attendanceSummary.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Absent</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {attendanceSummary.absent} / {attendanceSummary.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Late</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {attendanceSummary.late} / {attendanceSummary.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg. Work Hours</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {attendanceSummary.averageWorkHours} hrs
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mt-6">
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
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`${
                  filterStatus === 'all'
                    ? 'bg-gray-100 text-gray-700'
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
            </nav>
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-3">
          <label className="form-label">Filter by Status</label>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>
        </div>

        {/* Attendance Table */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Hours
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceData.map((record) => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={record.employee?.profileImage || 'https://via.placeholder.com/40'}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.employee?.firstName} {record.employee?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.employee?.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.employee?.department?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge bg-${getStatusColor(record.status)}`}>
                        {getStatusText(record)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.workHours || 0} hrs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;
