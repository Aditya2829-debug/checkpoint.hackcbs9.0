import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'lavender' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-["Plus_Jakarta_Sans"] font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

  const variantStyles = {
    primary:
      'bg-[#005128] text-white hover:bg-[#10532D] shadow-[0_2px_8px_rgba(0,81,40,0.25)] border border-[#005128]',
    secondary:
      'bg-[#83C94B] text-[#111F15] hover:bg-[#92D959] shadow-[0_2px_8px_rgba(131,201,75,0.25)] border border-[#83C94B]',
    lavender:
      'bg-[#7050A8] text-white hover:bg-[#5F5B6B] shadow-[0_2px_8px_rgba(112,80,168,0.25)] border border-[#7050A8]',
    outline:
      'bg-transparent text-[#111F15] dark:text-[#E4F5E5] border border-[#E3EAE1] dark:border-[#2D3E33] hover:bg-[#EDF6EA] dark:hover:bg-[#1A2A1F]',
    ghost:
      'bg-transparent text-[#404940] dark:text-[#9BAA9E] hover:bg-black/5 dark:hover:bg-white/5',
    danger:
      'bg-[#BA1A1A] text-white hover:bg-[#961212] shadow-[0_2px_8px_rgba(186,26,26,0.25)] border border-[#BA1A1A]',
  }[variant];

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5 font-bold',
    icon: 'p-2.5 rounded-xl',
  }[size];

  return (
    <button
      className={cn(baseStyles, variantStyles, sizeStyles, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
