import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/shared/Header';
import { SearchModal } from '../components/shared/SearchModal';
import { ScannerModal } from '../components/shared/ScannerModal';
import { OnboardingModal } from '../components/shared/OnboardingModal';
import { BottomNav } from '../components/shared/BottomNav';

export const Layout: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    // Check if user has already completed initial onboarding
    const onboarded = localStorage.getItem('checkpoint_onboarded');
    if (!onboarded) {
      setIsOnboardingOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5FDE8] dark:bg-[#101014] text-[#121915] dark:text-[#F4FBF4] flex flex-col transition-colors">
      {/* Top Header with Navigation, Language Toggle, and Theme Toggle */}
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Content Area: Responsive width on desktop, phone-optimized on mobile */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 pb-24 md:pb-12">
        <Outlet context={{ onOpenSearch: () => setIsSearchOpen(true), onOpenOnboarding: () => setIsOnboardingOpen(true) }} />
      </main>

      {/* Sticky Bottom Nav - visible only on mobile screens */}
      <div className="md:hidden">
        <BottomNav />
      </div>

      {/* Global Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ScannerModal />
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </div>
  );
};
