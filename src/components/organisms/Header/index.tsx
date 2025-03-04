// src/components/organisms/Header/index.tsx
import { Logo } from '@/components/atoms/Logo';
import { LanguageToggleButton } from '@/components/molecules/LanguageToggleButton';
import { Navigation } from '@/components/molecules/Navigation';
import { SearchBar } from '@/components/molecules/SearchBar';
import { UserActions } from '@/components/molecules/UserActions';

import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <Logo />
        <Navigation />
      </div>
      <div className={styles.rightSection}>
        <SearchBar />
        <UserActions />
        <LanguageToggleButton />
      </div>
    </header>
  );
};
