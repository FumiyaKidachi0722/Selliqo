// src/components/molecules/UserActions/index.tsx
import { Button } from '@/components/atoms/Button';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuthStore } from '@/store/useAuthStore';

import styles from './UserActions.module.css';

export const UserActions = () => {
  const { navigate } = useLanguage();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  // const logout = useAuthStore((state) => state.logout);

  const handleLogin = () => {
    navigate('/login');
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
