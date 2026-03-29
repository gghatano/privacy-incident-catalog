# データモデル詳細設計

## case.json フィールド定義

### 基本情報

| フィールド | 型 | 必須 | デフォルト | 記入ガイドライン |
|-----------|---|------|----------|----------------|
| id | string | ○ | - | プレフィックス + 連番（例: breach-0001, algo-0001） |
| title | string | ○ | - | 「組織名：事件の概要」の形式。30〜60文字程度 |
| region | string | ○ | - | 「国内」または「国外」 |
| domain | string | ○ | - | 業界ドメイン（categories.ts の DOMAIN_OPTIONS から選択） |
| domain_sub | string | - | - | サブドメイン（任意） |
| organization | string | ○ | - | 主要な関連組織名 |

### 分類・深刻度

| フィールド | 型 | 必須 | デフォルト | 記入ガイドライン |
|-----------|---|------|----------|----------------|
| incident_category | string[] | ○ | - | 1件以上選択。複数カテゴリに該当する場合は複数選択可 |
| severity | string | ○ | "medium" | critical/high/medium/low |
| occurred_at | string \| null | ○ | null | "YYYY" / "YYYY-MM" / "YYYY-MM-DD" / null（不明） |

### IDプレフィックス規則

| カテゴリ | プレフィックス | 例 |
|---------|------------|-----|
| data_breach | breach- | breach-0001 |
| privacy_violation | priv- | priv-0001 |
| unauthorized_use | unauth- | unauth-0001 |
| inadequate_anonymization | anon- | anon-0001 |
| algorithmic_discrimination | algo- | algo-0001 |
| surveillance_tracking | surv- | surv-0001 |
| 複数カテゴリ | inc- | inc-0001 |

### 記述フィールド

| フィールド | 型 | 必須 | デフォルト | 記入ガイドライン |
|-----------|---|------|----------|----------------|
| summary | string | ○ | "調査中" | **何が起こったか**: 事件の経緯を2〜3文で記述。影響や対応には触れない |
| impact | string | ○ | "調査中" | **どう影響したか**: 被害規模、社会的影響、制裁金等を具体的に記述。2〜3文程度 |
| root_cause | string | ○ | "調査中" | **なぜ起こったか**: 技術的原因、組織的原因を出典に基づいて記述 |
| response | string | ○ | "調査中" | **どう対応したか**: 企業の対応、規制当局の措置を時系列で記述 |
| lessons_learned | string | ○ | "調査中" | **何を学べるか**: 再発防止策、業界への示唆を記述 |

### メタデータ

| フィールド | 型 | 必須 | デフォルト | 記入ガイドライン |
|-----------|---|------|----------|----------------|
| tags | string[] | ○ | [] | 検索用キーワード。5〜10個程度 |
| sources | Source[] | ○ | - | 最低1件必須 |
| figures | Figure[] | ○ | [] | data_flow, timeline 等 |
| review_status | string | ○ | "ai_generated" | ai_generated → under_review → human_reviewed / flagged |
| status | string | ○ | "seed" | seed → draft → published |
| editorial_notes | string[] | - | - | 編集上の注意事項 |

## Source

```typescript
{
  source_type: "web" | "pdf",
  title: "記事タイトル",
  url: "https://...",
  note?: "参照箇所の補足"
}
```

## Figure（data_flow）

### ノードカテゴリ

| カテゴリ | 役割 | 例 |
|---------|------|-----|
| source | データの出所 | 「ユーザーの個人情報」 |
| trigger | 事件の引き金 | 「設定ミス」「不正アクセス」 |
| incident | 事件の内容 | 「データが公開状態に」 |
| impact | 影響・被害 | 「個人情報流出」 |
| response | 対応 | 「サービス停止・通知」 |

### ノードの流れ

```
source → trigger → incident → impact → response
```

## severity 判定基準の詳細

### critical
- 100万件以上のデータ漏洩
- 重大な人権侵害（生命・健康への影響）
- 10億円以上の制裁金
- 国家レベルの社会問題化

### high
- 1万〜100万件のデータ影響
- 規制当局による制裁・改善命令
- 広範なメディア報道・社会的批判
- 1億〜10億円の制裁金・損害賠償

### medium
- 1,000〜1万件のデータ影響
- 企業の信頼低下
- 業界内での注目
- 改善命令・是正勧告

### low
- 1,000件未満のデータ影響
- 限定的な影響
- 自主的な改善で解決
- 学術的・啓発的な事例
