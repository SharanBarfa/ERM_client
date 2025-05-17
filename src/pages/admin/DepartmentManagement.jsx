import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../services/departmentService';
import { toast } from 'react-toastify';

const DepartmentManagement = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [editingDepartment, setEditingDepartment] = useState(null);

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await getDepartments();
      if (response.success) {
        setDepartments(response.data);
      }
    } catch (error) {
      setError('Failed to fetch departments');
      toast.error('Failed to fetch departments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      if (editingDepartment) {
        // Update existing department
        const response = await updateDepartment(editingDepartment._id, formData, token);
        if (response.success) {
          toast.success('Department updated successfully');
          setEditingDepartment(null);
        }
      } else {
        // Create new department
        const response = await createDepartment(formData, token);
        if (response.success) {
          toast.success('Department created successfully');
        }
      }

      // Reset form and refresh departments
      setFormData({ name: '', description: '' });
      fetchDepartments();
    } catch (error) {
      const errorMessage = error.error || error.message || 'Failed to save department';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // If unauthorized, redirect to login
      if (errorMessage.includes('unauthorized') || errorMessage.includes('token')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }
        
        const response = await deleteDepartment(id, token);
        if (response.success) {
          toast.success('Department deleted successfully');
          setDepartments(prevDepartments => prevDepartments.filter(dept => dept._id !== id));
        } else {
          throw new Error(response.error || 'Failed to delete department');
        }
      } catch (error) {
        const errorMessage = error.error || error.message || 'Failed to delete department';
        setError(errorMessage);
        toast.error(errorMessage);
        
        // If unauthorized, redirect to login
        if (errorMessage.includes('unauthorized') || errorMessage.includes('token')) {
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingDepartment(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Department Management</h1>

        {/* Add/Edit Department Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingDepartment ? 'Edit Department' : 'Add New Department'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Department Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter department name"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter department description"
              />
            </div>
            <div className="flex justify-end space-x-4">
              {editingDepartment && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? 'Saving...' : editingDepartment ? 'Update Department' : 'Add Department'}
              </button>
            </div>
          </form>
        </div>

        {/* Departments List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">Departments</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {departments.map((dept) => (
                <div key={dept._id} className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{dept.name}</h3>
                    {dept.description && (
                      <p className="mt-1 text-sm text-gray-500">{dept.description}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Status: <span className={`font-medium ${dept.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {dept.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dept._id)}
                      disabled={isLoading}
                      className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
              {departments.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No departments found. Add your first department above.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement; 