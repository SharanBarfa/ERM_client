import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById } from '../services/employeeService';
import { toast } from 'react-toastify';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeById(id);
      if (response.success) {
        setEmployee(response.data);
      } else {
        toast.error('Failed to fetch employee details');
        navigate('/employees');
      }
    } catch (error) {
      toast.error('Failed to fetch employee details');
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Employee not found</h2>
        <button
          onClick={() => navigate('/admin/employees')}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Back to Employees
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Employee Details</h1>
          <button
            onClick={() => navigate('/admin/employees')}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Back to Employees
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Profile Header */}
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-16 w-16">
                <img
                  className="h-16 w-16 rounded-full"
                  src={employee.profileImage || '/default-avatar.png'}
                  alt={employee.fullName}
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{employee.fullName}</h3>
                <p className="text-sm text-gray-500">Employee ID: {employee.employeeId}</p>
              </div>
            </div>
          </div>

          {/* Employee Information */}
          <div className="border-t border-gray-200">
            <dl>
              {/* Personal Information */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Personal Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p><span className="font-medium">First Name:</span> {employee.firstName}</p>
                      <p><span className="font-medium">Last Name:</span> {employee.lastName}</p>
                      <p><span className="font-medium">Email:</span> {employee.email}</p>
                      <p><span className="font-medium">Phone:</span> {employee.phone}</p>
                    </div>
                  </div>
                </dd>
              </div>

              {/* Employment Information */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Employment Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p><span className="font-medium">Department:</span> {employee.department?.name}</p>
                      <p><span className="font-medium">Position:</span> {employee.position}</p>
                      <p><span className="font-medium">Join Date:</span> {new Date(employee.joinDate).toLocaleDateString()}</p>
                      <p>
                        <span className="font-medium">Status:</span>{' '}
                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                          employee.status === 'active' ? 'bg-green-100 text-green-800' :
                          employee.status === 'leave' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                </dd>
              </div>

              {/* Address Information */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p><span className="font-medium">Street:</span> {employee.address?.street}</p>
                      <p><span className="font-medium">City:</span> {employee.address?.city}</p>
                      <p><span className="font-medium">State:</span> {employee.address?.state}</p>
                      <p><span className="font-medium">ZIP Code:</span> {employee.address?.zipCode}</p>
                      <p><span className="font-medium">Country:</span> {employee.address?.country}</p>
                    </div>
                  </div>
                </dd>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p><span className="font-medium">Name:</span> {employee.emergencyContact?.name}</p>
                      <p><span className="font-medium">Relationship:</span> {employee.emergencyContact?.relationship}</p>
                      <p><span className="font-medium">Phone:</span> {employee.emergencyContact?.phone}</p>
                    </div>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails; 