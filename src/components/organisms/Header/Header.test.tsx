// src/components/organisms/Header/Header.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from './index'; // 正しいインポートパスを確認してください
import '@testing-library/jest-dom';

// サブコンポーネントのモック
jest.mock('@/components/atoms/Logo', () => ({
  Logo: () => <div data-testid="logo">Mocked Logo</div>,
}));

jest.mock('@/components/molecules/LanguageToggleButton', () => ({
  LanguageToggleButton: () => (
    <div data-testid="language-toggle-button">Mocked LanguageToggleButton</div>
  ),
}));

jest.mock('@/components/molecules/Navigation', () => ({
  Navigation: () => <nav data-testid="navigation">Mocked Navigation</nav>,
}));

jest.mock('@/components/molecules/SearchBar', () => ({
  SearchBar: () => <div data-testid="search-bar">Mocked SearchBar</div>,
}));

jest.mock('@/components/molecules/UserActions', () => ({
  UserActions: () => <div data-testid="user-actions">Mocked UserActions</div>,
}));

describe('Header コンポーネント', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('すべてのサブコンポーネントがレンダリングされていること', () => {
    render(<Header />);

    // Header 全体の要素が存在することを確認
    const headerElement = screen.getByRole('banner'); // <header> はデフォルトで 'banner' ロールを持つ
    expect(headerElement).toBeInTheDocument();

    // 左セクションの確認
    const leftSection = headerElement.querySelector(`.${'leftSection'}`);
    expect(leftSection).toBeInTheDocument();

    // 右セクションの確認
    const rightSection = headerElement.querySelector(`.${'rightSection'}`);
    expect(rightSection).toBeInTheDocument();

    // サブコンポーネントの存在確認
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('user-actions')).toBeInTheDocument();
    expect(screen.getByTestId('language-toggle-button')).toBeInTheDocument();
  });

  test('レイアウトが正しく分割されていること', () => {
    render(<Header />);

    const headerElement = screen.getByRole('banner');

    // 左セクションにLogoとNavigationが含まれていることを確認
    const logo = screen.getByTestId('logo');
    const navigation = screen.getByTestId('navigation');
    const leftSection = headerElement.querySelector(`.${'leftSection'}`);
    expect(leftSection).toContainElement(logo);
    expect(leftSection).toContainElement(navigation);

    // 右セクションにSearchBar、UserActions、LanguageToggleButtonが含まれていることを確認
    const searchBar = screen.getByTestId('search-bar');
    const userActions = screen.getByTestId('user-actions');
    const languageToggleButton = screen.getByTestId('language-toggle-button');
    const rightSection = headerElement.querySelector(`.${'rightSection'}`);
    expect(rightSection).toContainElement(searchBar);
    expect(rightSection).toContainElement(userActions);
    expect(rightSection).toContainElement(languageToggleButton);
  });
});
