import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById } from '../services/employeeService';
import { toast } from 'react-toastify';

const ViewEmployee = () => {
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600">
          <p>Employee not found</p>
          <button
            onClick={() => navigate('/admin/employees')}
            className="mt-2 px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Employee Details</h1>
          <button
            onClick={() => navigate('/employees')}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Employees
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Personal Information */}
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Employee's personal details.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.firstName} {employee.lastName}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.phone}</dd>
              </div>
            </dl>
          </div>

          {/* Employment Information */}
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Employment Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Employee's work details.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Department</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.department?.name || 'Not assigned'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Position</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.position}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Join Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(employee.joinDate).toLocaleDateString()}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                    employee.status === 'active' ? 'bg-green-100 text-green-800' :
                    employee.status === 'leave' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Address Information */}
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Address Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Employee's current address.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Street address</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.address?.street}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.address?.city}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">State / Province</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.address?.state}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">ZIP / Postal code</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.address?.zipCode}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Country</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.address?.country}</dd>
              </div>
            </dl>
          </div>

          {/* Emergency Contact */}
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Emergency Contact</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Contact information for emergencies.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Contact Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.emergencyContact?.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.emergencyContact?.relationship}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{employee.emergencyContact?.phone}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee; 