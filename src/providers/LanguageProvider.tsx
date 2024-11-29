// src/providers/LanguageProvider.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  currentLang: string;
  changeLanguage: (lang: string) => void;
  navigate: (path: string) => void; // ナビゲート関数を追加
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState('ja');

  useEffect(() => {
    const langFromUrl = pathname?.split('/')[1];
    if (langFromUrl && ['en', 'ja'].includes(langFromUrl)) {
      setCurrentLang(langFromUrl);
    } else {
      setCurrentLang('ja'); // デフォルト言語
    }
  }, [pathname]);

  const changeLanguage = (lang: string) => {
    const newPath = pathname.replace(/^\/(en|ja)/, `/${lang}`);
    setCurrentLang(lang);
    localStorage.setItem('language', lang);
    router.push(newPath);
  };

  const navigate = (path: string) => {
    const fullPath = `/${currentLang}${path}`;
    router.push(fullPath);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage, navigate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
