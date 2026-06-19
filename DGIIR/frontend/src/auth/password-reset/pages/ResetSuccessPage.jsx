import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import BrandingPanel from '../../components/BrandingPanel';
import ThemeToggle from '../../components/ThemeToggle';
import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

const ResetSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || 'citizen';

  const handleReturnToLogin = () => {
    switch(role) {
      case 'officer':
        navigate('/officer/login');
        break;
      case 'operations':
        navigate('/operations/login');
        break;
      case 'citizen':
      default:
        navigate('/');
        break;
    }
  };

  return (
    <motion.div 
      className="flex min-h-screen w-full bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <BrandingPanel variant="login" />

      <div className="flex-1 flex flex-col relative w-full lg:w-[55%]">
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <Card className="w-full max-w-[500px] p-8 sm:p-10 relative z-10 border border-slate-200 dark:border-slate-800 text-center" animate>
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
            </motion.div>
            
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Password Reset Successful
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-sm mx-auto leading-relaxed">
              Your account password parameters have been updated successfully.
            </p>
            
            <Button 
              onClick={handleReturnToLogin}
              fullWidth 
              variant="primary"
              className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-4 text-lg shadow-lg shadow-green-900/20"
            >
              Back To Login
            </Button>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ResetSuccessPage;
