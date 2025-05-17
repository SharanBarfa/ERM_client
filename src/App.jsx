import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { hasPendingRedirect, completeRegistration } from './utils/registrationHelper';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminAttendance from './pages/admin/AdminAttendance';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
// import AdminProject from './pages/admin/AdminProject';
import AdminTeams from './pages/admin/AdminTeams';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import EmployeeAttendance from './pages/employee/EmployeeAttendance';
import EmployeeTeam from './pages/employee/EmployeeTeam';
import AddEmployee from './pages/AddEmployee';
import EmployeeDetails from './pages/EmployeeDetails';
// import EmployeeProjects from './pages/employee/EmployeeProjects';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardRedirect from './components/common/DashboardRedirect';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  const navigate = useNavigate();

  // Handle redirect after registration
  useEffect(() => {
    // Check if there's a pending redirect from registration
    if (hasPendingRedirect()) {
      console.log('Found pending registration redirect');

      // Complete the registration process and get the redirect path
      const redirectPath = completeRegistration();

      if (redirectPath) {
        console.log('Redirecting to:', redirectPath);
        navigate(redirectPath, { replace: true });
      }
    }
  }, [navigate]);

  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/teams" element={<AdminTeams />} />
          <Route path="/admin/departments" element={<Departments />} />
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/performance" element={<Performance />} />
          {/* <Route path="/admin/project" element={<AdminProject />} /> */}
        </Route>

        {/* Employee routes */}
        <Route element={<ProtectedRoute requireEmployee={true} />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/profile" element={<EmployeeProfile />} />
          <Route path="/employee/attendance" element={<EmployeeAttendance />} />
          <Route path="/employee/team" element={<EmployeeTeam />} />
          {/* <Route path="/employee/projects" element={<EmployeeProjects />} /> */}
        </Route>

        {/* Redirect old dashboard path to role-specific dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/employees/add" element={<AddEmployee />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App
