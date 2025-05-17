import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDepartments } from '../services/departmentService';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // User account information
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee', // Default role

    // Employee information
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
    position: '',
    joinDate: new Date().toISOString().split('T')[0], // Default to today
    status: 'active',

    // Address information
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },

    // Emergency contact
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = formData.role === 'admin' ? 1 : 3;

  const { register } = useAuth();

  // Destructure form data for easier access
  const {
    name, email, password, confirmPassword, role,
    firstName, lastName, phone, department, position, joinDate, status,
    address,
    emergencyContact
  } = formData;

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments();
        if (response.success) {
          setDepartments(response.data);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects (address and emergencyContact)
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // If role changes, reset step to 1
    if (name === 'role') {
      setCurrentStep(1);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate first step
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      // If admin is selected, submit the form
      if (role === 'admin') {
        handleSubmit(new Event('submit'));
        return;
      }
    } else if (currentStep === 2) {
      // Validate second step for employees
      if (!firstName || !lastName || !department || !position) {
        setError('Please fill in all required fields');
        return;
      }
    }

    setError('');
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation for employees
    if (role === 'employee') {
      if (!emergencyContact.name || !emergencyContact.phone) {
        setError('Please provide emergency contact information');
        return;
      }

      if (!department) {
        setError('Please select a department');
        return;
      }
    }

    try {
      setIsLoading(true);
      setError('');

      let result;

      if (role === 'employee') {
        // Prepare employee data
        const employeeData = {
          firstName,
          lastName,
          email,
          phone,
          department,
          position,
          joinDate,
          status,
          address,
          emergencyContact
        };

        // Call register function from auth context with both user and employee data
        result = await register({
          name,
          email,
          password,
          role,
          employeeData
        });
      } else {
        // For admin registration, we only need basic user data
        result = await register({
          name,
          email,
          password,
          role
        });
      }

      // Registration successful
      if (result && result.success && result.data) {
        toast.success('Registration successful! Redirecting to dashboard...');
        setTimeout(() => {
          const dashboardPath = role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';
          navigate(dashboardPath);
        }, 1000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render step indicators
  const renderStepIndicators = () => {
    if (role === 'admin') return null;

    return (
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`flex items-center ${
              step < currentStep ? 'text-indigo-600' : step === currentStep ? 'text-indigo-600 font-bold' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step <= currentStep ? 'border-indigo-600' : 'border-gray-300'
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-16 h-0.5 ${
                  step < currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Full Name"
                value={name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={role}
                onChange={handleChange}
              >
                <option value="employee">Employee</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Employee Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="First Name"
                  value={firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Phone Number"
                value={phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
              <select
                id="department"
                name="department"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {departments && departments.length > 0 ? (
                  departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No departments available</option>
                )}
              </select>
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
              <input
                id="position"
                name="position"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Position"
                value={position}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">Join Date</label>
              <input
                id="joinDate"
                name="joinDate"
                type="date"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={joinDate}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Address</h4>
              <div>
                <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">Street Address</label>
                <input
                  id="address.street"
                  name="address.street"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    id="address.city"
                    name="address.city"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="City"
                    value={address.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">State/Province</label>
                  <input
                    id="address.state"
                    name="address.state"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="State/Province"
                    value={address.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">Zip/Postal Code</label>
                  <input
                    id="address.zipCode"
                    name="address.zipCode"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Zip/Postal Code"
                    value={address.zipCode}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    id="address.country"
                    name="address.country"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Country"
                    value={address.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <h4 className="text-md font-medium text-gray-700">Emergency Contact</h4>
              <div>
                <label htmlFor="emergencyContact.name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  id="emergencyContact.name"
                  name="emergencyContact.name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Emergency Contact Name"
                  value={emergencyContact.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="emergencyContact.relationship" className="block text-sm font-medium text-gray-700">Relationship</label>
                <input
                  id="emergencyContact.relationship"
                  name="emergencyContact.relationship"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Relationship"
                  value={emergencyContact.relationship}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="emergencyContact.phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  id="emergencyContact.phone"
                  name="emergencyContact.phone"
                  type="tel"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Emergency Contact Phone"
                  value={emergencyContact.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Render navigation buttons
  const renderNavButtons = () => {
    return (
      <div className="flex justify-between mt-8">
        {currentStep > 1 && role === 'employee' && (
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Previous
          </button>
        )}
        {role === 'admin' ? (
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        ) : currentStep < totalSteps ? (
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {renderStepIndicators()}
          {renderStepContent()}
          {renderNavButtons()}
        </form>
      </div>
    </div>
  );
};

export default Register;