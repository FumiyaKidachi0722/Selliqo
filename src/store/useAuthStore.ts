import { create } from 'zustand';

// 型定義
interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  username: string | null;
  email: string | null;
  role: string | null; // 役割 ("0" for admin, "1" for manager, "2" for user)
  stripeCustomerId: string | null;
  login: (
    token: string,
    username: string,
    email: string,
    role: string,
    stripeCustomerId: string
  ) => void;
  signup: (
    token: string,
    username: string,
    email: string,
    role: string,
    stripeCustomerId: string
  ) => void;
  logout: () => void;
  checkAuthStatus: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // クライアントサイドのみでlocalStorageをチェック
  const isClient = typeof window !== 'undefined';

  // ローカルストレージから状態を読み込む
  const storedAuth = isClient
    ? JSON.parse(localStorage.getItem('auth') || '{}')
    : {};

  return {
    isLoggedIn: !!storedAuth.token,
    token: storedAuth.token || null,
    username: storedAuth.username || null,
    email: storedAuth.email || null,
    role: storedAuth.role || null,
    stripeCustomerId: storedAuth.stripeCustomerId || null,

    // ログイン処理
    login: (token, username, email, role, stripeCustomerId) => {
      const authData = { token, username, email, role, stripeCustomerId };
      if (isClient) {
        localStorage.setItem('auth', JSON.stringify(authData));
      }
      set({
        isLoggedIn: true,
        ...authData,
      });
    },

    // サインアップ処理
    signup: (token, username, email, role, stripeCustomerId) => {
      const authData = { token, username, email, role, stripeCustomerId };
      if (isClient) {
        localStorage.setItem('auth', JSON.stringify(authData));
      }
      set({
        isLoggedIn: true,
        ...authData,
      });
    },

    // ログアウト処理
    logout: () => {
      if (isClient) {
        localStorage.removeItem('auth');
      }
      set({
        isLoggedIn: false,
        token: null,
        username: null,
        email: null,
        role: null,
        stripeCustomerId: null,
      });
    },

    // 認証状態の確認
    checkAuthStatus: () => {
      if (!isClient) return;
      const storedAuth = JSON.parse(localStorage.getItem('auth') || '{}');
      if (storedAuth.token) {
        set({
          isLoggedIn: true,
          token: storedAuth.token,
          username: storedAuth.username,
          email: storedAuth.email,
          role: storedAuth.role,
          stripeCustomerId: storedAuth.stripeCustomerId,
        });
      } else {
        set({
          isLoggedIn: false,
          token: null,
          username: null,
          email: null,
          role: null,
          stripeCustomerId: null,
        });
      }
    },
  };
});
