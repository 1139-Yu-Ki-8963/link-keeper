---
name: registering-link-keeper-articles
invocation: registering-link-keeper-articles
type: action
description: |
  link-keeper に記事リンクを分類・説明付きで登録するスキル。
  TRIGGER when: 記事URLを渡して「登録」「link-keeperに追加」と依頼された時。
  SKIP: link-keeper以外への登録、UI・DBスキーマ変更、登録済みURLの再登録の時。
allowed-tools: ["Bash", "Read", "Write", "Edit"]
---

# link-keeper 記事登録スキル

残しておきたい記事URLを個人ナレッジ管理アプリ **link-keeper**（`~/Projects/link-keeper`）へ、一貫した分類で登録する。複数URLをまとめて渡された場合も順に処理する。

## 使用タイミング

- 記事URL（1件〜複数）を渡して「登録して」「link-keeper に追加して」と言われた時
- 「この記事も追加」「以下も登録」とURLが列挙された時

SKIP: link-keeper 以外への登録、UI・DBスキーマ変更、登録済みURLの再登録の時。

## データモデル（登録先）

`Resource` に対し、単一選択の `Category`(大カテゴリ)・`ResourceType`(種類)・`Topic`(話題・必須)・`Status`(実践状況・任意)、真偽値 `pinned`(再読・共有したい⭐)。
マスタは画面と DB に既存。Topic は 11 値の固定マスタで追加不要。

## 基本ワークフロー

### Phase 1: 前提確認
- アプリの場所は `~/Projects/link-keeper`、dev サーバーは `http://localhost:8100`
- dev が未起動なら起動する: `cd ~/Projects/link-keeper && npm run dev`（バックグラウンド）
- DB は `dev.db`（SQLite）。マスタID取得は `better-sqlite3` を `node -e` で直接使う
完了条件: dev サーバーが起動し DB にアクセスできること。

### Phase 2: タイトル取得
各URLの `og:title`（無ければ `<title>`）を取得して正確なタイトルを得る。

```
node -e "fetch('<URL>',{headers:{'user-agent':'Mozilla/5.0'}}).then(r=>r.text()).then(t=>console.log((t.match(/property=\"og:title\" content=\"([^\"]+)\"/)||t.match(/<title>([^<]+)<\/title>/)||[])[1]))"
```

Zenn 等の SPA は本文が JSON 埋め込みで取りにくい。本文要約が必要なら WebFetch を試し、混雑時はタイトル基準で説明文を書く（後述）。
完了条件: 全 URL のタイトルが取得できていること。

### Phase 3: 分類と説明文の決定
「分類ルール」節に従い、大カテゴリ・種類・話題・実践状況を決める。説明文（1〜2行）は自分で簡潔に作成する（タイトルだけで断定できない詳細は書かない）。
完了条件: 各記事の大カテゴリ・種類・話題・説明文が決定していること。

### Phase 4: マスタID取得
登録に使う名前→ID を一括取得する。

```
node -e "
const D=require('better-sqlite3'),db=new D('dev.db');
const g=(t,n)=>db.prepare('SELECT id FROM '+t+' WHERE name=?').get(n)?.id;
console.log(JSON.stringify({cat:g('Category','情報'),type:g('ResourceType','記事'),topic:g('Topic','Skills')}));
"
```
完了条件: 登録に必要な全 ID が取得できていること。

### Phase 5: 登録（create Server Action へ POST）
dev サーバー上の追加フォームの Server Action を no-JS 相当の multipart POST で叩く。id・createdAt は Prisma 側で処理される。

```
node -e "(async()=>{
  const base='http://localhost:8100';
  const page=await (await fetch(base+'/resources/new')).text();
  const aid=(page.match(/name=\"(\\\$ACTION_ID_[^\"]+)\"/)||[])[1];
  const fd=new FormData();
  fd.append(aid,'');
  fd.append('title','<タイトル>'); fd.append('url','<URL>'); fd.append('description','<説明>');
  fd.append('categoryId','<catId>'); fd.append('typeId','<typeId>'); fd.append('topicId','<topicId>');
  // 実践状況は新規未読のため未指定でよい。pinned を立てるなら fd.append('pinned','on')
  const r=await fetch(base+'/resources/new',{method:'POST',body:fd,redirect:'manual',headers:{origin:base}});
  console.log(r.status); // 303 = 登録成功
})();"
```
完了条件: HTTP 303 が返り、DB に新レコードが存在すること。

### 検証
登録後に DB で件数・分類・話題を確認し、ユーザーへ表形式で報告する。

```
node -e "const D=require('better-sqlite3'),db=new D('dev.db');
const r=db.prepare('SELECT r.title,c.name cat,t.name topic FROM Resource r JOIN Category c ON c.id=r.categoryId JOIN Topic t ON t.id=r.topicId ORDER BY r.createdAt DESC LIMIT 5').all();
console.log(JSON.stringify(r),'total',db.prepare('SELECT COUNT(*) n FROM Resource').get().n);"
```

