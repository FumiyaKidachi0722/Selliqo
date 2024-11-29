// src/components/molecules/LanguageToggleButton/index.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/store/useAuthStore';

import styles from './LanguageToggleButton.module.css';

export const LanguageToggleButton = () => {
  const language = useAuthStore((state) => state.language);
  const setLanguage = useAuthStore((state) => state.setLanguage);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // クライアントサイドでlocalStorageから言語を同期
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage && storedLanguage !== language) {
      setLanguage(storedLanguage);
    }
  }, [language, setLanguage]);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ja' : 'en';
    setLanguage(newLanguage);

    // URLの言語セグメントを置き換え
    const newPathname = pathname.replace(/^\/(en|ja)/, `/${newLanguage}`);
    router.push(newPathname);
  };

  return (
    <button onClick={toggleLanguage} className={styles.toggleButton}>
      {language === 'en' ? '日本語' : 'English'}
    </button>
  );
};
