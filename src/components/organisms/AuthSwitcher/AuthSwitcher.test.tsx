// src/components/organisms/AuthSwitcher/AuthSwitcher.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthSwitcher } from './index'; // 正しいインポートパス
import '@testing-library/jest-dom';

import { useLanguage } from '@/providers/LanguageProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types/roles';

// モックするモジュール
jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.loginTitle': 'Login',
        'common.signupTitle': 'Sign Up',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('@/providers/LanguageProvider', () => ({
  useLanguage: jest.fn(),
}));

jest.mock('@/store/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/components/molecules/AuthToggleButton', () => ({
  AuthToggleButton: ({
    isLogin,
    onToggle,
  }: {
    isLogin: boolean;
    onToggle: () => void;
  }) => (
    <button onClick={onToggle}>
      {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
    </button>
  ),
}));

jest.mock('@/components/molecules/LoginForm', () => ({
  LoginForm: ({
    onLogin,
    errorMessage,
  }: {
    onLogin: Function;
    errorMessage: string | null;
  }) => (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLogin('testuser', 'password');
        }}
      >
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      {errorMessage && <div role="alert">{errorMessage}</div>}
    </div>
  ),
}));

jest.mock('@/components/molecules/SignupForm', () => ({
  SignupForm: ({
    onSignup,
    errorMessage,
  }: {
    onSignup: Function;
    errorMessage: string | null;
  }) => (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSignup('newuser', 'new@example.com', 'newpassword');
        }}
      >
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign Up</button>
      </form>
      {errorMessage && <div role="alert">{errorMessage}</div>}
    </div>
  ),
}));

// グローバル fetch をモック
global.fetch = jest.fn();

// 型キャストして jest.Mock を適用
const mockedUseAuthStore = useAuthStore as unknown as jest.Mock;
const mockedUseLanguage = useLanguage as unknown as jest.Mock;

describe('AuthSwitcher Component', () => {
  const mockNavigate = jest.fn();
  const mockLogin = jest.fn();
  const mockSignup = jest.fn();
  const mockLogout = jest.fn();
  const mockSetLanguage = jest.fn();
  const mockCheckAuthStatus = jest.fn();

  // 完全なモック状態を定義
  const mockAuthState = {
    isLoggedIn: true,
    token: 'fake-token',
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER',
    stripeCustomerId: 'cust_123',
    language: 'ja',
    login: mockLogin,
    signup: mockSignup,
    logout: mockLogout,
    setLanguage: mockSetLanguage,
    checkAuthStatus: mockCheckAuthStatus,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // useLanguage のモックの戻り値を設定
    mockedUseLanguage.mockReturnValue({
      navigate: mockNavigate,
    });

    // useAuthStore のモックの実装を設定
    mockedUseAuthStore.mockImplementation(
      (selector: (state: typeof mockAuthState) => any) => {
        return selector(mockAuthState);
      }
    );
  });

  test('初期状態でログインフォームが表示される', () => {
    render(<AuthSwitcher />);

    // 複数の 'Login' テキストを避けるため、役割と名前で特定
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Switch to Sign Up/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('切り替えボタンをクリックするとサインアップフォームが表示される', () => {
    render(<AuthSwitcher />);

    const toggleButton = screen.getByRole('button', {
      name: /Switch to Sign Up/i,
    });
    fireEvent.click(toggleButton);

    expect(
      screen.getByRole('heading', { name: 'Sign Up' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Switch to Login/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Sign Up/i })
    ).toBeInTheDocument();
  });

  test('ログインが成功すると適切なダッシュボードにナビゲートされる (USER)', async () => {
    // モックされた fetch のレスポンスを設定
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'fake-token',
        username: 'testuser',
        email: 'test@example.com',
        role: UserRole.USER,
        stripeCustomerId: 'cust_123',
      }),
    });

    render(<AuthSwitcher />);

    const loginButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        'fake-token',
        'testuser',
        'test@example.com',
        UserRole.USER,
        'cust_123'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/user/dashboard');
    });
  });

  test('ログインが成功すると適切なダッシュボードにナビゲートされる (ADMIN)', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'admin-token',
        username: 'adminuser',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        stripeCustomerId: 'cust_admin',
      }),
    });

    render(<AuthSwitcher />);

    const loginButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        'admin-token',
        'adminuser',
        'admin@example.com',
        UserRole.ADMIN,
        'cust_admin'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  test('ログインが失敗するとエラーメッセージが表示される', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Invalid credentials',
      }),
    });

    render(<AuthSwitcher />);

    const loginButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Invalid credentials'
      );
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test('サインアップが成功すると適切なダッシュボードにナビゲートされる (USER)', async () => {
    // サインアップフォームに切り替え
    render(<AuthSwitcher />);
    const toggleButton = screen.getByRole('button', {
      name: /Switch to Sign Up/i,
    });
    fireEvent.click(toggleButton);

    // モックされた fetch のレスポンスを設定
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'signup-token',
        role: UserRole.USER,
        stripeCustomerId: 'cust_signup',
      }),
    });

    const signupButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        'signup-token',
        'newuser',
        'new@example.com',
        UserRole.USER,
        'cust_signup'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/user/dashboard');
    });
  });

  test('サインアップが失敗するとエラーメッセージが表示される', async () => {
    // サインアップフォームに切り替え
    render(<AuthSwitcher />);
    const toggleButton = screen.getByRole('button', {
      name: /Switch to Sign Up/i,
    });
    fireEvent.click(toggleButton);

    // モックされた fetch のレスポンスを設定
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Email already exists',
      }),
    });

    const signupButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Email already exists'
      );
      expect(mockSignup).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test('未承認の役割の場合にエラーメッセージが表示される (UNKNOWN)', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'unknown-token',
        username: 'unknownuser',
        email: 'unknown@example.com',
        role: 'UNKNOWN',
        stripeCustomerId: 'cust_unknown',
      }),
    });

    render(<AuthSwitcher />);

    const loginButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        'unknown-token',
        'unknownuser',
        'unknown@example.com',
        'UNKNOWN',
        'cust_unknown'
      );
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent('未承認の役割です');
    });
  });
});
