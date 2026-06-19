import React from 'react';
import { motion } from 'framer-motion';
import Loader from './Loader';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  icon: Icon,
  className = '',
  ...props
}) => {
  const baseClasses = "relative inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900";

  const variants = {
    primary: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-500 shadow-md",
    secondary: "bg-dgiir-green-100 text-dgiir-green-800 hover:bg-dgiir-green-200 focus:ring-dgiir-green-200 dark:bg-dgiir-green-900/40 dark:text-dgiir-green-400 dark:hover:bg-dgiir-green-900/60",
    outline: "border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-500",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-gray-700",
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  const classes = `
    ${baseClasses}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={!(disabled || isLoading) ? { scale: 1.02 } : {}}
      whileTap={!(disabled || isLoading) ? { scale: 0.98 } : {}}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <Loader size={20} className="mr-2 text-current" />
          Loading...
        </span>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 mr-2" />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
