# Eコマースプラットフォーム設計書 (Next.js 15 と React 19)

## 概要

このプロジェクトでは、**Next.js 15 RC** および **React 19 RC** を使用してモダンなEコマースプラットフォームを構築します。主な機能には、商品一覧、カート管理、注文処理、ユーザーと管理者向けダッシュボード、およびログイン機能が含まれます。React Server Components、Suspense、Next.js の App Router の強化を活用し、パフォーマンスとスケーラビリティを最適化します。

## ディレクトリ構造

```plaintext
Selliqo/
├── public/                       # 静的ファイル（画像、フォントなど）
├── src/                          # ソースコード
│   ├── app/                      # Next.js 15のApp Routerを使用したルート
│   │   ├── [lang]/               # 多言語対応のルートディレクトリ
│   │   │   ├── layout.tsx        # 言語ごとのレイアウト（ヘッダー、フッター）
│   │   │   ├── page.tsx          # 言語ごとのホームページエントリーポイント
│   │   │   ├── dashboard/        # ダッシュボード関連ページ
│   │   │   │   └── page.tsx      # ダッシュボードページ
│   │   │   ├── login/            # ログインページ
│   │   │   │   └── page.tsx      # ログインページの実装
│   │   │   ├── product/          # 商品ページ
│   │   │   │   ├── page.tsx      # 商品リストページ
│   │   │   │   └── [id]/page.tsx # 商品詳細ページ
│   │   │   ├── cart/             # カートページ
│   │   │   │   └── page.tsx      # カートのエントリーポイント
│   │   ├── layout.tsx            # アプリ全体の共通レイアウト
│   │   ├── page.tsx              # グローバルなホームページエントリーポイント
│   │   ├── api/                  # サーバーサイドAPIルート
│   │   │   ├── login/            # 認証用API
│   │   │   │   └── route.ts      # ログインAPIエンドポイント
│   ├── components/               # Atomic Designに基づくUIコンポーネント
│   │   ├── atoms/                # 基本的なUI要素（ボタン、テキスト、入力フォームなど）
│   │   ├── molecules/            # 複数のatomを組み合わせたもの（検索バー、カートアイテムなど）
│   │   ├── organisms/            # 複雑なUI構造（ナビゲーション、商品リストなど）
│   │   ├── templates/            # ページレイアウトテンプレート（ヘッダー、フッターなど）
│   ├── hooks/                    # カスタムフック（データフェッチ、状態管理）
│   ├── layouts/                  # ページレイアウト（管理者用、ユーザー用）
│   ├── services/                 # APIクライアント（AxiosやGraphQLクエリ）
│   ├── store/                    # グローバル状態管理（ZustandやRedux）
│   ├── styles/                   # グローバルおよびモジュールCSS
│   ├── types/                    # TypeScriptの型定義（APIレスポンス、コンポーネントのProps）
│   └── utils/                    # ヘルパー関数やユーティリティ
├── prisma/                       # Prismaスキーマとマイグレーション
├── .env                          # 環境変数（Stripe APIキー、MongoDB URI）
├── .gitignore                    # Gitで追跡しないファイル
├── package.json                  # プロジェクトの依存関係
└── tsconfig.json                 # TypeScriptの設定
```

## 主な機能

1. **ホームページ**

   - **React Server Components（RSC）**を使用して、サーバーサイドで商品リストとカテゴリナビゲーションをレンダリングします。
   - **検索バー**では、**Suspense**を活用して段階的に検索結果をロードします。

2. **商品詳細ページ**

   - **Suspense**を使用して、商品詳細情報（価格、レビューなど）を段階的に表示します。
   - 商品の詳細情報、画像、在庫状況、レビューを表示します。

3. **カートページ**

   - **Server Actions**を利用して、サーバーサイドで商品をカートに追加・削除する処理を行います。
   - 合計金額の動的な計算とリアルタイム更新を行います。

4. **チェックアウトページ**

   - **Suspense**を使用して、配送情報やStripeの決済フォームを非同期で読み込みます。
   - 安全な支払い処理をStripeを利用して行います。

5. **ユーザーダッシュボード**

   - **React Server Components**を使い、ユーザーの注文履歴を効率的にレンダリングします。
   - プロフィール管理や注文状況の追跡を提供します。

6. **管理者ダッシュボード**

   - **Suspense**を活用して、商品追加・編集や注文管理のタスクを非同期で処理します。
   - **Server Actions**を使って、商品情報や注文ステータスを更新します。

7. **検索結果ページ**

   - **Suspense**でリアルタイムの検索結果更新を実現します。
   - 商品リストをカテゴリ、価格、レビューでフィルタリングして表示します。

8. **ログイン機能**
   - **Partial Pre-Rendering (PPR)** を使用して、ログインページやユーザーダッシュボードで事前レンダリングを実現。
   - **Server Actions**を使ったログイン処理をサーバー側で効率的に行い、JWTトークンによるセッション管理を実装します。

## 技術スタック

- **Next.js 15 RC**: サーバーサイドレンダリング（SSR）と React Server Components、App Router の強化。
- **React 19 RC**: Server Components、強化された Suspense、Server Actions を活用。
- **TypeScript**: メンテナブルなコードを実現するための厳格な型定義。
- **MongoDB + Prisma**: 効率的なデータベース管理。
- **Zustand/Redux**: カートやユーザーセッションのグローバル状態管理。
- **Stripe API**: 安全な支払い処理を実現。

## データベース設計

- **User**

  - `id`: ユーザー ID
  - `email`: ユニークなメールアドレス
  - `passwordHash`: パスワードのハッシュ
  - `role`: ユーザー/管理者の権限

- **Product**

  - `id`: 商品 ID
  - `name`: 商品名
  - `description`: 商品説明
  - `price`: 価格
  - `stock`: 在庫数
  - `category`: 商品のカテゴリ

- **Order**
  - `id`: 注文 ID
  - `userId`: ユーザー ID（外部キー）
  - `products`: 注文された商品のリスト（productId, quantity）
  - `totalAmount`: 合計金額
  - `status`: `pending`, `completed`, `cancelled`

## Next.js 15 & React 19 の主な新機能

1. **React Server Components**: 商品リストやユーザーダッシュボードなどの重要なページのサーバーサイドレンダリングに使用し、SEO とパフォーマンスを向上させます。
2. **Suspense**: 非同期データフェッチを扱い、ページ全体のブロックを防ぎ、ユーザー体験を向上させます。
3. **Server Actions**: カート管理や注文処理などのサーバーサイド操作を簡潔かつ高速に行います。
4. **App Router の強化**: ページ遷移とルーティングを最適化し、スムーズな体験を提供します。

## デプロイと環境設定

- **フロントエンド**: Vercel でデプロイし、サーバーサイドレンダリングを高速かつスケーラブルに実現します。
- **バックエンド**: AWS Lambda や Render にデプロイし、サーバーレスアーキテクチャを採用します。
- **環境変数**: `.env` ファイルで Stripe API キーやデータベース URI などの機密情報を管理します。

## テスト計画

- **ユニットテスト**: Jest と React Testing Library を使用して、コンポーネントやロジックのテストを行います。
- **E2E テスト**: Cypress を使用してカート操作、商品検索、決済フローなどの

ユーザーストーリーをテストします。
