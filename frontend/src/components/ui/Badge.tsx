import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'lavender' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  onClick,
}) => {
  const variantStyles = {
    default: 'bg-[#E2F3D8] text-[#176B3A] border-transparent dark:bg-[#1A2A1F] dark:text-[#98E9AB]',
    success: 'bg-[#EDF6EA] text-[#005128] border-[#176B3A]/20 dark:bg-[#10532D]/40 dark:text-[#AAF470]',
    warning: 'bg-[#FEF7EC] text-[#9A6405] border-[#E6AD45]/30 dark:bg-[#3D2E12] dark:text-[#F3CE85]',
    danger: 'bg-[#FDF2F2] text-[#BA1A1A] border-[#D96E61]/30 dark:bg-[#401818] dark:text-[#FFA4A0]',
    lavender: 'bg-[#EEE7FA] text-[#7050A8] border-[#DAD4E6] dark:bg-[#30263F] dark:text-[#E6DFF2]',
    outline: 'bg-transparent text-[#404940] border-[#E3EAE1] dark:border-[#2D3E33] dark:text-[#9BAA9E]',
  }[variant];

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] font-semibold',
    md: 'px-3 py-1 text-xs font-semibold',
  }[size];

  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors',
        sizeStyles,
        variantStyles,
        onClick && 'cursor-pointer hover:opacity-85',
        className
      )}
    >
      {children}
    </span>
  );
};
