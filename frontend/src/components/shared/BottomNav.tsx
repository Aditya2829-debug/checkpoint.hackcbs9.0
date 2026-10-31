import React from 'react';
import { Scan, History, Compass, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useScanStore } from '../../store/useScanStore';
import { cn } from '../../utils/cn';

export const BottomNav: React.FC = () => {
  const { openScanner } = useScanStore();

  const navItems = [
    { label: 'Scan', to: '/', icon: Scan, isScanBtn: true },
    { label: 'History', to: '/history', icon: History },
    { label: 'Explore', to: '/explore', icon: Compass },
    { label: 'Profile', to: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F7FAF6]/95 dark:bg-[#0D1A12]/95 backdrop-blur-md border-t-2 border-[#111F15]/15 dark:border-[#2D3E33] safe-bottom max-w-[440px] mx-auto">
      <div className="flex items-center justify-between h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.isScanBtn) {
            return (
              <NavLink
                key={item.label}
                to="/"
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center py-1 transition-all',
                    isActive
                      ? 'text-[#111F15]'
                      : 'text-[#69766D] dark:text-[#9BAA9E]'
                  )
                }
              >
                {({ isActive }) => (
                  <div
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1 rounded-full transition-all',
                      isActive
                        ? 'bg-[#C5F82A] text-[#111F15] font-bold shadow-sm border border-[#111F15]/30'
                        : 'hover:text-[#111F15]'
                    )}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                    {isActive && (
                      <span className="text-xs font-['Plus_Jakarta_Sans'] font-extrabold tracking-tight">
                        Scan
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1 transition-all',
                  isActive
                    ? 'text-[#111F15]'
                    : 'text-[#69766D] dark:text-[#9BAA9E]'
                )
              }
            >
              {({ isActive }) => (
                <div
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1 rounded-full transition-all',
                    isActive
                      ? 'bg-[#C5F82A] text-[#111F15] font-bold shadow-sm border border-[#111F15]/30'
                      : 'hover:text-[#111F15]'
                  )}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                  {isActive && (
                    <span className="text-xs font-['Plus_Jakarta_Sans'] font-extrabold tracking-tight">
                      {item.label}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
