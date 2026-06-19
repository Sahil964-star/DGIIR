import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  id,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col space-y-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
            <Icon size={20} />
          </div>
        )}
        <input
          id={id}
          ref={ref}
          type={inputType}
          className={`
            w-full py-3 rounded-lg border bg-white dark:bg-slate-900 
            text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
            transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700'}
            ${Icon ? 'pl-11 pr-4' : 'px-4'}
            ${isPassword ? 'pr-12' : ''}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 flex items-center px-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none h-full"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
