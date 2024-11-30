import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './index';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('SearchBarコンポーネント', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('SearchInputとButtonが正しくレンダリングされる', () => {
    render(<SearchBar />);

    // SearchInputが存在するか確認
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    // Buttonが存在するか確認
    const buttonElement = screen.getByRole('button', { name: 'Search' });
    expect(buttonElement).toBeInTheDocument();

    // ボタンが初期状態でdisabledになっているか確認
    expect(buttonElement).toBeDisabled();
  });

  test('ボタンがdisabledの状態ではhandleSearchが呼び出されない', () => {
    render(<SearchBar />);

    const buttonElement = screen.getByRole('button', { name: 'Search' });

    // ボタンが無効化されているためクリックしても何も起きない
    fireEvent.click(buttonElement);

    // handleSearchが呼び出されないことを確認
    expect(console.log).not.toHaveBeenCalled();
  });
});
