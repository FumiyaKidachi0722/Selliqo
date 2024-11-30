import React from 'react';
import { render, screen } from '@testing-library/react';
import { Navigation } from './index';

// `useLanguage`をモック
jest.mock('@/providers/LanguageProvider', () => ({
  useLanguage: jest.fn(),
}));

describe('Navigationコンポーネント', () => {
  const useLanguage = require('@/providers/LanguageProvider').useLanguage;

  beforeEach(() => {
    // `useLanguage`のモック
    useLanguage.mockReturnValue({
      currentLang: 'en',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('ナビゲーションメニューが正しくレンダリングされる', () => {
    render(<Navigation />);

    // ナビゲーション要素の存在を確認
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();

    // 各リンクが表示されるか確認
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Course')).toBeInTheDocument();

    // 無効なリンクが正しく表示されるか確認
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('リンクのパスが正しく生成される', () => {
    render(<Navigation />);

    // Homeリンクのhref属性を確認
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');

    // Courseリンクのhref属性を確認
    const courseLink = screen.getByText('Course').closest('a');
    expect(courseLink).toHaveAttribute('href', '/en/course');
  });

  test('無効なリンクにhref属性がないことを確認', () => {
    render(<Navigation />);

    // 無効なリンクが`a`タグではないことを確認
    const aboutLink = screen.getByText('About');
    expect(aboutLink.tagName).toBe('SPAN');
    expect(aboutLink).toHaveClass('disabledLink');

    const contactLink = screen.getByText('Contact');
    expect(contactLink.tagName).toBe('SPAN');
    expect(contactLink).toHaveClass('disabledLink');
  });
});
