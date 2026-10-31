import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('checkpoint_theme');
  // Only honor saved if explicitly set by user, otherwise strictly light
  if (saved === 'dark' || saved === 'light') return saved;
  return 'light';
};

const applyThemeToDom = (theme: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;

  if (theme === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    if (body) {
      body.classList.add('dark');
      body.style.backgroundColor = '#101014';
      body.style.color = '#FFFFFF';
    }
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    if (body) {
      body.classList.remove('dark');
      body.style.backgroundColor = '#F5FDE8';
      body.style.color = '#121915';
    }
  }
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('checkpoint_theme', newTheme);
      applyThemeToDom(newTheme);
      return { theme: newTheme };
    }),
  setTheme: (newTheme) => {
    localStorage.setItem('checkpoint_theme', newTheme);
    applyThemeToDom(newTheme);
    set({ theme: newTheme });
  },
}));

// Apply default theme to DOM immediately on load
if (typeof window !== 'undefined') {
  applyThemeToDom(getInitialTheme());
}
