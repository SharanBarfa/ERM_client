import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();
  
  // This would normally come from an API
  const blogPosts = [
    {
      id: 1,
      title: '10 Ways to Improve Employee Engagement in 2025',
      excerpt: 'Discover proven strategies to boost employee engagement and create a more productive workplace environment.',
      content: `
        <p>Employee engagement is a critical factor in organizational success. When employees are engaged, they are more productive, more likely to stay with the company, and more likely to provide excellent customer service.</p>
        
        <h3>1. Foster Open Communication</h3>
        <p>Create channels for two-way communication between management and employees. Regular town halls, feedback sessions, and an open-door policy can help employees feel heard and valued.</p>
        
        <h3>2. Recognize and Reward Achievements</h3>
        <p>Implement a recognition program that acknowledges employees' contributions. This can be as simple as a shout-out in a team meeting or as elaborate as a formal awards ceremony.</p>
        
        <h3>3. Provide Growth Opportunities</h3>
        <p>Offer training, mentorship, and career development opportunities. Employees who see a clear path for advancement are more likely to be engaged in their current roles.</p>
        
        <h3>4. Promote Work-Life Balance</h3>
        <p>Encourage employees to take breaks, use their vacation time, and disconnect after work hours. A well-rested employee is a more engaged employee.</p>
        
        <h3>5. Create a Positive Work Environment</h3>
        <p>Foster a culture of respect, inclusivity, and positivity. Address toxic behaviors promptly and celebrate team successes.</p>
      `,
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
      content: `
        <p>Remote work has become a permanent fixture in the modern workplace. Organizations that adapt to this new reality will have a competitive advantage in attracting and retaining top talent.</p>
        
        <h3>Emerging Remote Work Trends</h3>
        <p>The landscape of remote work continues to evolve. Here are some trends we're seeing in 2025:</p>
        
        <ul>
          <li><strong>Hybrid work models</strong> that combine in-office and remote work are becoming the norm</li>
          <li><strong>Asynchronous communication</strong> is replacing the need for constant real-time interaction</li>
          <li><strong>Digital nomad visas</strong> are being offered by more countries, allowing employees to work from anywhere</li>
          <li><strong>Virtual reality workspaces</strong> are creating more immersive remote collaboration experiences</li>
        </ul>
        
        <h3>Best Practices for Remote Work Success</h3>
        <p>To make remote work effective for your organization, consider implementing these best practices:</p>
        
        <ol>
          <li>Establish clear communication protocols and expectations</li>
          <li>Invest in the right technology and tools for remote collaboration</li>
          <li>Focus on outcomes rather than hours worked</li>
          <li>Create opportunities for virtual team building and social connection</li>
          <li>Provide stipends for home office setup and equipment</li>
        </ol>
      `,
      category: 'Remote Work',
      author: 'Rahul Verma',
      date: 'April 5, 2025',
      image: 'https://via.placeholder.com/800x400',
      readTime: '7 min read'
    }
  ];
  
  const post = blogPosts.find(post => post.id === parseInt(id)) || blogPosts[0];
  
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
              <Link to="/blog" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">Blog</Link>
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

      {/* Blog Post Content */}
      <article className="py-12 bg-white flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all articles
          </Link>
          
          <div className="mb-8">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="h-4 w-4 text-indigo-600" />
            <span className="text-sm text-indigo-600 font-medium">{post.category}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex items-center space-x-4 mb-8 text-gray-600">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{post.date}</span>
            </div>
            <div>{post.readTime}</div>
          </div>
          
          <div 
            className="prose prose-indigo max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map((relatedPost) => (
              <div key={relatedPost.id} className="bg-white rounded-lg overflow-hidden shadow border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <img className="h-48 w-full object-cover" src={relatedPost.image} alt={relatedPost.title} />
                <div className="p-6">
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                    <Tag className="h-4 w-4" />
                    <span>{relatedPost.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{relatedPost.title}</h3>
                  <p className="text-gray-600 mb-4">{relatedPost.excerpt}</p>
                  <Link
                    to={`/blog/${relatedPost.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
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

export default BlogPost;
