'use client';

import { TopTemplate } from '@/components/templates/top';
import { useTranslation } from '@/hooks/useTranslation';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div>
      <header>
        <h2>{t('common.welcome')}</h2>
      </header>
      <main>
        <TopTemplate />
      </main>
    </div>
  );
}
