// src/components/molecules/SignupForm/index.tsx
import { useState } from 'react';

import { Button } from '@/components/atoms/Button';

import styles from './SignupForm.module.css';

interface SignupFormProps {
  onSignup: (username: string, email: string, password: string) => void;
  errorMessage?: string;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSignup,
  errorMessage,
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(username, email, password);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          aria-describedby={errorMessage ? 'error-username' : undefined}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
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
      <Button type="submit" label="Sign Up" />
    </form>
  );
};
