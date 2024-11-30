// src/components/templates/Course/Detail/CourseDetailTemplate.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CourseDetailTemplate } from './index'; // 正しいインポートパスを確認してください
import '@testing-library/jest-dom';
import { AuthState, useAuthStore } from '@/store/useAuthStore';
import { Course } from '@/types/course';

// モックするモジュール
jest.mock('@/store/useAuthStore');

describe('CourseDetailTemplate コンポーネント', () => {
  // 型エラーを回避するために `unknown` を経由してキャスト
  const mockedUseAuthStore = useAuthStore as unknown as jest.Mock;

  const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

  const mockSetLocation = jest.fn();
  Object.defineProperty(window, 'location', {
    value: {
      href: '',
      assign: mockSetLocation,
    },
    writable: true,
  });

  const mockCourse: Course = {
    id: 'course-123',
    name: 'React Testing',
    description: 'Learn how to test React applications.',
    image: '',
    price: 10000,
    metadata: {
      category: 'Development', // 'category' を追加
      schedule: 'Every Monday and Wednesday',
      teacher: 'John Doe',
    },
  };

  // 完全なモック状態を定義
  const mockAuthState: AuthState = {
    isLoggedIn: false,
    token: null,
    username: null,
    email: null,
    role: null,
    stripeCustomerId: null,
    language: 'ja',
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    setLanguage: jest.fn(),
    checkAuthStatus: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock useAuthStore の初期実装
    mockedUseAuthStore.mockImplementation(
      (selector?: (state: AuthState) => any) => {
        if (typeof selector === 'function') {
          return selector(mockAuthState);
        }
        return mockAuthState;
      }
    );
    // Mock localStorage
    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation((key: string) => {
        if (key === 'language') return 'ja';
        return null;
      });
  });

  afterAll(() => {
    mockAlert.mockRestore();
  });

  test('ロード中にローディングメッセージが表示される', () => {
    // fetch を未解決の Promise に設定
    global.fetch = jest.fn().mockImplementation(() => new Promise(() => {}));

    render(<CourseDetailTemplate id="course-123" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('コースデータが正しく表示される', async () => {
    // fetch をモックしてコースデータを返す
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourse,
    });

    render(<CourseDetailTemplate id="course-123" />);

    // ローディングメッセージが表示された後、コースデータが表示されることを確認
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // コースデータが表示されるまで待つ
    await waitFor(() =>
      expect(screen.getByText('React Testing')).toBeInTheDocument()
    );

    expect(
      screen.getByText('Learn how to test React applications.')
    ).toBeInTheDocument();
    expect(screen.getByText('価格: ¥10,000')).toBeInTheDocument();
    expect(
      screen.getByText('スケジュール: Every Monday and Wednesday')
    ).toBeInTheDocument();
    expect(screen.getByText('講師: John Doe')).toBeInTheDocument();

    // 購入ボタンが表示されていること
    expect(
      screen.getByRole('button', { name: /購入する/i })
    ).toBeInTheDocument();
  });

  test('ログインしていない場合、購入ボタンが無効化され、メッセージが表示される', async () => {
    // fetch をモックしてコースデータを返す
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourse,
    });

    render(<CourseDetailTemplate id="course-123" />);

    // コースデータが表示されるまで待つ
    await waitFor(() =>
      expect(screen.getByText('React Testing')).toBeInTheDocument()
    );

    const purchaseButton = screen.getByRole('button', { name: /購入する/i });
    expect(purchaseButton).toBeDisabled();

    expect(screen.getByText('ログインすると購入できます')).toBeInTheDocument();
  });

  test('ログインしていない状態で購入ボタンをクリックしてもアラートは表示されない', async () => {
    // fetch をモックしてコースデータを返す
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourse,
    });

    render(<CourseDetailTemplate id="course-123" />);

    // コースデータが表示されるまで待つ
    await waitFor(() =>
      expect(screen.getByText('React Testing')).toBeInTheDocument()
    );

    const purchaseButton = screen.getByRole('button', { name: /購入する/i });
    expect(purchaseButton).toBeDisabled();

    fireEvent.click(purchaseButton);

    // アラートは表示されないことを確認
    expect(mockAlert).not.toHaveBeenCalled();
  });

  test('ログインしている場合、購入ボタンが有効化され、購入処理が成功するとリダイレクトされる (USER)', async () => {
    // useAuthStore をログイン状態にモック
    mockedUseAuthStore.mockReturnValue({
      isLoggedIn: true,
      token: 'token_123',
      username: 'testuser',
      email: 'test@example.com',
      role: '2', // "2" for user
      stripeCustomerId: 'cust_123',
      language: 'ja',
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
      setLanguage: jest.fn(),
      checkAuthStatus: jest.fn(),
    });

    // fetch をコースデータと購入処理にモック
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: 'https://checkout.stripe.com/pay/cust_123' }),
      });

    render(<CourseDetailTemplate id="course-123" />);

    // コースデータが表示されるまで待つ
    await waitFor(() =>
      expect(screen.getByText('React Testing')).toBeInTheDocument()
    );

    const purchaseButton = screen.getByRole('button', { name: /購入する/i });
    expect(purchaseButton).toBeEnabled();

    fireEvent.click(purchaseButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 'course-123',
          lang: 'ja',
          stripeCustomerId: 'cust_123',
        }),
      });
      expect(window.location.href).toBe(
        'https://checkout.stripe.com/pay/cust_123'
      );
    });
  });

  test('購入処理が失敗するとエラーメッセージがコンソールに表示される', async () => {
    // useAuthStore をログイン状態にモック
    mockedUseAuthStore.mockReturnValue({
      isLoggedIn: true,
      token: 'token_123',
      username: 'testuser',
      email: 'test@example.com',
      role: '2', // "2" for user
      stripeCustomerId: 'cust_123',
      language: 'ja',
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
      setLanguage: jest.fn(),
      checkAuthStatus: jest.fn(),
    });

    // fetch をコースデータと購入処理にモック
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse,
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<CourseDetailTemplate id="course-123" />);

    // コースデータが表示されるまで待つ
    await waitFor(() =>
      expect(screen.getByText('React Testing')).toBeInTheDocument()
    );

    const purchaseButton = screen.getByRole('button', { name: /購入する/i });
    expect(purchaseButton).toBeEnabled();

    fireEvent.click(purchaseButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 'course-123',
          lang: 'ja',
          stripeCustomerId: 'cust_123',
        }),
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '購入処理に失敗しました:',
        new Error('Failed to retrieve Stripe Checkout URL')
      );
    });

    consoleErrorSpy.mockRestore();
  });

  test('ログインしているが stripeCustomerId がない場合、アラートが表示される', async () => {
    // useAuthStore をログイン状態にモック（stripeCustomerId がない）
    mockedUseAuthStore.mockReturnValue({
      isLoggedIn: true,
      token: 'token_123',
      username: 'testuser',
      email: 'test@example.com',
      role: '2', // "2" for user
      stripeCustomerId: null,
      language: 'ja',
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
      setLanguage: jest.fn(),
      checkAuthStatus: jest.fn(),
    });

    // fetch をコースデータにモック
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourse,
    });

    render(<CourseDetailTemplate id="course-123" />);

    // コースデータが表示されるまで待つ
    await waitFor(() =>
      expect(screen.getByText('React Testing')).toBeInTheDocument()
    );

    const purchaseButton = screen.getByRole('button', { name: /購入する/i });
    expect(purchaseButton).toBeEnabled();

    fireEvent.click(purchaseButton);

    expect(mockAlert).toHaveBeenCalledWith('購入するにはログインが必要です');
  });

  test('コースIDがない場合、何もレンダリングしない', () => {
    render(<CourseDetailTemplate id="" />);

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('React Testing')).not.toBeInTheDocument();
    expect(screen.queryByText('価格: ¥10,000')).not.toBeInTheDocument();
  });

  test('コースデータのフェッチが失敗した場合、エラーメッセージがコンソールに表示される', async () => {
    // fetch をコースデータにモックして失敗させる
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<CourseDetailTemplate id="course-123" />);

    await waitFor(() =>
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to fetch course data:',
        new Error('Failed to fetch course data')
      );
    });

    // `course` が設定されていないため、他の要素がレンダリングされていないことを確認
    expect(screen.queryByText('React Testing')).not.toBeInTheDocument();
    expect(screen.queryByText('価格: ¥10,000')).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
