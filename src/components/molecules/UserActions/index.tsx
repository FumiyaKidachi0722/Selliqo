'use client';

import { Button } from '@/components/atoms/Button';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types/roles';

import styles from './UserActions.module.css';

export const UserActions = () => {
  const { navigate } = useLanguage();
  // const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { isLoggedIn, role } = useAuthStore();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleDashboardNavigation = () => {
    if (role === UserRole.ADMIN || role === UserRole.MANAGER) {
      navigate('/admin/dashboard');
    } else if (role === UserRole.USER) {
      navigate('/user/dashboard');
    }
  };

  return (
    <div className={styles.container}>
      {isLoggedIn ? (
        <div
          className={styles.userIcon}
          onClick={handleDashboardNavigation}
          style={{ cursor: 'pointer' }}
        >
          <span>U</span>
        </div>
      ) : (
        <Button label="Login" onClick={handleLogin} variant="primary" />
      )}
    </div>
  );
};
