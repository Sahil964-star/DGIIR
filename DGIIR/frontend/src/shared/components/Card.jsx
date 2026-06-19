import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', noPadding = false, animate = false, ...props }) => {
  const baseClasses = `bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 overflow-hidden transition-colors ${noPadding ? '' : 'p-6'}`;

  if (animate) {
    return (
      <motion.div
        className={`${baseClasses} ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
