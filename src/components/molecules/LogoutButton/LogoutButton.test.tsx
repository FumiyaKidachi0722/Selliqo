import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { LogoutButton } from './index';

// `useAuthStore`をモック
jest.mock('@/store/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LogoutButtonコンポーネント', () => {
  let mockPush: jest.Mock;
  let mockLogout: jest.Mock;
  const useAuthStore = require('@/store/useAuthStore').useAuthStore;

  beforeEach(() => {
    mockPush = jest.fn();
    mockLogout = jest.fn();

    // `useRouter`のモック
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // `useAuthStore`のモック
    useAuthStore.mockImplementation((selector: any) =>
      selector({
        logout: mockLogout,
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('ボタンが正しくレンダリングされる', () => {
    render(<LogoutButton />);

    // ボタンが存在するか確認
    const buttonElement = screen.getByRole('button', { name: 'ログアウト' });
    expect(buttonElement).toBeInTheDocument();

    // ボタンに適切なクラスが適用されているか確認
    expect(buttonElement).toHaveClass('logoutButton');
  });

  test('ボタンクリック時にlogout関数が呼び出され、ルートにリダイレクトされる', () => {
    render(<LogoutButton />);

    const buttonElement = screen.getByRole('button', { name: 'ログアウト' });

    // ボタンをクリック
    fireEvent.click(buttonElement);

    // logout関数が呼び出されているか確認
    expect(mockLogout).toHaveBeenCalledTimes(1);

    // router.pushが呼び出されているか確認
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
