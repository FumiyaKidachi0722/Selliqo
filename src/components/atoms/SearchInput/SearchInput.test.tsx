import React from 'react';
import { render, screen } from '@testing-library/react';
import { SearchInput } from './index';

describe('SearchInputコンポーネント', () => {
  test('デフォルトのプロパティで正しくレンダリングされる', () => {
    render(<SearchInput />);

    // 入力フィールドが正しくレンダリングされているか
    const inputElement = screen.getByRole('textbox', { name: '' });

    expect(inputElement).toBeInTheDocument();

    // デフォルトのplaceholderが正しく設定されているか
    expect(inputElement).toHaveAttribute('placeholder', 'Search...');

    // disabledが設定されているか
    expect(inputElement).toBeDisabled();
  });

  test('指定されたplaceholderが正しく適用される', () => {
    render(<SearchInput placeholder="カスタム検索" />);

    const inputElement = screen.getByPlaceholderText('カスタム検索');

    // カスタムplaceholderが適用されているか
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('placeholder', 'カスタム検索');
  });

  test('スタイルクラスが適用されている', () => {
    const { container } = render(<SearchInput />);

    // 親の要素に正しいクラス名が適用されているか確認
    const inputElement = container.querySelector('input');
    expect(inputElement).toHaveClass('input');
  });
});
