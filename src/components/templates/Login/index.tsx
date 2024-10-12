// src/components/templates/Login/index.tsx
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

import { LoginForm } from '@/components/molecules/LoginForm';
import { useTranslation } from '@/components/templates/TranslationProvider';

// Zustandのストアをインポート

interface User {
  username: string;
  email: string;
  password: string;
}

export const LoginTemplate: React.FC = () => {
  const messages = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const login = useAuthStore((state) => state.login); // Zustandのloginアクションを取得

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
      // ログイン成功時に状態を更新
      login('dummy-jwt-token'); // JWTトークンの代わりにダミーのトークンを保存
      console.log('Login successful');
      router.push('/'); // ホームページにリダイレクト
    } else {
      setError(messages.errors?.invalidCredentials || 'Invalid credentials');
    }
  };

  return (
    <div>
      <h2>{messages.common?.loginTitle || 'Login'}</h2>
      <LoginForm onLogin={handleLogin} errorMessage={error} />
    </div>
  );
};
