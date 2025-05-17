import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">

      <nav className="bg-indigo-700 text-white shadow-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">ERM System</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">Home</Link>
              <Link to="/features" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">Features</Link>
              <Link to="/contact" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">Contact</Link>
              <Link to="/login" className="px-4 py-2 rounded-md text-sm font-medium bg-white text-indigo-600 hover:bg-gray-100">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-800 text-white hover:bg-indigo-900">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-indigo-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Streamline Your Employee Management</h1>
              <p className="text-xl mb-6">A comprehensive solution for managing your workforce efficiently and effectively.</p>
              <div className="flex space-x-4">
                <Link to="/register" className="px-6 py-3 bg-white text-indigo-700 rounded-md font-medium hover:bg-gray-100">
                  Get Started
                </Link>
                
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-indigo-600 p-8 rounded-lg shadow-xl text-white">
                <h3 className="text-2xl font-bold mb-4">Employee Dashboard</h3>
                <div className="space-y-2">
                  <div className="bg-indigo-500 p-4 rounded">
                    <p className="font-medium">Attendance Overview</p>
                    <div className="w-full bg-indigo-400 h-2 mt-2 rounded-full">
                      <div className="bg-white h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  <div className="bg-indigo-500 p-4 rounded">
                    <p className="font-medium">Performance Metrics</p>
                    <div className="w-full bg-indigo-400 h-2 mt-2 rounded-full">
                      <div className="bg-white h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>
                  <div className="bg-indigo-500 p-4 rounded">
                    <p className="font-medium">Task Completion</p>
                    <div className="w-full bg-indigo-400 h-2 mt-2 rounded-full">
                      <div className="bg-white h-2 rounded-full w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            <p className="mt-4 text-xl text-gray-600">Everything you need to manage your workforce effectively</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Employee Management</h3>
              <p className="text-gray-600">Comprehensive employee profiles, performance tracking, and career development tools.</p>
            </div>


            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Time & Attendance</h3>
              <p className="text-gray-600">Track work hours, manage time-off requests, and monitor attendance with ease.</p>
            </div>


            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Analytics</h3>
              <p className="text-gray-600">Gain insights with real-time analytics and reporting on employee performance metrics.</p>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Trusted by Companies Worldwide</h2>
            <p className="mt-4 text-xl text-gray-600">See what our clients have to say about our system</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 italic mb-4">"This system has transformed how we manage our workforce. Productivity is up 30% since implementation."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">AYUSHI RAGHUVANSHI </p>
                  <p className="text-sm text-gray-500">HR , Santi Infosoft</p>
                </div>
              </div>
            </div>


            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 italic mb-4">"Employee satisfaction scores have improved significantly since we started using the ERM System."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">VIPIN JAIN</p>
                  <p className="text-sm text-gray-500">CEO, Santi Infosoft</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 bg-indigo-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workforce Management?</h2>
          <p className="text-xl mb-8">Join thousands of companies already using our platform</p>
          <Link to="/register" className="px-8 py-4 bg-white text-indigo-600 rounded-md font-medium text-lg hover:bg-gray-100 inline-block">
            Get Started Today
          </Link>
        </div>
      </section>


      <footer className="bg-gray-800 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ERM System</h3>
              <p className="text-gray-400">Simplifying employee management for businesses worldwide.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
            
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">info@shantiinfosoft.com</li>
                <li className="text-gray-400">+91 8815531673</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ERM System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;