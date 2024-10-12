// src/components/molecules/UserActions/index.tsx
import { useState } from 'react';

import { Button } from '@/components/atoms/Button';

import styles from './UserActions.module.css';

export const UserActions = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <div className={styles.container}>
      {loggedIn ? (
        <div className={styles.userIcon}>
          <span>U</span>
        </div>
      ) : (
        <Button label="Login" onClick={handleLogin} variant="primary" />
      )}
    </div>
  );
};
