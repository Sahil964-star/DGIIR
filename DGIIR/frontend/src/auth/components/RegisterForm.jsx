import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, Lock, MapPin, CheckCircle2 } from 'lucide-react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import PasswordStrength from './PasswordStrength';
import OTPVerification from './OTPVerification';

const districts = [
  "Central Delhi", "East Delhi", "New Delhi", "North Delhi",
  "North East Delhi", "North West Delhi", "Shahdara",
  "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"
];

const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || 'citizen';
  
  const [step, setStep] = useState('form'); // 'form' | 'otp' | 'success'
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    district: '',
    address: '',
    agreed: false
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    // Simulate API call for registration
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOTP = (otp) => {
    setIsLoading(true);
    // Simulate API call for OTP verification
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 1500);
  };



  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: REGISTRATION FORM */}
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                Create Citizen Account
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Register to report and track civic issues.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <Input
                id="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                icon={User}
                required
              />

              <div className="flex gap-4">
                <div className="w-1/2">
                  <Input
                    id="mobile"
                    placeholder="Mobile Number"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    icon={Phone}
                    required
                  />
                </div>
                <div className="w-1/2">
                  <Input
                    id="email"
                    placeholder="Email Address (Optional)"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={Mail}
                  />
                </div>
              </div>

              <div>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  icon={Lock}
                  required
                  minLength={8}
                />
                <PasswordStrength password={formData.password} />
              </div>

              <Input
                id="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={Lock}
                required
              />

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  id="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block p-3.5 transition-colors"
                >
                  <option value="" disabled>Select District</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <Input
                id="address"
                placeholder="Full Address (Optional)"
                value={formData.address}
                onChange={handleChange}
              />

              <div className="flex items-center py-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    id="agreed"
                    type="checkbox"
                    required
                    checked={formData.agreed}
                    onChange={handleChange}
                    className="rounded border-slate-300 text-green-600 focus:ring-green-600 bg-white dark:bg-slate-800 dark:border-slate-600 h-4 w-4"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    I agree to the Terms and Privacy Policy
                  </span>
                </label>
              </div>

              <Button 
                type="submit" 
                fullWidth 
                variant="primary"
                isLoading={isLoading}
                disabled={!formData.agreed}
                className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3.5 mt-2"
              >
                Create Account
              </Button>

              <div className="text-center mt-6">
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
                >
                  Already have an account? Login
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'otp' && (
          <OTPVerification key="otp" onVerify={handleVerifyOTP} />
        )}

        {/* STEP 3: SUCCESS VALIDATION */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center w-full py-12"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
            </motion.div>
            
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Account Created Successfully
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto">
              Welcome to DGIIR. Your digital public access identity is active.
            </p>
            
            <Button 
              onClick={() => navigate('/citizen')}
              fullWidth 
              variant="primary"
              className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3.5"
            >
              Go to Dashboard
            </Button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default RegisterForm;
