# link-keeper プロジェクトコンテキスト（PROJECT-CONTEXT）

## 概要

残しておきたい記事・書籍・動画・ツールなどのリンクを集約し、種類・タグ・シーンで絞り込んで管理する個人ナレッジ管理サイト。画面からの追加・編集・削除（CRUD）に対応する。

## 技術スタック

- フレームワーク: Next.js 16（App Router）+ React 19
- 言語: TypeScript（strict）
- スタイル: Tailwind CSS v4（モノトーン基調）
- DB: SQLite + Prisma 7（driver adapter: better-sqlite3）
- CRUD: Server Actions
- Lint/Format: Biome

外部サービス・認証は使わず、ローカルの単一ファイル `dev.db` で完結する。

## 設定索引

- 実装フロー設定: `.claude/rules/always/project-context/flow-values.yml`
- ルート直下許可リスト: `.claude/rules/always/placement/directory-structure/rule.md`
- 命名規約の上書き（任意・置けば効く）: `.claude/rules/always/naming/commit-branch/naming-values.txt`
- 文章置き換え辞書（任意・置けば効く）: `.claude/rules/always/review-checklist/text-dictionary/prh.yml`
- レビュー観点（任意・置けば効く）: `.claude/rules/scoped/review-checklist/<domain>/<name>/rule.md`
