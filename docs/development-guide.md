# Claude Code Agent Teams 開発ガイド

PETs活用事例カタログプロジェクトでの実践経験に基づく、Agent Teamsでの効率的な開発プロセスガイド。

## 開発フロー概要

```
Issue作成 → /1_issue_plan → 計画承認 → /2_issue_impl → テスト → PR → レビュー → マージ
```

## 1. 計画フェーズ

### Issue作成
- 課題・要件をGitHub Issueに記載
- ラベルで分類（bug, feature, enhancement等）

### 計画策定（/1_issue_plan）
1. Issueの内容を読み込み、要件を分析
2. 不明点があればIssueにコメントで質問 → 回答を待つ
3. 実装計画を策定:
   - 対象ファイル一覧
   - 実装手順
   - テスト方針
   - 完了条件
4. 計画をIssueに書き込み、承認を得る

### Tips
- 不明点は**必ずIssueで確認**してから着手する
- 計画段階でスコープを明確にすることで、手戻りを防ぐ

## 2. 実装フェーズ

### git worktree による分離開発
```bash
git worktree add gitworktree/feature-<issue番号>-<キーワード> develop
cd gitworktree/feature-<issue番号>-<キーワード>
git checkout -b feature-<issue番号>-<キーワード>
```

### 実装のポイント
- 1つのIssueに対して1つのブランチ・1つのPR
- 小さく頻繁にテストを実行（`npm run test`, `npm run validate`）
- コンポーネント変更後は `npm run build` でビルドを確認

## 3. 大量データ更新パターン

143件のcase.jsonを一括更新した際の実践パターン:

### チーム分割
- 全件を**7チーム（約20件ずつ）**に分割
- 各チームをバックグラウンドエージェントとして並行起動

### 承認待ち回避
```
mode: "bypassPermissions"  # ファイル編集・WebFetchの承認をスキップ
run_in_background: true    # バックグラウンド実行
```

### 指示の明確化
各チームに渡す指示に必ず含めるもの:
1. **対象ファイルの完全なリスト**（ID一覧）
2. **更新ルール**（具体的な記述ガイドライン）
3. **注意事項**（推測禁止、他フィールド変更禁止等）
4. **出力形式**（完了後の報告フォーマット）

### 完了後の検証
```bash
npx tsx scripts/validate-cases.ts  # スキーマ検証
npm run test -- --run              # 単体テスト
npm run build                      # ビルド確認
```

### エラー対応
- JSONパースエラー（スマートクォート等）はPythonスクリプトで一括修正
- バリデーションエラーは個別にcase.jsonを修正

## 4. レビューフェーズ

### case-reviewerによる品質チェック
- 各事例に対してレビューエージェントを起動
- 出典URLのファクトチェック
- 可読性チェック（summaryとimpactだけで概要が分かるか）

### レビュー後の修正
- レビュー指摘に基づき修正
- 断定表現の緩和（「実現した」→「確認した」等）
- 出典を超えた記述の削除

## 5. PR作成

### PRの書き方
- タイトル: 70文字以内
- Before/After の具体例を含める
- ビジネス上の価値を明示
- 影響範囲を簡潔に示す

### コンフリクト解決
mainとdevelopの同期:
```bash
git fetch origin main develop
git merge origin/main  # developブランチで実行
# コンフリクトを解決
git add . && git commit
git push origin develop
```

## 6. プロジェクト外パスへの書き込み

Agent Teamsは**起動元プロジェクトのディレクトリ外への書き込み権限がない**。
別プロジェクトへのファイル配置が必要な場合は、メインエージェントが直接書き込む。

## 7. スキル定義のベストプラクティス

### case-create
- `prompts.ts` を正とする記述ガイドラインを参照させる
- 「推測で埋めない」ルールを必ず含める

### case-enrich
- 既存データの保持を優先する
- sources は追記のみ（削除しない）

### case-review
- 3ペルソナ（ファクトチェッカー、ビジネスレビュアー、法規制レビュアー）による多角的検証
- 出典URLの全件確認を必須とする
