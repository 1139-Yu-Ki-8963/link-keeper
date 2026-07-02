# link-keeper

記事・書籍・動画・ツールのリンクを種類・タグ・シーンで絞り込んで管理する個人ナレッジ管理サイト。詳細は README.md を参照。

## 技術スタック

| 領域 | 採用 |
|---|---|
| フレームワーク | Next.js 16（App Router）+ React 19 + TypeScript strict |
| スタイル | Tailwind CSS v4 |
| DB | SQLite（ローカル単一ファイル `dev.db`）+ Prisma 7 |
| CRUD | Server Actions |
| Lint / Format | Biome |

外部サービス・認証なし。ローカル完結。

## コマンド

| 目的 | コマンド |
|---|---|
| dev サーバー | `npm run dev`（port 4500。※port-management-rules 上の割当は 8100 — 移行するまで現状は 4500） |
| Lint / 型検査 | `npm run lint` / `npm run typecheck` |
| DB マイグレーション | `npm run db:migrate` |
| Prisma Studio | `npm run db:studio`（規約割当 8101） |

## ディレクトリ

- `app/` — App Router ページ・Server Actions
- `components/` — UI コンポーネント
- `lib/` — ユーティリティ
- `prisma/` — スキーマ・シード（`prisma/seed.ts`）
