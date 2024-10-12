'use client';

import { useTranslation } from '@/components/templates/TranslationProvider';

export default function LoginPage() {
  const messages = useTranslation();

  return (
    <div>
      <h2>{messages.common?.loginTitle || 'Login'}</h2>
      <button>{messages.common?.loginButton || 'Login Button'}</button>
    </div>
  );
}
