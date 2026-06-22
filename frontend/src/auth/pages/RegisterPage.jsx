import React from 'react';
import BrandingPanel from '../components/BrandingPanel';
import RegisterForm from '../components/RegisterForm';
import ThemeToggle from '../components/ThemeToggle';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] transition-colors duration-300 flex">
      <BrandingPanel variant="register" />
      
      {/* Right Content Area */}
      <div className="w-full lg:w-[55%] flex flex-col relative overflow-hidden">
        {/* Theme Toggle (Top Right) */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>
        
        {/* Background gradient for Dark Mode */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-800/30 rounded-full blur-[100px] pointer-events-none hidden dark:block"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-900/10 rounded-full blur-[80px] pointer-events-none hidden dark:block"></div>
        
        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative z-10">
          <div className="w-full max-w-xl bg-white/50 dark:bg-[#111827]/80 backdrop-blur-sm p-8 sm:p-10 rounded-2xl border border-slate-100 dark:border-[#1f2937] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
