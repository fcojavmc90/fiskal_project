"use client";
import React, { createContext, useContext, useState } from 'react';
import translations from '../../lib/translations.json';

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<'es' | 'en'>('es');

  const t = (key: string) => {
    const keys = key.split('.');
    let result: any = (translations as any)[lang];
    for (const k of keys) {
      if (result[k]) result = result[k];
      else return key;
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  return context;
};
