'use client';

import { usePathname } from 'next/navigation';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import { Messages } from '@/types/translation';

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
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'ja'; // デフォルトを 'ja' に設定

  const [messages, setMessages] = useState<Messages>({});
  const [loading, setLoading] = useState(true);

  const loadMessages = useCallback(
    async (files: string[]) => {
      const allMessages: Messages = {};
      try {
        for (const file of files) {
          const res = await fetch(`/locales/${lang}/${file}.json`);
          if (res.ok) {
            const data = await res.json();
            allMessages[file] = data;
          } else {
            console.warn(`Failed to load ${file}.json: ${res.statusText}`);
            allMessages[file] = {}; // 空の翻訳データを設定
          }
        }
        return allMessages;
      } catch (error) {
        console.error('Error loading messages:', error);
        return {};
      }
    },
    [lang]
  );

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
  }, [lang, loadMessages]);

  if (loading) {
    return <div>Loading translations...</div>;
  }

  return (
    <TranslationContext.Provider value={messages}>
      {children}
    </TranslationContext.Provider>
  );
};
