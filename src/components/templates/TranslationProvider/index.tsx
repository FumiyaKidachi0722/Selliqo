'use client';

import { usePathname } from 'next/navigation';
import React, { createContext, useState, useEffect } from 'react';

export type Messages = {
  [namespace: string]: { [key: string]: string };
};

export const TranslationContext = createContext<Messages | null>(null);

export const TranslationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState('en');
  const [messages, setMessages] = useState<Messages>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lang = pathname.startsWith('/ja') ? 'ja' : 'en';
    setCurrentLang(lang);
  }, [pathname]);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const res = await fetch(`/locales/${currentLang}/manifest.json`);
        if (!res.ok) throw new Error('Failed to load manifest.json');

        const files: string[] = await res.json();
        const translations = await Promise.all(
          files.map(async (file) => {
            const fileRes = await fetch(`/locales/${currentLang}/${file}.json`);
            return fileRes.ok ? { [file]: await fileRes.json() } : {};
          })
        );
        const mergedMessages = translations.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        setMessages(mergedMessages);
      } catch (error) {
        console.error('Error loading translations:', error);
        setMessages({});
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [currentLang]);

  if (loading) return <div>Loading translations...</div>;

  return (
    <TranslationContext.Provider value={messages}>
      {children}
    </TranslationContext.Provider>
  );
};
