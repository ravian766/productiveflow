'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'system' | 'light' | 'dark';
type AccentColor = 'blue' | 'green' | 'purple' | 'red' | 'orange';

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_COLORS = {
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('system');
  const [accentColor, setAccentColor] = useState<AccentColor>('blue');

  // Only run on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        const response = await fetch('/api/user/theme');
        if (response.ok) {
          const data = await response.json();
          setTheme(data.theme || 'system');
          setAccentColor(data.accentColor || 'blue');
        }
      } catch (error) {
        console.error('Failed to fetch theme settings:', error);
      }
    };

    if (mounted) {
      fetchThemeSettings();
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    const style = document.documentElement.style;
    
    // Apply theme colors
    const colors = THEME_COLORS[accentColor];
    Object.entries(colors).forEach(([shade, value]) => {
      style.setProperty(`--color-primary-${shade}`, value);
    });

    // Apply theme mode
    root.classList.remove('light', 'dark');

    const setThemeClass = (isDark: boolean) => {
      root.classList.remove('light', 'dark');
      root.classList.add(isDark ? 'dark' : 'light');
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setThemeClass(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setThemeClass(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setThemeClass(theme === 'dark');
    }

    // Handle accent color
    const colorOptions: AccentColor[] = ['blue', 'green', 'purple', 'red', 'orange'];
    colorOptions.forEach((color) => {
      root.classList.remove(`accent-${color}`);
    });
    root.classList.add(`accent-${accentColor}`);
  }, [theme, accentColor, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
