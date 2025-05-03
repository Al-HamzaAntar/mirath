
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t } = useLanguage();

  // Check system preference or stored preference on component mount
  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full border-islamic-primary/20 dark:border-islamic-dark-primary/30"
      onClick={toggleTheme}
      title={isDarkMode ? t('theme.light') : t('theme.dark')}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-islamic-secondary" />
      ) : (
        <Moon className="h-5 w-5 text-islamic-primary" />
      )}
      <span className="sr-only">{t('theme.toggle')}</span>
    </Button>
  );
};
