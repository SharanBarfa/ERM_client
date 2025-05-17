import React from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      title: 'Employee Management',
      description: 'Comprehensive employee profiles with personal details, employment history, skills, and documents.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      details: [
        'Centralized employee database',
        'Document management',
        'Skills and qualifications tracking',
        'Employment history and career progression',
        'Custom fields for organization-specific data'
      ]
    },
    {
      title: 'Time & Attendance',
      description: 'Track work hours, manage time-off requests, and monitor attendance with ease.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      details: [
        'Digital check-in/check-out',
        'Leave management system',
        'Overtime tracking',
        'Attendance reports and analytics',
        'Integration with payroll systems'
      ]
    },
    {
      title: 'Performance Management',
      description: 'Set goals, conduct reviews, and track employee performance over time.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      details: [
        'Goal setting and tracking',
        'Performance reviews and feedback',
        'Skills assessment',
        'Recognition and rewards',
        'Performance improvement plans'
      ]
    },
    {
      title: 'Reporting & Analytics',
      description: 'Generate insightful reports and visualize workforce data for better decision-making.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      details: [
        'Customizable dashboards',
        'Real-time analytics',
        'Exportable reports',
        'Department and team metrics',
        'Trend analysis and forecasting'
      ]
    },
    {
      title: 'Department Management',
      description: 'Organize employees by departments, manage department heads, and track departmental metrics.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      details: [
        'Department hierarchy',
        'Resource allocation',
        'Department-specific reporting',
        'Budget tracking',
        'Cross-department collaboration tools'
      ]
    },
    {
      title: 'Mobile Access',
      description: 'Access the system on-the-go with our responsive mobile interface.',
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      details: [
        'Responsive design for all devices',
        'Mobile check-in/check-out',
        'Push notifications',
        'Offline capabilities',
        'Secure mobile access'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-indigo-700 text-white shadow-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">ERM System</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">Home</Link>
              <Link to="/features" className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-800">Features</Link>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features for Modern Workforce Management</h1>
          <p className="text-xl mb-6 max-w-3xl mx-auto">Discover how our comprehensive suite of tools can transform your employee management processes.</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Core Features</h2>
            <p className="mt-4 text-xl text-gray-600">Everything you need to manage your workforce effectively</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Seamless Integrations</h2>
            <p className="mt-4 text-xl text-gray-600">Connect with your favorite tools and services</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            {['Slack', 'Microsoft Teams', 'Google Workspace', 'Zoom', 'Jira', 'QuickBooks', 'Salesforce', 'Zendesk'].map((integration, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md w-full max-w-xs flex items-center justify-center h-20">
                <span className="text-lg font-medium text-gray-800">{integration}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workforce Management?</h2>
          <p className="text-xl mb-8">Join thousands of companies already using our platform</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="px-8 py-4 bg-white text-indigo-600 rounded-md font-medium text-lg hover:bg-gray-100 inline-block">
              Get Started Today
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-indigo-600 text-white border border-white rounded-md font-medium text-lg hover:bg-indigo-700 inline-block">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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

export default Features;
