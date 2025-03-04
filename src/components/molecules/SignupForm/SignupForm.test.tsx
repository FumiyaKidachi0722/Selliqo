import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SignupForm } from './index';

describe('SignupFormコンポーネント', () => {
  const mockOnSignup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('フォームが正しくレンダリングされる', () => {
    render(<SignupForm onSignup={mockOnSignup} />);

    // 各フィールドが存在するか確認
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // ボタンが存在するか確認
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });

  test('入力値が変更されると状態が更新される', () => {
    render(<SignupForm onSignup={mockOnSignup} />);

    // Usernameフィールドの値を変更
    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    expect(usernameInput).toHaveValue('testuser');

    // Emailフィールドの値を変更
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');

    // Passwordフィールドの値を変更
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput).toHaveValue('password123');
  });

  test('フォーム送信時にonSignupが呼び出される', () => {
    render(<SignupForm onSignup={mockOnSignup} />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // 入力値を設定
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // フォームを送信
    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

    // onSignupが正しい引数で呼び出されるか確認
    expect(mockOnSignup).toHaveBeenCalledWith(
      'testuser',
      'test@example.com',
      'password123'
    );
  });

  test('エラーメッセージが正しく表示される', () => {
    render(
      <SignupForm
        onSignup={mockOnSignup}
        errorMessage="Username is already taken"
      />
    );

    // エラーメッセージが表示されるか確認
    expect(screen.getByText(/username is already taken/i)).toBeInTheDocument();
  });
});
