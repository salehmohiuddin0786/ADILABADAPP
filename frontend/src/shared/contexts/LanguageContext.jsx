import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../../locales/en/common.json';
import teTranslations from '../../locales/te/common.json';
import urTranslations from '../../locales/ur/common.json';
import hiTranslations from '../../locales/hi/common.json';

const TRANSLATIONS = {
  en: enTranslations,
  te: teTranslations,
  ur: urTranslations,
  hi: hiTranslations
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', dir: 'ltr' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو', dir: 'rtl' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', dir: 'ltr' }
];

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('adilabad_lang');
      if (savedLang && TRANSLATIONS[savedLang]) {
        setCurrentLanguage(savedLang);
      }
    } catch (e) {
      // Ignore local storage error
    }
  }, []);

  useEffect(() => {
    const activeConfig = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
    if (typeof document !== 'undefined') {
      document.documentElement.lang = activeConfig.code;
      document.documentElement.dir = activeConfig.dir;
      if (activeConfig.dir === 'rtl') {
        document.body.classList.add('rtl-layout');
      } else {
        document.body.classList.remove('rtl-layout');
      }
    }
  }, [currentLanguage]);

  const changeLanguage = (langCode) => {
    if (TRANSLATIONS[langCode]) {
      setCurrentLanguage(langCode);
      try {
        localStorage.setItem('adilabad_lang', langCode);
      } catch (e) {}
    }
  };

  /**
   * Helper translation function with fallback to English
   * e.g. t('brand.name')
   */
  const t = (keyPath, fallback = '') => {
    const keys = keyPath.split('.');
    let result = TRANSLATIONS[currentLanguage];
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        result = undefined;
        break;
      }
    }

    if (result !== undefined) return result;

    // Fallback to English
    let fallbackResult = TRANSLATIONS.en;
    for (const k of keys) {
      if (fallbackResult && fallbackResult[k] !== undefined) {
        fallbackResult = fallbackResult[k];
      } else {
        return fallback || keyPath;
      }
    }
    return fallbackResult || fallback || keyPath;
  };

  const isRTL = currentLanguage === 'ur';

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t, isRTL, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      currentLanguage: 'en',
      changeLanguage: () => {},
      t: (key) => key,
      isRTL: false,
      supportedLanguages: SUPPORTED_LANGUAGES
    };
  }
  return ctx;
}
