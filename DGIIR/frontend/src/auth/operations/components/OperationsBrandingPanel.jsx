import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useTheme } from '../../../shared/context/ThemeContext';
import SecurityIndicators from './SecurityIndicators';

const OperationsBrandingPanel = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 relative overflow-hidden bg-emerald-900 dark:bg-[#080f1e]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-[#0f172a]/90' : 'bg-emerald-900/90'} mix-blend-multiply`} />
        {/* Simplified operational nerve center abstraction */}
        <svg className="absolute w-full h-full opacity-20 dark:opacity-30" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
          <g stroke={isDarkMode ? '#16a34a' : '#ffffff'} strokeWidth="1" fill="none">
            {/* Grid */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" strokeOpacity="0.3" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Radar / Nodes */}
            <circle cx="400" cy="400" r="200" strokeOpacity="0.4" />
            <circle cx="400" cy="400" r="300" strokeOpacity="0.2" />
            <line x1="400" y1="0" x2="400" y2="800" strokeOpacity="0.3" />
            <line x1="0" y1="400" x2="800" y2="400" strokeOpacity="0.3" />
            
            {/* Active Nodes */}
            <circle cx="250" cy="300" r="4" fill={isDarkMode ? '#16a34a' : '#ffffff'} />
            <circle cx="550" cy="450" r="4" fill={isDarkMode ? '#16a34a' : '#ffffff'} />
            <circle cx="350" cy="600" r="4" fill={isDarkMode ? '#16a34a' : '#ffffff'} />
            
            {/* Connecting lines */}
            <path d="M250,300 L400,400 L550,450" strokeOpacity="0.8" />
            <path d="M400,400 L350,600" strokeOpacity="0.8" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-16">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="text-emerald-700 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">DGIIR</h1>
              <p className="text-emerald-200 text-xs font-medium uppercase tracking-wider">Govt. of NCT of Delhi</p>
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Incident Management.
              <br />
              <span className="text-emerald-400">Accountability.</span>
              <br />
              Response.
            </h2>
          </div>
        </motion.div>

        <SecurityIndicators />
      </div>
    </div>
  );
};

export default OperationsBrandingPanel;
