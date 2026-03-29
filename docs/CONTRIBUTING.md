# 開発者ガイド

## 技術スタック

- **フレームワーク**: React 19 + TypeScript
- **ビルド**: Vite
- **スタイル**: Tailwind CSS v4
- **ルーティング**: React Router v7
- **バリデーション**: Zod + React Hook Form
- **テスト**: Vitest + Testing Library（単体）、Playwright（E2E）
- **デプロイ**: GitHub Pages

## 環境構築

```bash
# リポジトリをクローン
git clone <repository-url>
cd privacy-incident-catalog

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

## コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（http://localhost:5173） |
| `npm run build` | 本番ビルド（tsc + vite build） |
| `npm run test` | 単体テスト実行 |
| `npm run test:e2e` | E2Eテスト実行（Playwright） |
| `npm run lint` | ESLint実行 |
| `npm run validate` | case.jsonスキーマ検証 |

## ディレクトリ構成

```
src/
├── pages/           # ページコンポーネント
├── components/      # UIコンポーネント
│   ├── layout/      # Header, Footer, Layout
│   ├── case-list/   # 一覧表示関連
│   ├── case-detail/ # 詳細表示関連
│   ├── case-form/   # フォーム関連
│   └── figures/     # 図表関連
├── schemas/         # Zodスキーマ
├── types/           # TypeScript型定義
├── constants/       # 定数
├── context/         # Contextプロバイダ
├── hooks/           # カスタムフック
├── lib/             # ユーティリティ
└── __tests__/       # 単体テスト
```

## 開発フロー

1. GitHub Issueで要件を確認
2. git worktreeでフィーチャーブランチを作成
   ```bash
   git worktree add gitworktree/feature-<issue番号>-<keyword> develop
   ```
3. 実装・テスト
4. PRを作成（develop向け）
5. レビュー・マージ

## ブランチ戦略

- `main`: 本番。GitHub Pages自動デプロイ。直接コミットしない
- `develop`: 開発ベース。PRはここ向け
- `feature-<issue番号>-<keyword>`: フィーチャーブランチ

## コミットメッセージ規約

```
<type>: <subject> (#<issue>)

feat:     新機能
fix:      バグ修正
refactor: リファクタリング
docs:     ドキュメント
test:     テスト
chore:    ビルド・設定変更
```
