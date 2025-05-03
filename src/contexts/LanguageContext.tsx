
import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  t: (key: string) => string;
};

const defaultLanguage: 'ar' | 'en' = 'ar';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations dictionary
const translations: Record<string, Record<'ar' | 'en', string>> = {
  // Header
  'app.title': {
    ar: 'حاسبة الميراث الإسلامي',
    en: 'Islamic Inheritance Calculator',
  },
  'app.subtitle': {
    ar: 'على أساس القرآن الكريم والسنة النبوية',
    en: 'Based on the Quran and Sunnah',
  },
  
  // Footer
  'footer.disclaimer': {
    ar: 'هذه الحاسبة هي مجرد أداة مساعدة ولا تغني عن استشارة أهل العلم المتخصصين في علم الفرائض',
    en: 'This calculator is just a helping tool and does not replace consulting with specialists in Islamic inheritance law',
  },
  
  // Estate Form
  'estate.title': {
    ar: 'بيانات التركة',
    en: 'Estate Details',
  },
  'estate.totalAssets': {
    ar: 'إجمالي الأصول',
    en: 'Total Assets',
  },
  'estate.totalDebts': {
    ar: 'إجمالي الديون',
    en: 'Total Debts',
  },
  'estate.funeralExpenses': {
    ar: 'مصاريف الجنازة',
    en: 'Funeral Expenses',
  },
  'estate.bequests': {
    ar: 'الوصية (حتى 1/3)',
    en: 'Bequests (up to 1/3)',
  },
  'estate.currency': {
    ar: 'العملة:',
    en: 'Currency:',
  },
  'estate.netEstate': {
    ar: 'صافي التركة للتوزيع:',
    en: 'Net Estate for Distribution:',
  },
  'estate.netEstateFormula': {
    ar: 'صافي التركة = إجمالي الأصول - الديون - مصاريف الجنازة - الوصية',
    en: 'Net Estate = Total Assets - Debts - Funeral Expenses - Bequests',
  },
  'estate.calculate': {
    ar: 'حساب صافي التركة',
    en: 'Calculate Net Estate',
  },
  
  // Heirs Form
  'heirs.title': {
    ar: 'الورثة',
    en: 'Heirs',
  },
  'heirs.calculate': {
    ar: 'حساب الميراث',
    en: 'Calculate Inheritance',
  },
  
  // Results
  'results.title': {
    ar: 'نتائج الميراث',
    en: 'Inheritance Results',
  },
  'results.estateDetails': {
    ar: 'تفاصيل التركة:',
    en: 'Estate Details:',
  },
  'results.totalAssets': {
    ar: 'إجمالي الأصول:',
    en: 'Total Assets:',
  },
  'results.totalDebts': {
    ar: 'إجمالي الديون:',
    en: 'Total Debts:',
  },
  'results.funeralExpenses': {
    ar: 'مصاريف الجنازة:',
    en: 'Funeral Expenses:',
  },
  'results.bequests': {
    ar: 'الوصية:',
    en: 'Bequests:',
  },
  'results.netEstate': {
    ar: 'صافي التركة للتوزيع:',
    en: 'Net Estate for Distribution:',
  },
  'results.shares': {
    ar: 'توزيع الأنصبة:',
    en: 'Distribution of Shares:',
  },
  'results.aulNotice': {
    ar: 'تنبيه: تم تطبيق "العول"',
    en: 'Notice: "Awl" has been applied',
  },
  'results.aulDescription': {
    ar: 'مجموع الأنصبة المحددة شرعًا تجاوز الواحد الصحيح، لذلك تم تخفيض نصيب كل وارث بشكل متناسب.',
    en: 'The sum of the legally defined shares exceeded one, so each heir\'s share was proportionally reduced.',
  },
  'results.raddNotice': {
    ar: 'تنبيه: تم تطبيق "الرد"',
    en: 'Notice: "Radd" has been applied',
  },
  'results.raddDescription': {
    ar: 'مجموع الأنصبة المحددة أقل من الواحد الصحيح، وتم رد الباقي على أصحاب الفروض بحسب أنصبتهم باستثناء الزوجين.',
    en: 'The sum of the defined shares is less than one, and the remainder has been returned to the entitled heirs proportionally, except for spouses.',
  },
  'results.percentage': {
    ar: 'النسبة المئوية',
    en: 'Percentage',
  },
  'results.fraction': {
    ar: 'الكسور الشرعية',
    en: 'Legal Fractions',
  },
  'results.amount': {
    ar: 'المبلغ',
    en: 'Amount',
  },
  'results.noHeirs': {
    ar: 'لا يوجد ورثة مستحقين للتركة أو المدخلات غير صحيحة',
    en: 'There are no eligible heirs for the estate or the inputs are invalid',
  },
  'results.recalculate': {
    ar: 'إعادة الحساب',
    en: 'Recalculate',
  },
  'results.print': {
    ar: 'طباعة النتائج',
    en: 'Print Results',
  },
  'results.disclaimer': {
    ar: 'ملاحظة: هذه الحاسبة هي أداة مساعدة فقط وتعتمد على المذهب السني، وينصح بالرجوع لأهل العلم والمتخصصين في علم الفرائض للحالات الخاصة.',
    en: 'Note: This calculator is only a helpful tool based on the Sunni school of thought, and it is recommended to consult scholars and specialists in inheritance law for special cases.',
  },
  
  // Toasts
  'toast.estateCalculated': {
    ar: 'تم حساب صافي التركة',
    en: 'Net estate calculated',
  },
  'toast.netEstateAmount': {
    ar: 'صافي التركة:',
    en: 'Net estate:',
  },
  'toast.inheritanceCalculated': {
    ar: 'تم حساب الميراث',
    en: 'Inheritance calculated',
  },
  'toast.inheritanceDescription': {
    ar: 'تم توزيع التركة وفق أحكام الشريعة الإسلامية',
    en: 'The estate has been distributed according to Islamic law',
  },
  'toast.invalidAssets': {
    ar: 'خطأ في البيانات',
    en: 'Data Error',
  },
  'toast.assetsError': {
    ar: 'يجب أن تكون قيمة الأصول أكبر من صفر',
    en: 'Asset value must be greater than zero',
  },
  'toast.noHeirs': {
    ar: 'لا يوجد ورثة',
    en: 'No Heirs',
  },
  'toast.noHeirsError': {
    ar: 'يرجى تحديد الورثة أولاً',
    en: 'Please select heirs first',
  },
  'toast.bequestWarning': {
    ar: 'تنبيه بخصوص الوصية',
    en: 'Bequest Warning',
  },
  'toast.bequestError': {
    ar: 'الوصية تتجاوز ثلث التركة، وهذا قد لا يكون مقبولاً شرعاً',
    en: 'The bequest exceeds one-third of the estate, which may not be acceptable in Islamic law',
  },
  
  // ThemeToggle
  'theme.light': {
    ar: 'تفعيل الوضع النهاري',
    en: 'Enable light mode',
  },
  'theme.dark': {
    ar: 'تفعيل الوضع الليلي',
    en: 'Enable dark mode',
  },
  'theme.toggle': {
    ar: 'تبديل المظهر',
    en: 'Toggle theme',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'ar' | 'en'>(defaultLanguage);

  useEffect(() => {
    // Update document direction based on language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en' | null;
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
