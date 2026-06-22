import React from 'react';
import BrandingPanel from '../../components/BrandingPanel';
import AccessRequestForm from '../components/AccessRequestForm';
import ThemeToggle from '../components/ThemeToggle';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RequestAccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] transition-colors duration-300 flex">
      <BrandingPanel variant="login" />
      
      {/* Right Content Area */}
      <div className="w-full lg:w-[55%] flex flex-col relative overflow-hidden">
        {/* Top Bar with Back Button & Theme Toggle */}
        <div className="absolute top-6 left-6 z-20">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-sm font-semibold text-slate-500 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-500 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Portal
          </button>
        </div>
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>
        
        {/* Background gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-800/30 rounded-full blur-[100px] pointer-events-none hidden dark:block"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-900/10 rounded-full blur-[80px] pointer-events-none hidden dark:block"></div>
        
        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative z-10 overflow-y-auto">
          <AccessRequestForm />
        </div>
      </div>
    </div>
  );
};

export default RequestAccessPage;
