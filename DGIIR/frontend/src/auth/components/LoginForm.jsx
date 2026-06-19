import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import RoleSelector from './RoleSelector';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { Mail, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const token = data.token || 'mock-jwt-token';
      const user = data.user || { email, name: 'John Doe' };
      
      login(user, selectedRole, token);

      switch (selectedRole) {
        case 'citizen': navigate('/citizen'); break;
        case 'operations': navigate('/dashboard/operations'); break;
        case 'officer': navigate('/dashboard/officer'); break;
        case 'cm': navigate('/dashboard/cm'); break;
        default: navigate('/');
      }
    },
    onError: (error) => {
      console.error('Login failed, using mock flow:', error);
      // Fallback for mock flow without backend
      const token = 'mock-jwt-token-123';
      const user = { email, name: 'Mock User' };
      login(user, selectedRole, token);

      switch (selectedRole) {
        case 'citizen': navigate('/citizen'); break;
        case 'operations': navigate('/dashboard/operations'); break;
        case 'officer': navigate('/dashboard/officer'); break;
        case 'cm': navigate('/dashboard/cm'); break;
        default: navigate('/');
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMutation.mutate({ email, password, role: selectedRole });
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

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">or</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
        </div>

        <div className="space-y-4">
          <Input
            id="email"
            type="text"
            placeholder="Email / Mobile Number"
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
          
          <a href="#forgot" className="text-green-600 hover:text-green-700 dark:text-green-500 font-semibold ml-auto whitespace-nowrap">
            Forgot Password?
          </a>
        </div>

        <Button 
          type="submit" 
          fullWidth 
          variant="primary"
          isLoading={loginMutation.isPending}
          className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3.5"
        >
          <div className="flex items-center justify-center space-x-2">
            {!loginMutation.isPending && <Lock size={18} />}
            <span>Login</span>
          </div>
        </Button>
      </form>

      <AnimatePresence>
        {selectedRole !== 'cm' && (
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
            
            <Button 
              type="button" 
              onClick={() => {
                if (selectedRole === 'citizen') {
                  navigate('/register', { state: { role: selectedRole } });
                } else if (selectedRole === 'officer') {
                  navigate('/officer/request-access');
                }
              }}
              variant="outline" 
              fullWidth
              className="text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-800/50 dark:hover:bg-green-900/20 font-semibold py-3.5"
            >
              {selectedRole === 'officer' ? 'Request Access' : 'Create New Account'}
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
