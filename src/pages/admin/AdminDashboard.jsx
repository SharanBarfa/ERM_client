import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getEmployees } from '../../services/employeeService';
import { getDepartments } from '../../services/departmentService';
import { getRecentActivities } from '../../services/activityService';
import { getTeams } from '../../services/teamService';
import { getUpcomingEvents, createEvent } from '../../services/eventService';
import RecentActivities from '../../components/dashboard/RecentActivities';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeStats, setEmployeeStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    newHires: 0
  });
  const [departmentData, setDepartmentData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    participants: 0,
    type: 'event'
  });
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch employees
      const employeesResponse = await getEmployees();
      if (!employeesResponse.success) {
        throw new Error(employeesResponse.error || 'Failed to fetch employees');
      }

      // Calculate employee stats
      const employees = employeesResponse.data || [];
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

      const stats = {
        total: employees.length,
        active: employees.filter(emp => emp.status === 'active').length,
        onLeave: employees.filter(emp => emp.status === 'leave').length,
        newHires: employees.filter(emp => new Date(emp.joinDate) >= thirtyDaysAgo).length
      };
      setEmployeeStats(stats);

      // Fetch departments
      const departmentsResponse = await getDepartments();
      if (!departmentsResponse.success) {
        throw new Error(departmentsResponse.error || 'Failed to fetch departments');
      }

      // Calculate department distribution
      const departments = departmentsResponse.data || [];
      const deptData = departments.map(dept => {
        const deptEmployees = employees.filter(emp => emp.department?._id === dept._id);
        return {
          name: dept.name,
          count: deptEmployees.length,
          percentage: Math.round((deptEmployees.length / employees.length) * 100)
        };
      });
      setDepartmentData(deptData);

      // Fetch recent activities
      const activitiesResponse = await getRecentActivities({ limit: 5 });
      if (!activitiesResponse.success) {
        throw new Error(activitiesResponse.error || 'Failed to fetch activities');
      }
      setRecentActivities(activitiesResponse.data || []);

      // Fetch teams
      console.log('Fetching teams for dashboard');
      try {
        const teamsResponse = await getTeams();
        console.log('Teams response:', teamsResponse);
        if (teamsResponse && teamsResponse.success) {
          setTeams(teamsResponse.data || []);
        } else {
          console.log('Teams data not available:', teamsResponse);
          setTeams([]);
        }
      } catch (err) {
        console.error('Error fetching teams:', err);
        setTeams([]);
        // Don't throw error to prevent dashboard from failing completely
      }

      // // Fetch projects
      // console.log('Fetching projects for dashboard');
      // try {
      //   const projectsResponse = await getProjects();
      //   console.log('Projects response:', projectsResponse);
      //   if (projectsResponse && projectsResponse.success) {
      //     setProjects(projectsResponse.data || []);
      //   } else {
      //     console.log('Projects data not available:', projectsResponse);
      //     setProjects([]);
      //   }
      // } catch (err) {
      //   console.error('Error fetching projects:', err);
      //   setProjects([]);
      //   // Don't throw error to prevent dashboard from failing completely
      // }

      // Fetch upcoming events
      try {
        const eventsResponse = await getUpcomingEvents(3);
        console.log('Events response:', eventsResponse);
        if (eventsResponse && eventsResponse.success) {
          setUpcomingEvents(eventsResponse.data || []);
        } else {
          console.log('Events data not available:', eventsResponse);
          setUpcomingEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setUpcomingEvents([]);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      setEventLoading(true);
      setEventError('');

      const response = await createEvent(eventFormData);
      
      if (response.success) {
        // Refresh events
        const eventsResponse = await getUpcomingEvents(3);
        if (eventsResponse.success) {
          setUpcomingEvents(eventsResponse.data || []);
        }
        
        // Reset form and close modal
        setEventFormData({
          title: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          location: '',
          participants: 0,
          type: 'event'
        });
        setShowEventModal(false);
      } else {
        setEventError(response.error || 'Failed to create event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setEventError(err.message || 'Failed to create event');
    } finally {
      setEventLoading(false);
    }
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
          onClick={fetchDashboardData}
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
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.name || 'Admin'}! Here's what's happening in your organization.
        </p>
        {/* <div className="mt-4 flex space-x-4">
          <a href="/admin/attendance" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Manage Attendance
          </a>
          <a href="/admin/employees" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            View Employees
          </a>
          <a href="/admin/project" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Manage Projects
          </a>
        </div> */}
      </div>

      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-indigo-500 rounded-md">
                  <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Employees</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{employeeStats.total}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-green-500 rounded-md">
                  <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Employees</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{employeeStats.active}</div>
                      <div className="ml-2 text-sm font-medium text-green-600">
                        {Math.round((employeeStats.active / employeeStats.total) * 100)}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-yellow-500 rounded-md">
                  <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">On Leave</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{employeeStats.onLeave}</div>
                      <div className="ml-2 text-sm font-medium text-yellow-600">
                        {Math.round((employeeStats.onLeave / employeeStats.total) * 100)}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-blue-500 rounded-md">
                  <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">New Hires (30 days)</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{employeeStats.newHires}</div>
                      <div className="ml-2 text-sm font-medium text-blue-600">
                        {Math.round((employeeStats.newHires / employeeStats.total) * 100)}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department distribution and Activity feed */}
        <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
          {/* Department Distribution */}
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Department Distribution</h3>
            </div>
            <div className="px-6 py-5">
              <ul className="divide-y divide-gray-200">
                {departmentData.map((dept) => (
                  <li key={dept.name} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{dept.name}</p>
                        <p className="text-sm text-gray-500">{dept.count} employees</p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-indigo-600 h-2.5 rounded-full"
                            style={{ width: `${dept.percentage}%` }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 text-right">{dept.percentage}%</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Activity Feed */}
          <RecentActivities activities={recentActivities} />
        </div>

        {/* Teams and Projects */}
        <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
          {/* Teams */}
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Teams</h3>
                <a href="/admin/teams" className="text-sm text-indigo-600 hover:text-indigo-900">View all</a>
              </div>
            </div>
            <div className="px-6 py-5">
              {teams && teams.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {teams.slice(0, 3).map((team) => (
                    <li key={team._id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500">
                              <span className="text-sm font-medium leading-none text-white">{team.name ? team.name.charAt(0) : 'T'}</span>
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{team.name}</p>
                            <p className="text-sm text-gray-500">
                              {team.department?.name || 'No department'} • {team.members?.length || 0} members
                            </p>
                          </div>
                        </div>
                        <div>
                          <a
                            href={`/admin/teams`}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No teams available</p>
                  <a
                    href="/admin/teams/new"
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create Team
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Projects</h3>
                <a href="/admin/project" className="text-sm text-indigo-600 hover:text-indigo-900">View all</a>
              </div>
            </div>
            <div className="px-6 py-5">
              {projects && projects.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {projects.slice(0, 3).map((project) => (
                    <li key={project._id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{project.name}</p>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                              project.status === 'completed' ? 'bg-green-100 text-green-800' :
                              project.status === 'in_progress' || project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              project.status === 'on_hold' || project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
                              project.status === 'planning' ? 'bg-purple-100 text-purple-800' :
                              project.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status ? project.status.replace(/[_-]/g, ' ') : 'Not started'}
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
                            href={`/admin/project/${project._id}`}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                          >
                            View
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No projects available</p>
                  <a
                    href="/admin/project/new"
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create Project
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Upcoming Events</h3>
            </div>
            <div className="px-6 py-5">
              <ul className="divide-y divide-gray-200">
                {upcomingEvents.map((event) => (
                  <li key={event.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.date} • {event.participants} participants</p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Details
                        </button>
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

export default AdminDashboard;

