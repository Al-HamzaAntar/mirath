
import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-20 py-6 text-center border-t border-islamic-primary/20 dark:border-islamic-dark-primary/20">
      <div className="container mx-auto px-4">
        <p className="text-islamic-dark/70 dark:text-islamic-dark-dark/80">
          <span className="block mb-1">حاسبة الميراث الإسلامي &copy; {new Date().getFullYear()}</span>
          <span className="block arabic-text">
            هذه الحاسبة هي مجرد أداة مساعدة ولا تغني عن استشارة أهل العلم المتخصصين في علم الفرائض
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
