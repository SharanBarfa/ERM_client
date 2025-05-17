import axios from "axios";

// Default mock users data
const defaultMockUsers = [
  {
    _id: "user001",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    password: "password", // In a real app, this would be hashed
    department: "dept001",
    position: "System Administrator",
    token: "admin_token_12345"
  },
  {
    _id: "user002",
    name: "Employee User",
    email: "employee@example.com",
    role: "employee",
    password: "password", // In a real app, this would be hashed
    department: "dept002",
    position: "Marketing Specialist",
    token: "employee_token_67890",
    employee: {
      _id: "emp001",
      employeeId: "EMP001",
      firstName: "Employee",
      lastName: "User",
      email: "employee@example.com",
      department: {
        _id: "dept002",
        name: "Marketing"
      },
      position: "Marketing Specialist",
      joinDate: "2023-01-15",
      status: "active"
    }
  }
];

// Load mock users from localStorage or use default
const loadMockUsers = () => {
  try {
    const storedUsers = localStorage.getItem('mockUsers');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
  } catch (error) {
    console.error('Error loading mock users from localStorage:', error);
  }

  // If no stored users or error, use default and save to localStorage
  localStorage.setItem('mockUsers', JSON.stringify(defaultMockUsers));
  return defaultMockUsers;
};

// Save mock users to localStorage
const saveMockUsers = (users) => {
  try {
    localStorage.setItem('mockUsers', JSON.stringify(users));
    console.log('Saved mock users to localStorage:', users.length);
  } catch (error) {
    console.error('Error saving mock users to localStorage:', error);
  }
};

// Initialize mock users
let mockUsers = loadMockUsers();

