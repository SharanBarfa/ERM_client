import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCurrentEmployee } from "../../services/employeeService";
import { getDepartments } from "../../services/departmentService";

const EmployeeProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form data with empty values
  const [formData, setFormData] = useState({
    // User account information
    name: "",
    email: "",
    phone: "",

    // Employee information
    firstName: "",
    lastName: "",
    department: "",
    position: "",

    // Address information
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",

    // Emergency contact
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: ""
  });

  // Fetch employee data on component mount
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch employee information
        const employeeResponse = await getCurrentEmployee();
        console.log('Employee data:', employeeResponse);

        if (employeeResponse.success) {
          setEmployee(employeeResponse.data);

          // Initialize form data with employee information
          const employeeData = employeeResponse.data;
          setFormData({
            // User account information
            name: user?.name || "",
            email: employeeData?.email || user?.email || "",
            phone: employeeData?.phone || "",

            // Employee information
            firstName: employeeData?.firstName || "",
            lastName: employeeData?.lastName || "",
            department: employeeData?.department?._id || "",
            position: employeeData?.position || "",

            // Address information
            street: employeeData?.address?.street || "",
            city: employeeData?.address?.city || "",
            state: employeeData?.address?.state || "",
            zipCode: employeeData?.address?.zipCode || "",
            country: employeeData?.address?.country || "",

            // Emergency contact
            emergencyContactName: employeeData?.emergencyContact?.name || "",
            emergencyContactRelationship: employeeData?.emergencyContact?.relationship || "",
            emergencyContactPhone: employeeData?.emergencyContact?.phone || ""
          });
        } else {
          // Even if we don't have employee data, initialize with user data
          setFormData({
            ...formData,
            name: user?.name || "",
            email: user?.email || "",
          });
          console.warn("No employee data found or failed to fetch employee information");
        }

        // Fetch departments
        console.log('Fetching departments for employee profile...');
        const departmentsResponse = await getDepartments();

        if (departmentsResponse.success) {
          console.log('Departments fetched successfully:', departmentsResponse.data);
          setDepartments(departmentsResponse.data);
        } else {
          console.error('Failed to fetch departments:', departmentsResponse.error);
          // Set default departments if API fails
          setDepartments([
            { _id: "dept001", name: "Engineering" },
            { _id: "dept002", name: "Marketing" },
            { _id: "dept003", name: "Sales" },
            { _id: "dept004", name: "HR" },
            { _id: "dept005", name: "Finance" },
            { _id: "dept006", name: "Operations" }
          ]);
        }
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError("Failed to load employee data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Prepare employee data for update
      const employeeData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        emergencyContact: {
          name: formData.emergencyContactName,
          relationship: formData.emergencyContactRelationship,
          phone: formData.emergencyContactPhone
        }
      };

      // Prepare user data for update
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };

      console.log('Updating profile with data:', { userData, employeeData });

      // Update user profile
      await updateProfile({
        ...userData,
        employeeData
      });

      setIsEditing(false);

      // Refresh employee data
      const refreshedEmployee = await getCurrentEmployee();
      if (refreshedEmployee.success) {
        setEmployee(refreshedEmployee.data);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError(error.error || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage your personal information
        </p>

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>

      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
        {isLoading && !isEditing ? (
          <div className="py-4 text-center">
            <p className="text-gray-500">Loading profile information...</p>
          </div>
        ) : (
          <div className="py-4">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Personal Information
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Personal details and employment information
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {isEditing ? (
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-8">
                      {/* Account Information */}
                      <div>
                        <h4 className="text-md font-medium text-gray-700">Account Information</h4>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Full name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email address
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                              Phone number
                            </label>
                            <input
                              type="text"
                              name="phone"
                              id="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Employee Information */}
                      <div>
                        <h4 className="text-md font-medium text-gray-700">Employee Information</h4>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                              First name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              id="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                              Last name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              id="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                              Department
                            </label>
                            <select
                              id="department"
                              name="department"
                              value={formData.department}
                              onChange={handleChange}
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="">Select Department</option>
                              {departments && departments.length > 0 ? (
                                departments.map((dept) => (
                                  <option key={dept._id} value={dept._id}>
                                    {dept.name}
                                  </option>
                                ))
                              ) : (
                                <>
                                  <option value="dept001">Engineering</option>
                                  <option value="dept002">Marketing</option>
                                  <option value="dept003">Sales</option>
                                  <option value="dept004">HR</option>
                                  <option value="dept005">Finance</option>
                                  <option value="dept006">Operations</option>
                                </>
                              )}
                            </select>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                              Position
                            </label>
                            <input
                              type="text"
                              name="position"
                              id="position"
                              value={formData.position}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div>
                        <h4 className="text-md font-medium text-gray-700">Address</h4>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                              Street address
                            </label>
                            <input
                              type="text"
                              name="street"
                              id="street"
                              value={formData.street}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              id="city"
                              value={formData.city}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                              State / Province
                            </label>
                            <input
                              type="text"
                              name="state"
                              id="state"
                              value={formData.state}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                              ZIP / Postal code
                            </label>
                            <input
                              type="text"
                              name="zipCode"
                              id="zipCode"
                              value={formData.zipCode}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                              Country
                            </label>
                            <input
                              type="text"
                              name="country"
                              id="country"
                              value={formData.country}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div>
                        <h4 className="text-md font-medium text-gray-700">Emergency Contact</h4>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700">
                              Name
                            </label>
                            <input
                              type="text"
                              name="emergencyContactName"
                              id="emergencyContactName"
                              value={formData.emergencyContactName}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-gray-700">
                              Relationship
                            </label>
                            <input
                              type="text"
                              name="emergencyContactRelationship"
                              id="emergencyContactRelationship"
                              value={formData.emergencyContactRelationship}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700">
                              Phone number
                            </label>
                            <input
                              type="text"
                              name="emergencyContactPhone"
                              id="emergencyContactPhone"
                              value={formData.emergencyContactPhone}
                              onChange={handleChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="border-t border-gray-200">
                  <dl>
                    {/* Account Information */}
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Full name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {user?.name || "Not provided"}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Email address</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {employee?.email || user?.email || "Not provided"}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {employee?.phone || "Not provided"}
                      </dd>
                    </div>

                    {/* Employee Information */}
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {employee?.employeeId || "Not assigned"}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Department</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {employee?.department?.name || "Not assigned"}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Position</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {employee?.position || "Not assigned"}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Join Date</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {employee?.joinDate ? new Date(employee.joinDate).toLocaleDateString() : "Not provided"}
                      </dd>
                    </div>

                    {/* Address Information */}
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {employee?.address ? (
                          <div>
                            <p>{employee.address.street}</p>
                            <p>
                              {employee.address.city}, {employee.address.state} {employee.address.zipCode}
                            </p>
                            <p>{employee.address.country}</p>
                          </div>
                        ) : (
                          "Not provided"
                        )}
                      </dd>
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Emergency contact</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {employee?.emergencyContact ? (
                          <div>
                            <p>
                              <span className="font-medium">Name:</span> {employee.emergencyContact.name}
                            </p>
                            {employee.emergencyContact.relationship && (
                              <p>
                                <span className="font-medium">Relationship:</span> {employee.emergencyContact.relationship}
                              </p>
                            )}
                            <p>
                              <span className="font-medium">Phone:</span> {employee.emergencyContact.phone}
                            </p>
                          </div>
                        ) : (
                          "Not provided"
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;