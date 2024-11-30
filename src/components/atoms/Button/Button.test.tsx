import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { Button } from './index';

describe('Buttonコンポーネント', () => {
  test('デフォルトのプロパティで正しくレンダリングされる', () => {
    render(<Button label="クリックしてください" />);
    const buttonElement = screen.getByRole('button', {
      name: 'クリックしてください',
    });

    // ボタンが正しくレンダリングされているか
    expect(buttonElement).toBeInTheDocument();

    // デフォルトクラスが適用されているか
    expect(buttonElement).toHaveClass('primary');
    expect(buttonElement).toHaveClass('medium');

    // disabledが設定されていないことを確認
    expect(buttonElement).not.toBeDisabled();
  });

  test('指定されたvariantとsizeのスタイルが正しく適用される', () => {
    render(<Button label="危険なボタン" variant="danger" size="large" />);
    const buttonElement = screen.getByRole('button', { name: '危険なボタン' });

    // variantとsizeのクラスが正しく適用されているか
    expect(buttonElement).toHaveClass('danger');
    expect(buttonElement).toHaveClass('large');
  });

  test('disabledプロパティがtrueの場合、ボタンが無効化される', () => {
    render(<Button label="無効なボタン" disabled />);
    const buttonElement = screen.getByRole('button', { name: '無効なボタン' });

    // ボタンが無効化されているか
    expect(buttonElement).toBeDisabled();

    // 無効化用のクラスが適用されているか
    expect(buttonElement).toHaveClass('buttonDisabled');
  });

  test('クリック時にonClickが正しく呼び出される', () => {
    const handleClick = jest.fn();
    render(<Button label="クリック可能なボタン" onClick={handleClick} />);
    const buttonElement = screen.getByRole('button', {
      name: 'クリック可能なボタン',
    });

    // ボタンをクリック
    fireEvent.click(buttonElement);

    // onClickハンドラが1回呼び出されているか
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('aria-labelが正しく設定されている', () => {
    render(<Button label="アクセシブルなボタン" ariaLabel="カスタムラベル" />);
    const buttonElement = screen.getByRole('button', {
      name: 'カスタムラベル',
    });

    // aria-label属性がカスタムラベルになっているか
    expect(buttonElement).toHaveAttribute('aria-label', 'カスタムラベル');
  });

  test('ariaLabelが指定されていない場合、labelがaria-labelとして使用される', () => {
    render(<Button label="フォールバックラベル" />);
    const buttonElement = screen.getByRole('button', {
      name: 'フォールバックラベル',
    });

    // label属性がaria-labelとして使用されているか
    expect(buttonElement).toHaveAttribute('aria-label', 'フォールバックラベル');
  });
});
