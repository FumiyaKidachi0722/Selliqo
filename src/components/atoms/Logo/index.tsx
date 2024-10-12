// src/components/atoms/Logo/index.tsx
import Image from 'next/image';

import styles from './Logo.module.css';

export const Logo = () => {
  return (
    <div className={styles.logo}>
      <Image
        src="/images/logo.webp"
        alt="Logo"
        width={80}
        height={80}
        priority
      />
    </div>
  );
};
