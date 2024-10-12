// src/components/molecules/UserActions/index.tsx
// usePathnameとuseRouterをインポート
import { useAuthStore } from '@/store/useAuthStore';
import { usePathname, useRouter } from 'next/navigation';

// Zustandのストアをインポート
import { Button } from '@/components/atoms/Button';

import styles from './UserActions.module.css';

export const UserActions = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  // const logout = useAuthStore((state) => state.logout);

  const currentLang = pathname.split('/')[1] || 'ja';

  const handleLogin = () => {
    router.push(`/${currentLang}/login`);
  };

  // const handleLogout = () => {
  //   logout();
  // };

  return (
    <div className={styles.container}>
      {isLoggedIn ? (
        <div className={styles.userIcon}>
          <span>U</span>
          {/* <Button label="Logout" onClick={handleLogout} variant="secondary" /> */}
        </div>
      ) : (
        <Button label="Login" onClick={handleLogin} variant="primary" />
      )}
    </div>
  );
};
