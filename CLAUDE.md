# link-keeper

記事・書籍・動画・ツールのリンクを種類・タグ・シーンで絞り込んで管理する個人ナレッジ管理サイト。詳細は README.md を参照。

## 技術スタック

| 領域 | 採用 |
|---|---|
| 配信 | GitHub Pages（静的 HTML） |
| データ源 | Markdown 表（docs/リソース蓄積簿.md） |
| ビルド | Node.js スクリプト（scripts/build-catalog.mjs） |
| フロントエンド | 素の HTML + CSS + JavaScript（フレームワークなし） |
| テーマ | ダーク/ライト両対応（CSS カスタムプロパティ） |

外部サービス・認証・DB なし。ローカル完結。

## コマンド

| 目的 | コマンド |
|---|---|
| ビルド | `npm run build`（蓄積簿 → index.html にデータ埋め込み） |
| ローカルプレビュー | `python3 -m http.server 8100` |

## ディレクトリ

- `docs/` — リソース蓄積簿（データの正本）
- `scripts/` — ビルドスクリプト
- `index.html` — アプリ本体（単一ファイル）

## データ追加方法

`Skill("registering-link-keeper-articles")` でリソース蓄積簿に追記し、`npm run build` でデータを埋め込む。
