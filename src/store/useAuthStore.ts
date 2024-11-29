// src/store/useAuthStore.ts
import { create } from 'zustand';

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
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  token: null,
  username: null,
  email: null,
  role: null,
  stripeCustomerId: null,

  login: (token, username, email, role, stripeCustomerId) =>
    set({
      isLoggedIn: true,
      token,
      username,
      email,
      role,
      stripeCustomerId,
    }),

  signup: (token, username, email, role, stripeCustomerId) =>
    set({
      isLoggedIn: true,
      token,
      username,
      email,
      role,
      stripeCustomerId,
    }),

  logout: () =>
    set({
      isLoggedIn: false,
      token: null,
      username: null,
      email: null,
      role: null,
      stripeCustomerId: null,
    }),
}));
