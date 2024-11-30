import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import { LanguageToggleButton } from './index';

// `useAuthStore`をモック
jest.mock('@/store/useAuthStore', () => {
  const actualZustand = jest.requireActual('zustand');
  return {
    __esModule: true,
    useAuthStore: actualZustand.create(() => ({
      language: 'en',
      setLanguage: jest.fn(),
    })),
  };
});

// `next/navigation`をモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe('LanguageToggleButtonコンポーネント', () => {
  let mockSetLanguage: jest.Mock;
  let mockPush: jest.Mock;
  let useAuthStore: any;

  beforeEach(() => {
    mockSetLanguage = jest.fn();
    mockPush = jest.fn();

    // モックした`useAuthStore`を取得
    useAuthStore = require('@/store/useAuthStore').useAuthStore;

    // `useAuthStore`の初期状態を設定
    useAuthStore.setState({
      language: 'en',
      setLanguage: mockSetLanguage,
    });

    // `next/navigation`のモックを設定
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue('/en/dashboard');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('初期レンダリング時にボタンが正しく表示される', () => {
    render(<LanguageToggleButton />);

    const buttonElement = screen.getByRole('button', { name: '日本語' });
    expect(buttonElement).toBeInTheDocument();
  });

  test('ボタンをクリックすると言語が切り替わる', () => {
    render(<LanguageToggleButton />);

    const buttonElement = screen.getByRole('button', { name: '日本語' });
    fireEvent.click(buttonElement);

    expect(mockSetLanguage).toHaveBeenCalledWith('ja');
    expect(mockPush).toHaveBeenCalledWith('/ja/dashboard');
  });

  test('ローカルストレージから言語が同期される', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('ja');

    render(<LanguageToggleButton />);

    expect(Storage.prototype.getItem).toHaveBeenCalledWith('language');
    expect(mockSetLanguage).toHaveBeenCalledWith('ja');
  });
});
