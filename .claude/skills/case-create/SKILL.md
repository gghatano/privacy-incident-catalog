---
name: case-create
description: 文献URL・テキストから新規 case.json を作成
argument-hint: "<URL or description of literature>"
user-invocable: true
---

提供された文献（URL またはテキスト）からデータ活用・プライバシー炎上事例の case.json を新規作成する。

## 手順

### 1. 文献の取得・読み取り

$ARGUMENTS で指定された URL を WebFetch で取得する。テキストが直接与えられた場合はそのまま使用する。

### 2. 事例情報の抽出

`src/constants/prompts.ts` の `generateCreatePrompt()` に定義されたガイドラインに従い、文献から以下の情報を抽出する:

- title, summary, impact, root_cause, response, lessons_learned
- region, domain, domain_sub, organization
- incident_category（選択肢は `src/constants/categories.ts` を参照）
- severity
- tags, sources
- figures（data_flow のノードとエッジ）

**重要**:
- フィールドごとの記入ガイドラインは `src/constants/prompts.ts` を正とする
- 文献から読み取れない項目は「調査中」と記入し、推測で埋めない
- **summary と impact の役割分担**:
  - summary: 何が起こったか、事件の経緯を記述する
  - impact: どのような影響・被害があったかを記述する

### 3. case.json の生成

スキーマは `src/schemas/case.schema.ts` に定義されている。スキーマに適合する JSON を生成する。

**注意事項**:
- 新規作成時は `review_status` を `"ai_generated"` に設定する
- タイトルに「【未レビュー】」を付与する

事例 ID は既存の `public/cases/` 配下の ID を確認し、連番で次の ID を採番する。

### 4. ファイルの保存

```bash
mkdir -p public/cases/<id>
```

生成した JSON を `public/cases/<id>/case.json` に保存する。

### 5. index.json の更新

`public/cases/index.json` に新しい事例 ID を追加する。

### 6. バリデーション

```bash
npx tsx scripts/validate-cases.ts
```

エラーがあれば修正して再度バリデーションを実行する。

### 7. レビュー

生成した事例に対して /case-review を実行し、公開情報との整合性を検証する。
