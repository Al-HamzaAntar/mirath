
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full border-islamic-primary/20 dark:border-islamic-dark-primary/30"
      onClick={toggleLanguage}
      title={language === 'ar' ? 'English' : 'العربية'}
    >
      <Globe className="h-5 w-5 text-islamic-primary dark:text-islamic-dark-primary" />
      <span className="sr-only">{language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}</span>
    </Button>
  );
};
