'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from './ThemeProvider';

type Theme = 'system' | 'light' | 'dark';
type AccentColor = 'blue' | 'green' | 'purple' | 'red' | 'orange';

const THEME_COLORS = {
  blue: {
    bg: 'bg-blue-500',
    border: 'border-blue-600',
    ring: 'ring-blue-400',
  },
  green: {
    bg: 'bg-green-500',
    border: 'border-green-600',
    ring: 'ring-green-400',
  },
  purple: {
    bg: 'bg-purple-500',
    border: 'border-purple-600',
    ring: 'ring-purple-400',
  },
  red: {
    bg: 'bg-red-500',
    border: 'border-red-600',
    ring: 'ring-red-400',
  },
  orange: {
    bg: 'bg-orange-500',
    border: 'border-orange-600',
    ring: 'ring-orange-400',
  },
};

export function ThemeSettings() {
  const router = useRouter();
  const { theme, accentColor, setTheme, setAccentColor } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/user/theme');
        if (response.ok) {
          const data = await response.json();
          setTheme(data.theme || 'system');
          setAccentColor(data.accentColor || 'blue');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch theme settings:', error);
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [setTheme, setAccentColor]);

  const handleThemeChange = async (newTheme: Theme) => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      setTheme(newTheme);
      
      const response = await fetch('/api/user/theme', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: newTheme, accentColor }),
      });

      if (!response.ok) {
        throw new Error('Failed to update theme');
      }

      router.refresh();
    } catch (error) {
      console.error('Failed to update theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAccentColorChange = async (newColor: AccentColor) => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      setAccentColor(newColor);
      
      const response = await fetch('/api/user/theme', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme, accentColor: newColor }),
      });

      if (!response.ok) {
        throw new Error('Failed to update accent color');
      }

      router.refresh();
    } catch (error) {
      console.error('Failed to update accent color:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
          Theme Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Customize your interface appearance
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Theme Mode
          </label>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {(['system', 'light', 'dark'] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={`flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                  theme === t
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                disabled={isSaving}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Accent Color
          </label>
          <div className="mt-2 flex space-x-3">
            {(['blue', 'green', 'purple', 'red', 'orange'] as AccentColor[]).map(
              (color) => (
                <button
                  key={color}
                  onClick={() => handleAccentColorChange(color)}
                  className={`w-8 h-8 rounded-full transition-all ${THEME_COLORS[color].bg} ${
                    accentColor === color
                      ? `ring-2 ring-offset-2 ${THEME_COLORS[color].ring}`
                      : ''
                  }`}
                  disabled={isSaving}
                  aria-label={`${color} accent color`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
