// src/components/templates/Login/index.tsx
import { useEffect, useState } from 'react';

import { useLanguage } from '@/hooks/useLanguage';
import { useAuthStore } from '@/store/useAuthStore';

import { LoginForm } from '@/components/molecules/LoginForm';
import { useTranslation } from '@/components/templates/TranslationProvider';

export const LoginTemplate = () => {
  const messages = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const { navigate } = useLanguage();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    // ダミーデータをpublic配下から取得
    const fetchUsers = async () => {
      try {
        const response = await fetch('/data/users.json');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to load user data');
      }
    };
    fetchUsers();
  }, []);

  const handleLogin = (identifier: string, password: string) => {
    const user = users.find(
      (user) =>
        (user.username === identifier || user.email === identifier) &&
        user.password === password
    );

    if (user) {
      login('dummy-token', user.username, user.email, user.role);
      if (user.role === '0' || user.role === '1') {
        navigate('/admin/dashboard');
      } else if (user.role === '2') {
        navigate('/user/dashboard');
      } else {
        setError('Unauthorized role');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>{messages.common?.loginTitle || 'Login'}</h2>
      <LoginForm onLogin={handleLogin} errorMessage={error} />
    </div>
  );
};
