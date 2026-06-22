import React from 'react';
import { motion } from 'framer-motion';
import BrandingPanel from '../components/BrandingPanel';
import LoginForm from '../components/LoginForm';
import ThemeToggle from '../components/ThemeToggle';
import Card from '../../shared/components/Card';

const LoginPage = () => {
  return (
    <motion.div 
      className="flex min-h-screen w-full bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Left Branding Panel (Hidden on Mobile) */}
      <BrandingPanel />

      {/* Right Authentication Panel */}
      <div className="flex-1 flex flex-col relative w-full lg:w-[55%]">
        {/* Theme Toggle (Top Right) */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>

        {/* Login Area Centered */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <Card className="w-full max-w-[600px] p-8 sm:p-10 relative z-10" animate>
            <LoginForm />
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
