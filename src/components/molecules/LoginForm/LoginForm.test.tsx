import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './index';

describe('LoginFormコンポーネント', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('フォームが正しくレンダリングされる', () => {
    render(<LoginForm onLogin={mockOnLogin} />);

    // Email/Username フィールドが存在するか
    expect(screen.getByLabelText(/email or username/i)).toBeInTheDocument();

    // Password フィールドが存在するか
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Login ボタンが存在するか
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('入力値が変更されると状態が更新される', () => {
    render(<LoginForm onLogin={mockOnLogin} />);

    // Email/Username フィールドの値を変更
    const identifierInput = screen.getByLabelText(/email or username/i);
    fireEvent.change(identifierInput, { target: { value: 'testuser' } });
    expect(identifierInput).toHaveValue('testuser');

    // Password フィールドの値を変更
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput).toHaveValue('password123');
  });

  test('フォーム送信時にonLoginが呼び出される', () => {
    render(<LoginForm onLogin={mockOnLogin} />);

    const identifierInput = screen.getByLabelText(/email or username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // 入力値を設定
    fireEvent.change(identifierInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // フォームを送信
    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    // onLoginが呼び出されるか確認
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
    expect(mockOnLogin).toHaveBeenCalledWith('testuser', 'password123');
  });

  test('エラーメッセージが正しく表示される', () => {
    render(
      <LoginForm
        onLogin={mockOnLogin}
        errorMessage="Invalid login credentials"
      />
    );

    // エラーメッセージが表示されるか
    expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
  });
});