### Phase 6: seed へ永続化（必須・記事を失わないため）
登録は dev.db にしか入らない。`dev.db` は gitignore かつ `db:reset` で消えるため、**登録のたびに `seed.ts` を dev.db から再生成**して記事を永続化する。記事は url を一意キーに冪等投入する形（既存 dev.db では skip、空DBでは復元）で埋め込む。

`prisma/seed.ts` を dev.db の全 Resource から再生成する（マスタ配列はテンプレートに保持し、`RESOURCES` を JSON 埋め込み）。生成器は `node -e` で `prisma/seed.ts` を `fs.writeFileSync` する（手写し不可。タイトル・説明の特殊文字は JSON.stringify で安全に埋める）。生成内容の骨子:
- マスタ: `CATEGORIES / TYPES / TOPICS / STATUSES` を upsert
- `RESOURCES`: `{title, description, url, category, type, topic, status, pinned}` を JSON で埋め込み
- main(): マスタ upsert →名前→id マップ作成→ url 重複を skip しつつ `resource.create`（topicId は名前から引く）

再生成後の整形・型チェック:
```
cd ~/Projects/link-keeper && npx biome check --write prisma/seed.ts && npx tsc --noEmit
```
完了条件: seed.ts が再生成され、biome + tsc が通ること。

### 検証（破壊せずに再現性を確認）
`prisma migrate reset` は破壊的で、Prisma 7 は AI 起点の実行に明示同意を要求するため**使わない**。代わりに一時DBで再現確認し、dev.db は無傷のままにする。
```
cd ~/Projects/link-keeper
rm -f _verify.db
DATABASE_URL="file:./_verify.db" npx prisma migrate deploy
DATABASE_URL="file:./_verify.db" npx tsx prisma/seed.ts   # → Resource N件（新規 N件）
node -e "const D=require('better-sqlite3'),v=new D('_verify.db');console.log('verify',v.prepare('SELECT COUNT(*) n FROM Resource').get().n)"
rm -f _verify.db
```
一時DBの件数が dev.db と一致すれば、`db:reset` でも記事が復元される。

## 完了条件

| Phase | 完了条件 |
|---|---|
| Phase 1 | dev サーバーが起動し DB にアクセスできる |
| Phase 2 | 全 URL のタイトルが取得できている |
| Phase 3 | 各記事の大カテゴリ・種類・話題・説明文が決定している |
| Phase 4 | 登録に必要な全 ID が取得できている |
| Phase 5 | HTTP 303 が返り、DB に新レコードが存在する |
| Phase 6 | seed.ts が再生成され、biome + tsc が通る |
| **Goal** | 全記事が DB に登録され、seed.ts の再生成で _verify.db と件数が一致する |

## 分類ルール

### 大カテゴリ（最重要・「1年後にも使えるか」で二分）
`Category` テーブルの値から選ぶ。判断基準:
- 進化の速いAI/特定ツールの知見・速報・事例 → 1年後には価値が下がるもの
- ツール非依存の普遍的な考え方・枠組み → durable な技術
- 迷う1本は判断と理由を添えて報告し、ユーザーが編集画面で変えられる旨を伝える

### 種類（ResourceType）
`ResourceType` テーブルの値から選ぶ。Web記事は基本「記事」。スキル本文や雛形そのものは内容次第で「テンプレート」も検討。

### 話題（Topic・必須）
`Topic` テーブルから全件取得し、記事の主題に最も近い 1 つを選ぶ（単一選択）。
Topic は Claude Code の構成要素と記事テーマで構成される。
Phase 4 で DB から取得する。スキル内には具体値を直書きしない（マスタが正本）。
迷ったら記事タイトルの主語で判断する。

### 実践状況（Status・任意）／⭐（pinned）
- 新規登録は **未読**（フォーム未指定でよい）。読了・実践はユーザーがカードで切り替える
- `pinned` は既定オフ。ユーザーが明示した時のみ on

## 重要な注意事項

- **説明文は捏造しない**: タイトルで保証できない具体（「3つのツールの中身」等）は書かない。本文を読めた時のみ踏み込む
- **同一URLの重複登録を避ける**: 登録前に既存を確認してもよい
- **登録のたびに Phase 6 で seed 再生成（必須）**: dev.db だけだと `db:reset` で記事が消える。記事もマスタも seed.ts に永続化する
- **dev が LAN 公開でも localhost で操作**: 登録の POST は `http://localhost:8100` を使う
- スクリプトファイル（.js/.ts）は新規作成せず、`node -e` のインライン実行で完結させる

## 注意点

- 記事 URL のタイトル取得が失敗する場合は WebFetch で直接読む — curl は JS レンダリングを待たないためタイトルが空になることがある

## 参照資料

- アプリ本体・スキーマ: `~/Projects/link-keeper/prisma/schema.prisma`
- マスタ定義: `~/Projects/link-keeper/prisma/seed.ts`
- 登録アクション: `~/Projects/link-keeper/app/resources/actions.ts`
