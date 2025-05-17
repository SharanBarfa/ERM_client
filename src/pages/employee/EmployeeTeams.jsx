import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTeams } from '../../services/teamService';
import { getProjects } from '../../services/projectService';

const EmployeeTeams = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch teams
      const teamsResponse = await getTeams();
      if (teamsResponse.success) {
        // Filter teams where the current user is a member
        const userTeams = teamsResponse.data.filter(team => 
          team.members.some(member => member._id === user.employeeId)
        );
        setTeams(userTeams);
      }

      // Fetch projects
      const projectsResponse = await getProjects();
      if (projectsResponse.success) {
        // Filter projects where the current user is a team member
        const userProjects = projectsResponse.data.filter(project =>
          teams.some(team => team._id === project.team?._id)
        );
        setProjects(userProjects);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-semibold text-gray-900">My Teams & Projects</h1>
      </div>

      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Teams Section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">My Teams</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                          {member._id === team.leader._id && (
                            <span className="ml-2 text-xs text-indigo-600">(Leader)</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-12">
          <h2 className="text-lg font-medium text-gray-900 mb-4">My Projects</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project._id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Project Details:</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Status:</span>{' '}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Priority:</span>{' '}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          project.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {project.priority}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Progress:</span>{' '}
                        <span className="text-sm text-gray-600">{project.progress}%</span>
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Project Manager:</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {project.manager.firstName} {project.manager.lastName}
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Department:</h4>
                    <p className="mt-1 text-sm text-gray-600">{project.department.name}</p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Timeline:</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTeams; 