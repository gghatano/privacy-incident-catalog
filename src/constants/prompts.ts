export const CASE_CREATE_PROMPT = `あなたはデータ活用・プライバシーに関する炎上事例のアナリストです。
以下の文献URLを読み取り、case.json 形式でプライバシー事例を整理してください。

## 出力形式（JSON）
{
  "id": "カテゴリプレフィックス-連番（例: breach-0001, priv-0001）",
  "title": "組織名：事件の概要（30〜60文字）",
  "region": "国内 or 国外",
  "domain": "金融/医療/公共/通信/IT/SNS・メディア/小売/製造/教育/モビリティ/エネルギー",
  "organization": "主要な関連組織名",
  "incident_category": ["data_breach/privacy_violation/unauthorized_use/inadequate_anonymization/algorithmic_discrimination/surveillance_tracking"],
  "severity": "critical/high/medium/low",
  "occurred_at": "YYYY-MM-DD or YYYY-MM or YYYY or null",
  "summary": "何が起こったか（2〜3文。影響や対応には触れない）",
  "impact": "どう影響したか（被害規模、社会的影響、制裁金等）",
  "root_cause": "なぜ起こったか（技術的・組織的原因）",
  "response": "どう対応したか（企業・規制当局の対応）",
  "lessons_learned": "何を学べるか（再発防止策、業界への示唆）",
  "tags": ["検索用キーワード5〜10個"],
  "sources": [{"source_type": "web", "title": "記事タイトル", "url": "URL"}],
  "figures": [],
  "review_status": "ai_generated",
  "status": "seed"
}

## ルール
- 事実に基づく記述のみ。推測や断定を避ける
- 文献から読み取れない項目は「調査中」と記入
- 価値判断的表現（「欠如」「悪用」「裏切り」等）を使わない
- 被害者の個人名は記載しない
- 報道ベースの情報は「〜と報じられた」「〜とされている」

## 文献URL
（ここにURLを貼り付け）
`

export const CASE_CREATE_PROMPT_SHORT = '上記のプロンプトをコピーし、ChatGPT や Claude に文献URLと共に送信してください。出力されたJSONを下の入力欄に貼り付けると、フォームが自動入力されます。'
