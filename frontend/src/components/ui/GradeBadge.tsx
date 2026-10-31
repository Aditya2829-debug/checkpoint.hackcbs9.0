import React from 'react';
import type { HealthGrade } from '../../types';
import { cn } from '../../utils/cn';

interface GradeBadgeProps {
  grade: HealthGrade;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
  className?: string;
}

export const GradeBadge: React.FC<GradeBadgeProps> = ({
  grade,
  size = 'md',
  showLabel = false,
  className,
}) => {
  const gradeStyles = {
    A: {
      bg: 'bg-[#00C6A5] text-white -rotate-[1.5deg]',
      label: 'Grade A • Clean & Safe',
    },
    B: {
      bg: 'bg-[#D7FF63] text-[#0F3822] rotate-1',
      label: 'Grade B • Moderate Watch',
    },
    C: {
      bg: 'bg-[#FFD154] text-[#0F3822] rotate-0',
      label: 'Grade C • Cautionary',
    },
    D: {
      bg: 'bg-[#FF5E5E] text-white -rotate-2',
      label: 'Grade D • High Hazard',
    },
  }[grade];

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs font-bold rounded-lg border-2 border-[#0F3822]',
    md: 'w-10 h-10 text-base font-extrabold rounded-xl border-2 border-[#0F3822] shadow-[2px_2px_0px_#0F3822]',
    lg: 'w-14 h-14 text-2xl font-black rounded-2xl border-2 border-[#0F3822] shadow-[3px_3px_0px_#0F3822]',
    hero: 'w-24 h-24 text-5xl font-black rounded-3xl border-3 border-[#0F3822] shadow-[4px_4px_0px_#0F3822]',
  }[size];

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center font-["Space_Grotesk"] transition-transform select-none',
          sizeClasses,
          gradeStyles.bg
        )}
      >
        {grade}
      </div>
      {showLabel && (
        <span className="text-xs font-bold tracking-wide uppercase font-['Space_Grotesk'] text-[#0F3822] dark:text-[#D7FF63]">
          {gradeStyles.label}
        </span>
      )}
    </div>
  );
};
