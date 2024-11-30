# Eコマースプラットフォーム設計書 (Next.js 15 と React 19)

https://selliqo.vercel.app/

## 概要

このプロジェクトでは、**Next.js 15 RC** および **React 19 RC** を使用してモダンなEコマースプラットフォームを構築します。主な機能には、スクール事業のコース一覧、カート管理、予約処理、ユーザーと管理者向けダッシュボード、およびログイン機能が含まれます。React Server Components、Suspense、Next.js の App Router の強化を活用し、パフォーマンスとスケーラビリティを最適化します。

## ディレクトリ構造

```plaintext
Selliqo/
├── public/                       # 静的ファイル（画像、フォント、JSON データなど）
├── src/                          # ソースコード
│   ├── app/                      # Next.js 15のApp Routerを使用したルート
│   │   ├── [lang]/               # 多言語対応のルートディレクトリ
│   │   │   ├── layout.tsx        # 言語ごとのレイアウト（ヘッダー、フッター）
│   │   │   ├── page.tsx          # 言語ごとのホームページエントリーポイント
│   │   │   ├── dashboard/        # ダッシュボード関連ページ
│   │   │   │   └── page.tsx      # ダッシュボードページ
│   │   │   ├── login/            # ログインページ
│   │   │   │   └── page.tsx      # ログインページの実装
│   │   │   ├── course/           # コースページ
│   │   │   │   ├── page.tsx      # コースリストページ
│   │   │   │   └── [id]/page.tsx # コース詳細ページ
│   │   │   ├── cart/             # カートページ
│   │   │   │   └── page.tsx      # カートのエントリーポイント
│   │   ├── layout.tsx            # アプリ全体の共通レイアウト
│   │   ├── page.tsx              # グローバルなホームページエントリーポイント
│   │   ├── api/                  # サーバーサイドAPIルート
│   │   │   ├── login/            # 認証用API
│   │   │   │   └── route.ts      # ログインAPIエンドポイント
│   ├── components/               # Atomic Designに基づくUIコンポーネント
│   │   ├── atoms/                # 基本的なUI要素（ボタン、テキスト、入力フォームなど）
│   │   ├── molecules/            # 複数のatomを組み合わせたもの（言語切り替え、予約カードなど）
│   │   ├── organisms/            # 複雑なUI構造（ナビゲーション、コースリストなど）
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

   - **React Server Components（RSC）**を使用して、サーバーサイドでコースリストとカテゴリナビゲーションをレンダリングします。
   - **検索バー**では、**Suspense**を活用して段階的に検索結果をロードします。

2. **コース詳細ページ**

   - **Suspense**を使用して、コース詳細情報（価格、講師など）を段階的に表示します。
   - コースの詳細情報、スケジュール、レビューを表示します。

3. **カートページ**

   - **Server Actions**を利用して、サーバーサイドでコースをカートに追加・削除する処理を行います。
   - 合計金額の動的な計算とリアルタイム更新を行います。

4. **予約ページ**

   - **Suspense**を使用して、予約情報と決済フォームを非同期で読み込みます。
   - Stripe を利用して、安全な支払い処理を行います。

5. **ユーザーダッシュボード**

   - **React Server Components**を使い、ユーザーの予約履歴を効率的にレンダリングします。
   - プロフィール管理や予約状況の追跡を提供します。

6. **管理者ダッシュボード**

   - **Suspense**を活用して、コース追加・編集や予約管理のタスクを非同期で処理します。
   - **Server Actions**を使って、コース情報や予約ステータスを更新します。

7. **検索結果ページ**

   - **Suspense**でリアルタイムの検索結果更新を実現します。
   - コースリストをカテゴリ、講師、価格でフィルタリングして表示します。

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

- **Course**

  - `id`: コース ID
  - `name`: コース名
  - `description`: コース説明
  - `price`: 価格
  - `schedule`: スケジュール
  - `category`: コースのカテゴリ
  - `teacher`: 講師情報

- **Reservation**
  - `id`: 予約 ID
  - `userId`: ユーザー ID（外部キー）
  - `courseId`: コース ID（外部キー）
  - `status`: `reserved`, `completed`, `cancelled`

## Next.js 15 & React 19 の主な新機能

1. **React Server Components**: コースリストやユーザーダッシュボードなどの重要なページのサーバーサイドレンダリングに使用し、SEO とパフォーマンスを向上させます。
2. **Suspense**: 非同期データフェッチを扱い、ページ全体のブロックを防ぎ、ユーザー体験を向上させます。
3. **Server Actions**: カート管理や予約処理などのサーバーサイド操作を簡潔かつ高速に行います。
4. **App Router の強化**: ページ遷移とルーティングを最適化し、スムーズな体験を提供します。

## デプロイと環境設定

- **フロントエンド**: Vercel でデプロイし、サーバーサイドレンダリングを高速かつスケーラブルに実現します。
- **バックエンド**: AWS Lambda や Render にデプロイし、サーバーレスアーキテクチャを採用します。
- **環境変数**: `.env` ファイルで Stripe API キーやデータベース URI などの機密情報を管理します。

## テスト計画

- **ユニットテスト**: Jest と React Testing Library を使用して、コンポーネントやロジックのテストを行います。
- **E2E テスト**: Cypress を使用してカート操作、コース検索、予約フローなどのユーザーストーリーをテストします。
