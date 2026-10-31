import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'tinted-green' | 'tinted-lavender' | 'outlined' | 'elevated';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  interactive = false,
  className,
  ...props
}) => {
  const variantStyles = {
    surface:
      'bg-white dark:bg-[#1A2A1F] border border-[#E3EAE1] dark:border-[#2D3E33] shadow-[0_1px_3px_rgba(23,37,27,0.04)]',
    'tinted-green':
      'bg-[#EDF6EA] dark:bg-[#15271B] border border-[#176B3A]/15 text-[#111F15] dark:text-[#E4F5E5]',
    'tinted-lavender':
      'bg-[#EEE7FA] dark:bg-[#251D33] border border-[#7050A8]/20 text-[#111F15] dark:text-[#E4F5E5]',
    outlined:
      'bg-transparent border border-[#E3EAE1] dark:border-[#2D3E33]',
    elevated:
      'bg-white dark:bg-[#1A2A1F] border border-[#E3EAE1] dark:border-[#2D3E33] shadow-[0_8px_24px_-4px_rgba(23,37,27,0.08)]',
  }[variant];

  return (
    <div
      className={cn(
        'rounded-2xl p-4 transition-all duration-200',
        variantStyles,
        interactive && 'cursor-pointer hover:translate-y-[-2px] hover:shadow-[0_8px_20px_-2px_rgba(23,37,27,0.1)] active:scale-[0.99]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
