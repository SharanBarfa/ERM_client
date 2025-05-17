import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  type = 'button',
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };
  
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button 
      type={type} 
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;