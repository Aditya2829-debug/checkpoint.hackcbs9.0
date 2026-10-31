import React from 'react';
import { Search, Moon, Sun, ScanLine, ShieldCheck } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useThemeStore } from '../../store/useThemeStore';
import { useScanStore } from '../../store/useScanStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { cn } from '../../utils/cn';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { theme, toggleTheme } = useThemeStore();
  const { openScanner } = useScanStore();
  const { language, toggleLanguage, t } = useLanguageStore();

  const navLinks = [
    { label: t('scan'), to: '/' },
    { label: t('history'), to: '/history' },
    { label: t('explore'), to: '/explore' },
    { label: t('profile'), to: '/profile' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-[#F5FDE8]/95 dark:bg-[#101014]/95 backdrop-blur-md border-b-2 border-[#0F3822]/15 dark:border-[#2D2B38] safe-top transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#D7FF63] text-[#0F3822] border-2 border-[#0F3822] flex items-center justify-center font-bold shadow-[2px_2px_0px_#0F3822] group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-['Space_Grotesk'] font-black text-xl tracking-tight text-[#0F3822] dark:text-[#D7FF63]">
                CheckPoint
              </span>
              <span className="font-['Space_Grotesk'] font-black text-xl text-[#00C6A5]">
                !!
              </span>
            </div>
            <p className="text-[9px] font-extrabold font-mono text-[#69766D] dark:text-[#9BAA9E] tracking-wider uppercase -mt-1 hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links (Visible on md and up) */}
        <nav className="hidden md:flex items-center gap-1 bg-white/70 dark:bg-[#191820]/70 p-1 rounded-full border-2 border-[#0F3822]/15 dark:border-[#2D2B38]">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'px-4 py-1.5 rounded-full text-xs font-["Space_Grotesk"] font-bold transition-all',
                  isActive
                    ? 'bg-[#D7FF63] text-[#0F3822] border-2 border-[#0F3822] shadow-[2px_2px_0px_#0F3822]'
                    : 'text-[#414942] dark:text-[#9BAA9E] hover:text-[#0F3822] dark:hover:text-white'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Working Bilingual Switcher */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-full border-2 border-[#0F3822] text-xs font-['Space_Grotesk'] font-black bg-[#D7FF63] text-[#0F3822] shadow-[2px_2px_0px_#0F3822] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1"
            title="Toggle English / Hindi"
          >
            <span>文A</span>
            <span>{language === 'en' ? 'EN / HI' : 'हिन्दी'}</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl border border-[#0F3822]/20 dark:border-white/20 text-[#0F3822] dark:text-[#D7FF63] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Search products"
            aria-label="Search products"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Desktop Scan CTA Button */}
          <button
            onClick={() => openScanner('barcode')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00C6A5] text-white font-['Space_Grotesk'] font-bold text-xs border-2 border-[#0F3822] shadow-[2px_2px_0px_#0F3822] active:translate-y-[1px] active:shadow-none transition-all"
          >
            <ScanLine className="w-4 h-4 stroke-[2.5]" />
            <span>Scan</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[#0F3822]/20 dark:border-white/20 text-[#0F3822] dark:text-[#D7FF63] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Toggle theme"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FFD154]" />
            ) : (
              <Moon className="w-4 h-4 text-[#0F3822]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
