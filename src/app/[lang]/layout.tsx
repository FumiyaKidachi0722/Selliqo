'use client';

import { Layout } from '@/components/templates/Layout';
import { TranslationProvider } from '@/components/templates/TranslationProvider';

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TranslationProvider>
      <Layout>{children}</Layout>
    </TranslationProvider>
  );
}
