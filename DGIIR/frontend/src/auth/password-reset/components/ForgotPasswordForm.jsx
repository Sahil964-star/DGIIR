import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || 'citizen';
  
  const [channel, setChannel] = useState('mobile'); // 'mobile' | 'email'
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API dispatch
    setTimeout(() => {
      setIsLoading(false);
      navigate('/forgot-password/verify', { state: { role, channel, identifier: inputValue } });
    }, 1500);
  };

  const getSubtitle = () => {
    switch(role) {
      case 'officer': return "Recover access to your field operations account.";
      case 'operations': return "Recover access to your operations control center account.";
      case 'citizen':
      default: return "Recover access to your citizen account.";
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Forgot Password?
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {getSubtitle()}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {/* Dual-Radio / Tab Switcher */}
        <div className="flex p-1 space-x-1 bg-slate-100 dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => { setChannel('mobile'); setInputValue(''); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all ${
              channel === 'mobile' 
                ? 'bg-white dark:bg-slate-800 text-green-700 dark:text-green-500 shadow-sm border border-slate-200 dark:border-slate-700' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Mobile Number</span>
          </button>
          <button
            type="button"
            onClick={() => { setChannel('email'); setInputValue(''); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center space-x-2 transition-all ${
              channel === 'email' 
                ? 'bg-white dark:bg-slate-800 text-green-700 dark:text-green-500 shadow-sm border border-slate-200 dark:border-slate-700' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Registered Email</span>
          </button>
        </div>

        {/* Dynamic Input Block */}
        <div className="min-h-[80px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={channel}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {channel === 'mobile' ? (
                <Input 
                  id="mobile" 
                  type="tel" 
                  placeholder="Registered Mobile Number" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ''))}
                  icon={Phone} 
                  maxLength="10"
                  required 
                />
              ) : (
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Registered Email ID" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)}
                  icon={Mail} 
                  required 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <Button 
          type="submit" 
          fullWidth 
          variant="primary"
          isLoading={isLoading}
          disabled={!inputValue || (channel === 'mobile' && inputValue.length < 10)}
          className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-4"
        >
          <div className="flex items-center justify-center space-x-2">
            <span>Send OTP</span>
            {!isLoading && <ArrowRight size={18} />}
          </div>
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
