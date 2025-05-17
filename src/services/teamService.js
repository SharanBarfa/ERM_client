import api from './api';
import { API_URL } from '../config';

// Get all teams
export const getTeams = async (params = {}) => {
  try {
    console.log('Fetching teams with params:', params);
    const response = await api.get('/teams', { params });
    console.log('Teams response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch teams' };
  }
};

// Get team by ID
export const getTeamById = async (id) => {
  try {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching team by ID:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch team' };
  }
};

// Create team
export const createTeam = async (teamData) => {
  try {
    const response = await api.post('/teams', teamData);
    return response.data;
  } catch (error) {
    console.error('Error creating team:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to create team' };
  }
};

// Update team
export const updateTeam = async (id, teamData) => {
  try {
    const response = await api.put(`/teams/${id}`, teamData);
    return response.data;
  } catch (error) {
    console.error('Error updating team:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to update team' };
  }
};

// Delete team
export const deleteTeam = async (id) => {
  try {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting team:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to delete team' };
  }
};

// Add member to team
export const addTeamMember = async (teamId, employeeId) => {
  try {
    const response = await api.put(`/teams/${teamId}/members`, { employeeId });
    return response.data;
  } catch (error) {
    console.error('Error adding team member:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to add team member' };
  }
};

// Remove member from team
export const removeTeamMember = async (teamId, employeeId) => {
  try {
    const response = await api.delete(`/teams/${teamId}/members/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing team member:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to remove team member' };
  }
};

// Get teams for employee
export const getEmployeeTeams = async (employeeId) => {
  try {
    const response = await api.get(`/teams/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee teams:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch employee teams' };
  }
};

// Get team members
export const getTeamMembers = async () => {
  try {
    const response = await api.get('/teams/members');
    return response.data;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch team members' };
  }
};

// Get current user's teams
export const getCurrentUserTeams = async () => {
  try {
    const response = await api.get('/teams/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user teams:', error);
    return { success: false, error: error.response?.data?.message || 'Failed to fetch user teams' };
  }
};
