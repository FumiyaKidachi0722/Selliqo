// src/components/templates/TranslationProvider/index.tsx
'use client';

import { usePathname } from 'next/navigation';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { Messages } from '@/types/translation';

export const TranslationContext = createContext<Messages | null>(null);

export const useTranslation = (): Messages => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

const supportedLanguages = ['en', 'ja']; // サポートする言語を定義

export const TranslationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [lang, setLang] = useState('ja'); // デフォルトの言語
  const [messages, setMessages] = useState<Messages>({});
  const [loading, setLoading] = useState(true);

  // パス名から言語コードを抽出
  useEffect(() => {
    const pathSegments = pathname?.split('/');
    const potentialLang = pathSegments && pathSegments[1];
    if (supportedLanguages.includes(potentialLang)) {
      setLang(potentialLang);
    } else {
      setLang('ja'); // フォールバックとしてデフォルト言語を設定
    }
  }, [pathname]);

  const loadMessages = useCallback(async () => {
    try {
      // manifest.jsonをフェッチ
      const manifestRes = await fetch(`/locales/${lang}/manifest.json`);
      if (!manifestRes.ok) {
        throw new Error(
          `Failed to load manifest.json: ${manifestRes.statusText}`
        );
      }
      const files: string[] = await manifestRes.json();

      const allMessages: Messages = {};

      // 各翻訳ファイルを並行してフェッチ
      const fetchPromises = files.map(async (file) => {
        const res = await fetch(`/locales/${lang}/${file}.json`);
        if (res.ok) {
          const data = await res.json();
          allMessages[file] = data;
        } else {
          console.warn(`Failed to load ${file}.json: ${res.statusText}`);
          allMessages[file] = {};
        }
      });

      await Promise.all(fetchPromises);

      return allMessages;
    } catch (error) {
      console.error('Error loading messages:', error);
      return {};
    }
  }, [lang]);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);

    loadMessages().then((loadedMessages) => {
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
    return <div>翻訳を読み込んでいます...</div>;
  }

  return (
    <TranslationContext.Provider value={messages}>
      {children}
    </TranslationContext.Provider>
  );
};
