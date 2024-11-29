// src/providers/TranslationProvider.tsx
'use client';

import React, { createContext, useEffect, useState } from 'react';

import { useAuthStore } from '@/store/useAuthStore';

export type Messages = {
  [namespace: string]: { [key: string]: string };
};

export const TranslationContext = createContext<Messages | null>(null);

export const TranslationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const language = useAuthStore((state) => state.language);
  const [messages, setMessages] = useState<Messages>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/locales/${language}/manifest.json`);
        if (!res.ok) throw new Error('Failed to load manifest.json');

        const files: string[] = await res.json();
        const translations = await Promise.all(
          files.map(async (file) => {
            const fileRes = await fetch(`/locales/${language}/${file}.json`);
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
  }, [language]);

  if (loading) return <div>Loading translations...</div>;

  return (
    <TranslationContext.Provider value={messages}>
      {children}
    </TranslationContext.Provider>
  );
};
