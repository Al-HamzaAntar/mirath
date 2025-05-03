
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  return (
    <header className="relative py-6 mb-10 text-center islamic-pattern">
      <div className="container mx-auto px-4">
        <div className="absolute left-4 top-4">
          <ThemeToggle />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-islamic-primary dark:text-islamic-dark-primary">
          حاسبة الميراث الإسلامي
        </h1>
        <h2 className="text-lg md:text-xl text-islamic-dark/80 dark:text-islamic-dark-dark/80 mt-2">
          على أساس القرآن الكريم والسنة النبوية
        </h2>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-islamic-primary to-islamic-secondary dark:from-islamic-dark-primary dark:to-islamic-dark-secondary"></div>
    </header>
  );
};

export default Header;
