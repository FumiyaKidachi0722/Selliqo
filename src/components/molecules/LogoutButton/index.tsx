// src/components/molecules/LogoutButton/index.tsx
'use client';

import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/useAuthStore';

import styles from './LogoutButton.module.css';

export const LogoutButton = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout(); // ログアウト処理
    router.push('/');
  };

  return (
    <button onClick={handleLogout} className={styles.logoutButton}>
      ログアウト
    </button>
  );
};
