import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/constants';

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'light' | 'dark' | 'system'

  useEffect(() => {
    AsyncStorage.getItem('theme_mode').then((saved) => {
      if (saved) setThemeMode(saved);
    });
  }, []);

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  const theme = {
    isDark,
    colors: {
      background: isDark ? COLORS.darkBg : COLORS.gray50,
      card: isDark ? COLORS.darkCard : COLORS.white,
      text: isDark ? COLORS.darkText : COLORS.gray900,
      textSecondary: isDark ? COLORS.darkTextSecondary : COLORS.gray500,
      border: isDark ? COLORS.darkBorder : COLORS.gray200,
      primary: COLORS.primary,
      accent: COLORS.accent,
      inputBg: isDark ? '#21262D' : COLORS.white,
    },
  };

  const toggleTheme = async () => {
    const next = isDark ? 'light' : 'dark';
    setThemeMode(next);
    await AsyncStorage.setItem('theme_mode', next);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
