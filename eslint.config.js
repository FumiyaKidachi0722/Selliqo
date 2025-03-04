import { FlatCompat } from '@eslint/eslintrc';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';

const compat = new FlatCompat();

const eslintConfig = [
  ...compat.extends('next'),
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:react/recommended'),
  ...compat.extends('plugin:react-hooks/recommended'),
  ...compat.extends('plugin:import/errors'),
  ...compat.extends('plugin:import/warnings'),
  ...compat.extends('plugin:import/typescript'),
  ...compat.extends('plugin:prettier/recommended'),
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    ignores: [
      '.next/',
      '.yarn/',
      'node_modules/',
      '.yarn/releases/yarn-4.5.0.cjs',
    ],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      'prettier/prettier': ['error'],
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'], // Reactや他の外部ライブラリ
            ['internal'], // プロジェクト内インポート
            ['parent', 'sibling', 'index'], // 相対パスのインポート
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      semi: ['error', 'always'],
      'react/react-in-jsx-scope': 'off',
      '@next/next/no-duplicate-head': 'off',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    env: {
      jest: true,
    },
  },
];

export default eslintConfig;
