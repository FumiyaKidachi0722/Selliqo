'use client';

import { useTranslation } from '@/components/templates/TranslationProvider';

export default function HomePage() {
  const messages = useTranslation();
  return (
    <div>
      <h2>{messages.common?.welcome}</h2>
    </div>
  );
}
