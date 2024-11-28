// src/hooks/useTranslation.ts

import { useContext } from 'react';

import { TranslationContext } from '@/components/templates/TranslationProvider';

type Messages = {
  [key: string]: string | Messages;
};

export const useTranslation = () => {
  const messages = useContext(TranslationContext);
  if (!messages) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }

  const getNestedValue = (obj: Messages, key: string): string | undefined => {
    const keys = key.split('.');
    let result: string | Messages | undefined = obj;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = (result as Messages)[k];
      } else {
        return undefined;
      }
    }

    return typeof result === 'string' ? result : undefined;
  };

  const replacePlaceholders = (
    text: string,
    variables: Record<string, string>
  ): string => {
    return text.replace(
      /{{\s*(\w+)\s*}}/g,
      (_, varName) => variables[varName] || ''
    );
  };

  const t = (key: string, variables: Record<string, string> = {}): string => {
    const value = getNestedValue(messages, key);
    if (!value) {
      return key;
    }
    return replacePlaceholders(value, variables);
  };

  return { t };
};
