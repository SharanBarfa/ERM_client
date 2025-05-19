import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTodayAttendanceStatus, checkIn, checkOut } from '../../services/attendanceService';
import { getCurrentUserTeams } from '../../services/teamService';
import { getCurrentEmployee } from '../../services/employeeService';
// import { getProjects } from '../../services/projectService';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [employee, setEmployee] = useState(null);

  // Fetch today's attendance status
  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      try {
        setLoading(true);
        console.log('Fetching attendance status in component');
        const status = await getTodayAttendanceStatus();
        console.log('Attendance status in component:', status);
        setTodayAttendance(status);
      } catch (err) {
        console.error('Error fetching attendance status in component:', err);
        setError('Failed to load attendance status');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceStatus();
  }, []);

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        console.log('Fetching teams in component');
        const response = await getCurrentUserTeams();
        console.log('Teams response in component:', response);
        setTeams(response.data || []);
      } catch (err) {
        console.error('Error fetching teams in component:', err);
        // Don't set error for teams as it's not critical
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        console.log('Fetching projects in component');
        const response = await getProjects();
        console.log('Projects response in component:', response);

        if (response.success && employee) {
          // Filter projects where the current employee is assigned
          const employeeProjects = response.data.filter(project =>
            project.team && teams.some(team => team._id === project.team._id) ||
            project.tasks && project.tasks.some(task =>
              task.assignedTo && task.assignedTo._id === employee._id
            )
          );
          setProjects(employeeProjects);
        }
      } catch (err) {
        console.error('Error fetching projects in component:', err);
        // Don't set error for projects as it's not critical
      } finally {
        setLoading(false);
      }
    };

    // Only fetch projects when we have employee data and teams
    if (employee && teams.length > 0) {
      fetchProjects();
    }
  }, [employee, teams]);


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
        // Don't set error as it's not critical
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeInfo();
  }, []);

  // Handle check-in
  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      // Get employee ID from user object
      const employeeId = user?.employee?._id || user?.user?.employee?._id || user?._id;

      console.log('User object for check-in:', user);
      console.log('Employee ID for check-in:', employeeId);

      if (!employeeId) {
        setError('Employee ID not found');
        return;
      }

      console.log('Calling check-in with employee ID:', employeeId);
      const response = await checkIn(employeeId);
      console.log('Check-in response in component:', response);
      setTodayAttendance(response.data);
    } catch (err) {
      console.error('Error checking in in component:', err);
      setError(err.error || 'Failed to check in');
    } finally {
      setCheckingIn(false);
    }
  };

  // Handle check-out
  const handleCheckOut = async () => {
    try {
      setCheckingOut(true);
      // Get employee ID from user object
      const employeeId = user?.employee?._id || user?.user?.employee?._id || user?._id;

      console.log('User object for check-out:', user);
      console.log('Employee ID for check-out:', employeeId);

      if (!employeeId) {
        setError('Employee ID not found');
        return;
      }

      console.log('Calling check-out with employee ID:', employeeId);
      const response = await checkOut(employeeId);
      console.log('Check-out response in component:', response);
      setTodayAttendance(response.data);
    } catch (err) {
      console.error('Error checking out in component:', err);
      setError(err.error || 'Failed to check out');
    } finally {
      setCheckingOut(false);
    }
  };

  // Sample data for tasks and announcements
  const upcomingLeaves = [
    { id: 1, type: 'Vacation', startDate: 'May 15, 2025', endDate: 'May 20, 2025', status: 'Approved' },
    { id: 2, type: 'Sick Leave', startDate: 'Jun 5, 2025', endDate: 'Jun 6, 2025', status: 'Pending' }
  ];

  const tasks = [
    { id: 1, title: 'Complete quarterly performance review', dueDate: 'Apr 20, 2025', priority: 'High', status: 'In Progress' },
    { id: 2, title: 'Submit expense reports', dueDate: 'Apr 25, 2025', priority: 'Medium', status: 'Not Started' },
    { id: 3, title: 'Update personal information', dueDate: 'Apr 30, 2025', priority: 'Low', status: 'Not Started' }
  ];

  const announcements = [
    { id: 1, title: 'Company Picnic', content: 'Annual company picnic scheduled for May 30th at Central Park.', date: 'Apr 10, 2025' },
    { id: 2, title: 'New Health Benefits', content: 'Updated health benefits package available starting next month.', date: 'Apr 5, 2025' },
    { id: 3, title: 'Office Renovation', content: 'Office renovations will begin next week. Please prepare for temporary relocation.', date: 'Apr 1, 2025' }
  ];

  return (
    <div className="py-6">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.user?.name || user?.name || 'Employee'}! Here's your personal overview.
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

        {/* Employee Information Card */}
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Employee Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal and job details</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            {loading ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading employee information...</p>
              </div>
            ) : employee ? (
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.firstName} {employee.lastName}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.employeeId}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Position</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.position}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Department</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.department?.name || 'Not assigned'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {employee.email}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Join Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(employee.joinDate).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No employee information available</p>
              </div>
            )}
          </div>
        </div>

        {/* Check-in/Check-out Card */}
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Attendance</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Today's attendance status</p>
            </div>
            <div className="flex space-x-3">
              {!todayAttendance?.checkIn ? (
                <button
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {checkingIn ? 'Checking in...' : 'Check In'}
                </button>
              ) : !todayAttendance?.checkOut ? (
                <button
                  onClick={handleCheckOut}
                  disabled={checkingOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {checkingOut ? 'Checking out...' : 'Check Out'}
                </button>
              ) : (
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Completed for today
                </span>
              )}
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {todayAttendance ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      todayAttendance.status === 'present' ? 'bg-green-100 text-green-800' :
                      todayAttendance.status === 'absent' ? 'bg-red-100 text-red-800' :
                      todayAttendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {todayAttendance.status.charAt(0).toUpperCase() + todayAttendance.status.slice(1)}
                    </span>
                  ) : (
                    <span className="text-gray-500">Not recorded yet</span>
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Check-in Time</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {todayAttendance?.checkIn ? (
                    new Date(todayAttendance.checkIn).toLocaleTimeString()
                  ) : (
                    <span className="text-gray-500">Not checked in yet</span>
                  )}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Check-out Time</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {todayAttendance?.checkOut ? (
                    new Date(todayAttendance.checkOut).toLocaleTimeString()
                  ) : (
                    <span className="text-gray-500">Not checked out yet</span>
                  )}
                </dd>
              </div>
              {todayAttendance?.checkIn && todayAttendance?.checkOut && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Work Hours Today</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {todayAttendance.workHours ? (
                      <span className="font-semibold">{todayAttendance.workHours.toFixed(2)} hours</span>
                    ) : (
                      <span className="text-gray-500">Calculating...</span>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        {/* Team and Performance */}
        <div className="grid grid-cols-1 gap-5 mt-6 lg:grid-cols-2">
          {/* My Teams */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900">My Teams</h3>
              <div className="mt-4 flow-root">
                {loading ? (
                  <p className="text-center py-4 text-gray-500">Loading teams...</p>
                ) : teams.length > 0 ? (
                  <ul className="-my-5 divide-y divide-gray-200">
                    {teams.map((team) => (
                      <li key={team._id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500">
                              <span className="text-sm font-medium leading-none text-white">{team.name.charAt(0)}</span>
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{team.name}</p>
                            <p className="text-sm text-gray-500 truncate">
                              {team.department?.name || 'No department'} • {team.members?.length || 0} members
                            </p>
                          </div>
                          <div>
                            <a
                              href={`/employee/team`}
                              className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center py-4 text-gray-500">You are not assigned to any teams yet.</p>
                )}
              </div>
              <div className="mt-6">
                <a href="/employee/teams" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  View all teams
                </a>
              </div>
            </div>
          </div>

          {/* My Projects */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900">My Projects</h3>
              <div className="mt-4 flow-root">
                {loading ? (
                  <p className="text-center py-4 text-gray-500">Loading projects...</p>
                ) : projects.length > 0 ? (
                  <ul className="-my-5 divide-y divide-gray-200">
                    {projects.slice(0, 3).map((project) => (
                      <li key={project._id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${
                              project.status === 'completed' ? 'bg-green-500' :
                              project.status === 'in_progress' ? 'bg-blue-500' :
                              project.status === 'on_hold' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }`}>
                              <span className="text-sm font-medium leading-none text-white">{project.name.charAt(0)}</span>
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                            <div className="flex items-center mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                                project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {project.status.replace('_', ' ')}
                              </span>
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${project.progress || 0}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs text-gray-500">{project.progress || 0}%</span>
                            </div>
                          </div>
                          <div>
                            <a
                              href="/employee/projects"
                              className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center py-4 text-gray-500">You are not assigned to any projects yet.</p>
                )}
              </div>
              <div className="mt-6">
                <a href="/employee/projects" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  View all projects
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
          
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">My Tasks</h3>
            </div>
            <div className="px-6 py-5">
              <ul className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <li key={task.id} className="py-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <div className="flex mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                            Due: {task.dueDate}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'High' ? 'bg-red-100 text-red-800' :
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${
                            task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Upcoming Leaves</h3>
            </div>
            <div className="px-6 py-5">
              {upcomingLeaves.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {upcomingLeaves.map((leave) => (
                    <li key={leave.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{leave.type}</p>
                          <p className="text-sm text-gray-500">
                            {leave.startDate} to {leave.endDate}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {leave.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 py-4">No upcoming leaves scheduled.</p>
              )}
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Request Leave
                </button>
              </div>
            </div>
          </div>
        </div>  */}

        <div className="mt-8">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Company Announcements</h3>
            </div>
            <div className="px-6 py-5">
              <ul className="divide-y divide-gray-200">
                {announcements.map((announcement) => (
                  <li key={announcement.id} className="py-4">
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                          </svg>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{announcement.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{announcement.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{announcement.date}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
