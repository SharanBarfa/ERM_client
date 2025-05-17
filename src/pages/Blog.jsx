import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, Tag } from 'lucide-react';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: '10 Ways to Improve Employee Engagement in 2025',
      excerpt: 'Discover proven strategies to boost employee engagement and create a more productive workplace environment.',
      category: 'Employee Engagement',
      author: 'Priya Sharma',
      date: 'April 10, 2025',
      image: 'https://via.placeholder.com/800x400',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'The Future of Remote Work: Trends and Best Practices',
      excerpt: 'Remote work is here to stay. Learn about emerging trends and how to implement effective remote work policies.',
      category: 'Remote Work',
      author: 'Rahul Verma',
      date: 'April 5, 2025',
      image: 'https://via.placeholder.com/800x400',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'How to Conduct Effective Performance Reviews',
      excerpt: 'Performance reviews don\'t have to be dreaded. Learn how to make them valuable for both managers and employees.',
      category: 'Performance Management',
      author: 'Neha Patel',
      date: 'March 28, 2025',
      image: 'https://via.placeholder.com/800x400',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Building a Strong Company Culture in a Hybrid Workplace',
      excerpt: 'Maintaining company culture can be challenging in hybrid work environments. Here are strategies that work.',
      category: 'Company Culture',
      author: 'Vikram Singh',
      date: 'March 20, 2025',
      image: 'https://via.placeholder.com/800x400',
      readTime: '8 min read'
    },
    {
      id: 5,
      title: 'Employee Wellness Programs That Actually Work',
      excerpt: 'Invest in your employees\' wellbeing with these proven wellness program ideas that deliver real results.',
      category: 'Employee Wellness',
      author: 'Ananya Gupta',
      date: 'March 15, 2025',
      image: 'https://via.placeholder.com/800x400',
      readTime: '5 min read'
    },
    {
      id: 6,
      title: 'HR Technology Trends to Watch in 2025',
      excerpt: 'Stay ahead of the curve with these emerging HR technology trends that are reshaping workforce management.',
      category: 'HR Technology',
      author: 'Arjun Mehta',
      date: 'March 8, 2025',
      image: 'https://via.placeholder.com/800x400',
      readTime: '6 min read'
    }
  ];

  const categories = [
    'All Categories',
    'Employee Engagement',
    'Remote Work',
    'Performance Management',
    'Company Culture',
    'Employee Wellness',
    'HR Technology'
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts[0];

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
              <Link to="/features" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">Features</Link>
              <Link to="/pricing" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">Pricing</Link>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ERM System Blog</h1>
          <p className="text-xl mb-6 max-w-3xl mx-auto">Insights, tips, and best practices for effective employee management</p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>

          <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/2">
                <img className="h-full w-full object-cover" src={featuredPost.image} alt={featuredPost.title} />
              </div>
              <div className="p-8 md:w-1/2">
                <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">{featuredPost.category}</div>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">{featuredPost.title}</h3>
                <p className="mt-4 text-gray-600">{featuredPost.excerpt}</p>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-800 font-medium">{featuredPost.author.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{featuredPost.author}</p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime={featuredPost.date}>{featuredPost.date}</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value === 'All Categories' ? 'all' : e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category === 'All Categories' ? 'all' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No articles found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <img className="h-48 w-full object-cover" src={post.image} alt={post.title} />
                  <div className="p-6">
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                      <Tag className="h-4 w-4" />
                      <span>{post.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Stay up to date with the latest articles, tips, and insights on employee management.</p>
            <div className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email"
                />
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Subscribe
                </button>
              </div>
            </div>
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

export default Blog;
