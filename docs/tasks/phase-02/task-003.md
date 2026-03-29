# Task 003: 初期事例データの収集・登録

## 概要
各カテゴリから代表的な事例を収集し、case.json として登録する。

## 完了条件
- [ ] 各 incident_category から最低3件（計18件以上）の事例を登録
- [ ] 全件が npm run validate を通過する
- [ ] case-reviewer による品質チェックを実施

## 作業内容
1. /case-create で文献URLから事例を作成
2. /case-review でレビュー
3. 指摘があれば修正

## 対象カテゴリと想定事例
- data_breach: 大規模情報漏洩事件
- privacy_violation: プライバシー問題で炎上した事例
- unauthorized_use: 同意なしデータ利用で問題になった事例
- inadequate_anonymization: 匿名化の失敗事例
- algorithmic_discrimination: AIバイアス・差別事例
- surveillance_tracking: 監視技術の問題事例
