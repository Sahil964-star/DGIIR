import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', noPadding = false, animate = false, ...props }) => {
  const baseClasses = `bg-white dark:bg-slate-900 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/40 dark:border-slate-800/40 overflow-hidden transition-colors ${noPadding ? '' : 'p-5'}`;

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
