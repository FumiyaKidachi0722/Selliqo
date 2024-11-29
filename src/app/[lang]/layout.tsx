// src/app/[lang]/layout.tsx
'use client';

import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/Header';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { TranslationProvider } from '@/providers/TranslationProvider';

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <TranslationProvider>
        <Header />
        <main>{children}</main>
        <Footer />
      </TranslationProvider>
    </LanguageProvider>
  );
}