// Simple token verification function
const verifyToken = (token) => {
  // In a real app, this would verify the JWT token
  // For mock purposes, we'll just extract the user ID from the token
  // Assuming token format is "userId_timestamp"
  try {
    const userId = token.split('_')[0];
    return { id: userId };
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Mock departments data
const mockDepartments = [
  {
    _id: "dept001",
    name: "Engineering",
    description: "Software development, infrastructure management, and technical support.",
    manager: null,
    budget: 750000,
    location: "Main Office - Floor 3",
    employeeCount: 78
  },
  {
    _id: "dept002",
    name: "Marketing",
    description: "Brand management, digital marketing, and market research.",
    manager: null,
    budget: 450000,
    location: "Main Office - Floor 2",
    employeeCount: 45
  },
  {
    _id: "dept003",
    name: "Sales",
    description: "Client acquisition, account management, and sales operations.",
    manager: null,
    budget: 680000,
    location: "Main Office - Floor 2",
    employeeCount: 62
  },
  {
    _id: "dept004",
    name: "HR",
    description: "Talent acquisition, employee relations, and organizational development.",
    manager: null,
    budget: 220000,
    location: "Main Office - Floor 1",
    employeeCount: 15
  },
  {
    _id: "dept005",
    name: "Finance",
    description: "Financial analysis, accounting, and budget management.",
    manager: null,
    budget: 350000,
    location: "Main Office - Floor 1",
    employeeCount: 25
  },
  {
    _id: "dept006",
    name: "Operations",
    description: "Process optimization, supply chain management, and business operations.",
    manager: null,
    budget: 280000,
    location: "Main Office - Floor 1",
    employeeCount: 20
  }
];

// Mock API functions
const mockAPI = {
  // Login endpoint
  login: async (email, password) => {
    console.log('Mock login attempt:', { email });

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      // Find user by email
      const user = mockUsers.find(u => u.email === email);

      if (!user) {
        console.error('User not found:', email);
        throw new Error('Invalid email or password');
      }

      // Check password (in a real app, this would compare hashed passwords)
      if (user.password !== password) {
        console.error('Invalid password for user:', email);
        throw new Error('Invalid email or password');
      }

      console.log(`${user.role} login successful:`, user.name);

      // Generate a new token
      const newToken = `${user.role}_token_${Date.now()}`;

      // Update the user's token
      user.token = newToken;

      // Save the updated users list to localStorage
      saveMockUsers(mockUsers);

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;

      // Log the user data being returned
      console.log('Login returning user data:', userWithoutPassword);

      // Store token and user data in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));

      return {
        success: true,
        data: userWithoutPassword
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  },

  // Register endpoint
  register: async (userData) => {
    const { email, password, name, role = "employee", employeeData } = userData;
    console.log("Registration data received:", { email, name, role, employeeData });

    if (!email || !password || !name) {
      throw new Error("Email, password, and name are required");
    }

    try {
      // Check if user with this email already exists
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error("A user with this email already exists");
      }

      // Generate a mock user ID and token
      const userId = `user${Date.now().toString().substring(9)}`;
      const token = `${role}_token_${Date.now()}`;

      // Create a new user object
      const newUser = {
        _id: userId,
        name,
        email,
        password, // In a real app, this would be hashed
        role,
        token
      };

      // If it's an employee, add employee data
      if (role === "employee") {
        if (!employeeData || !employeeData.department) {
          throw new Error("Department is required for employee registration");
        }

        // Get department info
        const department = mockDepartments.find(d => d._id === employeeData.department);
        if (!department) {
          throw new Error("Invalid department selected");
        }

        // Generate employee ID
        const employeeId = `EMP${Date.now().toString().substring(9)}`;

        // Create employee object with all required fields
        const employee = {
          _id: `emp${Date.now().toString().substring(9)}`,
          employeeId,
          firstName: employeeData.firstName || name.split(' ')[0],
          lastName: employeeData.lastName || (name.split(' ').length > 1 ? name.split(' ')[1] : ''),
          email: email,
          phone: employeeData.phone || '',
          department: {
            _id: department._id,
            name: department.name
          },
          position: employeeData.position || 'New Employee',
          joinDate: employeeData.joinDate || new Date().toISOString(),
          status: 'active',
          user: userId,
          // Add performance data
          performance: {
            rating: 0,
            reviews: []
          },
          // Add teams data
          teams: []
        };

        // Add address and emergency contact if provided
        if (employeeData.address) {
          employee.address = employeeData.address;
        }

        if (employeeData.emergencyContact) {
          employee.emergencyContact = employeeData.emergencyContact;
        }

        // Add employee data to user
        newUser.employee = employee;

        console.log("Created employee user:", { user: newUser, employee });
      } else {
        // For admin users
        console.log("Created admin user:", newUser);
      }

      // Add the new user to our mock database
      mockUsers.push(newUser);

      // Save the updated users list to localStorage
      saveMockUsers(mockUsers);

      console.log("Updated users list:", mockUsers);

      // Store token and user data in localStorage for immediate login
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Return user data without password
      const { password: _, ...userWithoutPassword } = newUser;

      return {
        success: true,
        data: userWithoutPassword
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(error.message || "Registration failed");
    }
  },

  // Get user profile
  getProfile: async (token) => {
    console.log('Mock getProfile with token:', token);

    try {
      if (!token) {
        throw new Error("Unauthorized - No token provided");
      }

      // Find user by token
      const user = mockUsers.find(u => u.token === token);

      if (!user) {
        console.error('User not found for token:', token);
        throw new Error("Invalid token");
      }

      console.log('Found user profile:', user.name);

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        data: userWithoutPassword
      };
    } catch (error) {
      console.error('Get profile error:', error);
      throw new Error(error.message || "Failed to get profile");
    }
  },

  // Update user profile
  updateProfile: async (token, userData) => {
    console.log('Mock updateProfile with token:', token);
    console.log('Update data:', userData);

    if (!token) {
      throw new Error("Unauthorized - No token provided");
    }

    try {
      // Find user by token
      const userIndex = mockUsers.findIndex(u => u.token === token);

      if (userIndex === -1) {
        console.error('User not found for token:', token);
        throw new Error("User not found");
      }

      // Update user data (except password and role)
      const { password, role, ...updateData } = userData;

      // Keep the existing user data that's not being updated
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updateData,
      };

      console.log('Updated user:', mockUsers[userIndex].name);

      // Save the updated users list to localStorage
      saveMockUsers(mockUsers);

      // Return user data without password
      const { password: _, ...userWithoutPassword } = mockUsers[userIndex];

      return {
        success: true,
        data: userWithoutPassword
      };
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error.message || "Failed to update profile");
    }
  },

  // Update employee profile
  updateEmployee: async (token, employeeId, employeeData) => {
    console.log('Mock updateEmployee with token:', token);
    console.log('Employee ID:', employeeId);
    console.log('Employee data:', employeeData);

    if (!token) {
      throw new Error("Unauthorized - No token provided");
    }

    try {
      // Find user by token
      const userIndex = mockUsers.findIndex(u => u.token === token);

      if (userIndex === -1) {
        console.error('User not found for token:', token);
        throw new Error("User not found");
      }

      const user = mockUsers[userIndex];

      // Check if user has employee data
      if (!user.employee) {
        throw new Error("User is not an employee");
      }

      // Update employee data
      user.employee = {
        ...user.employee,
        ...employeeData
      };

      // If department ID is provided, update department info
      if (employeeData.department) {
        const department = mockDepartments.find(d => d._id === employeeData.department);
        if (department) {
          user.employee.department = {
            _id: department._id,
            name: department.name
          };
        }
      }

      console.log('Updated employee data for user:', user.name);

      // Save the updated users list to localStorage
      saveMockUsers(mockUsers);

      return {
        success: true,
        data: user.employee
      };
    } catch (error) {
      console.error("Update employee error:", error);
      throw new Error(error.message || "Failed to update employee");
    }
  },

  // Get departments
  getDepartments: async (token) => {
    console.log('Mock API: Getting departments');

    // In a real app, we would validate the token
    // For mock purposes, we'll just return the departments

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        success: true,
        count: mockDepartments.length,
        total: mockDepartments.length,
        pagination: {
          page: 1,
          limit: 10,
          pages: 1
        },
        data: mockDepartments
      };
    } catch (error) {
      console.error("Error getting departments:", error);
      throw new Error("Failed to get departments");
    }
  },

  // Get department by ID
  getDepartmentById: async (token, departmentId) => {
    console.log(`Mock API: Getting department with ID ${departmentId}`);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const department = mockDepartments.find(dept => dept._id === departmentId);

      if (!department) {
        throw new Error("Department not found");
      }

      return {
        success: true,
        data: department
      };
    } catch (error) {
      console.error("Error getting department:", error);
      throw new Error(error.message || "Failed to get department");
    }
  },

  // Get current employee
  getCurrentEmployee: async (token) => {
    console.log('Mock API: Getting current employee');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get token from localStorage if not provided
      const authToken = token || localStorage.getItem('token');

      if (!authToken) {
        console.error('No token provided for getCurrentEmployee');
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      // Find user by token
      const user = mockUsers.find(u => u.token === authToken);

      if (!user) {
        console.error('User not found for token:', authToken);
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Check if user has employee data
      if (!user.employee) {
        console.error('User does not have employee data:', user.name);
        return {
          success: false,
          error: 'User is not an employee'
        };
      }

      console.log('Found employee data for user:', user.name);

      return {
        success: true,
        data: user.employee
      };
    } catch (error) {
      console.error('Error getting current employee:', error);
      return {
        success: false,
        error: 'Failed to get employee information'
      };
    }
  },

  // Get today's attendance status
  getTodayAttendanceStatus: async (token) => {
    console.log('Mock API: Getting today attendance status');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get token from localStorage if not provided
      const authToken = token || localStorage.getItem('token');

      if (!authToken) {
        console.error('No token provided for getTodayAttendanceStatus');
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      // Find user by token
      const user = mockUsers.find(u => u.token === authToken);

      if (!user) {
        console.error('User not found for token:', authToken);
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Check if user has employee data
      if (!user.employee) {
        console.error('User does not have employee data:', user.name);
        return {
          success: false,
          error: 'User is not an employee'
        };
      }

      // Create a mock attendance record for today
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // If user doesn't have attendance data, create it
      if (!user.attendance) {
        user.attendance = {};
      }

      // If no attendance for today, create a default one
      if (!user.attendance[todayStr]) {
        user.attendance[todayStr] = {
          date: today.toISOString(),
          status: 'pending',
          employee: user.employee._id
        };
      }

      console.log('Today attendance status:', user.attendance[todayStr]);

      return {
        success: true,
        data: user.attendance[todayStr]
      };
    } catch (error) {
      console.error('Error getting today attendance status:', error);
      return {
        success: false,
        error: 'Failed to get attendance status'
      };
    }
  },

  // Check in
  checkIn: async (token, employeeId) => {
    console.log('Mock API: Check in for employee', employeeId);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get token from localStorage if not provided
      const authToken = token || localStorage.getItem('token');

      if (!authToken) {
        console.error('No token provided for checkIn');
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      // Find user by token
      const user = mockUsers.find(u => u.token === authToken);

      if (!user) {
        console.error('User not found for token:', authToken);
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Check if user has employee data
      if (!user.employee) {
        console.error('User does not have employee data:', user.name);
        return {
          success: false,
          error: 'User is not an employee'
        };
      }

      // Create a mock attendance record for today
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      // If user doesn't have attendance data, create it
      if (!user.attendance) {
        user.attendance = {};
      }

      // Update or create today's attendance
      user.attendance[todayStr] = {
        date: now.toISOString(),
        status: 'present',
        employee: user.employee._id,
        checkIn: now.toISOString()
      };

      console.log('Updated attendance after check-in:', user.attendance[todayStr]);

      // Save the updated users list to localStorage
      saveMockUsers(mockUsers);

      return {
        success: true,
        data: user.attendance[todayStr]
      };
    } catch (error) {
      console.error('Error checking in:', error);
      return {
        success: false,
        error: 'Failed to check in'
      };
    }
  },

  // Check out
  checkOut: async (token, employeeId) => {
    console.log('Mock API: Check out for employee', employeeId);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get token from localStorage if not provided
      const authToken = token || localStorage.getItem('token');

      if (!authToken) {
        console.error('No token provided for checkOut');
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      // Find user by token
      const user = mockUsers.find(u => u.token === authToken);

      if (!user) {
        console.error('User not found for token:', authToken);
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Check if user has employee data
      if (!user.employee) {
        console.error('User does not have employee data:', user.name);
        return {
          success: false,
          error: 'User is not an employee'
        };
      }

      // Create a mock attendance record for today
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      // If user doesn't have attendance data, create it
      if (!user.attendance) {
        user.attendance = {};
      }

      // If no check-in, can't check out
      if (!user.attendance[todayStr] || !user.attendance[todayStr].checkIn) {
        return {
          success: false,
          error: 'Must check in before checking out'
        };
      }

      // Update today's attendance with check-out time
      user.attendance[todayStr].checkOut = now.toISOString();

      // Calculate work hours
      const checkInTime = new Date(user.attendance[todayStr].checkIn);
      const checkOutTime = now;
      const workHours = (checkOutTime - checkInTime) / (1000 * 60 * 60); // Convert ms to hours

      user.attendance[todayStr].workHours = parseFloat(workHours.toFixed(2));

      console.log('Updated attendance after check-out:', user.attendance[todayStr]);

      // Save the updated users list to localStorage
      saveMockUsers(mockUsers);

      return {
        success: true,
        data: user.attendance[todayStr]
      };
    } catch (error) {
      console.error('Error checking out:', error);
      return {
        success: false,
        error: 'Failed to check out'
      };
    }
  },

  // Get current user teams
  getCurrentUserTeams: async (token) => {
    console.log('Mock API: Getting current user teams');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get token from localStorage if not provided
      const authToken = token || localStorage.getItem('token');

      if (!authToken) {
        console.error('No token provided for getCurrentUserTeams');
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      // Find user by token
      const user = mockUsers.find(u => u.token === authToken);

      if (!user) {
        console.error('User not found for token:', authToken);
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Check if user has employee data
      if (!user.employee) {
        console.error('User does not have employee data:', user.name);
        return {
          success: false,
          error: 'User is not an employee'
        };
      }

      // Create mock teams if none exist
      if (!user.employee.teams || !user.employee.teams.length) {
        // Create a default team for the employee's department
        const defaultTeam = {
          _id: `team${Date.now().toString().substring(9)}`,
          name: `${user.employee.department.name} Team`,
          department: user.employee.department,
          members: [
            {
              _id: user.employee._id,
              name: `${user.employee.firstName} ${user.employee.lastName}`,
              role: 'Member'
            }
          ],
          createdAt: new Date().toISOString()
        };

        user.employee.teams = [defaultTeam];
      }

      console.log('User teams:', user.employee.teams);

      return {
        success: true,
        data: user.employee.teams
      };
    } catch (error) {
      console.error('Error getting user teams:', error);
      return {
        success: false,
        error: 'Failed to get teams'
      };
    }
  },

  // Get current user performance
  getCurrentUserPerformance: async (token) => {
    console.log('Mock API: Getting current user performance');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Get token from localStorage if not provided
      const authToken = token || localStorage.getItem('token');

      if (!authToken) {
        console.error('No token provided for getCurrentUserPerformance');
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      // Find user by token
      const user = mockUsers.find(u => u.token === authToken);

      if (!user) {
        console.error('User not found for token:', authToken);
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Check if user has employee data
      if (!user.employee) {
        console.error('User does not have employee data:', user.name);
        return {
          success: false,
          error: 'User is not an employee'
        };
      }

      // Create mock performance data if none exists
      if (!user.employee.performance || !user.employee.performance.reviews) {
        // Create default performance data
        user.employee.performance = {
          rating: 3.5,
          reviews: [
            {
              _id: `review${Date.now().toString().substring(9)}`,
              reviewType: 'Quarterly Review',
              reviewDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(),
              rating: 3.5,
              strengths: 'Good team player, meets deadlines',
              areasForImprovement: 'Could improve communication skills',
              goals: 'Improve technical skills in the next quarter',
              reviewer: {
                _id: 'admin001',
                name: 'Admin User'
              }
            }
          ]
        };
      }

      console.log('User performance:', user.employee.performance);

      return {
        success: true,
        data: user.employee.performance.reviews
      };
    } catch (error) {
      console.error('Error getting user performance:', error);
      return {
        success: false,
        error: 'Failed to get performance data'
      };
    }
  }
};

export default mockAPI;
