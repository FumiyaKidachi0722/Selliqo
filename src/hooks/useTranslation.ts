import { useEffect, useState } from 'react';

type Translations = Record<string, string>;

export const useTranslation = (namespace: string) => {
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);

  const fetchTranslations = async (lang: string) => {
    try {
      const response = await fetch(`/locales/${lang}/${namespace}.json`);
      if (!response.ok) {
        console.error(
          `Failed to load ${namespace}.json: ${response.statusText}`
        );
        return {};
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching translations for ${namespace}:`, error);
      return {};
    }
  };

  useEffect(() => {
    const lang = localStorage.getItem('language') || 'ja'; // デフォルト言語を 'ja' とする
    setLoading(true);

    const loadTranslations = async () => {
      const data = await fetchTranslations(lang);
      setTranslations(data);
      setLoading(false);
    };

    loadTranslations();
  }, [namespace]);

  const t = (key: string, replacements?: Record<string, string | number>) => {
    let translation = translations[key] || key;

    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        translation = translation.replace(`{{${k}}}`, String(v));
      });
    }

    return translation;
  };

  return { t, loading };
};
