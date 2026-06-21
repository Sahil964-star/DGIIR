import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../../api/authApi';

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || 'citizen';
  const identifier = location.state?.identifier || '';
  const otp = location.state?.otp || '';
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const resetPasswordMutation = useMutation({
    mutationFn: (data) => authApi.resetPassword(data),
    onSuccess: () => {
      navigate('/forgot-password/success', { state: { role } });
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError('');
  };

  const isPasswordValid = () => {
    const { password } = formData;
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isPasswordValid()) {
      setError('Please ensure your password meets all strength requirements.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    resetPasswordMutation.mutate({
      phone: identifier,
      otp,
      newPassword: formData.password
    });
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Create New Password
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block p-3.5 transition-colors pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div className="mt-3">
            <PasswordStrengthMeter password={formData.password} />
          </div>
        </div>

        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <ShieldCheck className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`pl-10 w-full bg-white dark:bg-slate-800 border ${
                error && formData.password !== formData.confirmPassword 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-slate-300 dark:border-slate-700 focus:ring-green-600 focus:border-green-600'
              } text-slate-900 dark:text-white text-sm rounded-lg block p-3.5 transition-colors pr-10`}
            />
          </div>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
              {error}
            </motion.p>
          )}
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            fullWidth 
            variant="primary"
            isLoading={resetPasswordMutation.isPending}
            disabled={!formData.password || !formData.confirmPassword}
            className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-4"
          >
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
