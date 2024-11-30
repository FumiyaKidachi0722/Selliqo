// src/store/useAuthStore.ts
import { create } from 'zustand';

// 型定義
export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  username: string | null;
  email: string | null;
  role: string | null; // 役割 ("0" for admin, "1" for manager, "2" for user)
  stripeCustomerId: string | null;
  language: string; // 言語設定
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
  setLanguage: (language: string) => void;
  checkAuthStatus: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const isClient = typeof window !== 'undefined';

  // ローカルストレージから認証と言語設定を読み込む
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
    language: 'ja', // デフォルト言語

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

    // 言語設定の更新
    setLanguage: (language) => {
      if (isClient) {
        localStorage.setItem('language', language);
      }
      set({ language });
    },

    // 認証状態と言語設定の確認
    checkAuthStatus: () => {
      if (!isClient) return;
      const storedAuth = JSON.parse(localStorage.getItem('auth') || '{}');
      const storedLanguage = localStorage.getItem('language') || 'en';
      set({
        isLoggedIn: !!storedAuth.token,
        token: storedAuth.token || null,
        username: storedAuth.username || null,
        email: storedAuth.email || null,
        role: storedAuth.role || null,
        stripeCustomerId: storedAuth.stripeCustomerId || null,
        language: storedLanguage,
      });
    },
  };
});
