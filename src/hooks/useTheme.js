// hooks/useTheme.js

import { useState, useEffect, useCallback, useMemo } from 'react';

// Theme configuration with Kimi AI-style colors
const THEMES = {
  light: {
    name: 'light',
    background: '#ffffff',
    surface: '#f8fafc',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    codeBg: '#f1f5f9',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  dark: {
    name: 'dark',
    background: '#0a0a0d',
    surface: '#161b22',
    primary: '#60a5fa',
    secondary: '#a78bfa',
    accent: '#22d3ee',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    border: '#30363d',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    gradient: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
    codeBg: '#0d1117',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
  },
  midnight: {
    name: 'midnight',
    background: '#020617',
    surface: '#0f172a',
    primary: '#38bdf8',
    secondary: '#818cf8',
    accent: '#2dd4bf',
    text: '#e2e8f0',
    textMuted: '#64748b',
    border: '#1e293b',
    shadow: '0 4px 20px rgba(56, 189, 248, 0.15)',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
    codeBg: '#020617',
    success: '#4ade80',
    warning: '#facc15',
    error: '#fb7185',
  },
  ocean: {
    name: 'ocean',
    background: '#0c4a6e',
    surface: '#075985',
    primary: '#38bdf8',
    secondary: '#22d3ee',
    accent: '#67e8f9',
    text: '#ecfeff',
    textMuted: '#a5f3fc',
    border: '#164e63',
    shadow: '0 4px 20px rgba(34, 211, 238, 0.2)',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%)',
    codeBg: '#083344',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
  }
};

// Storage key
const STORAGE_KEY = 'swiftmeta-theme-preference';
const SYSTEM_PREFERS_KEY = 'swiftmeta-system-preference';

/**
 * Smart theme hook with system detection, persistence, and animations
 */
export function useTheme() {
  // Initialize state from localStorage or system preference
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEMES[stored]) return stored;
    
    // Check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [followsSystem, setFollowsSystem] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(SYSTEM_PREFERS_KEY) === 'true';
  });

  // Get current theme colors
  const colors = useMemo(() => THEMES[theme] || THEMES.dark, [theme]);

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;

    // Add transition class
    setIsTransitioning(true);
    body.classList.add('theme-transitioning');

    // Apply CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === 'string' && !value.startsWith('linear')) {
        root.style.setProperty(`--theme-${key}`, value);
      }
    });

    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', theme);

    // Remove transition class after animation
    const timer = setTimeout(() => {
      body.classList.remove('theme-transitioning');
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [theme, colors]);

  // Listen to system preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || !followsSystem) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setThemeState(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [followsSystem]);

  // Set theme explicitly
  const setTheme = useCallback((newTheme) => {
    if (!THEMES[newTheme]) {
      console.warn(`Theme "${newTheme}" not found. Available: ${Object.keys(THEMES).join(', ')}`);
      return;
    }

    setFollowsSystem(false);
    localStorage.setItem(STORAGE_KEY, newTheme);
    localStorage.setItem(SYSTEM_PREFERS_KEY, 'false');
    setThemeState(newTheme);
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  // Cycle through all themes
  const cycleTheme = useCallback(() => {
    const themeNames = Object.keys(THEMES);
    const currentIndex = themeNames.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    setTheme(themeNames[nextIndex]);
  }, [theme, setTheme]);

  // Follow system preference
  const followSystemPreference = useCallback(() => {
    setFollowsSystem(true);
    localStorage.setItem(SYSTEM_PREFERS_KEY, 'true');
    localStorage.removeItem(STORAGE_KEY);
    
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setThemeState(systemPrefersDark ? 'dark' : 'light');
  }, []);

  // Check if current theme is dark (for conditional logic)
  const isDark = useMemo(() => {
    return ['dark', 'midnight', 'ocean'].includes(theme);
  }, [theme]);

  // Get theme-aware className helper
  const cx = useCallback((lightClass, darkClass) => {
    return isDark ? darkClass : lightClass;
  }, [isDark]);

  // Theme-aware styles object
  const styles = useMemo(() => ({
    background: { backgroundColor: colors.background },
    surface: { backgroundColor: colors.surface },
    text: { color: colors.text },
    textMuted: { color: colors.textMuted },
    border: { borderColor: colors.border },
    gradient: { background: colors.gradient },
    shadow: { boxShadow: colors.shadow },
  }), [colors]);

  return {
    // Current state
    theme,
    colors,
    isDark,
    isTransitioning,
    followsSystem,
    
    // Available themes
    availableThemes: Object.keys(THEMES),
    themes: THEMES,
    
    // Actions
    setTheme,
    toggleTheme,
    cycleTheme,
    followSystemPreference,
    
    // Helpers
    cx,
    styles,
    
    // For styled-components/emotion
    themeVars: colors,
  };
}

/**
 * Hook for animated theme transitions
 */
export function useThemeTransition() {
  const { isTransitioning, theme } = useTheme();
  
  return {
    isTransitioning,
    transitionClass: isTransitioning ? 'theme-transitioning' : '',
    transitionStyles: {
      transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
    }
  };
}

/**
 * Hook for theme-aware media queries
 */
export function useThemeMedia() {
  const { isDark } = useTheme();
  
  return {
    prefersReducedMotion: typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false,
    prefersHighContrast: typeof window !== 'undefined'
      ? window.matchMedia('(prefers-contrast: high)').matches
      : false,
    isDark,
  };
}

// Default export
export default useTheme;
