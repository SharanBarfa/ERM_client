import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTeams, createTeam, updateTeam, deleteTeam, addTeamMember, removeTeamMember } from '../../services/teamService';
import { getEmployees } from '../../services/employeeService';
import { getDepartments } from '../../services/departmentService';

const AdminTeams = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: [],
    leader: '',
    department: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showCreateMemberDropdown, setShowCreateMemberDropdown] = useState(false);
  const [showEditMemberDropdown, setShowEditMemberDropdown] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCreateMemberDropdown && !event.target.closest('.create-member-dropdown')) {
        setShowCreateMemberDropdown(false);
      }
      if (showEditMemberDropdown && !event.target.closest('.edit-member-dropdown')) {
        setShowEditMemberDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCreateMemberDropdown, showEditMemberDropdown]);

  useEffect(() => {
    const filtered = employees.filter(employee =>
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setEmployeesLoading(true);
      setEmployeesError(null);

      // Fetch teams
      const teamsResponse = await getTeams();
      if (teamsResponse.success) {
        setTeams(teamsResponse.data || []);
      }

      // Fetch employees
      const employeesResponse = await getEmployees();
      if (employeesResponse.success) {
        setEmployees(employeesResponse.data || []);
        setFilteredEmployees(employeesResponse.data || []);
      } else {
        setEmployeesError('Failed to load employees');
      }

      

      // Fetch departments
      const departmentsResponse = await getDepartments();
      if (departmentsResponse.success) {
        setDepartments(departmentsResponse.data || []);
      } else {
        setError('Failed to load departments');
      }

      console.log('Fetched data:', {
        teams: teamsResponse.data,
        employees: employeesResponse.data,
        departments: departmentsResponse?.data
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      setEmployeesError('Failed to load employees');
    } finally {
      setLoading(false);
      setEmployeesLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      members: selectedOptions
    }));
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      console.log('Creating team with data:', formData);

      if (!formData.name || !formData.leader || !formData.department) {
        setError('Please fill in all required fields (name, leader, and department are required)');
        return;
      }

      // Create a copy of the form data to send to the API
      const teamData = {
        name: formData.name,
        description: formData.description,
        members: formData.members,
        leader: formData.leader,
        department: formData.department
      };

      console.log('Submitting team data to API:', teamData);
      const response = await createTeam(teamData);
      console.log('Create team response:', response);

      if (response && response.success) {
        console.log('Team created successfully:', response.data);
        const updatedTeams = await getTeams();
        if (updatedTeams.success) {
          setTeams(updatedTeams.data || []);
        }

        setShowCreateModal(false);
        setShowCreateMemberDropdown(false);
        setFormData({
          name: '',
          description: '',
          members: [],
          leader: '',
          department: ''
        });
      } else {
        console.error('Failed to create team:', response);
        setError((response && response.error) || 'Failed to create team');
      }
    } catch (err) {
      console.error('Error creating team:', err);
      setError(err.message || 'Failed to create team. Please check the console for details.');
    }
  };

  const handleEditTeam = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      console.log('Updating team with data:', formData);

      if (!formData.name || !formData.leader || !formData.department) {
        setError('Please fill in all required fields (name, leader, and department are required)');
        return;
      }

      // Create a copy of the form data to send to the API
      const teamData = {
        name: formData.name,
        description: formData.description,
        members: formData.members,
        leader: formData.leader,
        department: formData.department
      };

      console.log('Submitting team update to API:', teamData);
      const response = await updateTeam(selectedTeam._id, teamData);
      console.log('Update team response:', response);

      if (response && response.success) {
        console.log('Team updated successfully:', response.data);
        const updatedTeams = await getTeams();
        if (updatedTeams.success) {
          setTeams(updatedTeams.data || []);
        }

        setShowEditModal(false);
        setSelectedTeam(null);
        setShowEditMemberDropdown(false);
        setFormData({
          name: '',
          description: '',
          members: [],
          leader: '',
          department: ''
        });
      } else {
        console.error('Failed to update team:', response);
        setError((response && response.error) || 'Failed to update team');
      }
    } catch (err) {
      console.error('Error updating team:', err);
      setError(err.message || 'Failed to update team. Please check the console for details.');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        const response = await deleteTeam(teamId);
        if (response.success) {
          const updatedTeams = await getTeams();
          if (updatedTeams.success) {
            setTeams(updatedTeams.data || []);
          }
        } else {
          setError(response.error || 'Failed to delete team');
        }
      } catch (err) {
        console.error('Error deleting team:', err);
        setError(err.response?.data?.message || 'Failed to delete team');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Team Management</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Team
          </button>
        </div>
      </div>

      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {/* Teams List */}
        <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div key={team._id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{team.description}</p>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Team Leader:</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {team.leader.firstName} {team.leader.lastName}
                  </p>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Team Members:</h4>
                  <ul className="mt-2 space-y-2">
                    {team.members.map((member) => (
                      <li key={member._id} className="text-sm text-gray-600">
                        {member.firstName} {member.lastName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setSelectedTeam(team);
                      setFormData({
                        name: team.name,
                        description: team.description || '',
                        members: team.members.map(member => member._id),
                        leader: team.leader._id,
                        department: team.department?._id || ''
                      });
                      setShowEditModal(true);
                      // Close any open dropdowns
                      setShowCreateMemberDropdown(false);
                      setShowEditMemberDropdown(false);
                    }}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team._id)}
                    className="text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Team</h2>
            <form onSubmit={handleCreateTeam}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Team Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments && departments.map((department) => (
                      <option key={department._id} value={department._id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Team Leader</label>
                  <select
                    name="leader"
                    value={formData.leader}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a team leader</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Team Members</label>
                  <div className="relative create-member-dropdown">
                    <div
                      onClick={() => setShowCreateMemberDropdown(!showCreateMemberDropdown)}
                      className="mt-1 flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <span className="text-gray-700">
                        {formData.members.length === 0
                          ? 'Select team members'
                          : `${formData.members.length} member${formData.members.length > 1 ? 's' : ''} selected`}
                      </span>
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>

                    {showCreateMemberDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
                        <div className="px-3 py-2 border-b">
                          <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {filteredEmployees.map((employee) => (
                          <div
                            key={employee._id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              const isSelected = formData.members.includes(employee._id);
                              setFormData(prev => ({
                                ...prev,
                                members: isSelected
                                  ? prev.members.filter(id => id !== employee._id)
                                  : [...prev.members, employee._id]
                              }));
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={formData.members.includes(employee._id)}
                              onChange={() => {}}
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                            />
                            <span>
                              {employee.firstName} {employee.lastName} - {employee.department?.name || 'No Department'}
                            </span>
                          </div>
                        ))}

                        {filteredEmployees.length === 0 && (
                          <div className="px-3 py-2 text-gray-500 text-center">
                            No employees found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {formData.members.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-gray-700 mb-1">Selected Members:</div>
                      <div className="flex flex-wrap gap-2">
                        {formData.members.map(memberId => {
                          const employee = employees.find(emp => emp._id === memberId);
                          return employee ? (
                            <div
                              key={memberId}
                              className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"
                            >
                              {employee.firstName} {employee.lastName}
                              <button
                                type="button"
                                className="ml-1 text-indigo-600 hover:text-indigo-900"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    members: prev.members.filter(id => id !== memberId)
                                  }));
                                }}
                              >
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowCreateMemberDropdown(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Team</h2>
            <form onSubmit={handleEditTeam}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Team Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments && departments.map((department) => (
                      <option key={department._id} value={department._id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Team Leader</label>
                  <select
                    name="leader"
                    value={formData.leader}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a team leader</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Team Members</label>
                  <div className="relative edit-member-dropdown">
                    <div
                      onClick={() => setShowEditMemberDropdown(!showEditMemberDropdown)}
                      className="mt-1 flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <span className="text-gray-700">
                        {formData.members.length === 0
                          ? 'Select team members'
                          : `${formData.members.length} member${formData.members.length > 1 ? 's' : ''} selected`}
                      </span>
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>

                    {showEditMemberDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
                        <div className="px-3 py-2 border-b">
                          <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        {filteredEmployees.map((employee) => (
                          <div
                            key={employee._id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              const isSelected = formData.members.includes(employee._id);
                              setFormData(prev => ({
                                ...prev,
                                members: isSelected
                                  ? prev.members.filter(id => id !== employee._id)
                                  : [...prev.members, employee._id]
                              }));
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={formData.members.includes(employee._id)}
                              onChange={() => {}}
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                            />
                            <span>
                              {employee.firstName} {employee.lastName} - {employee.department?.name || 'No Department'}
                            </span>
                          </div>
                        ))}

                        {filteredEmployees.length === 0 && (
                          <div className="px-3 py-2 text-gray-500 text-center">
                            No employees found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {formData.members.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-gray-700 mb-1">Selected Members:</div>
                      <div className="flex flex-wrap gap-2">
                        {formData.members.map(memberId => {
                          const employee = employees.find(emp => emp._id === memberId);
                          return employee ? (
                            <div
                              key={memberId}
                              className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"
                            >
                              {employee.firstName} {employee.lastName}
                              <button
                                type="button"
                                className="ml-1 text-indigo-600 hover:text-indigo-900"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    members: prev.members.filter(id => id !== memberId)
                                  }));
                                }}
                              >
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedTeam(null);
                    setShowEditMemberDropdown(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Update Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeams;