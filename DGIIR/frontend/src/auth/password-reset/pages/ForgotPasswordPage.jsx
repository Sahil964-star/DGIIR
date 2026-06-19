import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BrandingPanel from '../../components/BrandingPanel';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import ThemeToggle from '../../components/ThemeToggle';
import Card from '../../../shared/components/Card';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="flex min-h-screen w-full bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Left Branding Panel (Hidden on Mobile) */}
      <BrandingPanel variant="login" />

      {/* Right Authentication Panel */}
      <div className="flex-1 flex flex-col relative w-full lg:w-[55%]">
        
        {/* Top Controls */}
        <div className="absolute top-6 left-6 z-20">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-semibold text-slate-500 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-500 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        </div>
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>

        {/* Login Area Centered */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <Card className="w-full max-w-[500px] p-8 sm:p-10 relative z-10 border border-slate-200 dark:border-slate-800" animate>
            <ForgotPasswordForm />
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
