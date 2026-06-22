import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Clock, RefreshCw } from 'lucide-react';
import Button from '../../../shared/components/Button';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../../api/authApi';

const OTPInput = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, channel, identifier } = location.state || { role: 'citizen', channel: 'mobile', identifier: '' };
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const inputRef = useRef(null);

  const [timer, setTimer] = useState(300); // 5 minutes
  const [resendTimer, setResendTimer] = useState(30); // 30 seconds
  const [failures, setFailures] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState('');

  const verifyOtpMutation = useMutation({
    mutationFn: (data) => authApi.verifyOtp(data),
    onSuccess: (data, variables) => {
      navigate('/forgot-password/reset', { state: { role, identifier, otp: variables.otp } });
    },
    onError: (err) => {
      const newFailures = failures + 1;
      setFailures(newFailures);
      if (newFailures >= 3) {
        setIsLocked(true);
        setError('Maximum verification attempts reached. Security lockout active.');
      } else {
        setError(err.response?.data?.message || `Invalid code. ${3 - newFailures} attempts remaining.`);
        setOtp(['', '', '', '', '', '']);
        setActiveOTPIndex(0);
      }
    }
  });

  const resendOtpMutation = useMutation({
    mutationFn: (identifier) => authApi.forgotPassword(identifier),
    onSuccess: () => {
      setResendTimer(30);
      setTimer(300);
      setFailures(0);
      setIsLocked(false);
      setError('');
      setOtp(['', '', '', '', '', '']);
      setActiveOTPIndex(0);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setIsLocked(true);
      setError('Security token expired. Please request a new code.');
    }
  }, [timer]);

  const handleOnChange = (e, index) => {
    const { value } = e.target;
    if (isLocked) return;
    const newOTP = [...otp];
    newOTP[index] = value.substring(value.length - 1);
    setOtp(newOTP);
    if (!value) setActiveOTPIndex(index - 1);
    else setActiveOTPIndex(index + 1);
    setError('');
  };

  const handleOnKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOTP = [...otp];
      if (otp[index]) {
        newOTP[index] = '';
        setOtp(newOTP);
      } else if (index > 0) {
        newOTP[index - 1] = '';
        setOtp(newOTP);
        setActiveOTPIndex(index - 1);
      }
      setError('');
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    if (isLocked) return;
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.length > 0) {
      const newOTP = [...otp];
      pastedData.forEach((char, index) => {
        if (index < 6 && /^[0-9]$/.test(char)) {
          newOTP[index] = char;
        }
      });
      setOtp(newOTP);
      setActiveOTPIndex(Math.min(pastedData.length, 5));
    }
  };

  const formatTime = (timeInSeconds) => {
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const s = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleVerify = () => {
    if (isLocked) return;
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    verifyOtpMutation.mutate({ phone: identifier, otp: code });
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    resendOtpMutation.mutate(identifier);
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Verify OTP
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Enter the 6-digit verification security code sent to {channel === 'mobile' ? 'your mobile' : 'your email'}.
        </p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-2">{identifier}</p>
      </div>

      <div className="flex justify-center space-x-2 sm:space-x-4 mb-6">
        {otp.map((_, index) => (
          <React.Fragment key={index}>
            <input
              ref={index === activeOTPIndex ? inputRef : null}
              type="number"
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:border-green-500 focus:ring-green-500 transition-colors disabled:opacity-50"
              onChange={(e) => handleOnChange(e, index)}
              onKeyDown={(e) => handleOnKeyDown(e, index)}
              onPaste={handlePaste}
              value={otp[index]}
              disabled={isLocked}
            />
            {index === 2 && <span className="flex items-center text-slate-300 dark:text-slate-600 font-bold">-</span>}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center text-red-600 dark:text-red-400 text-sm font-semibold mb-6 space-x-1"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="flex items-center justify-between text-sm mb-8 px-2">
        <div className="flex items-center text-slate-500 dark:text-slate-400 font-medium space-x-1.5">
          <Clock className="w-4 h-4" />
          <span className={timer < 60 ? 'text-red-500' : ''}>{formatTime(timer)}</span>
        </div>
        <button
          onClick={handleResend}
          disabled={resendTimer > 0 || isLocked || resendOtpMutation.isPending}
          className="flex items-center font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Resend Code {resendTimer > 0 && `(${formatTime(resendTimer)})`}
        </button>
      </div>

      <div className="space-y-4">
        <Button 
          onClick={handleVerify}
          fullWidth 
          variant="primary"
          isLoading={verifyOtpMutation.isPending}
          disabled={isLocked || otp.join('').length < 6}
          className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-4"
        >
          Verify OTP
        </Button>

        <Button 
          onClick={() => navigate('/forgot-password', { state: { role } })}
          fullWidth 
          variant="outline"
          className="border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 font-semibold py-3.5"
        >
          Change {channel === 'mobile' ? 'Mobile Number' : 'Email'}
        </Button>
      </div>
    </div>
  );
};

export default OTPInput;
