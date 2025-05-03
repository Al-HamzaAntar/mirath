
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 py-6 text-center border-t border-islamic-primary/20 dark:border-islamic-dark-primary/20">
      <div className="container mx-auto px-4">
        <p className="text-islamic-dark/70 dark:text-islamic-dark-dark/80">
          <span className="block mb-1">{t('app.title')} &copy; {new Date().getFullYear()}</span>
          <span className="block arabic-text">
            {t('footer.disclaimer')}
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
