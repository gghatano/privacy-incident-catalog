# Task 002: case.json スキーマ定義の確定

## 概要
case.json のZodスキーマとTypeScript型定義を確定し、バリデーションスクリプトが動作するようにする。

## 完了条件
- [ ] src/types/case.ts が最終的な型定義を含む
- [ ] src/schemas/case.schema.ts がZodスキーマを定義
- [ ] scripts/validate-cases.ts がスキーマに基づいてバリデーションを実行できる
- [ ] サンプル事例1件が validate を通過する

## 作業内容
1. docs/data-model.md のフィールド定義に基づきZodスキーマを実装
2. バリデーションスクリプトを新スキーマに対応
3. サンプル事例を1件作成して検証
