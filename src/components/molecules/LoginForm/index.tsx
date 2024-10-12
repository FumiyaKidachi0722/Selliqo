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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email or Username:</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-describedby={errorMessage ? 'error-email' : undefined}
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
