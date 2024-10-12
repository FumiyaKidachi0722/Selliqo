// src/components/templates/Layout/index.tsx
import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/Header';

import styles from './Layout.module.css';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};
