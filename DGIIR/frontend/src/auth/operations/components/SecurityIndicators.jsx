import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

const SecurityIndicators = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="flex flex-col space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="flex items-center space-x-3 text-slate-100 dark:text-slate-200">
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <Activity className="w-4 h-4 text-green-400" />
        </div>
        <span className="font-medium tracking-wide">Real-Time Monitoring</span>
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex items-center space-x-3 text-slate-100 dark:text-slate-200">
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-green-400" />
        </div>
        <span className="font-medium tracking-wide">Secure Governance</span>
      </motion.div>
      
      <motion.div variants={itemVariants} className="flex items-center space-x-3 text-slate-100 dark:text-slate-200">
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <Cpu className="w-4 h-4 text-green-400" />
        </div>
        <span className="font-medium tracking-wide">Incident Intelligence</span>
      </motion.div>
    </motion.div>
  );
};

export default SecurityIndicators;
