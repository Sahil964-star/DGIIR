import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import BrandingPanel from '../../components/BrandingPanel';
import ThemeToggle from '../components/ThemeToggle';
import RequestStatusCard from '../components/RequestStatusCard';
import Button from '../../../shared/components/Button';

const RequestSubmittedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] transition-colors duration-300 flex">
      <BrandingPanel variant="login" />
      
      {/* Right Content Area */}
      <div className="w-full lg:w-[55%] flex flex-col relative overflow-hidden">
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>
        
        {/* Background gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-800/30 rounded-full blur-[100px] pointer-events-none hidden dark:block"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-900/10 rounded-full blur-[80px] pointer-events-none hidden dark:block"></div>
        
        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-500" />
            </motion.div>
            
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Request Submitted Successfully
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
              Your access request has been sent to the Operations Team for verification. You will receive approval status via email and SMS.
            </p>
            
            <div className="mb-8">
              <RequestStatusCard />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full sm:w-auto px-8 py-3.5 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
              >
                Return to Login
              </Button>
              <Button 
                onClick={() => navigate('/officer/track-request')}
                variant="primary"
                className="w-full sm:w-auto px-8 py-3.5 bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold"
              >
                Track Request Status
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RequestSubmittedPage;
