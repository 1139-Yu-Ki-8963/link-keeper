# link-keeper

残しておきたい記事・書籍・動画・ツールなどのリンクを集約し、**種類・タグ・シーン**で絞り込んで管理する個人ナレッジ管理サイト。[pmlifestyle.jp](https://pmlifestyle.jp) のリソースライブラリ風レイアウトを参考に、画面からの追加・編集・削除（CRUD）に対応した。

## 技術スタック

| 領域 | 採用 |
|---|---|
| フレームワーク | Next.js 16（App Router）+ React 19 |
| 言語 | TypeScript（strict） |
| スタイル | Tailwind CSS v4（モノトーン基調） |
| DB | SQLite + Prisma 7（driver adapter: better-sqlite3） |
| CRUD | Server Actions |
| Lint/Format | Biome |

外部サービスや認証は使わず、ローカルの単一ファイル `dev.db` で完結する。

## セットアップ

```bash
npm install
npm run db:migrate   # スキーマ反映（初回は dev.db を生成）
npm run db:seed      # マスタ（種類/シーン/タグ）とサンプルを投入
npm run dev          # http://localhost:8100
```

## 画面

- `/` … 一覧。左に絞り込みパネル（キーワード / 種類 / シーン / タグ）、右にカードグリッド。件数表示と「すべてクリア」付き。絞り込みは全件取得後にクライアント側で AND 評価する
- `/resources/new` … リンク追加フォーム
- `/resources/[id]/edit` … 編集フォーム（削除もここから）

## データモデル

`Resource`（リンク）に対し、`ResourceType`（種類・多対1）、`Scene`（シーン・多対1/任意）、`Tag`（多対多）。種類とシーンはテーブル管理なので、増やしたい場合は `prisma/seed.ts` か Prisma Studio から追加する。

```bash
npm run db:studio    # データをブラウザで確認・編集
```

## スクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー |
| `npm run build` / `npm start` | 本番ビルド / 起動 |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` / `npm run format` | Biome 検査 / 整形 |
| `npm run db:migrate` / `db:seed` / `db:studio` / `db:reset` | Prisma 操作 |
