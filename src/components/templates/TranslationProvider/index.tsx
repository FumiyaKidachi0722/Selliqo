'use client';

// src/components/templates/TranslationProvider/index.tsx
import { createContext, useContext, useEffect, useState } from 'react';

import { Messages } from '@/types/translation';
import { useParams } from 'next/navigation';

const TranslationContext = createContext<Messages | null>(null);

export const useTranslation = (): Messages => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { lang } = useParams();
  const [messages, setMessages] = useState<Messages>({});
  const [loading, setLoading] = useState(true);

  const loadMessages = async (files: string[]) => {
    const allMessages: Messages = {};
    try {
      for (const file of files) {
        const res = await fetch(`/locales/${lang}/${file}.json`);
        if (res.ok) {
          const data = await res.json();
          allMessages[file] = data;
        } else {
          console.error(`Failed to load ${file}.json: ${res.statusText}`);
        }
      }
      return allMessages;
    } catch (error) {
      console.error('Error loading messages:', error);
      return {};
    }
  };

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    loadMessages(['common']).then((loadedMessages) => {
      if (isMounted) {
        setMessages(loadedMessages);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [lang]);

  if (loading) {
    return <div>Loading translations...</div>;
  }

  return (
    <TranslationContext.Provider value={messages}>
      {children}
    </TranslationContext.Provider>
  );
};
