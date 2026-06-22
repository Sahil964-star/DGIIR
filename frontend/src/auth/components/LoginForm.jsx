import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import RoleSelector from './RoleSelector';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { Mail, Lock, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OTPVerification from './OTPVerification';
import { getRoleLandingPage } from '../../utils/roleUtils';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [rememberMe, setRememberMe] = useState(false);

  // Citizen-specific states
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setOtpSent(false);
    setErrorMsg('');
  };

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const token = data.data?.accessToken || data.accessToken;
      const user = data.data?.user || data.user;
      
      const actualRole = user.role;
      login(user, actualRole, token);
      navigate(getRoleLandingPage(actualRole));
    },
    onError: (error) => {
      setErrorMsg(error?.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    // Removed role from payload as backend only expects email and password
    loginMutation.mutate({ email, password });
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!mobile) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      await authApi.requestOtp(mobile);
      setOtpSent(true);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || 'Failed to request OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await authApi.verifyOtp({ phone: mobile, otp: otpCode });
      const token = data.data?.accessToken || data.accessToken;
      const user = data.data?.user || data.user;
      
      const actualRole = user.role;
      login(user, actualRole, token);
      navigate(getRoleLandingPage(actualRole));
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      if (errMsg === 'Name is required for new citizen registration') {
        setErrorMsg('Account not found. Please click "Create New Account" below to register.');
      } else {
        setErrorMsg(errMsg || 'Invalid OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Welcome Back!
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Login to continue to DGIIR
        </p>
      </div>

      {selectedRole === 'citizen' && otpSent ? (
        <div className="w-full">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800 text-center">
              {errorMsg}
            </div>
          )}
          <OTPVerification onVerify={handleVerifyOTP} isLoading={isLoading} />
          
          <div className="text-center mt-6">
            <button 
              type="button"
              onClick={() => setOtpSent(false)}
              className="text-sm font-semibold text-green-600 hover:text-green-700 dark:text-green-500 transition-colors"
            >
              Change Mobile Number
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={selectedRole === 'citizen' ? handleRequestOtp : handleSubmit} className="w-full space-y-5">
          <RoleSelector selectedRole={selectedRole} onSelectRole={handleRoleChange} />

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">
              {selectedRole === 'citizen' ? 'Citizen OTP Login' : 'Admin Credentials'}
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          </div>

          {selectedRole === 'citizen' ? (
            <div className="space-y-4">
              <Input
                id="mobile"
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                icon={Phone}
                required
              />
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                id="email"
                type={selectedRole === 'cm' ? 'email' : 'text'}
                placeholder={selectedRole === 'cm' ? 'Email Address' : 'Email / Mobile Number'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />
              
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
              />
            </div>
          )}

          {(selectedRole === 'operations' || selectedRole === 'officer') && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center italic mt-2">
              Account provided by system administrator.
            </p>
          )}

          {errorMsg && (
            <div className="text-red-500 text-sm text-center">{errorMsg}</div>
          )}

          {selectedRole !== 'citizen' && (
            <div className="flex items-center justify-between text-sm py-1 h-8">
              <AnimatePresence>
                {selectedRole !== 'cm' && (
                  <motion.label 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-2 cursor-pointer overflow-hidden whitespace-nowrap"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-green-600 focus:ring-green-600 bg-white dark:bg-slate-800 dark:border-slate-600 h-4 w-4"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="text-slate-600 dark:text-slate-300">Remember Me <span className="hidden sm:inline">("Maintain persistent session key")</span></span>
                  </motion.label>
                )}
              </AnimatePresence>
              
              {selectedRole !== 'cm' && (
                <a 
                  href="#forgot" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/forgot-password', { state: { role: selectedRole } });
                  }}
                  className="text-green-600 hover:text-green-700 dark:text-green-500 font-semibold ml-auto whitespace-nowrap"
                >
                  Forgot Password?
                </a>
              )}
            </div>
          )}

          <Button 
            type="submit" 
            fullWidth 
            variant="primary"
            isLoading={selectedRole === 'citizen' ? isLoading : loginMutation.isPending}
            className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3.5"
          >
            <div className="flex items-center justify-center space-x-2">
              {selectedRole !== 'citizen' && !(selectedRole === 'citizen' ? isLoading : loginMutation.isPending) && <Lock size={18} />}
              <span>{selectedRole === 'citizen' ? 'Login' : 'Login'}</span>
            </div>
          </Button>
        </form>
      )}

      <AnimatePresence>
        {selectedRole === 'citizen' && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">New to DGIIR?</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">
              Citizens can create a new account to report and track civic complaints.
            </p>
            
            <Button 
              type="button" 
              onClick={() => {
                navigate('/register', { state: { role: selectedRole } });
              }}
              variant="outline" 
              fullWidth
              className="text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-800/50 dark:hover:bg-green-900/20 font-semibold py-3.5"
            >
              Create New Account
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center space-x-1.5">
        <Lock size={12} />
        <span>Secure login protected by government standards</span>
      </div>
    </div>
  );
};

export default LoginForm;
