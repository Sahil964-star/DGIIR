import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', animate = false }) => {
  const baseClasses = "bg-white dark:bg-gray-900 rounded-[24px] shadow-sm border border-slate-100 dark:border-gray-800 overflow-hidden";
  
  if (animate) {
    return (
      <motion.div 
        className={`${baseClasses} ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
