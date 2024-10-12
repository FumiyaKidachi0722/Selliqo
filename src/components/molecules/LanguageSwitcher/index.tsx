'use client';

// src/components/molecules/LanguageSwitcher/index.tsx
import { usePathname, useRouter } from 'next/navigation';

import styles from './LanguageSwitcher.module.css';

export const LanguageSwitcher = () => {
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|ja)/, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div>
      <button className={styles.button} onClick={() => changeLanguage('en')}>
        English
      </button>
      <button className={styles.button} onClick={() => changeLanguage('ja')}>
        日本語
      </button>
    </div>
  );
};
