import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TopBar = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Handle case when user is null or undefined
  if (!user) {
    return null; // Don't render TopBar if user is not available
  }
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('#user-menu-button')) {
        setIsProfileDropdownOpen(false);
      }
      if (isMobileMenuOpen && !event.target.closest('#mobile-menu-button') && !event.target.closest('#mobile-menu')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isProfileDropdownOpen, isMobileMenuOpen]);

  // Close dropdowns when location changes
  useEffect(() => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get user information
  const userRole = user?.user?.role || user?.role;
  const userName = user?.user?.name || user?.name;

  // Determine links based on role
  const dashboardLink = userRole === 'admin' ? '/admin/dashboard' : '/employee/dashboard';
  const profileLink = userRole === 'admin' ? '/admin/profile' : '/employee/profile';

  // Navigation items based on role
  const navItems = userRole === 'admin'
    ? [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Employees', path: '/admin/employees' },
        { name: 'Teams', path: '/admin/teams' },
      
        { name: 'Departments', path: '/admin/departments' },
        // { name: 'Project', path: '/admin/project' },
        { name: 'Attendance', path: '/admin/attendance' }
      ]
    : [
        { name: 'Dashboard', path: '/employee/dashboard' },
        { name: 'My Profile', path: '/employee/profile' },
        // { name: 'My Team', path: '/employee/team' },
        // { name: 'Projects', path: '/employee/projects' },
        { name: 'Attendance', path: '/employee/attendance' }
      ];

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to={dashboardLink} className="text-xl font-bold text-gray-800">
              </Link>
              {userRole && (
                <span className="ml-2 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-md capitalize">
                  {userRole}
                </span>
              )}
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-500'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-transparent'
                    } px-3 py-2 text-sm font-medium border-b-2 transition-colors duration-150`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              id="mobile-menu-button"
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <div className="mr-3">


              </div>
              <button
                type="button"
                className="flex items-center rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-1 hover:bg-gray-50"
                id="user-menu-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                }}
              >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-2">
                  {userName ? userName.charAt(0) : 'U'}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">{userName || 'User'}</span>
                <svg
                  className="ml-1 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  <Link
                    to={profileLink}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                  } block px-3 py-2 text-base font-medium`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;