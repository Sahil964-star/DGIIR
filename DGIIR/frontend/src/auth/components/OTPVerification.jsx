import React, { useState, useRef, useEffect } from 'react';
import Button from '../../shared/components/Button';
import { motion } from 'framer-motion';

const OTPVerification = ({ onVerify, isLoading }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (value === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const digit = value.slice(-1);
    if (!/^\d$/.test(digit)) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto focus next input
    if (index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        if (index > 0) {
          const newOtp = [...otp];
          newOtp[index - 1] = '';
          setOtp(newOtp);
          inputRefs.current[index - 1].focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp(newOtp);
    inputRefs.current[5].focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      onVerify(otpValue);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          Verify Your Identity
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          A 6-digit verification security code has been sent to your mobile device.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-8">
        <div className="flex justify-between max-w-sm mx-auto gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-2xl font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
            />
          ))}
        </div>

        <Button 
          type="submit" 
          fullWidth 
          variant="primary"
          disabled={otp.join('').length !== 6}
          isLoading={isLoading}
          className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3.5"
        >
          Verify OTP
        </Button>

        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Resend OTP in <span className="font-semibold text-slate-900 dark:text-white">{countdown}s</span>
            </p>
          ) : (
            <button 
              type="button"
              onClick={() => setCountdown(30)}
              className="text-sm font-semibold text-green-600 hover:text-green-700 dark:text-green-500 transition-colors"
            >
              Resend OTP
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default OTPVerification;
