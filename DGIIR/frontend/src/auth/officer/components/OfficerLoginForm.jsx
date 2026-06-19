import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, FileBadge } from 'lucide-react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { useAuth } from '../../../hooks/useAuth';

const OfficerLoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    employeeId: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate Login payload
    setTimeout(() => {
      setIsLoading(false);
      // For first time login simulate going to onboarding
      // In a real app backend flag dictates this
      navigate('/officer/onboarding');
    }, 1500);
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Field Officer Login
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Secure access for authorized government personnel.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <Input id="email" type="email" placeholder="Official Email" value={formData.email} onChange={handleChange} icon={Mail} required />
        <Input id="employeeId" type="text" placeholder="Employee ID" value={formData.employeeId} onChange={handleChange} icon={FileBadge} required />
        <Input id="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} icon={Lock} required />

        <div className="flex items-center justify-between text-sm py-1">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              id="rememberMe"
              type="checkbox"
              className="rounded border-slate-300 text-green-600 focus:ring-green-600 bg-white dark:bg-slate-800 dark:border-slate-600 h-4 w-4"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <span className="text-slate-600 dark:text-slate-300 whitespace-nowrap">Remember Me <span className="hidden sm:inline">("Maintain persistent session key")</span></span>
          </label>
          
          <a 
            href="#forgot" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/forgot-password', { state: { role: 'officer' } });
            }}
            className="text-green-600 hover:text-green-700 dark:text-green-500 font-semibold ml-auto whitespace-nowrap"
          >
            Forgot Password?
          </a>
        </div>

        <Button 
          type="submit" 
          fullWidth 
          variant="primary"
          isLoading={isLoading}
          className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3.5"
        >
          <div className="flex items-center justify-center space-x-2">
            {!isLoading && <Lock size={18} />}
            <span>Login</span>
          </div>
        </Button>
      </form>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative flex py-2 items-center mb-6 mt-6">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">Need operational access?</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
        </div>
        
        <Button 
          type="button" 
          onClick={() => navigate('/officer/request-access')}
          variant="outline" 
          fullWidth
          className="text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-800/50 dark:hover:bg-green-900/20 font-semibold py-3.5"
        >
          Request Access
        </Button>
      </motion.div>
    </div>
  );
};

export default OfficerLoginForm;
