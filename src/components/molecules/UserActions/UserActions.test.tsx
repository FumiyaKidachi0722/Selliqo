import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserActions } from './index';
import { useLanguage } from '@/providers/LanguageProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types/roles';

// モック
jest.mock('@/providers/LanguageProvider', () => ({
  useLanguage: jest.fn(),
}));

jest.mock('@/store/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

describe('UserActionsコンポーネント', () => {
  const mockNavigate = jest.fn();
  const useLanguageMock = require('@/providers/LanguageProvider').useLanguage;
  const useAuthStoreMock = require('@/store/useAuthStore').useAuthStore;

  beforeEach(() => {
    jest.clearAllMocks();
    useLanguageMock.mockReturnValue({ navigate: mockNavigate });
  });

  test('ログインしていない場合、ログインボタンが表示される', () => {
    useAuthStoreMock.mockReturnValue({ isLoggedIn: false, role: null });

    render(<UserActions />);

    const loginButton = screen.getByRole('button', { name: 'Login' });
    expect(loginButton).toBeInTheDocument();

    // ボタンをクリックして`navigate`が呼び出されるか確認
    fireEvent.click(loginButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('ログインしている場合、ユーザーアイコンが表示される', () => {
    useAuthStoreMock.mockReturnValue({ isLoggedIn: true, role: UserRole.USER });

    render(<UserActions />);

    const userIcon = screen.getByText('U');
    expect(userIcon).toBeInTheDocument();

    // ユーザーアイコンをクリックして`navigate`が呼び出されるか確認
    fireEvent.click(userIcon);
    expect(mockNavigate).toHaveBeenCalledWith('/user/dashboard');
  });

  test('ADMINまたはMANAGERのロールで、管理ダッシュボードに遷移する', () => {
    useAuthStoreMock.mockReturnValue({
      isLoggedIn: true,
      role: UserRole.ADMIN,
    });

    render(<UserActions />);

    const userIcon = screen.getByText('U');
    expect(userIcon).toBeInTheDocument();

    // ユーザーアイコンをクリックして`navigate`が呼び出されるか確認
    fireEvent.click(userIcon);
    expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
  });

  test('USERのロールで、ユーザーダッシュボードに遷移する', () => {
    useAuthStoreMock.mockReturnValue({ isLoggedIn: true, role: UserRole.USER });

    render(<UserActions />);

    const userIcon = screen.getByText('U');
    expect(userIcon).toBeInTheDocument();

    // ユーザーアイコンをクリックして`navigate`が呼び出されるか確認
    fireEvent.click(userIcon);
    expect(mockNavigate).toHaveBeenCalledWith('/user/dashboard');
  });
});
