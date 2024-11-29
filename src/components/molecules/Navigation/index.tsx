'use client';

import Link from 'next/link';

import { useLanguage } from '@/providers/LanguageProvider';

import styles from './Navigation.module.css';

export const Navigation = () => {
  const { currentLang } = useLanguage();

  const createLink = (path: string) => {
    if (path === '/') return path;
    return `/${currentLang}${path}`;
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href={createLink('/')}>Home</Link>
        </li>
        <li className={styles.navItem}>
          <span className={styles.disabledLink}>About</span>
        </li>
        <li className={styles.navItem}>
          <span className={styles.disabledLink}>Contact</span>
        </li>
        <li className={styles.navItem}>
          <Link href={createLink('/course')}>Course</Link>
        </li>
      </ul>
    </nav>
  );
};
