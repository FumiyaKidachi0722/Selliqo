// src/components/organisms/Footer/Footer.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './';
import '@testing-library/jest-dom';

describe('Footer コンポーネント', () => {
  test('正しいテキストが表示されること', () => {
    render(<Footer />);
    expect(screen.getByText('© 2024 Your Company')).toBeInTheDocument();
  });

  test('footer 要素が正しくレンダリングされていること', () => {
    render(<Footer />);
    const footerElement = screen.getByRole('contentinfo'); // footer はデフォルトで contentinfo ロールを持つ
    expect(footerElement).toBeInTheDocument();
  });
});
