'use client';

import { TopTemplate } from '@/components/templates/top';
import { useTranslation } from '@/components/templates/TranslationProvider';

export default function HomePage() {
  const messages = useTranslation();
  return (
    <div>
      <header>
        <h2>{messages.common?.welcome}</h2>
      </header>
      <main>
        <TopTemplate />
      </main>
    </div>
  );
}
