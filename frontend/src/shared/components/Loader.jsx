import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ className = '', size = 24 }) => {
  return (
    <motion.div
      className={`inline-block border-2 border-current border-t-transparent rounded-full ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Loader;
