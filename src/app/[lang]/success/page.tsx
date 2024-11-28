// src/app/[lang]/success/page.tsx

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useTranslation } from '@/hooks/useTranslation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>{t('success.title')}</h1>
      {sessionId && <p>{t('success.sessionId', { sessionId })}</p>}
      <p>{t('success.thanks')}</p>
      <Link href="/" legacyBehavior>
        {t('success.return')}
      </Link>
    </div>
  );
}
