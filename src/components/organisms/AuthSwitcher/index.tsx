// src/components/organisms/AuthSwitcher/index.tsx
import { useState } from 'react';

import { AuthToggleButton } from '@/components/molecules/AuthToggleButton';
import { LoginForm } from '@/components/molecules/LoginForm';
import { SignupForm } from '@/components/molecules/SignupForm';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types/roles';

type AuthSwitcherProps = {
  isInitialLogin?: boolean;
};

export const AuthSwitcher = ({ isInitialLogin = true }: AuthSwitcherProps) => {
  const [isLogin, setIsLogin] = useState(isInitialLogin);

  const handleToggle = () => {
    setIsLogin((prev) => !prev);
  };

  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const { navigate } = useLanguage();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (identifier: string, password: string) => {
    try {
      // バックエンドAPIを呼び出して認証
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'ログインに失敗しました');
        return;
      }

      const data = await response.json();
      const { token, username, email, role, stripeCustomerId } = data;

      login(token, username, email, role, stripeCustomerId);

      if (role === UserRole.ADMIN || role === UserRole.MANAGER) {
        navigate('/admin/dashboard');
      } else if (role === UserRole.USER) {
        navigate('/user/dashboard');
      } else {
        setError('未承認の役割です');
      }
    } catch (error) {
      console.error('ログインエラー:', error);
      setError('ログインに失敗しました');
    }
  };

  const signup = useAuthStore((state) => state.signup);

  const handleSignup = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      // バックエンドAPIを呼び出してユーザーを作成
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'サインアップに失敗しました');
        return;
      }

      const data = await response.json();
      const { token, role, stripeCustomerId } = data;

      // 認証情報をストアに保存
      signup(token, username, email, role, stripeCustomerId);

      if (role === UserRole.ADMIN || role === UserRole.MANAGER) {
        navigate('/admin/dashboard');
      } else if (role === UserRole.USER) {
        navigate('/user/dashboard');
      } else {
        setError('未承認の役割です');
      }
    } catch (error) {
      console.error('サインアップエラー:', error);
      setError('サインアップに失敗しました');
    }
  };

  return (
    <div>
      {isLogin ? (
        <div>
          <h2>{t('common.loginTitle')}</h2>
          <LoginForm onLogin={handleLogin} errorMessage={error} />
        </div>
      ) : (
        <div>
          <h2>{t('common.signupTitle')}</h2>
          <SignupForm onSignup={handleSignup} errorMessage={error} />
        </div>
      )}
      <AuthToggleButton isLogin={isLogin} onToggle={handleToggle} />
    </div>
  );
};
