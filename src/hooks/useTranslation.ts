// src/hooks/useTranslation.ts
import { useContext } from 'react';

import { TranslationContext } from '@/providers/TranslationProvider';

export const useTranslation = () => {
  const messages = useContext(TranslationContext);

  if (!messages) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  const t = (key: string, variables: Record<string, string> = {}): string => {
    const [namespace, ...restKeys] = key.split('.');
    const namespaceMessages = messages[namespace];

    if (!namespaceMessages) {
      console.warn(`Translation namespace "${namespace}" not found.`);
      return key;
    }

    const translationKey = restKeys.join('.');
    const result = namespaceMessages[translationKey];

    if (typeof result === 'string') {
      return Object.entries(variables).reduce(
        (acc, [varName, value]) => acc.replace(`{{${varName}}}`, value),
        result
      );
    }

    console.warn(`Translation key "${key}" not found.`);
    return key;
  };

  return { t };
};
