// src/app/[lang]/success/page.tsx

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useTranslation } from '@/hooks/useTranslation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { t } = useTranslation('success'); // 翻訳用フック

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>{t('title')}</h1>
      {sessionId && <p>{t('sessionId', { sessionId })}</p>}
      <p>{t('thanks')}</p>
      <Link href="/" legacyBehavior>
        {t('return')}
      </Link>
    </div>
  );
}
