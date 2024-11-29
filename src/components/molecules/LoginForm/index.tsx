// src/components/molecules/LoginForm/index.tsx
import { useState } from 'react';

import { Button } from '@/components/atoms/Button';

import styles from './LoginForm.module.css';

interface LoginFormProps {
  onLogin: (identifier: string, password: string) => void;
  errorMessage?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  errorMessage,
}) => {
  const [identifier, setIdentifier] = useState(''); // Email または Username
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(identifier, password);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="identifier">Email or Username:</label>
        <input
          id="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          aria-describedby={errorMessage ? 'error-identifier' : undefined}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-describedby={errorMessage ? 'error-password' : undefined}
        />
      </div>
      {errorMessage && (
        <p id="error-message" className={styles.error}>
          {errorMessage}
        </p>
      )}
      <Button type="submit" label="Login" />
    </form>
  );
};
