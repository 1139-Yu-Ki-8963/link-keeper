# link-keeper プロジェクトコンテキスト（PROJECT-CONTEXT）

## 概要

残しておきたい記事・書籍・動画・ツールなどのリンクを集約し、種類・タグ・シーンで絞り込んで管理する個人ナレッジ管理サイト。GitHub Pages で公開する静的 HTML 構成。

## 技術スタック

- 配信: GitHub Pages（静的 HTML）
- データ源: Markdown 表（docs/リソース蓄積簿.md）
- ビルド: Node.js スクリプト（scripts/build-catalog.mjs）
- フロントエンド: 素の HTML + CSS + JavaScript（フレームワークなし）
- テーマ: ダーク/ライト両対応（CSS カスタムプロパティ）

外部サービス・認証・DB なし。ローカルの `npm run build` で蓄積簿データを index.html に埋め込み、push で GitHub Pages に反映。

## 設定索引

- 実装フロー設定: `.claude/rules/always/project-context/flow-values.yml`
- ルート直下許可リスト: 本ファイル末尾「## ルート直下許可ディレクトリ」節

## ルート直下許可ディレクトリ

| ディレクトリ名 | 用途 |
|---|---|
| docs | リソース蓄積簿（データの正本） |
| scripts | ビルドスクリプト |

## サブディレクトリ許可リスト

### .claude

| ディレクトリ名 | 用途 |
|---|---|
| rules | ルール定義（always/ scoped/ の標準体系） |
