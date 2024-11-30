import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthToggleButton } from './index';

describe('AuthToggleButtonコンポーネント', () => {
  test('ログイン状態の場合、"サインアップはこちら"が表示される', () => {
    render(<AuthToggleButton isLogin={true} onToggle={jest.fn()} />);

    // "サインアップはこちら"が表示されるか確認
    const buttonElement = screen.getByRole('button', {
      name: 'サインアップはこちら',
    });
    expect(buttonElement).toBeInTheDocument();
  });

  test('ログインしていない状態の場合、"ログインはこちら"が表示される', () => {
    render(<AuthToggleButton isLogin={false} onToggle={jest.fn()} />);

    // "ログインはこちら"が表示されるか確認
    const buttonElement = screen.getByRole('button', {
      name: 'ログインはこちら',
    });
    expect(buttonElement).toBeInTheDocument();
  });

  test('ボタンクリック時にonToggleが呼び出される', () => {
    const handleToggle = jest.fn();
    render(<AuthToggleButton isLogin={true} onToggle={handleToggle} />);

    // ボタンをクリック
    const buttonElement = screen.getByRole('button', {
      name: 'サインアップはこちら',
    });
    fireEvent.click(buttonElement);

    // onToggleが1回呼び出されているか確認
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  test('スタイルクラスが適用されている', () => {
    const { container } = render(
      <AuthToggleButton isLogin={true} onToggle={jest.fn()} />
    );

    // ボタンにクラスが適用されているか確認
    const buttonElement = container.querySelector('button');
    expect(buttonElement).toHaveClass('toggleButton');
  });
});
