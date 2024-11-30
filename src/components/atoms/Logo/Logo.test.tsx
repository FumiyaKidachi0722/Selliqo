import React from 'react';
import { render, screen } from '@testing-library/react';
import { Logo } from './index';

describe('Logoコンポーネント', () => {
  test('正しくレンダリングされる', () => {
    render(<Logo />);

    // Imageコンポーネントが正しくレンダリングされているか確認
    const imageElement = screen.getByRole('img', { name: /logo/i });
    expect(imageElement).toBeInTheDocument();

    // src属性が設定されているか確認
    expect(imageElement).toHaveAttribute('src', '/images/logo.webp');

    // alt属性が設定されているか確認
    expect(imageElement).toHaveAttribute('alt', 'Logo');
  });

  test('スタイルクラスが適用されている', () => {
    const { container } = render(<Logo />);

    // 親のdiv要素に正しいクラス名が適用されているか確認
    expect(container.firstChild).toHaveClass('logo');
  });
});
