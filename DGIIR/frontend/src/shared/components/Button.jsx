import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-dgiir-green-700 text-white hover:bg-dgiir-green-800 focus:ring-dgiir-green-700 dark:bg-dgiir-green-600 dark:hover:bg-dgiir-green-700',
    secondary: 'bg-dgiir-green-100 text-dgiir-green-800 hover:bg-dgiir-green-200 focus:ring-dgiir-green-200 dark:bg-dgiir-green-900/40 dark:text-dgiir-green-400 dark:hover:bg-dgiir-green-900/60',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-dgiir-green-700 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-gray-700'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
};

export default Button;
